import React from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContexts';
import { use } from 'react';
const EmployeeRegistration = () => {
    const {setUser ,createUser,} = use(AuthContext);
    const { register, handleSubmit} = useForm();
    const handleRegistration = (data) => {
        
        createUser(data.email, data.password)
        .then(result => {
            const users = result.user;
            console.log(users);
            setUser(users);
            const profile = {
                displayName: data.name,
                email: data.email,
                password: data.password,
                dateOfBirth: data.dateOfBirth,
                role: 'employee'
            };
            console.log(profile);
            fetch('http://localhost:3000/users', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                    },
                body:JSON.stringify(profile)
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

                            <label className="label">Personal Email</label>
                            <input type="email" {...register('email', { required: true })} className="input" placeholder="email@company.com" />


                            <label className="label">Password</label>
                            <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Minimum 6 characters" />

                            <label className="label">Date of Birth</label>
                            <input type="date" {...register("dateOfBirth", { required: true })} className="input" />


                            <button className="btn btn-neutral mt-4">Register</button>
                        </fieldset>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default EmployeeRegistration;