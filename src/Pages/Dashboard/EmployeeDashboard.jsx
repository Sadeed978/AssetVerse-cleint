import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import AuthContext from '../../contexts/AuthContexts';

const C = {
  purple: '#7c6af7', cyan: '#22d3ee', green: '#3fb950',
  yellow: '#f59e0b', red: '#f85149',
};

const tip = {
  background: '#0d1117',
  border: '1px solid rgba(124,106,247,0.3)',
  borderRadius: '10px', fontSize: '11px', color: '#c9d1d9',
};

/* Inline-safe stat card */
const StatCard = ({ emoji, label, value, color, rgb }) => (
  <div className="glass-card border border-base-300 rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200 cursor-default">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
      style={{ background: `rgba(${rgb}, 0.15)` }}>
      {emoji}
    </div>
    <p className="text-3xl font-black" style={{ color }}>{value}</p>
    <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
  </div>
);

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
          ? <img src={user.photoURL} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-base-300 object-cover" alt="" />
          : <div className="w-20 h-20 rounded-full border-4 border-base-300 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #7c6af7, #22d3ee)' }}>
              {displayName[0]?.toUpperCase()}
            </div>
        }
        <h2 className="text-2xl font-black mb-1">Hey, {displayName.split(' ')[0]} 👋</h2>
        <span className="badge badge-secondary mb-4">Employee</span>
        <p className="text-base-content/50 text-sm mb-6">
          You're not affiliated with a company yet. Your HR manager needs to add you to their team.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/Dashboard/RequestAsset" className="btn btn-primary rounded-full">Browse Assets</Link>
          <Link to="/Dashboard/MyAssets" className="btn btn-ghost rounded-full border border-base-300">My Assets</Link>
        </div>
      </div>
    </div>
  );

  const areaData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => ({
    day, requests: [0,1,0,2,1,3,1][i] || 0,
  }));

  const pieData = [
    { name: 'Accepted', value: accepted || 0 },
    { name: 'Pending',  value: pending  || 0 },
    { name: 'Rejected', value: rejected || 0 },
  ];
  const PIE_COLORS = [C.green, C.yellow, C.red];

  return (
    <div className="min-h-screen bg-base-200">

      {/* ── Cover + profile ── */}
      <div className="relative">
        <div className="h-36 w-full relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0d2b3a 40%, #1a1040 100%)' }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
          <div className="absolute -bottom-6 left-16 w-28 h-28 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #7c6af7, transparent)' }} />
        </div>

        <div className="px-6 -mt-10 pb-5 border-b border-base-300">
          <div className="flex items-end justify-between mb-3">
            <div className="relative">
              {user.photoURL
                ? <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-base-200 shadow-2xl" />
                : <div className="w-20 h-20 rounded-full border-4 border-base-200 shadow-2xl flex items-center justify-center text-3xl font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #22d3ee, #7c6af7)' }}>
                    {displayName[0]?.toUpperCase()}
                  </div>
              }
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-base-200" />
            </div>
            <Link to="/Dashboard/Profile" className="btn btn-xs rounded-full border border-base-300 bg-base-100 px-3 pb-1">
              Edit Profile
            </Link>
          </div>

          <h1 className="text-xl font-black">{displayName}</h1>
          <p className="text-base-content/40 text-xs mt-0.5">{user.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="badge badge-secondary badge-sm">Employee</span>
            <span className="text-xs text-base-content/30">🏢 {affiliation.companyName}</span>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-4">
            {[
              { label: 'Total',    value: total    },
              { label: 'Accepted', value: accepted },
              { label: 'Pending',  value: pending  },
              { label: 'Rejected', value: rejected },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-black">{value}</p>
                <p className="text-xs text-base-content/40">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 grid gap-5">

        {/* ── Quick action highlights ── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { to:'/Dashboard/RequestAsset', emoji:'🙋', label:'Request',  color: C.purple, rgb:'124,106,247' },
            { to:'/Dashboard/MyAssets',     emoji:'📦', label:'My Assets',color: C.cyan,   rgb:'34,211,238'  },
            { to:'/Dashboard/myteam',       emoji:'🤝', label:'My Team',  color: C.green,  rgb:'63,185,80'   },
            { to:'/Dashboard/Profile',      emoji:'👤', label:'Profile',  color: C.yellow, rgb:'245,158,11'  },
          ].map(({ to, emoji, label, color, rgb }) => (
            <Link key={to} to={to}
              className="flex flex-col items-center gap-2 p-3 glass-card border border-base-300 rounded-2xl hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ background: `rgba(${rgb}, 0.15)` }}>
                {emoji}
              </div>
              <span className="text-xs font-semibold" style={{ color }}>{label}</span>
            </Link>
          ))}
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard emoji="📋" label="Total"    value={total}    color={C.purple} rgb="124,106,247" />
          <StatCard emoji="✅" label="Accepted" value={accepted} color={C.green}  rgb="63,185,80"   />
          <StatCard emoji="⏳" label="Pending"  value={pending}  color={C.yellow} rgb="245,158,11"  />
          <StatCard emoji="❌" label="Rejected" value={rejected} color={C.red}    rgb="248,81,73"   />
        </div>

        {/* ── Charts row ── */}
        <div className="grid md:grid-cols-3 gap-4">

          {/* Area chart */}
          <div className="md:col-span-2 glass-card border border-base-300 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm">My Activity</h3>
                <p className="text-xs text-base-content/40">Requests this week</p>
              </div>
              <span className="text-xs font-black" style={{ color: C.purple }}>{total} total</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="empG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.purple} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.purple} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="requests" stroke={C.purple} strokeWidth={2.5} fill="url(#empG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie: status breakdown */}
          <div className="glass-card border border-base-300 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-1">Status Breakdown</h3>
            <p className="text-xs text-base-content/40 mb-2">Your requests</p>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={55} innerRadius={32} paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-base-content/50">
                    <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    {d.name}
                  </span>
                  <span className="text-xs font-black" style={{ color: PIE_COLORS[i] }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent requests feed ── */}
        {requests.length > 0 && (
          <div className="glass-card border border-base-300 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
              <h3 className="font-bold text-sm">My Requests</h3>
              <Link to="/Dashboard/MyAssets" className="text-xs font-semibold" style={{ color: C.purple }}>See all →</Link>
            </div>
            {requests.slice(0, 6).map((r, i) => (
              <div key={r._id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-base-300/20 transition-colors border-b border-base-300/20 last:border-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${[C.purple,C.cyan,C.green,C.yellow,C.red][i%5]}, ${['#a78bfa','#67e8f9','#86efac','#fcd34d','#fca5a5'][i%5]})` }}>
                  {r.assetName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{r.assetName}</p>
                  <p className="text-xs text-base-content/30">{r.assetType} · {r.requestDate}</p>
                </div>
                <span className={`badge badge-sm ${r.status==='Accepted'?'badge-success':r.status==='pending'?'badge-warning':'badge-error'}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeDashboard;
