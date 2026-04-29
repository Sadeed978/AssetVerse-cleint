import React from 'react';

const SinglePacage = ({ pacage }) => {
    const { name, employeeLimit, price, features } = pacage;
    return (
        <div className="card bg-base-100 shadow-md border border-base-300 w-full">
            <div className="card-body">
                <span className="badge badge-warning badge-sm w-fit">Most Popular</span>
                <div className="flex justify-between items-center mt-2">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <span className="text-lg font-semibold text-primary">{price} BDT</span>
                </div>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-base-content/70">
                    <li className="font-medium text-base-content">Employee Limit: {employeeLimit}</li>
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="text-success">✓</span> {feature}
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    <button className="btn btn-primary btn-block">Subscribe</button>
                </div>
            </div>
        </div>
    );
};

export default SinglePacage;
