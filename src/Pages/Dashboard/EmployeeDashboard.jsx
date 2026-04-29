import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import AuthContext from '../../contexts/AuthContexts';

const EmployeeDashboard = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;

  const { data: affiliation, isLoading: affL } = useQuery({
    queryKey: ['affiliation', userEmail], enabled: !!userEmail, retry: false,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`)).data,
  });

  const hrEmail = affiliation?.hrEmail;

  const { data: requests = [], isLoading: reqL } = useQuery({
    queryKey: ['myRequests', hrEmail, userEmail], enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(`https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`);
      return res.data.filter(r => r.requesterEmail === userEmail);
    },
  });

  const total    = requests.length;
  const accepted = requests.filter(r => r.status === 'Accepted').length;
  const pending  = requests.filter(r => r.status === 'pending').length;
  const rejected = requests.filter(r => r.status === 'Rejected').length;

  if (affL || reqL) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  /* ── Not affiliated ── */
  if (!affiliation || !hrEmail) return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="bg-base-100 border border-base-300 rounded-3xl p-10 max-w-md shadow-xl">
        {user.photoURL
          ? <img src={user.photoURL} className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-primary object-cover" alt="" />
          : <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary mx-auto mb-4">
              {(user.displayName || user.email)?.[0]?.toUpperCase()}
            </div>
        }
        <h2 className="text-2xl font-extrabold mb-1">Hey, {user.displayName?.split(' ')[0] || 'there'} 👋</h2>
        <span className="badge badge-secondary mb-4">Employee</span>
        <p className="text-base-content/50 text-sm mb-6">
          You're not affiliated with a company yet. Your HR manager needs to add you to their team.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/Dashboard/RequestAsset" className="btn btn-primary rounded-full">Browse Assets</Link>
          <Link to="/Dashboard/MyAssets" className="btn btn-outline rounded-full">My Assets</Link>
        </div>
      </div>
    </div>
  );

  const stats = [
    { icon: '📋', label: 'Total',    value: total,    color: 'text-primary',  bg: 'bg-primary/10'  },
    { icon: '✅', label: 'Accepted', value: accepted, color: 'text-success',  bg: 'bg-success/10'  },
    { icon: '⏳', label: 'Pending',  value: pending,  color: 'text-warning',  bg: 'bg-warning/10'  },
    { icon: '❌', label: 'Rejected', value: rejected, color: 'text-error',    bg: 'bg-error/10'    },
  ];

  const quickLinks = [
    { to: '/Dashboard/RequestAsset', icon: '🙋', label: 'Request Asset', style: 'btn-primary' },
    { to: '/Dashboard/MyAssets',     icon: '📦', label: 'My Assets',     style: 'btn-outline' },
    { to: '/Dashboard/myteam',       icon: '🤝', label: 'My Team',       style: 'btn-outline' },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Profile hero */}
      <div className="bg-base-100 border border-base-300 rounded-3xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-5">
          {user.photoURL
            ? <img src={user.photoURL} className="w-16 h-16 rounded-full ring-4 ring-secondary object-cover shrink-0" alt="" />
            : <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-2xl font-bold text-secondary shrink-0">
                {(user.displayName || user.email)?.[0]?.toUpperCase()}
              </div>
          }
          <div>
            <h1 className="text-xl font-extrabold">{user.displayName || 'Employee'}</h1>
            <p className="text-base-content/50 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-secondary badge-sm">Employee</span>
              <span className="text-base-content/40 text-xs">🏢 {affiliation.companyName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(({ icon, label, value, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition">
            <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center text-xl`}>{icon}</div>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-base-content/50 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {quickLinks.map(({ to, icon, label, style }) => (
          <Link key={to} to={to} className={`btn ${style} rounded-2xl gap-2 h-14 text-base`}>
            <span className="text-xl">{icon}</span>{label}
          </Link>
        ))}
      </div>

      {/* Recent requests */}
      {requests.length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-4">Recent Requests</h3>
          <div className="flex flex-col gap-3">
            {requests.slice(0, 5).map(r => (
              <div key={r._id} className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-sm">{r.assetName}</p>
                  <p className="text-xs text-base-content/40">{r.requestDate}</p>
                </div>
                <span className={`badge badge-sm ${r.status === 'Accepted' ? 'badge-success' : r.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
