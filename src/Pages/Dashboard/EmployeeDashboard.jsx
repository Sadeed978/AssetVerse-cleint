import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import AuthContext from '../../contexts/AuthContexts';

const EmployeeDashboard = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;

  const { data: dbProfile } = useQuery({
    queryKey: ['empDbProfile', userEmail], enabled: !!userEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/users/${userEmail}`)).data,
  });

  const displayName = user.displayName || dbProfile?.displayName || userEmail?.split('@')[0] || 'Employee';

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
      <div className="glass-card border border-base-300 rounded-3xl p-10 max-w-md shadow-2xl">
        {user.photoURL
          ? <img src={user.photoURL} className="w-20 h-20 rounded-2xl mx-auto mb-4 ring-2 ring-primary/40 object-cover" alt="" />
          : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-black text-white mx-auto mb-4">
              {displayName[0]?.toUpperCase()}
            </div>
        }
        <h2 className="text-2xl font-black mb-1">Hey, {displayName.split(' ')[0]} 👋</h2>
        <span className="badge badge-secondary mb-4">Employee</span>
        <p className="text-base-content/50 text-sm mb-6">
          You're not affiliated with a company yet. Your HR manager needs to add you to their team.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/Dashboard/RequestAsset" className="btn btn-primary rounded-full glow-primary">Browse Assets</Link>
          <Link to="/Dashboard/MyAssets" className="btn btn-ghost rounded-full border border-base-300">My Assets</Link>
        </div>
      </div>
    </div>
  );

  const radialData = [
    { name: 'Accepted', value: accepted, fill: 'var(--color-success)' },
    { name: 'Pending',  value: pending,  fill: 'var(--color-warning)' },
    { name: 'Rejected', value: rejected, fill: 'var(--color-error)'   },
    { name: 'Total',    value: total,    fill: 'var(--color-primary)'  },
  ];

  const quickLinks = [
    { to: '/Dashboard/RequestAsset', icon: '🙋', label: 'Request Asset', style: 'btn-primary glow-primary' },
    { to: '/Dashboard/MyAssets',     icon: '📦', label: 'My Assets',     style: 'btn-ghost border border-base-300 hover:border-primary' },
    { to: '/Dashboard/myteam',       icon: '🤝', label: 'My Team',       style: 'btn-ghost border border-base-300 hover:border-primary' },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Profile hero */}
      <div className="glass-card border border-base-300 rounded-3xl p-6 mb-6 relative overflow-hidden">
        {/* Background gradient blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          {user.photoURL
            ? <img src={user.photoURL} className="w-16 h-16 rounded-2xl ring-2 ring-primary/40 object-cover shrink-0" alt="" />
            : <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-black text-white shrink-0">
                {displayName[0]?.toUpperCase()}
              </div>
          }
          <div className="flex-1">
            <h1 className="text-xl font-black">{displayName}</h1>
            <p className="text-base-content/40 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="badge badge-secondary badge-sm">Employee</span>
              <span className="text-base-content/30 text-xs">🏢 {affiliation.companyName}</span>
            </div>
          </div>
          <Link to="/Dashboard/Profile" className="btn btn-ghost btn-sm rounded-full border border-base-300 hover:border-primary hidden sm:flex">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats + radial chart */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">

        {/* Stat cards */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { icon:'📋', label:'Total',    value: total,    color:'text-primary',  bg:'bg-primary/15'  },
            { icon:'✅', label:'Accepted', value: accepted, color:'text-success',  bg:'bg-success/15'  },
            { icon:'⏳', label:'Pending',  value: pending,  color:'text-warning',  bg:'bg-warning/15'  },
            { icon:'❌', label:'Rejected', value: rejected, color:'text-error',    bg:'bg-error/15'    },
          ].map(({ icon, label, value, color, bg }) => (
            <div key={label} className="glass-card border border-base-300 rounded-2xl p-5 flex flex-col gap-2 hover:border-primary/40 transition-all">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center text-lg`}>{icon}</div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Radial chart */}
        <div className="glass-card border border-base-300 rounded-2xl p-5 flex flex-col items-center justify-center">
          <p className="text-xs text-base-content/40 uppercase tracking-wide mb-2">Request Breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Tooltip contentStyle={{ background:'var(--color-base-100)', border:'1px solid var(--color-base-300)', borderRadius:'12px', fontSize:'11px' }}/>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {radialData.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-base-content/40">
                <span className="w-2 h-2 rounded-full inline-block" style={{background:d.fill}}/>
                {d.name}
              </span>
            ))}
          </div>
        </div>
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
        <div className="glass-card border border-base-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Recent Requests</h3>
            <Link to="/Dashboard/MyAssets" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {requests.slice(0, 5).map(r => (
              <div key={r._id} className="flex items-center justify-between bg-base-300/30 hover:bg-base-300/50 rounded-xl px-4 py-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                    {r.assetName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.assetName}</p>
                    <p className="text-xs text-base-content/30">{r.requestDate}</p>
                  </div>
                </div>
                <span className={`badge badge-sm ${r.status==='Accepted'?'badge-success':r.status==='pending'?'badge-warning':'badge-error'}`}>
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
