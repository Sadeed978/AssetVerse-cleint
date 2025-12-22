import React from 'react';
import SingleRequest from './SingleRequest';

const Requests = ({ requestPromise}) => {
    if (!requestPromise || requestPromise.length === 0) {
        return <div>No requests available.</div>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requestPromise.map((request) => (
                <SingleRequest key={request._id} request={request} ></SingleRequest>
            ))}
            
        </div>
    );
};

export default Requests;