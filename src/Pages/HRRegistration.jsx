import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContexts';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const HRRegistration = () => {
    const { setUser, createUser } = use(AuthContext);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const handleRegistration = (data) => {
        createUser(data.email, data.password)
            .then(result => {
                setUser(result.user);
                toast.success('HR account created!');
                const profile = {
                    displayName: data.name,
                    email: data.email,
                    companyName: data.companyName,
                    companyLogo: data.companyLogo || '',
                    password: data.password,
                    dateOfBirth: data.dateOfBirth,
                    role: 'hr',
                    packageLimit: 5,
                    currentEmployees: 0,
                    subscription: 'basic',
                };
                fetch('https://asset-verse-server-phi.vercel.app/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profile),
                })
                    .then(r => r.json())
                    .then(() => navigate('/Dashboard/HR'));
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
                        <h2 className="text-2xl font-black">Register as HR</h2>
                        <p className="text-base-content/40 text-sm mt-1">Create your company account</p>
                    </div>

                    <form onSubmit={handleSubmit(handleRegistration)} className="flex flex-col gap-3">
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Full Name</span></label>
                            <input type="text" {...register('name', { required: true })}
                                className="input input-bordered w-full" placeholder="Your full name" />
                        </div>
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Company Name</span></label>
                            <input type="text" {...register('companyName', { required: true })}
                                className="input input-bordered w-full" placeholder="Company name" />
                        </div>
                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text font-semibold text-sm">Company Logo URL</span>
                                <span className="label-text-alt text-base-content/40">optional</span>
                            </label>
                            <input type="url" {...register('companyLogo')}
                                className="input input-bordered w-full" placeholder="https://..." />
                        </div>
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Company Email</span></label>
                            <input type="email" {...register('email', { required: true })}
                                className="input input-bordered w-full" placeholder="email@company.com" />
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
                        <button className="btn btn-primary w-full rounded-xl mt-1">Create HR Account</button>
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

export default HRRegistration;
