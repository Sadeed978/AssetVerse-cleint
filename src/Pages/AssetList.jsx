import React, { useEffect, useState, useMemo, use } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContexts';

// Icon fallback based on asset name keywords
const getAssetIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('laptop') || n.includes('computer') || n.includes('pc')) return '💻';
    if (n.includes('phone') || n.includes('mobile')) return '📱';
    if (n.includes('router') || n.includes('network') || n.includes('wifi')) return '📡';
    if (n.includes('headphone') || n.includes('audio') || n.includes('speaker')) return '🎧';
    if (n.includes('chair') || n.includes('desk') || n.includes('furniture')) return '🪑';
    if (n.includes('monitor') || n.includes('screen') || n.includes('display')) return '🖥️';
    if (n.includes('keyboard') || n.includes('mouse')) return '⌨️';
    if (n.includes('printer') || n.includes('scanner')) return '🖨️';
    if (n.includes('tv') || n.includes('television')) return '📺';
    if (n.includes('camera')) return '📷';
    if (n.includes('projector')) return '📽️';
    return '📦';
};

const typeColors = {
    Returnable: 'badge-success',
    'Non-returnable': 'badge-error',
};

const AssetList = () => {
    const { user } = use(AuthContext);

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [productType, setProductType] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [editAsset, setEditAsset] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const itemsPerPage = 6;

    useEffect(() => {
        if (!user?.email) return;
        fetch(`https://asset-verse-server-phi.vercel.app/assets/hr/${user.email}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch assets');
                return res.json();
            })
            .then(data => { setAssets(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [user?.email]);

    const filteredAssets = useMemo(() => {
        let data = [...assets];
        if (search) data = data.filter(a => a.productName?.toLowerCase().includes(search.toLowerCase()));
        if (productType) data = data.filter(a => a.productType === productType);
        if (sort === 'high') data.sort((a, b) => b.productQuantity - a.productQuantity);
        if (sort === 'low') data.sort((a, b) => a.productQuantity - b.productQuantity);
        return data;
    }, [assets, search, productType, sort]);

    const start = (page - 1) * itemsPerPage;
    const paginatedAssets = filteredAssets.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

    // ── Edit ────────────────────────────────────────────────────────────────
    const openEdit = (asset) => {
        setEditAsset(asset);
        setEditForm({
            productName: asset.productName,
            productQuantity: asset.productQuantity,
            productType: asset.productType,
            productImage: asset.productImage || '',
        });
    };

    const handleEditSave = () => {
        setSaving(true);
        fetch(`https://asset-verse-server-phi.vercel.app/assets/${editAsset._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm),
        })
            .then(res => res.json())
            .then(() => {
                setAssets(prev => prev.map(a => a._id === editAsset._id ? { ...a, ...editForm } : a));
                toast.success('Asset updated!');
                setEditAsset(null);
            })
            .catch(() => toast.error('Failed to update asset'))
            .finally(() => setSaving(false));
    };

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = (id) => {
        if (!window.confirm('Delete this asset?')) return;
        setDeletingId(id);
        fetch(`https://asset-verse-server-phi.vercel.app/assets/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                setAssets(prev => prev.filter(a => a._id !== id));
                toast.success('Asset deleted!');
            })
            .catch(() => toast.error('Failed to delete asset'))
            .finally(() => setDeletingId(null));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
    if (error) return <p className="text-center text-error mt-10">{error}</p>;

    return (
        <div className="min-h-screen bg-base-200 p-6">

            {/* Header */}
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-extrabold text-primary mb-1">Asset Inventory</h2>
                <p className="text-base-content/50 text-sm">
                    {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Filter bar */}
            <div className="bg-base-100 rounded-2xl shadow p-4 mb-8 flex flex-wrap gap-3 items-center justify-center">
                <label className="input input-bordered flex items-center gap-2 w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="grow bg-transparent outline-none"
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </label>

                <select
                    className="select select-bordered w-44"
                    onChange={e => { setProductType(e.target.value); setPage(1); }}
                >
                    <option value="">All Types</option>
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                </select>

                <select
                    className="select select-bordered w-44"
                    onChange={e => { setSort(e.target.value); setPage(1); }}
                >
                    <option value="">Sort by Quantity</option>
                    <option value="high">High → Low</option>
                    <option value="low">Low → High</option>
                </select>
            </div>

            {/* Asset Cards */}
            {paginatedAssets.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-base-content/50 text-lg">No assets found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedAssets.map(asset => (
                        <div
                            key={asset._id}
                            className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300"
                        >
                            {/* Image / Icon area */}
                            <figure className="relative bg-gradient-to-br from-primary/10 to-secondary/10 h-44 flex items-center justify-center overflow-hidden rounded-t-2xl">
                                {asset.productImage ? (
                                    <img
                                        src={asset.productImage}
                                        alt={asset.productName}
                                        className="h-36 w-36 object-contain drop-shadow-md"
                                        onError={e => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                {/* Fallback icon — shown when image fails or is missing */}
                                <div
                                    className="text-7xl flex items-center justify-center"
                                    style={{ display: asset.productImage ? 'none' : 'flex' }}
                                >
                                    {getAssetIcon(asset.productName)}
                                </div>

                                {/* Type badge top-right */}
                                <span className={`badge ${typeColors[asset.productType] || 'badge-neutral'} absolute top-3 right-3 font-semibold`}>
                                    {asset.productType}
                                </span>
                            </figure>

                            <div className="card-body pt-4 pb-5 px-5">
                                <h2 className="card-title text-lg font-bold">{asset.productName}</h2>

                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-base-content/50 text-sm">Quantity:</span>
                                    <span className={`font-bold text-lg ${asset.productQuantity === 0 ? 'text-error' : asset.productQuantity < 5 ? 'text-warning' : 'text-success'}`}>
                                        {asset.productQuantity}
                                    </span>
                                    {asset.productQuantity === 0 && (
                                        <span className="badge badge-error badge-sm">Out of Stock</span>
                                    )}
                                    {asset.productQuantity > 0 && asset.productQuantity < 5 && (
                                        <span className="badge badge-warning badge-sm">Low Stock</span>
                                    )}
                                </div>

                                {asset.dateAdded && (
                                    <p className="text-xs text-base-content/40 mt-1">
                                        Added: {new Date(asset.dateAdded).toLocaleDateString()}
                                    </p>
                                )}

                                <div className="card-actions justify-end mt-3 gap-2">
                                    <button
                                        onClick={() => openEdit(asset)}
                                        className="btn btn-sm btn-outline btn-primary gap-1"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(asset._id)}
                                        disabled={deletingId === asset._id}
                                        className="btn btn-sm btn-outline btn-error gap-1"
                                    >
                                        {deletingId === asset._id
                                            ? <span className="loading loading-spinner loading-xs"></span>
                                            : '🗑️ Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                    <button
                        className="btn btn-sm btn-ghost"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >«</button>
                    {[...Array(totalPages).keys()].map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n + 1)}
                            className={`btn btn-sm ${page === n + 1 ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            {n + 1}
                        </button>
                    ))}
                    <button
                        className="btn btn-sm btn-ghost"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >»</button>
                </div>
            )}

            {/* Edit Modal */}
            {editAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-base-100 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <h3 className="text-xl font-bold mb-5">Edit Asset</h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="label text-sm font-medium">Product Name</label>
                                <input
                                    className="input input-bordered w-full"
                                    value={editForm.productName}
                                    onChange={e => setEditForm(f => ({ ...f, productName: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-medium">Quantity</label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={editForm.productQuantity}
                                    onChange={e => setEditForm(f => ({ ...f, productQuantity: parseInt(e.target.value) }))}
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-medium">Type</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={editForm.productType}
                                    onChange={e => setEditForm(f => ({ ...f, productType: e.target.value }))}
                                >
                                    <option value="Returnable">Returnable</option>
                                    <option value="Non-returnable">Non-returnable</option>
                                </select>
                            </div>
                            <div>
                                <label className="label text-sm font-medium">Image URL (optional)</label>
                                <input
                                    className="input input-bordered w-full"
                                    value={editForm.productImage}
                                    onChange={e => setEditForm(f => ({ ...f, productImage: e.target.value }))}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleEditSave}
                                disabled={saving}
                                className="btn btn-primary flex-1"
                            >
                                {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => setEditAsset(null)}
                                className="btn btn-ghost flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetList;
