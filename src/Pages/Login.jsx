import React from 'react';
import { useForm } from 'react-hook-form';
import { use } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router';
import AuthContext from '../contexts/AuthContexts';

const Login = () => {
    const { setUser,signInUser, } = use(AuthContext);
    const location = useLocation();
    const navigate= useNavigate();
    const { register, handleSubmit } = useForm();
    const handleLogin = (data) => {
        signInUser(data.email, data.password)
            .then(result => {
                const users = result.user;
                console.log(users);
                setUser(users);
                toast.success(users.email + ' Login Successful');
                navigate(location.state || '/');
            })
            .catch(error =>{console.error(error);
                toast.error('Login Failed: ' + error.message);
            } 
            );
    };
    return (
        <div>
             <div className="items-center  justify-center min-h-screen bg-gray-100 p-20">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto">
                <div className="card-body">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <fieldset className="fieldset">
                            <label className="label">Name</label>
                            <input type="text" {...register('name', { required: true })} className='input' placeholder="Name" />

                            <label className="label">Personal Email</label>
                            <input type="email" {...register('email', { required: true })} className="input" placeholder="email@company.com" />


                            <label className="label">Password</label>
                            <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Minimum 6 characters" />


                            <button className="btn btn-neutral mt-4">Log In </button>
                        </fieldset>
                    </form>
                    <p>If you are new then go to <Link className='text-blue-500' to='/HRRegister'>Register As HR</Link> or <Link className='text-blue-500' to='/EmployeeRegister'>Register As Employee</Link></p>
                </div>
            </div>

        </div>
        </div>
    );
};

export default Login;