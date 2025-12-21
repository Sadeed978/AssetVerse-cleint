import React from 'react';

const SinglePacage = ({ pacage }) => {
    const { name, employeeLimit, price, features } = pacage;
    return (
        <div className="p-4">
            <div className="card w-96 bg-base-100 shadow-sm">
                <div className="card-body">
                    <span className="badge badge-xs badge-warning">Most Popular</span>
                    <div className="flex justify-between">
                        <h2 className="text-3xl font-bold">{name}</h2>
                        <span className="text-xl">{price} BDT</span>
                    </div>
                    <ul className="mt-6 flex flex-col gap-2 text-xs">
                        <li>Employee Limit: {employeeLimit}</li>
                        {features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    <div className="mt-6">
                        <button className="btn btn-primary btn-block">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePacage;