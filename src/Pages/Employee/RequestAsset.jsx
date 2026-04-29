import React, { useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router';

const getIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('laptop') || n.includes('computer') || n.includes('pc')) return '💻';
    if (n.includes('phone') || n.includes('mobile'))    return '📱';
    if (n.includes('router') || n.includes('network') || n.includes('wifi')) return '📡';
    if (n.includes('headphone') || n.includes('audio') || n.includes('speaker')) return '🎧';
    if (n.includes('chair') || n.includes('furniture') || n.includes('desk')) return '🪑';
    if (n.includes('monitor') || n.includes('screen') || n.includes('display')) return '🖥️';
    if (n.includes('keyboard')) return '⌨️';
    if (n.includes('printer') || n.includes('scanner')) return '🖨️';
    if (n.includes('tv') || n.includes('television'))   return '📺';
    if (n.includes('camera'))   return '📷';
    if (n.includes('projector')) return '📽️';
    if (n.includes('mouse'))    return '🖱️';
    return '📦';
};

const typeConfig = {
    Returnable:      { badge: 'badge-success', icon: '🔄', bg: 'from-green-500/20 to-emerald-500/10' },
    'Non-returnable':{ badge: 'badge-error',   icon: '🎁', bg: 'from-red-500/20 to-rose-500/10'     },
};

const AssetCard = ({ asset }) => {
    const [imgErr, setImgErr] = useState(false);
    const cfg = typeConfig[asset.productType] || { badge: 'badge-neutral', icon: '📦', bg: 'from-primary/20 to-secondary/10' };
    const qty = asset.productQuantity || 0;
    const outOfStock = qty === 0;
    const lowStock   = qty > 0 && qty < 5;

    return (
        <div className={`bg-base-100 border border-base-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${outOfStock ? 'opacity-60' : ''}`}>

            {/* Image area with gradient bg */}
            <div className={`relative h-44 bg-gradient-to-br ${cfg.bg} flex items-center justify-center`}>
                {asset.productImage && !imgErr
                    ? <img src={asset.productImage} alt={asset.productName}
                        className="h-32 w-32 object-contain drop-shadow-lg"
                        onError={() => setImgErr(true)} />
                    : <span className="text-7xl drop-shadow">{getIcon(asset.productName)}</span>
                }

                {/* Type badge top-left */}
                <span className={`badge ${cfg.badge} badge-sm absolute top-3 left-3 font-semibold gap-1`}>
                    {cfg.icon} {asset.productType}
                </span>

                {/* Stock badge top-right */}
                {outOfStock && <span className="badge badge-error badge-sm absolute top-3 right-3 font-semibold">Out of Stock</span>}
                {lowStock   && <span className="badge badge-warning badge-sm absolute top-3 right-3 font-semibold">Low Stock</span>}
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-extrabold text-lg leading-tight mb-1">{asset.productName}</h3>

                {/* Stock bar */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-base-300 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${outOfStock ? 'bg-error' : lowStock ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${Math.min((qty / 20) * 100, 100)}%` }}
                        />
                    </div>
                    <span className={`text-xs font-bold tabular-nums ${outOfStock ? 'text-error' : lowStock ? 'text-warning' : 'text-success'}`}>
                        {qty} left
                    </span>
                </div>

                {/* Info chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {asset.companyName && (
                        <span className="bg-base-200 text-base-content/60 text-xs px-3 py-1 rounded-full">
                            🏢 {asset.companyName}
                        </span>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                    {outOfStock
                        ? <button disabled className="btn btn-disabled btn-block rounded-xl">Unavailable</button>
                        : <Link to={`/Dashboard/assetsDetails/${asset._id}`} className="btn btn-primary btn-block rounded-xl gap-2">
                            🙋 Request Asset
                          </Link>
                    }
                </div>
            </div>
        </div>
    );
};

const RequestAsset = () => {
    const assetRequest = useLoaderData();
    const [search,      setSearch]      = useState('');
    const [productType, setProductType] = useState('');
    const [sort,        setSort]        = useState('');
    const [page,        setPage]        = useState(1);
    const itemsPerPage = 9;

    const filtered = useMemo(() => {
        let d = [...assetRequest];
        if (search)      d = d.filter(a => a.productName?.toLowerCase().includes(search.toLowerCase()));
        if (productType) d = d.filter(a => a.productType === productType);
        if (sort === 'high') d.sort((a, b) => b.productQuantity - a.productQuantity);
        if (sort === 'low')  d.sort((a, b) => a.productQuantity - b.productQuantity);
        return d;
    }, [assetRequest, search, productType, sort]);

    const start     = (page - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const available    = assetRequest.filter(a => a.productQuantity > 0).length;
    const returnable   = assetRequest.filter(a => a.productType === 'Returnable').length;
    const nonReturnable= assetRequest.filter(a => a.productType === 'Non-returnable').length;

    return (
        <div className="min-h-screen bg-base-200 p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold">Request an Asset</h1>
                <p className="text-base-content/50 text-sm mt-1">Browse and request available assets from your company</p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { icon: '📦', label: 'Total',          value: assetRequest.length, color: 'text-primary', bg: 'bg-primary/10'  },
                    { icon: '🔄', label: 'Returnable',     value: returnable,          color: 'text-success', bg: 'bg-success/10'  },
                    { icon: '🎁', label: 'Non-returnable', value: nonReturnable,       color: 'text-error',   bg: 'bg-error/10'    },
                ].map(({ icon, label, value, color, bg }) => (
                    <div key={label} className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
                        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-xl`}>{icon}</div>
                        <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                        <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filter bar */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
                <label className="input input-bordered flex items-center gap-2 flex-1 min-w-[180px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input type="text" placeholder="Search assets…"
                        className="grow bg-transparent outline-none text-sm"
                        onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </label>

                <select className="select select-bordered w-44"
                    onChange={e => { setProductType(e.target.value); setPage(1); }}>
                    <option value="">All Types</option>
                    <option value="Returnable">🔄 Returnable</option>
                    <option value="Non-returnable">🎁 Non-returnable</option>
                </select>

                <select className="select select-bordered w-44"
                    onChange={e => { setSort(e.target.value); setPage(1); }}>
                    <option value="">Sort by Quantity</option>
                    <option value="high">↑ High → Low</option>
                    <option value="low">↓ Low → High</option>
                </select>

                <span className="text-sm text-base-content/40 ml-auto hidden sm:block">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Grid */}
            {paginated.length === 0 ? (
                <div className="text-center py-24">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-base-content/40 text-lg">No assets found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginated.map(asset => <AssetCard key={asset._id} asset={asset} />)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                    <button className="btn btn-sm btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>«</button>
                    {[...Array(totalPages).keys()].map(n => (
                        <button key={n} onClick={() => setPage(n + 1)}
                            className={`btn btn-sm ${page === n + 1 ? 'btn-primary' : 'btn-ghost'}`}>
                            {n + 1}
                        </button>
                    ))}
                    <button className="btn btn-sm btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>»</button>
                </div>
            )}
        </div>
    );
};

export default RequestAsset;
