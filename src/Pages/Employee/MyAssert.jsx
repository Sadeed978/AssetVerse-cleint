import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContexts';

const MyAssets = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user.email; 
  const { data: affiliation, isLoading: affiliationLoading } = useQuery({
    queryKey: ['affiliation', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`
      );
      return res.data;
    },
  });

  const hrEmail = affiliation?.hrEmail;
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['requests', hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`
      );
      return res.data;
    },
  });

  if (affiliationLoading || requestsLoading) {
    return <p className="text-center">Loading assets...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        All Asset Requests ({requests.length})
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <div key={req._id} className="card bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="card-body p-5">
                <h3 className="text-xl font-bold mb-2">{req.assetName}</h3>
                <p><strong>Type:</strong> {req.assetType}</p>
                <p><strong>Quantity:</strong> {req.quantity}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`ml-2 font-semibold ${req.status === 'Accepted' ? 'text-green-600' : req.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {req.status}
                  </span>
                </p>
                {req.requestDate && (
                  <p><strong>Date:</strong> {new Date(req.requestDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssets;
