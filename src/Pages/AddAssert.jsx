import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
const AddAssert = () => {
    const { register, handleSubmit } = useForm();
    
    const onSubmit = data => {
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
                console.log(result);
                toast.success('Product added successfully!');
            })
            .catch(error => {
                toast.error('Error adding product:', error);
            
            });
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Product Name */}
                <label className="label mr-4 flex items-center gap-4">
                    <span className="label-text w-40">Product Name</span>
                    <input
                        type="text"
                        {...register('productName', { required: true })}
                        className="input input-bordered w-full"
                        placeholder="Enter product name"
                    />
                </label>

                {/* Product Image */}
                <label className="label mr-4 flex items-center gap-4">
                    <span className="label-text w-40">Product Image URL</span>
                    <input
                        type="text"
                        {...register('productImage', { required: true })}
                        className="input input-bordered w-full"
                        placeholder="Image URL"
                    />
                </label>

                {/* Product Type (Radio - SAME STYLE) */}
                <div className="flex items-center gap-6">
                    <span className="label-text w-40">Product Type</span>

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
                <label className="label mr-4 flex items-center gap-4">
                    <span className="label-text w-40">Total Quantity</span>
                    <input
                        type="number"
                        {...register('productQuantity', { required: true, min: 1 })}
                        className="input input-bordered w-full"
                        placeholder="Total quantity"
                    />
                </label>

                {/* Available Quantity (readonly) */}
                <label className="label mr-4 flex items-center gap-4">
                    <span className="label-text w-40">Available Quantity</span>
                    <input
                        type="number"
                        {...register('availableQuantity')}
                        className="input input-bordered w-full"
                        readOnly
                    />
                </label>

                {/* Company Name */}
                <label className="label mr-4 flex items-center gap-4">
                    <span className="label-text w-40">Company Name</span>
                    <input
                        type="text"
                        {...register('companyName', { required: true })}
                        className="input input-bordered w-full"
                        placeholder="Company name"
                    />
                </label>

                {/* HR Email */}
                <label className="label mr-4 flex items-center gap-4">
                    <span className="label-text w-40">HR Email</span>
                    <input
                        type="email"
                        {...register('hrEmail')}
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

            </form>


        </div>
    );
};

export default AddAssert;