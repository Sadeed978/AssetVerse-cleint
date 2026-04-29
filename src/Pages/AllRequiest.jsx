import React, { useEffect, useState, use } from 'react';
import AuthContext from '../contexts/AuthContexts';
import SingleRequest from '../Component/SingleRequest';

const AllRequiest = () => {
  const { user } = use(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    fetch(`https://asset-verse-server-phi.vercel.app/requests/${user.email}`)
      .then(r => r.json())
      .then(d => { setRequests(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const filtered = requests.filter(r => {
    const matchSearch = !search || r.assetName?.toLowerCase().includes(search.toLowerCase()) || r.requesterEmail?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || r.status?.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">All Requests</h1>
        <p className="text-base-content/50 text-sm mt-1">{filtered.length} request{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
        <label className="input input-bordered flex items-center gap-2 flex-1 min-w-[200px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input type="text" placeholder="Search asset or email…" className="grow bg-transparent outline-none text-sm"
            onChange={e => setSearch(e.target.value)} />
        </label>
        <select className="select select-bordered" onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-base-content/40 text-lg">No requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(req => <SingleRequest key={req._id} request={req} />)}
        </div>
      )}
    </div>
  );
};

export default AllRequiest;
