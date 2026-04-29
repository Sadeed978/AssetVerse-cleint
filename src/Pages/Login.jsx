import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContexts';

const Login = () => {
    const { setUser, signInUser } = use(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const redirectByRole = (email, fallback) => {
        fetch(`https://asset-verse-server-phi.vercel.app/users/${email}`)
            .then(res => res.json())
            .then(data => {
                if (data?.role === 'hr') navigate('/Dashboard/HR');
                else if (data?.role === 'employee') navigate('/Dashboard/Employee');
                else navigate(fallback || '/');
            })
            .catch(() => navigate(fallback || '/'));
    };

    const handleLogin = (data) => {
        signInUser(data.email, data.password)
            .then(result => {
                setUser(result.user);
                toast.success('Login successful!');
                redirectByRole(result.user.email, location.state);
            })
            .catch(error => {
                console.error(error);
                toast.error('Login failed: ' + error.message);
            });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl border border-base-300">
                <div className="card-body gap-4">
                    <div className="text-center mb-2">
                        <h2 className="text-2xl font-black">Welcome back</h2>
                        <p className="text-base-content/40 text-sm mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-3">
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Email</span></label>
                            <input type="email" {...register('email', { required: true })}
                                className="input input-bordered w-full" placeholder="email@example.com" />
                        </div>
                        <div className="form-control">
                            <label className="label pb-1"><span className="label-text font-semibold text-sm">Password</span></label>
                            <input type="password" {...register('password', { required: true, minLength: 6 })}
                                className="input input-bordered w-full" placeholder="Your password" />
                        </div>
                        <button className="btn btn-primary w-full rounded-xl mt-2">Log In</button>
                    </form>

                    <p className="text-sm text-center text-base-content/50 mt-2">
                        New here?{' '}
                        <Link className="text-primary hover:underline font-medium" to="/HRRegister">Register as HR</Link>
                        {' '}or{' '}
                        <Link className="text-primary hover:underline font-medium" to="/EmployeeRegister">Employee</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
