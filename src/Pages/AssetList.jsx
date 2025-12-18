import React from 'react';
import { useEffect} from 'react';
import { useState } from 'react';
import {use} from 'react';
import AuthContext from '../contexts/AuthContexts';

const AssetList = () => {
    const {user} = use(AuthContext);
    const [assets,setAssets]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.email) return;

        fetch(`http://localhost:3000/assets/${user.email}`)
            .then(res => {
                if (!res.ok) return Promise.reject('Failed to fetch assets');
                return res.json();
            })
            .then(data => {
                setAssets(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [user?.email]);

    if (loading) return <p>Loading assets...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="text-2xl text-center">
            <h2 className='text-3xl text-blue-500 p-7'>My Assets</h2>

            {assets.length === 0 ? (
                <p>No assets found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {assets.map(asset => (
                        <div className="asset-card" key={asset._id}>
                            <div className="card bg-base-100 w-96 shadow-sm p-4 mx-auto">
                                <figure>
                                    <img
                                        src={asset.productImage}
                                        className='h-50 w-50 object-cover'
                                        alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title text-2xl">
                                        {asset.productName}
                                    </h2>
                                    <p className='text-xl'>Total Remaining:{asset.productQuantity}</p>
                                    <p className='text-xl'>Product Type:{asset.productType}</p>
                                    <div className="card-actions justify-end">
                                        <div className="badge badge-outline">Edit</div>
                                        <div className="badge badge-outline">Delete</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssetList;
