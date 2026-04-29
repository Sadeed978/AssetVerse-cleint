import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import AuthContext from '../../contexts/AuthContexts';

const EmployeeDashboard = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;

  const { data: affiliation, isLoading: affLoading } = useQuery({
    queryKey: ['affiliation', userEmail],
    enabled: !!userEmail,
    retry: false,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`
      );
      return res.data;
    },
  });

  const hrEmail = affiliation?.hrEmail;
  const companyName = affiliation?.companyName;

  const { data: requests = [], isLoading: reqLoading } = useQuery({
    queryKey: ['myRequests', hrEmail, userEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`
      );
      // Filter only this employee's requests
      return res.data.filter(r => r.requesterEmail === userEmail);
    },
  });

  const totalRequests = requests.length;
  const acceptedRequests = requests.filter(req => req.status === 'Accepted').length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const rejectedRequests = requests.filter(req => req.status === 'Rejected').length;

  if (affLoading || reqLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Not yet affiliated with any company
  if (!affiliation || !hrEmail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">👋</div>
        <h2 className="text-3xl font-bold mb-3">Welcome, {user.displayName || 'Employee'}!</h2>
        <p className="text-base-content/60 mb-8 text-lg">
          You're registered as an <span className="badge badge-primary badge-lg">Employee</span>
        </p>
        <div className="bg-base-200 rounded-2xl p-8 shadow">
          <h3 className="text-xl font-semibold mb-2">You're not affiliated with a company yet</h3>
          <p className="text-base-content/60 mb-6">
            Your HR manager needs to add you to their team. Once they do, you'll be able to
            request assets and see your dashboard here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/Dashboard/RequestAsset" className="btn btn-primary">
              Browse Assets
            </Link>
            <Link to="/Dashboard/MyAssets" className="btn btn-outline">
              My Assets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {user.photoURL && (
          <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full" />
        )}
        <div>
          <h2 className="text-2xl font-bold">
            Welcome, {user.displayName || 'Employee'}!
          </h2>
          <span className="badge badge-primary">Employee</span>
        </div>
      </div>

      {/* Company card */}
      <div className="mb-8 p-6 bg-base-200 rounded-xl shadow flex items-center gap-4">
        <div className="text-4xl">🏢</div>
        <div>
          <h3 className="text-xl font-semibold">{companyName}</h3>
          <p className="text-base-content/60 text-sm">Your affiliated company</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <div className="stat-title">Total Requests</div>
          <div className="stat-value text-primary">{totalRequests}</div>
          <div className="stat-desc">All your asset requests</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="stat-title">Accepted</div>
          <div className="stat-value text-success">{acceptedRequests}</div>
          <div className="stat-desc">Approved by HR</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{pendingRequests}</div>
          <div className="stat-desc">Awaiting approval</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-error">{rejectedRequests}</div>
          <div className="stat-desc">Not approved</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/Dashboard/RequestAsset" className="btn btn-primary btn-lg">
          Request an Asset
        </Link>
        <Link to="/Dashboard/MyAssets" className="btn btn-outline btn-lg">
          My Assets
        </Link>
        <Link to="/Dashboard/myteam" className="btn btn-outline btn-lg">
          My Team
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
