import React, { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContexts';

const typeIcon  = { Returnable: '🔄', 'Non-returnable': '🎁' };
const typeColor = { Returnable: 'badge-success', 'Non-returnable': 'badge-error' };

const AssetsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const { user } = use(AuthContext);

    const [requesterName, setRequesterName] = useState('');
    const [hrEmail,       setHrEmail]       = useState('');
    const [assetName,     setAssetName]      = useState('');
    const [assetType,     setAssetType]      = useState('');
    const [assetQty,      setAssetQty]       = useState(0);
    const [assetImage,    setAssetImage]     = useState('');
    const [companyName,   setCompanyName]    = useState('');
    const [submitting,    setSubmitting]     = useState(false);
    const [imgError,      setImgError]       = useState(false);

    useEffect(() => {
        if (user) {
            fetch(`https://asset-verse-server-phi.vercel.app/users/${user.email}`)
                .then(r => r.json())
                .then(d => setRequesterName(d.displayName || user.displayName || ''))
                .catch(console.error);
        }
        fetch(`https://asset-verse-server-phi.vercel.app/assets/${id}`)
            .then(r => r.json())
            .then(d => {
                setAssetName(d.productName || '');
                setAssetType(d.productType || '');
                setCompanyName(d.companyName || '');
                setAssetQty(parseInt(d.productQuantity) || 0);
                setHrEmail(d.hrEmail || '');
                setAssetImage(d.productImage || '');
            })
            .catch(console.error);
    }, [user, id]);

    const handleRequest = (data) => {
        setSubmitting(true);
        const payload = {
            ...data,
            assetName,
            assetType,
            requesterName,
            requesterEmail: user?.email,
            companyName,
            hrEmail,
            productQuantity: parseInt(data.productQuantity),
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0],
        };
        fetch('https://asset-verse-server-phi.vercel.app/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(r => r.json())
            .then(() => {
                toast.success('Request submitted successfully!');
                navigate('/Dashboard/MyAssets');
            })
            .catch(() => toast.error('Failed to submit request'))
            .finally(() => setSubmitting(false));
    };

    // Emoji fallback for asset image
    const getIcon = (name = '') => {
        const n = name.toLowerCase();
        if (n.includes('laptop') || n.includes('computer')) return '💻';
        if (n.includes('phone') || n.includes('mobile'))    return '📱';
        if (n.includes('router') || n.includes('network'))  return '📡';
        if (n.includes('headphone') || n.includes('audio')) return '🎧';
        if (n.includes('chair') || n.includes('furniture')) return '🪑';
        if (n.includes('monitor') || n.includes('screen'))  return '🖥️';
        if (n.includes('tv') || n.includes('television'))   return '📺';
        if (n.includes('printer'))                          return '🖨️';
        return '📦';
    };

    return (
        <div className="min-h-screen bg-base-200 p-6 flex items-start justify-center">
            <div className="w-full max-w-2xl">

                {/* Asset hero card */}
                <div className="bg-base-100 border border-base-300 rounded-3xl overflow-hidden shadow-xl mb-6">

                    {/* Gradient banner */}
                    <div className="h-28 bg-gradient-to-r from-primary/40 via-secondary/20 to-primary/10 relative flex items-end px-6 pb-4">
                        <h1 className="text-2xl font-extrabold text-base-content drop-shadow">Asset Request</h1>
                    </div>

                    {/* Asset info row */}
                    <div className="px-6 py-5 flex items-center gap-5">
                        {/* Image / icon */}
                        <div className="w-20 h-20 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                            {assetImage && !imgError
                                ? <img src={assetImage} alt={assetName}
                                    className="w-full h-full object-contain p-1"
                                    onError={() => setImgError(true)} />
                                : <span className="text-4xl">{getIcon(assetName)}</span>
                            }
                        </div>

                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-extrabold truncate">{assetName || '—'}</h2>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {assetType && (
                                    <span className={`badge badge-sm font-semibold ${typeColor[assetType] || 'badge-neutral'}`}>
                                        {typeIcon[assetType]} {assetType}
                                    </span>
                                )}
                                {companyName && (
                                    <span className="text-xs text-base-content/40">🏢 {companyName}</span>
                                )}
                            </div>
                        </div>

                        {/* Stock indicator */}
                        <div className="text-center shrink-0">
                            <p className={`text-3xl font-extrabold ${assetQty === 0 ? 'text-error' : assetQty < 5 ? 'text-warning' : 'text-success'}`}>
                                {assetQty}
                            </p>
                            <p className="text-xs text-base-content/40 uppercase tracking-wide">In Stock</p>
                            {assetQty === 0 && <span className="badge badge-error badge-xs mt-1">Out of Stock</span>}
                            {assetQty > 0 && assetQty < 5 && <span className="badge badge-warning badge-xs mt-1">Low Stock</span>}
                        </div>
                    </div>
                </div>

                {/* Request form */}
                <div className="bg-base-100 border border-base-300 rounded-3xl shadow-xl overflow-hidden">
                    <div className="px-6 pt-6 pb-2 border-b border-base-300">
                        <h3 className="font-bold text-lg">Fill Request Details</h3>
                        <p className="text-base-content/40 text-sm">Auto-filled fields are read-only</p>
                    </div>

                    <form onSubmit={handleSubmit(handleRequest)} className="px-6 py-5 flex flex-col gap-4">

                        {/* Read-only info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { label: 'Asset Name',      value: assetName,    icon: '📦' },
                                { label: 'Asset Type',      value: assetType,    icon: '🔖' },
                                { label: 'Requester Name',  value: requesterName,icon: '👤' },
                                { label: 'Requester Email', value: user?.email,  icon: '📧' },
                                { label: 'Company',         value: companyName,  icon: '🏢' },
                                { label: 'HR Email',        value: hrEmail,      icon: '👔' },
                            ].map(({ label, value, icon }) => (
                                <div key={label} className="bg-base-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                    <span className="text-lg shrink-0">{icon}</span>
                                    <div className="min-w-0">
                                        <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
                                        <p className="font-semibold text-sm truncate">{value || '—'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="divider text-xs text-base-content/30 my-0">Fill in below</div>

                        {/* Quantity */}
                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text font-semibold">Quantity Needed <span className="text-error">*</span></span>
                                <span className="label-text-alt text-base-content/40">Max: {assetQty}</span>
                            </label>
                            <input
                                type="number"
                                {...register('productQuantity', { required: true, min: 1, max: assetQty })}
                                className="input input-bordered w-full focus:input-primary"
                                placeholder={`Enter quantity (1 – ${assetQty})`}
                                min={1}
                                max={assetQty}
                                disabled={assetQty === 0}
                            />
                        </div>

                        {/* Purchase / Need date */}
                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text font-semibold">Required By Date <span className="text-error">*</span></span>
                            </label>
                            <input
                                type="date"
                                {...register('purchaseDate', { required: true })}
                                className="input input-bordered w-full focus:input-primary"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Note (optional) */}
                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text font-semibold">Note</span>
                                <span className="label-text-alt text-base-content/40">optional</span>
                            </label>
                            <textarea
                                {...register('note')}
                                className="textarea textarea-bordered w-full resize-none focus:textarea-primary"
                                placeholder="Any additional information for HR…"
                                rows={3}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn btn-ghost flex-1 rounded-xl"
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || assetQty === 0}
                                className="btn btn-primary flex-1 rounded-xl"
                            >
                                {submitting
                                    ? <><span className="loading loading-spinner loading-sm" /> Submitting…</>
                                    : '🙋 Submit Request'}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default AssetsDetails;
