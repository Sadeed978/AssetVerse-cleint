import React from 'react';
import { Link,  useLoaderData } from 'react-router';
const RequestAsset = () => {
    const assetRequest = useLoaderData();
    return (
        <div>
            <h2 className='text-4xl text-center text-blue-800 p-4'>All Assets</h2>
            <p className='text-2xl text-center'>click For your Requeist</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                {
                    assetRequest.map(request => (
                        <div key={request._id} className="card w-96 bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="card bg-base-100 w-96 shadow-sm">
                                    <figure className="px-10 pt-10">
                                        <img
                                            src={request.productImage}
                                            alt="Asset"
                                            className="rounded-xl" />
                                    </figure>
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title">{request.productName}</h2>
                                        <p className='text-blue-500'>Product Type:{request.productType}</p>
                                        <p className='text-blue-500'>Product Quantity:{request.productQuantity}</p>
                                        <Link to={`/assetsDetails/${request._id}`}>  <button className="btn btn-primary">Request Asset</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default RequestAsset;