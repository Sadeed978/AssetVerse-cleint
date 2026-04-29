import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContexts';

const statusStyle = {
  Accepted: { badge: 'badge-success', icon: '✅' },
  Rejected: { badge: 'badge-error',   icon: '❌' },
  pending:  { badge: 'badge-warning', icon: '⏳' },
  accepted: { badge: 'badge-success', icon: '✅' },
  denied:   { badge: 'badge-error',   icon: '❌' },
};

const MyAssets = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user.email;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const { data: affiliation, isLoading: affL } = useQuery({
    queryKey: ['affiliation', userEmail], enabled: !!userEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`)).data,
  });

  const hrEmail = affiliation?.hrEmail;

  const { data: allRequests = [], isLoading: reqL } = useQuery({
    queryKey: ['myAssets', hrEmail, userEmail], enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(`https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`);
      return res.data.filter(r => r.requesterEmail === userEmail);
    },
  });

  if (affL || reqL) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  const requests = allRequests.filter(r => {
    const ms = !search || r.assetName?.toLowerCase().includes(search.toLowerCase());
    const mf = !filter || r.status?.toLowerCase() === filter.toLowerCase();
    return ms && mf;
  });

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">My Assets</h1>
        <p className="text-base-content/50 text-sm mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
        <label className="input input-bordered flex items-center gap-2 flex-1 min-w-[180px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input type="text" placeholder="Search asset…" className="grow bg-transparent outline-none text-sm"
            onChange={e => setSearch(e.target.value)} />
        </label>
        <select className="select select-bordered" onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-base-content/40 text-lg">No assets found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map(req => {
            const s = statusStyle[req.status] || { badge: 'badge-neutral', icon: '📋' };
            return (
              <div key={req._id} className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
                      {req.assetName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{req.assetName}</h3>
                      <p className="text-xs text-base-content/40">{req.assetType}</p>
                    </div>
                  </div>
                  <span className={`badge badge-sm ${s.badge}`}>{s.icon} {req.status}</span>
                </div>
                <div className="bg-base-200 rounded-xl px-4 py-3 text-sm flex flex-col gap-1">
                  {req.productQuantity && (
                    <div className="flex justify-between">
                      <span className="text-base-content/50">Quantity</span>
                      <span className="font-medium">{req.productQuantity}</span>
                    </div>
                  )}
                  {req.requestDate && (
                    <div className="flex justify-between">
                      <span className="text-base-content/50">Requested</span>
                      <span className="font-medium">{new Date(req.requestDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {req.companyName && (
                    <div className="flex justify-between">
                      <span className="text-base-content/50">Company</span>
                      <span className="font-medium">{req.companyName}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAssets;
