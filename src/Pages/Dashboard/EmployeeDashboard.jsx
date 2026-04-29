import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import AuthContext from '../../contexts/AuthContexts';

const C = { purple:'#7c6af7', cyan:'#22d3ee', green:'#3fb950', yellow:'#f59e0b', red:'#f85149' };
const tip = { background:'#161b22', border:'1px solid #30363d', borderRadius:'10px', fontSize:'11px', color:'#c9d1d9' };

/* ── SVG Gauge ── */
const Gauge = ({ value, max, color, sub }) => {
  const pct = Math.min(value / Math.max(max,1), 1);
  const deg = pct * 180;
  const r=52, cx=68, cy=68;
  const rad = d => (d-180)*Math.PI/180;
  const ex = cx + r*Math.cos(rad(deg));
  const ey = cy + r*Math.sin(rad(deg));
  const lg = deg > 90 ? 1 : 0;
  return (
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
  );
};

const KPI = ({ emoji, label, value, color, rgb }) => (
  <div className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col gap-2">
    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
      style={{background:`rgba(${rgb},0.15)`}}>{emoji}</div>
    <p className="text-2xl font-black" style={{color}}>{value}</p>
    <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
  </div>
);

const EmployeeDashboard = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;

  const { data: dbProfile } = useQuery({
    queryKey:['empDbProfile',userEmail], enabled:!!userEmail,
    queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/users/${userEmail}`)).data,
  });

  const displayName = user.displayName || dbProfile?.displayName || userEmail?.split('@')[0] || 'Employee';

  const { data: affiliation, isLoading: affL } = useQuery({
    queryKey:['affiliation',userEmail], enabled:!!userEmail, retry:false,
    queryFn: async()=>(await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`)).data,
  });

  const hrEmail = affiliation?.hrEmail;

  const { data: requests=[], isLoading: reqL } = useQuery({
    queryKey:['myRequests',hrEmail,userEmail], enabled:!!hrEmail,
    queryFn: async()=>{
      const res = await axios.get(`https://asset-verse-server-phi.vercel.app/requests/${hrEmail}`);
      return res.data.filter(r=>r.requesterEmail===userEmail);
    },
  });

  const total    = requests.length;
  const accepted = requests.filter(r=>r.status==='Accepted').length;
  const pending  = requests.filter(r=>r.status==='pending').length;
  const rejected = requests.filter(r=>r.status==='Rejected').length;

  if (affL||reqL) return <div className="flex items-center justify-center min-h-[60vh]"><span className="loading loading-spinner loading-lg text-primary"/></div>;

  if (!affiliation||!hrEmail) return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="bg-base-100 border border-base-300 rounded-3xl p-10 max-w-md shadow-2xl">
        {user.photoURL
          ? <img src={user.photoURL} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-base-300 object-cover" alt=""/>
          : <div className="w-20 h-20 rounded-full border-4 border-base-300 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4"
              style={{background:'linear-gradient(135deg,#7c6af7,#22d3ee)'}}>
              {displayName[0]?.toUpperCase()}
            </div>
        }
        <h2 className="text-2xl font-black mb-1">Hey, {displayName.split(' ')[0]} 👋</h2>
        <span className="badge badge-secondary mb-4">Employee</span>
        <p className="text-base-content/50 text-sm mb-6">You're not affiliated with a company yet.</p>
        <div className="flex flex-col gap-3">
          <Link to="/Dashboard/RequestAsset" className="btn btn-primary rounded-full">Browse Assets</Link>
          <Link to="/Dashboard/MyAssets" className="btn btn-ghost rounded-full border border-base-300">My Assets</Link>
        </div>
      </div>
    </div>
  );

  const areaData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i)=>({
    day, requests:[0,1,0,2,1,3,1][i]||0
  }));

  const pieData = [
    {name:'Accepted',value:accepted||0},
    {name:'Pending', value:pending ||0},
    {name:'Rejected',value:rejected||0},
  ];
  const PIE_C = [C.green, C.yellow, C.red];

  // Asset type bar from requests
  const typeMap = {};
  requests.forEach(r=>{ typeMap[r.assetType||'Other']=(typeMap[r.assetType||'Other']||0)+1; });
  const typeBar = Object.entries(typeMap).map(([name,count])=>({name,count}));

  return (
    <div className="min-h-screen bg-base-200 p-5">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black">Employee Dashboard</h1>
          <p className="text-xs text-base-content/40 mt-0.5">{displayName} · 🏢 {affiliation.companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-secondary badge-sm">Employee</span>
          <Link to="/Dashboard/Profile" className="btn btn-xs btn-ghost border border-base-300 rounded-full">Profile</Link>
        </div>
      </div>

      {/* ── Row 1: KPI cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <KPI emoji="📋" label="Total"    value={total}    color={C.purple} rgb="124,106,247"/>
        <KPI emoji="✅" label="Accepted" value={accepted} color={C.green}  rgb="63,185,80"  />
        <KPI emoji="⏳" label="Pending"  value={pending}  color={C.yellow} rgb="245,158,11" />
        <KPI emoji="❌" label="Rejected" value={rejected} color={C.red}    rgb="248,81,73"  />
      </div>

      {/* ── Row 2: Gauges ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          {label:'Total Requests',  value:total,    max:Math.max(total,10),    color:C.purple, sub:'requests'},
          {label:'Accepted',        value:accepted, max:Math.max(total,1),     color:C.green,  sub:'approved'},
          {label:'Pending',         value:pending,  max:Math.max(total,1),     color:C.yellow, sub:'waiting' },
          {label:'Rejected',        value:rejected, max:Math.max(total,1),     color:C.red,    sub:'denied'  },
        ].map(({label,value,max,color,sub})=>(
          <div key={label} className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col items-center gap-1">
            <p className="text-xs text-base-content/40 uppercase tracking-widest mb-1">{label}</p>
            <Gauge value={value} max={max} color={color} sub={sub}/>
          </div>
        ))}
      </div>

      {/* ── Row 3: Area + Pie ── */}
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div className="md:col-span-2 bg-base-100 border border-base-300 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm">My Request Activity</h3>
              <p className="text-xs text-base-content/40">This week</p>
            </div>
            <span className="text-xs font-black" style={{color:C.purple}}>{total} total</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="empG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.purple} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:10,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#6b7280'}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip contentStyle={tip}/>
              <Area type="monotone" dataKey="requests" stroke={C.purple} strokeWidth={2.5} fill="url(#empG)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-1">Status Breakdown</h3>
          <p className="text-xs text-base-content/40 mb-2">My requests</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={55} innerRadius={30} paddingAngle={4}>
                {pieData.map((_,i)=><Cell key={i} fill={PIE_C[i]}/>)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {pieData.map((d,i)=>(
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-base-content/50">
                  <span className="w-2 h-2 rounded-full" style={{background:PIE_C[i]}}/>{d.name}
                </span>
                <span className="text-xs font-black" style={{color:PIE_C[i]}}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Asset type bar + Recent requests ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-base-100 border border-base-300 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-1">Requests by Asset Type</h3>
          <p className="text-xs text-base-content/40 mb-4">Distribution</p>
          {typeBar.length === 0
            ? <p className="text-center text-base-content/30 py-8 text-sm">No data yet</p>
            : <ResponsiveContainer width="100%" height={180}>
                <BarChart data={typeBar} barSize={28}>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:'#6b7280'}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip contentStyle={tip}/>
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {typeBar.map((_,i)=><Cell key={i} fill={[C.purple,C.cyan,C.green,C.yellow][i%4]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
            <h3 className="font-bold text-sm">My Requests</h3>
            <Link to="/Dashboard/MyAssets" className="text-xs font-semibold" style={{color:C.purple}}>See all →</Link>
          </div>
          <div className="overflow-y-auto" style={{maxHeight:'220px'}}>
            {requests.length === 0
              ? <p className="text-center text-base-content/30 py-8 text-sm">No requests yet</p>
              : requests.slice(0,6).map((r,i)=>(
                <div key={r._id} className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition border-b border-base-300/20 last:border-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{background:`linear-gradient(135deg,${[C.purple,C.cyan,C.green,C.yellow,C.red][i%5]},${['#a78bfa','#67e8f9','#86efac','#fcd34d','#fca5a5'][i%5]})`}}>
                    {r.assetName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs truncate">{r.assetName}</p>
                    <p className="text-xs text-base-content/30">{r.assetType} · {r.requestDate}</p>
                  </div>
                  <span className={`badge badge-xs ${r.status==='Accepted'?'badge-success':r.status==='pending'?'badge-warning':'badge-error'}`}>{r.status}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── Quick nav ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {[
          {to:'/Dashboard/RequestAsset', emoji:'🙋', label:'Request Asset', color:C.purple, rgb:'124,106,247'},
          {to:'/Dashboard/MyAssets',     emoji:'📦', label:'My Assets',     color:C.cyan,   rgb:'34,211,238' },
          {to:'/Dashboard/myteam',       emoji:'🤝', label:'My Team',       color:C.green,  rgb:'63,185,80'  },
          {to:'/Dashboard/Profile',      emoji:'👤', label:'Profile',       color:C.yellow, rgb:'245,158,11' },
        ].map(({to,emoji,label,color,rgb})=>(
          <Link key={to} to={to}
            className="flex items-center gap-3 px-4 py-3 bg-base-100 border border-base-300 rounded-xl hover:border-primary/40 transition group">
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

export default EmployeeDashboard;
