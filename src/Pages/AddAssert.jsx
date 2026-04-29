import React, { use, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContexts';

const AddAssert = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = use(AuthContext);
    const [companyName, setCompanyName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            fetch(`https://asset-verse-server-phi.vercel.app/users/${user?.email}`)
                .then(res => res.json())
                .then(data => setCompanyName(data.companyName))
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [user]);

    const onSubmit = data => {
        setSubmitting(true);
        data.companyName = companyName;
        data.hrEmail = user?.email;
        data.dateAdded = new Date().toISOString();

        fetch('https://asset-verse-server-phi.vercel.app/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(() => {
                toast.success('Asset added successfully!');
                reset();
            })
            .catch(() => toast.error('Failed to add asset'))
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">📦</div>
                    <h1 className="text-3xl font-extrabold text-base-content">Add New Asset</h1>
                    <p className="text-base-content/50 mt-1 text-sm">Fill in the details to add an asset to your inventory</p>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Product Name */}
                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold">Product Name <span className="text-error">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    {...register('productName', { required: true })}
                                    className="input input-bordered w-full focus:input-primary"
                                    placeholder="e.g. MacBook Pro, Office Chair..."
                                />
                            </div>

                            {/* Product Image URL */}
                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold">Product Image URL</span>
                                    <span className="label-text-alt text-base-content/40">optional</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('productImage')}
                                    className="input input-bordered w-full focus:input-primary"
                                    placeholder="https://example.com/image.png"
                                />
                            </div>

                            {/* Type + Quantity side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                {/* Product Type */}
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-semibold">Asset Type <span className="text-error">*</span></span>
                                    </label>
                                    <div className="flex flex-col gap-2 mt-1">
                                        <label className="flex items-center gap-3 cursor-pointer bg-base-200 rounded-lg px-4 py-3 hover:bg-base-300 transition">
                                            <input
                                                type="radio"
                                                {...register('productType')}
                                                value="Returnable"
                                                className="radio radio-success"
                                                defaultChecked
                                            />
                                            <div>
                                                <p className="font-medium text-sm">Returnable</p>
                                                <p className="text-xs text-base-content/40">Must be returned</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer bg-base-200 rounded-lg px-4 py-3 hover:bg-base-300 transition">
                                            <input
                                                type="radio"
                                                {...register('productType')}
                                                value="Non-returnable"
                                                className="radio radio-error"
                                            />
                                            <div>
                                                <p className="font-medium text-sm">Non-returnable</p>
                                                <p className="text-xs text-base-content/40">Kept by employee</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-semibold">Total Quantity <span className="text-error">*</span></span>
                                    </label>
                                    <input
                                        type="number"
                                        {...register('productQuantity', { required: true, min: 1 })}
                                        className="input input-bordered w-full focus:input-primary"
                                        placeholder="e.g. 10"
                                        min={1}
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="divider text-base-content/30 text-xs">Auto-filled</div>

                            {/* Company + HR Email side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-semibold">Company Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('companyName')}
                                        defaultValue={companyName}
                                        className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-semibold">HR Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        {...register('hrEmail')}
                                        defaultValue={user?.email}
                                        className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-primary w-full mt-2 text-base"
                            >
                                {submitting
                                    ? <><span className="loading loading-spinner loading-sm"></span> Adding...</>
                                    : '➕ Add Asset'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAssert;
