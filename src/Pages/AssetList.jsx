import React, { useEffect, useState, useMemo, use } from 'react';
import AuthContext from '../contexts/AuthContexts';

const AssetList = () => {
    const { user } = use(AuthContext);

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Filter states
    const [search, setSearch] = useState('');
    const [productType, setProductType] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);

    const itemsPerPage = 6;

    useEffect(() => {
        if (!user?.email) return;

        fetch(`https://asset-verse-server-phi.vercel.app/assets/hr/${user.email}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch assets');
                return res.json();
            })
            .then(data => {
                setAssets(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [user?.email]);

    // ✅ FILTER + SORT (IMPORTANT PART)
    const filteredAssets = useMemo(() => {
        let data = [...assets];

        // Search by product name
        if (search) {
            data = data.filter(asset =>
                asset.productName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by product type
        if (productType) {
            data = data.filter(asset => asset.productType === productType);
        }

        // Sort by quantity
        if (sort === 'high') {
            data.sort((a, b) => b.productQuantity - a.productQuantity);
        }
        if (sort === 'low') {
            data.sort((a, b) => a.productQuantity - b.productQuantity);
        }

        return data;
    }, [assets, search, productType, sort]);

    // ✅ PAGINATION
    const start = (page - 1) * itemsPerPage;
    const paginatedAssets = filteredAssets.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

    if (loading) return <p className="text-center">Loading assets...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-3xl text-blue-500 text-center mb-6">My Assets</h2>

            {/* 🔹 FILTER CONTROLS */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search by name"
                    className="input input-bordered"
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    className="select select-bordered"
                    onChange={e => setProductType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                </select>

                <select
                    className="select select-bordered"
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="">Sort by Quantity</option>
                    <option value="high">High → Low</option>
                    <option value="low">Low → High</option>
                </select>
            </div>

            {/* 🔹 ASSET CARDS */}
            {paginatedAssets.length === 0 ? (
                <p className="text-center">No assets found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedAssets.map(asset => (
                        <div key={asset._id} className="card bg-base-100 shadow-md">
                            <figure className="p-4">
                                <img
                                    src={asset.productImage}
                                    alt={asset.productName}
                                    className="h-40 w-40 object-contain mx-auto"
                                />
                            </figure>
                            <div className="card-body text-center">
                                <h2 className="card-title justify-center text-xl">
                                    {asset.productName}
                                </h2>
                                <p>Quantity: {asset.productQuantity}</p>
                                <p>Type: {asset.productType}</p>
                                <div className="card-actions justify-center">
                                    <button className="badge badge-outline">Edit</button>
                                    <button className="badge badge-outline">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🔹 PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {[...Array(totalPages).keys()].map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n + 1)}
                            className={`btn btn-sm ${page === n + 1 ? 'btn-primary' : ''}`}
                        >
                            {n + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssetList;
