import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AuthContext from '../../contexts/AuthContexts';

const PIE_COLORS = ['#22c55e', '#ef4444'];

const HrDashboard = () => {
  const { user } = use(AuthContext);
  const hrEmail = user.email;

  const { data: assets = [], isLoading: aL } = useQuery({
    queryKey: ['hrAssets', hrEmail], enabled: !!hrEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/assets/hr/${hrEmail}`)).data,
  });
  const { data: requests = [], isLoading: rL } = useQuery({
    queryKey: ['hrRequests', hrEmail], enabled: !!hrEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`)).data,
  });
  const { data: employees = [], isLoading: eL } = useQuery({
    queryKey: ['hrEmployees', hrEmail], enabled: !!hrEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`)).data,
  });

  if (aL || rL || eL) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  const returnable    = assets.filter(a => a.productType === 'Returnable').length;
  const nonReturnable = assets.filter(a => a.productType === 'Non-returnable').length;
  const pieData = [{ name: 'Returnable', value: returnable }, { name: 'Non-returnable', value: nonReturnable }];

  const reqMap = {};
  requests.forEach(r => { reqMap[r.assetName] = (reqMap[r.assetName] || 0) + (r.productQuantity || 0); });
  const barData = Object.entries(reqMap).map(([assetName, totalQuantity]) => ({ assetName, totalQuantity }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, 5);

  const pending  = requests.filter(r => r.status === 'pending').length;
  const accepted = requests.filter(r => r.status === 'Accepted').length;

  const statCards = [
    { icon: '👥', label: 'Employees',     value: employees.length, color: 'text-primary',   bg: 'bg-primary/10'   },
    { icon: '📦', label: 'Total Assets',  value: assets.length,    color: 'text-success',   bg: 'bg-success/10'   },
    { icon: '📋', label: 'Requests',      value: requests.length,  color: 'text-warning',   bg: 'bg-warning/10'   },
    { icon: '✅', label: 'Accepted',      value: accepted,         color: 'text-info',      bg: 'bg-info/10'      },
    { icon: '⏳', label: 'Pending',       value: pending,          color: 'text-error',     bg: 'bg-error/10'     },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        {user.photoURL
          ? <img src={user.photoURL} className="w-14 h-14 rounded-full ring-4 ring-primary object-cover" alt="" />
          : <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {(user.displayName || user.email)?.[0]?.toUpperCase()}
            </div>
        }
        <div>
          <h1 className="text-2xl font-extrabold">HR Dashboard</h1>
          <p className="text-base-content/50 text-sm">{user.displayName || user.email}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ icon, label, value, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition">
            <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center text-2xl`}>{icon}</div>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-base-content/50 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-1">Asset Types</h3>
          <p className="text-xs text-base-content/40 mb-4">Returnable vs Non-returnable</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={50} paddingAngle={4} label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Returnable</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Non-returnable</span>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-1">Top Requested Assets</h3>
          <p className="text-xs text-base-content/40 mb-4">By total quantity requested</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={32}>
              <XAxis dataKey="assetName" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent requests table */}
      {requests.length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm mt-6">
          <h3 className="font-bold text-base mb-4">Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-base-content/50 text-xs uppercase">
                  <th>Asset</th><th>Requester</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map(r => (
                  <tr key={r._id} className="hover:bg-base-200 transition">
                    <td className="font-medium">{r.assetName}</td>
                    <td className="text-base-content/60 text-sm">{r.requesterEmail}</td>
                    <td className="text-base-content/50 text-xs">{r.requestDate}</td>
                    <td>
                      <span className={`badge badge-sm ${r.status === 'Accepted' ? 'badge-success' : r.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrDashboard;
