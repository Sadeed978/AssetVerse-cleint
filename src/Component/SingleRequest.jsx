import React from 'react';

const SingleRequest = ({ request }) => {
    const { _id, assetName, assetType, requesterEmail, quantity, status } = request;
    const handleAccept = () => {
        // Implement accept logic here
    };
    const handleDeny = () => {
        fetch(`http://localhost:3000/requests/${_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'denied' })
        })
            .then(res => res.json())        
        .then(result => {
            console.log('Request denied:', result);
        })
        .catch(error => {
            console.error('Error denying request:', error);
        });
    }

    return (
        <div className="card bg-neutral text-neutral-content w-96">
            <div className="card-body items-center text-center">
                <h2 className="card-title">{assetName}</h2>
                <p>We are using cookies for no reason.</p>
                <p>Type: {assetType}</p>
                <p>Requester Email: {requesterEmail}</p>
                <p>Quantity: {quantity}</p>
                <p className='font-bold'>Status: {status}</p>
                <div className="card-actions justify-end">
                    <button onClick={handleAccept} className="btn btn-primary">Accept</button>
                    <button onClick={handleDeny} className="btn btn-ghost">Deny</button>
                </div>
            </div>
        </div>
    );
};

export default SingleRequest;