import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContexts';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const HRRegistration = () => {
    const { setUser, createUser, signInWithGoogle } = use(AuthContext);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const [googleUser, setGoogleUser] = useState(null);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companyLogo, setCompanyLogo] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const saveHRProfile = (profile) => {
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
                toast.success(users.email + ' Registration Successful');
                const profile = {
                    displayName: data.name,
                    email: data.email,
                    companyName: data.companyName,
                    companyLogo: data.companyLogo,
                    password: data.password,
                    dateOfBirth: data.dateOfBirth,
                    role: 'hr',
                    packageLimit: 5,
                    currentEmployees: 0,
                    subscription: 'basic',
                };
                saveHRProfile(profile).then(() => navigate('/Dashboard/HR'));
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
                            setGoogleUser(gUser);
                            setShowCompanyModal(true);
                        }
                    })
                    .catch(() => {
                        setGoogleUser(gUser);
                        setShowCompanyModal(true);
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

    const handleCompanySubmit = (e) => {
        e.preventDefault();
        if (!companyName.trim()) {
            toast.error('Company name is required');
            return;
        }
        setSubmitting(true);
        const profile = {
            displayName: googleUser.displayName,
            email: googleUser.email,
            photoURL: googleUser.photoURL,
            companyName: companyName.trim(),
            companyLogo: companyLogo.trim() || googleUser.photoURL || '',
            role: 'hr',
            packageLimit: 5,
            currentEmployees: 0,
            subscription: 'basic',
        };
        saveHRProfile(profile)
            .then(() => {
                toast.success('HR account created successfully!');
                setShowCompanyModal(false);
                navigate('/Dashboard/HR');
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to save profile');
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="items-center justify-center min-h-screen bg-base-200 p-20">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto">
                <div className="card-body">
                    <h2 className="text-xl font-bold text-center mb-2">Register as HR</h2>

                    <form onSubmit={handleSubmit(handleRegistration)}>
                        <fieldset className="fieldset">
                            <label className="label">Name</label>
                            <input type="text" {...register('name', { required: true })} className="input w-full" placeholder="Full Name" />

                            <label className="label">Company Name</label>
                            <input type="text" {...register('companyName', { required: true })} className="input w-full" placeholder="Company Name" />

                            <label className="label">Company Logo URL</label>
                            <input type="url" {...register('companyLogo')} className="input w-full" placeholder="Image URL (optional)" />

                            <label className="label">Company Email</label>
                            <input type="email" {...register('email', { required: true })} className="input w-full" placeholder="email@company.com" />

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
                        Continue with Google as HR
                    </button>

                    <p className="text-sm text-center mt-3">
                        Already have an account?{' '}
                        <Link className="text-blue-500" to="/Login">Login</Link>
                    </p>
                </div>
            </div>

            {/* Company details modal */}
            {showCompanyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-base-100 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
                        <h2 className="text-xl font-bold mb-1">One more step</h2>
                        <p className="text-base-content/60 text-sm mb-5">
                            Tell us about your company to complete HR registration.
                        </p>
                        <form onSubmit={handleCompanySubmit} className="flex flex-col gap-3">
                            <div>
                                <label className="label text-sm font-medium">Company Name *</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Acme Corp"
                                    value={companyName}
                                    onChange={e => setCompanyName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-medium">Company Logo URL (optional)</label>
                                <input
                                    type="url"
                                    className="input input-bordered w-full"
                                    placeholder="https://..."
                                    value={companyLogo}
                                    onChange={e => setCompanyLogo(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-2"
                                disabled={submitting}
                            >
                                {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Complete Registration'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm text-base-content/50"
                                onClick={() => setShowCompanyModal(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HRRegistration;
