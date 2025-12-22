import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContexts';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
const HRRegistration = () => {
    const { setUser, createUser, } = use(AuthContext);
    const { register, handleSubmit } = useForm();
    let limit=5;
    let currentEmployees=0;
    const handleRegistration = (data) => {

        createUser(data.email, data.password)
            .then(result => {
                const users = result.user;
                console.log(users);
                setUser(users);
                toast.success(users.email +'Registration Successful');
                const profile = {
                    displayName: data.name,
                    email: data.email,
                    companyName: data.companyName,
                    companyLogo: data.companyLogo,
                    password: data.password,
                    dateOfBirth: data.dateOfBirth,
                    role: 'hr',
                    packageLimit: limit,
                    currentEmployees:currentEmployees,
                    subscription: "basic"
                  
                };
                fetch('https://asset-verse-server-phi.vercel.app/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profile)
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log('get the data', data)
                    })

            })
            .catch(error => console.error(error));
    }

    return (
        <div className="items-center  justify-center min-h-screen bg-gray-100 p-20">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto">
                <div className="card-body">
                    <form onSubmit={handleSubmit(handleRegistration)}>
                        <fieldset className="fieldset">
                            <label className="label">Name</label>
                            <input type="text" {...register('name', { required: true })} className='input' placeholder="Name" />

                            <label className="label">Company Name</label>
                            <input type="text" {...register('companyName', { required: true })} className="input" placeholder="Company Name" />

                            <label className="label">Company Logo URL</label>
                            <input type="url" {...register('companyLogo')} className="input" placeholder="Image URL (ImgBB / Cloudinary)" />


                            <label className="label">Company Email</label>
                            <input type="email" {...register('email', { required: true })} className="input" placeholder="email@company.com" />


                            <label className="label">Password</label>
                            <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Minimum 6 characters" />

                            <label className="label">Date of Birth</label>
                            <input type="date" {...register("dateOfBirth", { required: true })} className="input" />

                            <button className="btn btn-neutral mt-4">Register</button>
                        </fieldset>
                        <p>If You have An Account <Link className='text-blue-500' to='/Login'>Login</Link></p>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default HRRegistration;