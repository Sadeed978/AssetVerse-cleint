import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContexts';

const Login = () => {
    const { setUser, signInUser, signInWithGoogle } = use(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [googleLoading, setGoogleLoading] = useState(false);

    const redirectByRole = (email, fallback) => {
        fetch(`https://asset-verse-server-phi.vercel.app/users/${email}`)
            .then(res => res.json())
            .then(data => {
                if (data?.role === 'hr') {
                    navigate('/Dashboard/HR');
                } else if (data?.role === 'employee') {
                    navigate('/Dashboard/Employee');
                } else {
                    navigate(fallback || '/');
                }
            })
            .catch(() => navigate(fallback || '/'));
    };

    const handleLogin = (data) => {
        signInUser(data.email, data.password)
            .then(result => {
                const users = result.user;
                setUser(users);
                toast.success(users.email + ' Login Successful');
                redirectByRole(users.email, location.state);
            })
            .catch(error => {
                console.error(error);
                toast.error('Login Failed: ' + error.message);
            });
    };

    const handleGoogleLogin = () => {
        if (googleLoading) return;
        setGoogleLoading(true);
        signInWithGoogle()
            .then(result => {
                const gUser = result.user;
                setUser(gUser);
                toast.success('Welcome, ' + gUser.displayName);
                redirectByRole(gUser.email, location.state);
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
                    <h2 className="text-xl font-bold text-center mb-2">Login</h2>

                    <form onSubmit={handleSubmit(handleLogin)}>
                        <fieldset className="fieldset">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                className="input w-full"
                                placeholder="email@example.com"
                            />
                            <label className="label">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: true, minLength: 6 })}
                                className="input w-full"
                                placeholder="Your password"
                            />
                            <button className="btn btn-neutral mt-4 w-full">Log In</button>
                        </fieldset>
                    </form>

                    <div className="divider text-base-content/40">OR</div>

                    <button
                        onClick={handleGoogleLogin}
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
                        Continue with Google
                    </button>

                    <p className="text-sm text-center mt-3">
                        New here?{' '}
                        <Link className="text-blue-500" to="/HRRegister">Register as HR</Link>
                        {' '}or{' '}
                        <Link className="text-blue-500" to="/EmployeeRegister">Register as Employee</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
