import React from 'react';
import SingleRequest from './SingleRequest';

const Requests = ({ requestPromise}) => {
    if (!requestPromise || requestPromise.length === 0) {
        return <div>No requests available.</div>;
    }
    return (
        <div>
            {requestPromise.map((request) => (
                <SingleRequest key={request._id} request={request} ></SingleRequest>
            ))}
            
        </div>
    );
};

export default Requests;