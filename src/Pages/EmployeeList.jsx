import React from 'react';
import { use } from 'react';
import AuthContext from '../contexts/AuthContexts';
import { useQuery } from '@tanstack/react-query';
const EmployeeList = () => {
    const { user } = use(AuthContext);
    const hrEmail = user?.email;
    const { data = [], isLoading, isError, error } = useQuery({
        queryKey: ['employeeList', hrEmail],
        queryFn: async () => {
            const res = await fetch(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`);
            const data = await res.json();
            return data;
        },
    });
    if (isLoading) {
        return <p>Loading...</p>;
    }
    return (

        <div>
            <h2 className="text-2xl text-center font-bold mb-4"> Employees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {data.map((employee) => (
                    <div key={employee._id} className=" p-4 mb-4 rounded shadow">

                        <div className="card bg-base-100 w-96 shadow-sm">

                            <div className="card-body items-center text-center">
                                <h2 className="card-title">{employee.employeeName}</h2>
                                <h3 className="text-xl font-semibold mb-2"></h3>
                                <p><strong>Email:</strong> {employee.employeeEmail}</p>
                                <p><strong>Asset Name:</strong> {employee.assetName}</p>
                                <p><strong>Asset Type:</strong> {employee.assetType}</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary">{employee.status}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
};

export default EmployeeList;