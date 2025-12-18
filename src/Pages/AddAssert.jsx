import React,{use, useState}from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContexts';
import { useEffect } from 'react';
const AddAssert = () => {
    const { register, handleSubmit } = useForm();
    const {user}=use(AuthContext)
    const [companyName,SetCompanyName]=useState(null);
    useEffect(() => {
        if (user){
         fetch(`http://localhost:3000/users/${user?.email}`)
         .then(res => res.json())
         .then(data => {
             SetCompanyName(data.companyName)
         })
         .catch(error => console.error('Error fetching user data:', error));
        }
     },[user] );
    const onSubmit = data => {
        data.companyName=companyName;
        console.log(data);
        fetch('http://localhost:3000/assets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                toast.success('Product added successfully!');
            })
            .catch(error => {
                toast.error('Error adding product:', error);

            });
    };
    
    return (
        <div className="items-center  justify-center min-h-screen bg-gray-100 p-20">
            <div className="card bg-base-100  max-w-sm shrink-0 shadow-2xl mx-auto ">
                <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <fieldset className="fieldset">
                       

                            {/* Product Name */}
                            <label className="label  items-center gap-4">
                                <span className="label-text w-40">Product Name</span>
                                <input
                                    type="text"
                                    {...register('productName', { required: true })}
                                    className="input input-bordered w-full"
                                    placeholder="Enter product name"
                                />
                            </label>

                            {/* Product Image */}
                            <label className="label mr-4 items-center gap-4">
                                <span className="label-text w-40">Product Image URL</span>
                                <input
                                    type="text"
                                    {...register('productImage', { required: true })}
                                    className="input input-bordered w-full"
                                    placeholder="Image URL"
                                />
                            </label>

                            {/* Product Type (Radio - SAME STYLE) */}
                            <div className="items-center ">
                                <span className="label-text w-40 mr-10">Type</span>

                                <label className="label mr-4">
                                    <input
                                        type="radio"
                                        {...register('productType')}
                                        value="Returnable"
                                        className="radio"
                                        defaultChecked
                                    />
                                    Returnable
                                </label>

                                <label className="label mr-4">
                                    <input
                                        type="radio"
                                        {...register('productType')}
                                        value="Non-returnable"
                                        className="radio"
                                    />
                                    Non-returnable
                                </label>
                            </div>

                            {/* Product Quantity */}
                            <label className="label mr-4 items-center gap-4">
                                <span className="label-text w-40">Total Quantity</span>
                                <input
                                    type="number"
                                    {...register('productQuantity', { required: true, min: 1 })}
                                    className="input input-bordered w-full"
                                    placeholder="Total quantity"
                                />
                            </label>

                            
                            <label className="label mr-4 items-center gap-4">
                                <span className="label-text w-40">Company Name</span>
                                <input
                                    type="text"
                                    {...register('companyName')} defaultValue={companyName}
                                    className="input input-bordered w-full"
                                    placeholder="Company name"
                                />
                            </label>

                        
                            <label className="label mr-4 items-center gap-4">
                                <span className="label-text w-40">HR Email</span>
                                <input
                                    type="email"
                                    {...register('hrEmail')} defaultValue={user?.email}
                                    className="input input-bordered w-full"
                                    readOnly
                                />
                            </label>

                            {/* Date Added */}
                            <input
                                type="hidden"
                                {...register('dateAdded')}
                                value={new Date().toISOString()}
                            />

                            {/* Submit */}
                            <button type="submit" className="btn btn-primary w-full">
                                Add Product
                            </button>

                       
                    </fieldset>
                    </form>
                </div>
            </div>



        </div>
    );
};

export default AddAssert;