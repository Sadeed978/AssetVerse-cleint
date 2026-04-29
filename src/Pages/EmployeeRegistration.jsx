import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContexts';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const EmployeeRegistration = () => {
    const { setUser, createUser, signInWithGoogle } = use(AuthContext);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [googleLoading, setGoogleLoading] = useState(false);

    const saveEmployeeProfile = (profile) => {
        return fetch('https://asset-verse-server-phi.vercel.app/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        }).then(res => res.json());
    };

    const handleRegistration = (data) => {
        createUser(data.email, data.password)
            .then(result => {
                const users = result.user;
                setUser(users);
                toast.success(users.email + ' Registration Successful as Employee');
                const profile = {
                    displayName: data.name,
                    email: data.email,
                    password: data.password,
                    dateOfBirth: data.dateOfBirth,
                    role: 'employee',
                };
                saveEmployeeProfile(profile).then(() => navigate('/Dashboard/Employee'));
            })
            .catch(error => {
                console.error(error);
                toast.error(error.message);
            });
    };

    const handleGoogleSignIn = () => {
        if (googleLoading) return;
        setGoogleLoading(true);
        signInWithGoogle()
            .then(result => {
                const gUser = result.user;
                setUser(gUser);
                fetch(`https://asset-verse-server-phi.vercel.app/users/${gUser.email}`)
                    .then(res => res.json())
                    .then(existing => {
                        if (existing && existing.role) {
                            toast.success('Welcome back, ' + gUser.displayName);
                            navigate(existing.role === 'hr' ? '/Dashboard/HR' : '/Dashboard/Employee');
                        } else {
                            const profile = {
                                displayName: gUser.displayName,
                                email: gUser.email,
                                photoURL: gUser.photoURL,
                                role: 'employee',
                            };
                            saveEmployeeProfile(profile).then(() => {
                                toast.success('Employee account created!');
                                navigate('/Dashboard/Employee');
                            });
                        }
                    })
                    .catch(() => {
                        const profile = {
                            displayName: gUser.displayName,
                            email: gUser.email,
                            photoURL: gUser.photoURL,
                            role: 'employee',
                        };
                        saveEmployeeProfile(profile).then(() => {
                            toast.success('Employee account created!');
                            navigate('/Dashboard/Employee');
                        });
                    });
            })
            .catch(error => {
                console.error(error);
                if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
                    toast.error(error.message);
                }
            })
            .finally(() => setGoogleLoading(false));
    };

    return (
        <div className="items-center justify-center min-h-screen bg-base-200 p-20">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto">
                <div className="card-body">
                    <h2 className="text-xl font-bold text-center mb-2">Register as Employee</h2>

                    <form onSubmit={handleSubmit(handleRegistration)}>
                        <fieldset className="fieldset">
                            <label className="label">Name</label>
                            <input type="text" {...register('name', { required: true })} className="input w-full" placeholder="Full Name" />

                            <label className="label">Personal Email</label>
                            <input type="email" {...register('email', { required: true })} className="input w-full" placeholder="email@example.com" />

                            <label className="label">Password</label>
                            <input type="password" {...register('password', { required: true, minLength: 6 })} className="input w-full" placeholder="Minimum 6 characters" />

                            <label className="label">Date of Birth</label>
                            <input type="date" {...register('dateOfBirth', { required: true })} className="input w-full" />

                            <button className="btn btn-neutral mt-4 w-full">Register</button>
                        </fieldset>
                    </form>

                    <div className="divider text-base-content/40">OR</div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="btn btn-outline w-full flex items-center gap-2"
                    >
                        {googleLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                        )}
                        Continue with Google as Employee
                    </button>

                    <p className="text-sm text-center mt-3">
                        Already have an account?{' '}
                        <Link className="text-blue-500" to="/Login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRegistration;
