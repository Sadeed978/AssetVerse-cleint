import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import AuthContext from '../../contexts/AuthContexts';

const PIE_COLORS = ['#7c6af7','#22d3ee','#3fb950','#f59e0b'];

const KpiCard = ({ icon, label, value, sub, colorClass, bgClass }) => (
  <div className="glass-card border border-base-300 rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-all duration-300">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${bgClass}`}>{icon}</div>
    <div>
      <p className={`text-3xl font-black ${colorClass}`}>{value}</p>
      <p className="text-xs text-base-content/40 uppercase tracking-wide mt-0.5">{label}</p>
      {sub && <p className="text-xs text-base-content/30 mt-1">{sub}</p>}
    </div>
  </div>
);

const HrDashboard = () => {
  const { user } = use(AuthContext);
  const hrEmail = user.email;

  const { data: assets   = [], isLoading: aL } = useQuery({ queryKey:['hrAssets',   hrEmail], enabled:!!hrEmail, queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/assets/hr/${hrEmail}`)).data });
  const { data: requests = [], isLoading: rL } = useQuery({ queryKey:['hrRequests', hrEmail], enabled:!!hrEmail, queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`)).data });
  const { data: employees= [], isLoading: eL } = useQuery({ queryKey:['hrEmployees',hrEmail], enabled:!!hrEmail, queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`)).data });

  if (aL||rL||eL) return <div className="flex items-center justify-center min-h-[60vh]"><span className="loading loading-spinner loading-lg text-primary"/></div>;

  const returnable    = assets.filter(a=>a.productType==='Returnable').length;
  const nonReturnable = assets.filter(a=>a.productType==='Non-returnable').length;
  const accepted      = requests.filter(r=>r.status==='Accepted').length;
  const pending       = requests.filter(r=>r.status==='pending').length;

  const pieData = [
    { name:'Returnable',     value: returnable    },
    { name:'Non-returnable', value: nonReturnable },
  ];

  const reqMap = {};
  requests.forEach(r=>{ reqMap[r.assetName]=(reqMap[r.assetName]||0)+(r.productQuantity||0); });
  const barData = Object.entries(reqMap).map(([assetName,totalQuantity])=>({assetName,totalQuantity}))
    .sort((a,b)=>b.totalQuantity-a.totalQuantity).slice(0,5);

  // Fake trend line data
  const trendData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i)=>({
    day, requests: Math.floor(Math.random()*10)+2+i
  }));

  const kpis = [
    { icon:'👥', label:'Employees',    value: employees.length, colorClass:'text-primary',   bgClass:'bg-primary/15',   sub:'Under your HR'     },
    { icon:'📦', label:'Total Assets', value: assets.length,    colorClass:'text-accent',    bgClass:'bg-accent/15',    sub:'In inventory'      },
    { icon:'✅', label:'Accepted',     value: accepted,         colorClass:'text-success',   bgClass:'bg-success/15',   sub:'Approved requests'  },
    { icon:'⏳', label:'Pending',      value: pending,          colorClass:'text-warning',   bgClass:'bg-warning/15',   sub:'Awaiting review'   },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {user.photoURL
          ? <img src={user.photoURL} className="w-14 h-14 rounded-2xl ring-2 ring-primary/40 object-cover" alt=""/>
          : <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-black text-white">
              {(user.displayName||user.email)?.[0]?.toUpperCase()}
            </div>
        }
        <div>
          <h1 className="text-2xl font-black">HR Dashboard</h1>
          <p className="text-base-content/40 text-sm">{user.displayName || user.email}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 glass-card border border-base-300 rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"/>
          <span className="text-xs text-base-content/50">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(k=><KpiCard key={k.label} {...k}/>)}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">

        {/* Pie */}
        <div className="glass-card border border-base-300 rounded-2xl p-6">
          <h3 className="font-bold text-sm mb-1">Asset Types</h3>
          <p className="text-xs text-base-content/40 mb-4">Returnable vs Non-returnable</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={85} innerRadius={45} paddingAngle={4}>
                {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'var(--color-base-100)', border:'1px solid var(--color-base-300)', borderRadius:'12px', fontSize:'12px' }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-3">
            {pieData.map((d,i)=>(
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{background:PIE_COLORS[i]}}/>
                <span className="text-xs text-base-content/60">{d.name}</span>
                <span className="text-xs font-bold text-base-content">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar */}
        <div className="glass-card border border-base-300 rounded-2xl p-6">
          <h3 className="font-bold text-sm mb-1">Top Requested Assets</h3>
          <p className="text-xs text-base-content/40 mb-4">By total quantity</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={28}>
              <XAxis dataKey="assetName" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'var(--color-base-100)', border:'1px solid var(--color-base-300)', borderRadius:'12px', fontSize:'12px' }}/>
              <Bar dataKey="totalQuantity" fill="var(--color-primary)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend line */}
      <div className="glass-card border border-base-300 rounded-2xl p-6 mb-5">
        <h3 className="font-bold text-sm mb-1">Request Trend</h3>
        <p className="text-xs text-base-content/40 mb-4">This week</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false}/>
            <XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:'var(--color-base-100)', border:'1px solid var(--color-base-300)', borderRadius:'12px', fontSize:'12px' }}/>
            <Line type="monotone" dataKey="requests" stroke="var(--color-primary)" strokeWidth={2.5} dot={{fill:'var(--color-primary)', r:4}} activeDot={{r:6}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent requests table */}
      {requests.length > 0 && (
        <div className="glass-card border border-base-300 rounded-2xl p-6">
          <h3 className="font-bold text-sm mb-4">Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-base-content/30 text-xs uppercase border-b border-base-300">
                  <th>Asset</th><th>Requester</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0,6).map(r=>(
                  <tr key={r._id} className="border-b border-base-300/50 hover:bg-base-300/20 transition">
                    <td className="font-semibold text-sm">{r.assetName}</td>
                    <td className="text-base-content/50 text-xs">{r.requesterEmail}</td>
                    <td className="text-base-content/30 text-xs">{r.requestDate}</td>
                    <td><span className={`badge badge-sm ${r.status==='Accepted'?'badge-success':r.status==='pending'?'badge-warning':'badge-error'}`}>{r.status}</span></td>
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
