import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, CartesianGrid,
  RadialBarChart, RadialBar
} from 'recharts';
import { Link } from 'react-router';
import AuthContext from '../../contexts/AuthContexts';

const C = { purple:'#7c6af7', cyan:'#22d3ee', green:'#3fb950', yellow:'#f59e0b', red:'#f85149', pink:'#ec4899' };

const tip = { background:'#161b22', border:'1px solid #30363d', borderRadius:'10px', fontSize:'11px', color:'#c9d1d9' };

/* ── SVG Gauge ── */
const Gauge = ({ value, max, color, label, sub }) => {
  const pct  = Math.min(value / Math.max(max, 1), 1);
  const deg  = pct * 180;
  const r    = 52, cx = 68, cy = 68;
  const rad  = d => (d - 180) * Math.PI / 180;
  const ex   = cx + r * Math.cos(rad(deg));
  const ey   = cy + r * Math.sin(rad(deg));
  const lg   = deg > 90 ? 1 : 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="136" height="76" viewBox="0 0 136 76">
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" strokeLinecap="round"/>
        {pct > 0 && (
          <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 ${lg} 1 ${ex} ${ey}`}
            fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"/>
        )}
        <text x={cx} y={cy-6} textAnchor="middle" fill={color} fontSize="20" fontWeight="900">{value}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill="rgba(201,209,217,0.4)" fontSize="9">{sub}</text>
      </svg>
      <p className="text-xs text-base-content/50 font-medium">{label}</p>
    </div>
  );
};

/* ── KPI card ── */
const KPI = ({ emoji, label, value, color, rgb, trend }) => (
  <div className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
        style={{ background:`rgba(${rgb},0.15)` }}>{emoji}</div>
      {trend && <span className="text-xs font-semibold" style={{ color: trend > 0 ? C.green : C.red }}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </span>}
    </div>
    <p className="text-2xl font-black" style={{ color }}>{value}</p>
    <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
  </div>
);

const HrDashboard = () => {
  const { user } = use(AuthContext);
  const hrEmail  = user.email;

  const { data: assets    = [], isLoading: aL } = useQuery({ queryKey:['hrAssets',   hrEmail], enabled:!!hrEmail, queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/assets/hr/${hrEmail}`)).data });
  const { data: requests  = [], isLoading: rL } = useQuery({ queryKey:['hrRequests', hrEmail], enabled:!!hrEmail, queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`)).data });
  const { data: employees = [], isLoading: eL } = useQuery({ queryKey:['hrEmployees',hrEmail], enabled:!!hrEmail, queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`)).data });

  if (aL||rL||eL) return <div className="flex items-center justify-center min-h-[60vh]"><span className="loading loading-spinner loading-lg text-primary"/></div>;

  const returnable    = assets.filter(a=>a.productType==='Returnable').length;
  const nonReturnable = assets.filter(a=>a.productType==='Non-returnable').length;
  const accepted      = requests.filter(r=>r.status==='Accepted').length;
  const pending       = requests.filter(r=>r.status==='pending').length;
  const denied        = requests.filter(r=>r.status==='denied'||r.status==='Rejected').length;
  const acceptRate    = requests.length ? Math.round((accepted/requests.length)*100) : 0;

  const pieData  = [{ name:'Returnable', value:returnable },{ name:'Non-returnable', value:nonReturnable }];
  const PIE_C    = [C.purple, C.cyan];

  const reqMap = {};
  requests.forEach(r=>{ reqMap[r.assetName]=(reqMap[r.assetName]||0)+(r.productQuantity||0); });
  const barData = Object.entries(reqMap).map(([n,v])=>({name:n,qty:v})).sort((a,b)=>b.qty-a.qty).slice(0,6);

  const areaData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i)=>({
    day, requests:[3,7,5,9,6,11,8][i], approved:[2,5,4,7,5,9,6][i]
  }));

  const radialData = [
    { name:'Total',    value:requests.length, fill:C.purple },
    { name:'Accepted', value:accepted,        fill:C.green  },
    { name:'Pending',  value:pending,         fill:C.yellow },
    { name:'Denied',   value:denied,          fill:C.red    },
  ];

  const displayName = user.displayName || user.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-base-200 p-5">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-base-content">HR Analytics Dashboard</h1>
          <p className="text-xs text-base-content/40 mt-0.5">{displayName} · {user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"/>
            <span className="text-xs text-success font-medium">Live</span>
          </div>
          <Link to="/Dashboard/Profile" className="btn btn-xs btn-ghost border border-base-300 rounded-full">Profile</Link>
        </div>
      </div>

      {/* ── Row 1: KPI cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <KPI emoji="👥" label="Employees"    value={employees.length} color={C.purple} rgb="124,106,247" trend={12} />
        <KPI emoji="📦" label="Total Assets" value={assets.length}    color={C.cyan}   rgb="34,211,238"  trend={5}  />
        <KPI emoji="✅" label="Accepted"     value={accepted}         color={C.green}  rgb="63,185,80"   trend={8}  />
        <KPI emoji="⏳" label="Pending"      value={pending}          color={C.yellow} rgb="245,158,11"  trend={-3} />
      </div>

      {/* ── Row 2: Gauges + Pie ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col items-center">
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-2">Employees</p>
          <Gauge value={employees.length} max={Math.max(employees.length,10)} color={C.purple} label="Total Staff" sub="employees"/>
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col items-center">
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-2">Accept Rate</p>
          <Gauge value={acceptRate} max={100} color={C.green} label="Approval %" sub="%"/>
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col items-center">
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-2">Pending</p>
          <Gauge value={pending} max={Math.max(requests.length,1)} color={C.yellow} label="Open Requests" sub="open"/>
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-2">Asset Types</p>
          <ResponsiveContainer width="100%" height={90}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={40} innerRadius={24} paddingAngle={4}>
                {pieData.map((_,i)=><Cell key={i} fill={PIE_C[i]}/>)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-1">
            {pieData.map((d,i)=>(
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-base-content/50">
                  <span className="w-2 h-2 rounded-full" style={{background:PIE_C[i]}}/>{d.name}
                </span>
                <span className="text-xs font-black" style={{color:PIE_C[i]}}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Area chart + Radial ── */}
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div className="md:col-span-2 bg-base-100 border border-base-300 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm">Weekly Request Activity</h3>
              <p className="text-xs text-base-content/40">Requests vs Approved this week</p>
            </div>
            <div className="flex gap-3">
              {[[C.purple,'Requests'],[C.green,'Approved']].map(([c,l])=>(
                <span key={l} className="flex items-center gap-1 text-xs text-base-content/50">
                  <span className="w-2 h-2 rounded-full" style={{background:c}}/>{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.purple} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.green} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:10,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tip}/>
              <Area type="monotone" dataKey="requests" stroke={C.purple} strokeWidth={2.5} fill="url(#gR)"/>
              <Area type="monotone" dataKey="approved"  stroke={C.green}  strokeWidth={2.5} fill="url(#gA)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-1">Request Breakdown</h3>
          <p className="text-xs text-base-content/40 mb-3">Status distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%"
              data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={5}/>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {radialData.map(d=>(
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-base-content/50">
                  <span className="w-2 h-2 rounded-full" style={{background:d.fill}}/>{d.name}
                </span>
                <span className="text-xs font-black" style={{color:d.fill}}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Horizontal bar + Table ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-base-100 border border-base-300 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-1">Top Requested Assets</h3>
          <p className="text-xs text-base-content/40 mb-4">By total quantity requested</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical" barSize={18}>
              <XAxis type="number" tick={{fontSize:9,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:9,fill:'#6b7280'}} axisLine={false} tickLine={false} width={85}/>
              <Tooltip contentStyle={tip}/>
              <Bar dataKey="qty" radius={[0,6,6,0]}>
                {barData.map((_,i)=><Cell key={i} fill={[C.purple,C.cyan,C.green,C.yellow,C.pink,C.red][i%6]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
            <h3 className="font-bold text-sm">Recent Requests</h3>
            <Link to="/Dashboard/AllRequiests" className="text-xs font-semibold" style={{color:C.purple}}>View all →</Link>
          </div>
          <div className="overflow-y-auto" style={{maxHeight:'260px'}}>
            {requests.length === 0
              ? <p className="text-center text-base-content/30 py-8 text-sm">No requests yet</p>
              : requests.slice(0,8).map((r,i)=>(
                <div key={r._id} className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition border-b border-base-300/30 last:border-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{background:`linear-gradient(135deg,${[C.purple,C.cyan,C.green,C.yellow,C.pink][i%5]},${['#a78bfa','#67e8f9','#86efac','#fcd34d','#f9a8d4'][i%5]})`}}>
                    {r.assetName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs truncate">{r.assetName}</p>
                    <p className="text-xs text-base-content/30 truncate">{r.requesterEmail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`badge badge-xs ${r.status==='Accepted'?'badge-success':r.status==='pending'?'badge-warning':'badge-error'}`}>{r.status}</span>
                    <p className="text-xs text-base-content/20 mt-0.5">{r.requestDate}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── Quick nav ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {[
          {to:'/Dashboard/AssetList',    emoji:'📦', label:'Asset List',   color:C.purple, rgb:'124,106,247'},
          {to:'/Dashboard/AddAssert',    emoji:'➕', label:'Add Asset',    color:C.cyan,   rgb:'34,211,238' },
          {to:'/Dashboard/AllRequiests', emoji:'📋', label:'All Requests', color:C.green,  rgb:'63,185,80'  },
          {to:'/Dashboard/EmployeeList', emoji:'👥', label:'Employees',    color:C.yellow, rgb:'245,158,11' },
        ].map(({to,emoji,label,color,rgb})=>(
          <Link key={to} to={to}
            className="flex items-center gap-3 px-4 py-3 bg-base-100 border border-base-300 rounded-xl hover:border-primary/40 hover:bg-base-100 transition group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{background:`rgba(${rgb},0.15)`}}>{emoji}</div>
            <span className="text-sm font-semibold" style={{color}}>{label}</span>
            <span className="ml-auto text-base-content/20 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HrDashboard;
