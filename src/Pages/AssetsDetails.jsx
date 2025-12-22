import React from 'react';
import {use} from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContexts';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
const AssetsDetails = () => {
    const { id } = useParams();
    const { register,handleSubmit } = useForm();
    const {user}=use(AuthContext)
    const [name,SetName]=useState('');
    const[email,SetEmail]=useState('');
    const[assetsName,SetAssetsName]=useState('');
    const[assetsType,SetAssetsType]=useState('');
    const[assetQuantity,SetAssetQuantity]=useState(0);
    const [companyName,SetCompanyName]=useState(null);
    useEffect(() => {
            if (user){
             fetch(`http://localhost:3000/users/${user?.email}`)
             .then(res => res.json())
             .then(data => {
                SetName(data.displayName);
             })
             .catch(error => console.error('Error fetching user data:', error));
            }
            fetch(`http://localhost:3000/assets/${id}`)
            .then(res => res.json())
            .then(data => {
               SetAssetsName(data.productName);
               SetAssetsType(data.productType);
               SetCompanyName(data.companyName);
               SetAssetQuantity(parseInt(data.productQuantity));
               SetEmail(data.hrEmail);
            })
        },[user,id] );

        

    const handleRequest = (data) => {
        data.assetName=assetsName;
        data.assetType=assetsType;
        data.requesterName=name;
        data.requesterEmail=user?.email;
        data.companyName=companyName;
        data.hrEmail=email;
        data.productQuantity=parseInt(data.productQuantity);
        data.status='pending';
        data.requestDate=new Date().toISOString().split('T')[0];
        console.log(data);
        fetch('http://localhost:3000/requests', {
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
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Assets Details</h2>
            <form onSubmit={handleSubmit(handleRequest)} className="max-w-md  bg-white p-6 rounded shadow mx-auto">
                <fieldset className="fieldset">
                    <div className="mb-4">
                        <label className="block text-gray-700">Asset Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            {...register('assetName')}
                            defaultValue={assetsName}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Asset Type</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            {...register('assetType')} defaultValue={assetsType}
                        />
                    </div>
                    <div>
                    <label className="label mr-4 items-center gap-4">Total Quantity </label>
    
                                <input
                                    type="number"
                                    {...register('productQuantity', { required: true, min: 1 ,max: {assetQuantity}})}
                                    className="input input-bordered w-full"
                                    placeholder="Total quantity"
                                />
                    </div>    
                    <div className="mb-4">
                        <label className="block text-gray-700">Requester Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            {...register('requesterName')}
                            defaultValue={name}
                           
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Requester Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            {...register('requesterEmail')}
                            defaultValue={user?.email}
                            
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Company Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            {...register('companyName')}
                            defaultValue={companyName}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">HR Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            {...register('hrEmail')}
                            defaultValue={email}
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-gray-700">Purchase Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded"
                            {...register('purchaseDate',{ required: true }) }
                        />
                    </div>
                    <button  className="bg-blue-500 text-white px-4 py-2 rounded" > Submit </button>
                </fieldset>
            </form>
        </div>
    );
};

export default AssetsDetails;