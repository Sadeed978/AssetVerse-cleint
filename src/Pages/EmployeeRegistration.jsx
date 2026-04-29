import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContexts';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const EmployeeRegistration = () => {
    const { setUser, createUser } = use(AuthContext);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const handleRegistration = (data) => {
        createUser(data.email, data.password)
            .then(result => {
                setUser(result.user);
                toast.success('Employee account created!');
                const profile = {
                    displayName: data.name,
                    email: data.email,
                    password: data.password,
                    dateOfBirth: data.dateOfBirth,
                    role: 'employee',
                };
                fetch('https://asset-verse-server-phi.vercel.app/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profile),
                })
                    .then(r => r.json())
                    .then(() => navigate('/Dashboard/Employee'));
            })
            .catch(error => {
                console.error(error);
                toast.error(error.message);
            });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl border border-base-300">
                <div className="card-body gap-3">
                    <div className="text-center mb-2">
                        <h2 className="text-2xl font-black">Register as Employee</h2>
                        <p className="text-base-content/40 text-sm mt-1">Join your company on AssetVerse</p>
                    </div>

                    <form onSubmit={handleSubmit(handleRegistration)} className="flex flex-col gap-3">
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Full Name</span></label>
                            <input type="text" {...register('name', { required: true })}
                                className="input input-bordered w-full" placeholder="Your full name" />
                        </div>
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Personal Email</span></label>
                            <input type="email" {...register('email', { required: true })}
                                className="input input-bordered w-full" placeholder="email@example.com" />
                        </div>
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Password</span></label>
                            <input type="password" {...register('password', { required: true, minLength: 6 })}
                                className="input input-bordered w-full" placeholder="Minimum 6 characters" />
                        </div>
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Date of Birth</span></label>
                            <input type="date" {...register('dateOfBirth', { required: true })}
                                className="input input-bordered w-full" />
                        </div>
                        <button className="btn btn-primary w-full rounded-xl mt-1">Create Employee Account</button>
                    </form>

                    <p className="text-sm text-center text-base-content/50 mt-1">
                        Already have an account?{' '}
                        <Link className="text-primary hover:underline font-medium" to="/Login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRegistration;
