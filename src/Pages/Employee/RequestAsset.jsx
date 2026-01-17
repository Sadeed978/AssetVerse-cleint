import React, { useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router';

const RequestAsset = () => {
    const assetRequest = useLoaderData();
    const [search, setSearch] = useState('');
    const [productType, setProductType] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);

    const itemsPerPage = 6;

   
    const filteredAssets = useMemo(() => {
        let data = [...assetRequest];

     
        if (search) {
            data = data.filter(item =>
                item.productName?.toLowerCase().includes(search.toLowerCase())
            );
        }

      
        if (productType) {
            data = data.filter(item => item.productType === productType);
        }

   
        if (sort === 'high') {
            data.sort((a, b) => b.productQuantity - a.productQuantity);
        }
        if (sort === 'low') {
            data.sort((a, b) => a.productQuantity - b.productQuantity);
        }

        return data;
    }, [assetRequest, search, productType, sort]);

   
    const start = (page - 1) * itemsPerPage;
    const paginatedAssets = filteredAssets.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl text-center text-blue-800 p-4">All Assets</h2>
            <p className="text-2xl text-center mb-6">Click to request an asset</p>

           
            <div className="flex flex-wrap gap-4 justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search asset"
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

          
            {paginatedAssets.length === 0 ? (
                <p className="text-center">No assets found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedAssets.map(request => (
                        <div key={request._id} className="card bg-base-100 shadow-xl">
                            <figure className="px-10 pt-10">
                                <img
                                    src={request.productImage}
                                    alt={request.productName}
                                    className="rounded-xl h-40 w-40 object-contain mx-auto"
                                />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">{request.productName}</h2>
                                <p className="text-blue-500">
                                    Product Type: {request.productType}
                                </p>
                                <p className="text-blue-500">
                                    Product Quantity: {request.productQuantity}
                                </p>
                                <Link to={`/Dashboard/assetsDetails/${request._id}`}>
                                    <button className="btn btn-primary mt-2">
                                        Request Asset
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

           
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

export default RequestAsset;
