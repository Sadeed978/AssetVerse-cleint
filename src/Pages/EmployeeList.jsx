import React, { use, useState } from 'react';
import AuthContext from '../contexts/AuthContexts';
import { useQuery } from '@tanstack/react-query';

// Fetch full user profile for each employee
const EmployeeCard = ({ emp }) => {
  const [expanded, setExpanded] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['empProfile', emp.employeeEmail],
    enabled: !!emp.employeeEmail,
    queryFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/users/${emp.employeeEmail}`);
      return res.ok ? res.json() : null;
    },
  });

  const name    = profile?.displayName || emp.employeeName || 'Unknown';
  const email   = emp.employeeEmail;
  const photo   = profile?.photoURL;
  const dob     = profile?.dateOfBirth;
  const company = emp.companyName || profile?.companyName;
  const initial = name[0]?.toUpperCase();

  // Color based on first letter
  const colors = ['bg-primary/20 text-primary', 'bg-secondary/20 text-secondary',
    'bg-success/20 text-success', 'bg-warning/20 text-warning', 'bg-info/20 text-info'];
  const colorClass = colors[initial?.charCodeAt(0) % colors.length] || colors[0];

  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">

      {/* Top gradient banner */}
      <div className="h-16 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/10 relative">
        <div className="absolute -bottom-6 left-5">
          {photo
            ? <img src={photo} alt={name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-base-100 shadow-md" />
            : <div className={`w-14 h-14 rounded-full ring-4 ring-base-100 shadow-md flex items-center justify-center text-xl font-extrabold ${colorClass}`}>
                {initial}
              </div>
          }
        </div>
        {/* Status pill top-right */}
        <div className="absolute top-3 right-3">
          <span className={`badge badge-sm font-semibold ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
            {emp.status === 'active' ? '● Active' : '● ' + (emp.status || 'active')}
          </span>
        </div>
      </div>

      {/* Name block */}
      <div className="pt-8 px-5 pb-4">
        <h3 className="font-extrabold text-base leading-tight">{name}</h3>
        <p className="text-xs text-base-content/40 truncate mt-0.5">{email}</p>
        {company && <p className="text-xs text-primary/70 mt-1 font-medium">🏢 {company}</p>}
      </div>

      {/* Info rows */}
      <div className="px-5 pb-4 flex flex-col gap-2">

        {/* Asset row */}
        {emp.assetName && (
          <div className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <span>📦</span> Asset
            </div>
            <span className="font-semibold text-sm">{emp.assetName}</span>
          </div>
        )}

        {/* Type row */}
        {emp.assetType && (
          <div className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <span>🔖</span> Type
            </div>
            <span className={`badge badge-sm ${emp.assetType === 'Returnable' ? 'badge-success' : 'badge-error'}`}>
              {emp.assetType}
            </span>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-primary/70 hover:text-primary transition mt-1 text-left font-medium"
        >
          {expanded ? '▲ Show less' : '▼ More details'}
        </button>

        {/* Expanded info */}
        {expanded && (
          <div className="flex flex-col gap-2 mt-1 animate-in fade-in duration-200">
            {dob && (
              <div className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm text-base-content/50">
                  <span>🎂</span> Date of Birth
                </div>
                <span className="font-semibold text-sm">{dob}</span>
              </div>
            )}
            <div className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <span>📧</span> Email
              </div>
              <span className="font-semibold text-xs truncate max-w-[160px]">{email}</span>
            </div>
            <div className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <span>🔑</span> Role
              </div>
              <span className="badge badge-secondary badge-sm capitalize">employee</span>
            </div>
            {emp.date && (
              <div className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm text-base-content/50">
                  <span>📅</span> Joined
                </div>
                <span className="font-semibold text-sm">
                  {new Date(emp.date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const EmployeeList = () => {
  const { user } = use(AuthContext);
  const hrEmail = user?.email;
  const [search, setSearch] = useState('');

  const { data = [], isLoading } = useQuery({
    queryKey: ['employeeList', hrEmail],
    queryFn: async () => {
      const res = await fetch(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`);
      return res.json();
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  const filtered = data.filter(e =>
    !search ||
    e.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Employees</h1>
          <p className="text-base-content/50 text-sm mt-1">
            {data.length} employee{data.length !== 1 ? 's' : ''} under your HR
          </p>
        </div>

        {/* Search */}
        <label className="input input-bordered flex items-center gap-2 w-full sm:w-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input type="text" placeholder="Search employees…"
            className="grow bg-transparent outline-none text-sm"
            onChange={e => setSearch(e.target.value)} />
        </label>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: '👥', label: 'Total',  value: data.length,                                          color: 'text-primary',  bg: 'bg-primary/10'  },
          { icon: '✅', label: 'Active', value: data.filter(e => e.status === 'active').length,       color: 'text-success',  bg: 'bg-success/10'  },
          { icon: '📦', label: 'Assets', value: data.filter(e => e.assetName).length,                 color: 'text-warning',  bg: 'bg-warning/10'  },
        ].map(({ icon, label, value, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-xl`}>{icon}</div>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-base-content/40 text-lg">
            {search ? 'No employees match your search' : 'No employees yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(emp => <EmployeeCard key={emp._id} emp={emp} />)}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
