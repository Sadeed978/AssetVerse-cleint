import React, { useState, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import AuthContext from '../contexts/AuthContexts';
import { toast } from 'react-toastify';
import { Link } from 'react-router';

const roleGradient = {
  hr:       'from-indigo-600 via-purple-600 to-pink-500',
  employee: 'from-blue-600 via-cyan-500 to-teal-400',
};
const roleBadge = { hr: 'badge-primary', employee: 'badge-secondary' };

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 py-3 border-b border-base-300 last:border-0">
    <span className="text-xl w-8 text-center shrink-0">{icon}</span>
    <div>
      <p className="text-xs text-base-content/40 uppercase tracking-widest">{label}</p>
      <p className="font-semibold text-base-content">{value || '—'}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useContext(AuthContext);
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [coverIdx, setCoverIdx] = useState(0);

  const covers = [
    roleGradient[user?.role] || 'from-indigo-600 via-purple-600 to-pink-500',
    'from-rose-500 via-orange-400 to-yellow-400',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-slate-700 via-slate-600 to-slate-500',
  ];

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', user.email],
    enabled: !!user.email,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/users/${user.email}`)).data,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  const name     = profile.displayName || user.displayName || user.email?.split('@')[0] || 'User';
  const avatar   = profile.photoURL || user.photoURL;
  const initial  = name[0]?.toUpperCase();
  const gradient = covers[coverIdx] || covers[0];

  const startEdit = () => {
    setForm({
      displayName: profile.displayName || '',
      companyName: profile.companyName || '',
      dateOfBirth: profile.dateOfBirth || '',
    });
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await axios.patch(`https://asset-verse-server-phi.vercel.app/users/${user.email}`, form);
      qc.invalidateQueries(['userProfile', user.email]);
      toast.success('Profile updated!');
      setEditing(false);
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-base-200">

      {/* ── COVER PHOTO ─────────────────────────────────────────────────── */}
      <div className={`relative h-64 md:h-80 bg-gradient-to-r ${gradient} w-full`}>
        {/* Cover change buttons */}
        <div className="absolute bottom-3 right-4 flex gap-2">
          {covers.map((c, i) => (
            <button key={i} onClick={() => setCoverIdx(i)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${i === coverIdx ? 'border-white scale-125' : 'border-white/40'} bg-gradient-to-br ${c}`}
            />
          ))}
        </div>
      </div>

      {/* ── PROFILE SECTION ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4">

        {/* Avatar + name row */}
        <div className="relative flex flex-col md:flex-row md:items-end gap-4 -mt-16 md:-mt-20 mb-4 pb-4 border-b border-base-300">

          {/* Avatar */}
          <div className="relative shrink-0">
            {avatar
              ? <img src={avatar} alt={name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-base-200 shadow-xl" />
              : <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${gradient} ring-4 ring-base-200 shadow-xl flex items-center justify-center text-5xl font-black text-white`}>
                  {initial}
                </div>
            }
            {/* Online dot */}
            <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-success border-2 border-base-200" />
          </div>

          {/* Name + meta */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-base-content">{name}</h1>
                <p className="text-base-content/40 text-sm mt-0.5">{user.email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`badge ${roleBadge[profile.role] || 'badge-neutral'} capitalize`}>{profile.role}</span>
                  {profile.companyName && (
                    <span className="text-xs text-base-content/40 flex items-center gap-1">🏢 {profile.companyName}</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {!editing && (
                  <>
                    <button onClick={startEdit}
                      className="btn btn-primary btn-sm rounded-full gap-1 px-5">
                      ✏️ Edit Profile
                    </button>
                    <Link to={profile.role === 'hr' ? '/Dashboard/HR' : '/Dashboard/Employee'}
                      className="btn btn-ghost btn-sm rounded-full border border-base-300 hover:border-primary gap-1 px-5">
                      📊 Dashboard
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ROW (Facebook-style) ── */}
        <div className="flex gap-6 mb-6 overflow-x-auto pb-1">
          {[
            { label: 'Role',    value: profile.role || '—' },
            { label: 'Company', value: profile.companyName || '—' },
            { label: 'DOB',     value: profile.dateOfBirth || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center shrink-0">
              <p className="font-black text-base-content text-lg leading-tight">{value}</p>
              <p className="text-xs text-base-content/40 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="grid md:grid-cols-5 gap-5 pb-12">

          {/* Left column — info cards */}
          <div className="md:col-span-2 flex flex-col gap-4">

            {/* About card */}
            <div className="glass-card border border-base-300 rounded-2xl p-5">
              <h3 className="font-black text-base mb-4">About</h3>
              <InfoRow icon="🏢" label="Company"      value={profile.companyName} />
              <InfoRow icon="📧" label="Email"        value={profile.email}       />
              <InfoRow icon="🎂" label="Date of Birth"value={profile.dateOfBirth} />
              <InfoRow icon="🔖" label="Role"         value={profile.role}        />
            </div>

            {/* Quick links */}
            <div className="glass-card border border-base-300 rounded-2xl p-5">
              <h3 className="font-black text-base mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                {(profile.role === 'hr' ? [
                  { to:'/Dashboard/HR',          icon:'📊', label:'Dashboard'    },
                  { to:'/Dashboard/AssetList',   icon:'📦', label:'Asset List'   },
                  { to:'/Dashboard/AddAssert',   icon:'➕', label:'Add Asset'    },
                  { to:'/Dashboard/AllRequiests',icon:'📋', label:'All Requests' },
                  { to:'/Dashboard/EmployeeList',icon:'👥', label:'Employees'    },
                ] : [
                  { to:'/Dashboard/Employee',    icon:'📊', label:'Dashboard'    },
                  { to:'/Dashboard/MyAssets',    icon:'📦', label:'My Assets'    },
                  { to:'/Dashboard/RequestAsset',icon:'🙋', label:'Request Asset'},
                  { to:'/Dashboard/myteam',      icon:'🤝', label:'My Team'      },
                ]).map(({ to, icon, label }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-base-300/50 transition text-sm font-medium text-base-content/70 hover:text-base-content">
                    <span>{icon}</span>{label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — edit form or activity */}
          <div className="md:col-span-3 flex flex-col gap-4">

            {editing ? (
              <div className="glass-card border border-base-300 rounded-2xl p-6">
                <h3 className="font-black text-base mb-5">Edit Profile</h3>
                <div className="flex flex-col gap-4">
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-semibold text-sm">Display Name</span></label>
                    <input className="input input-bordered w-full" value={form.displayName}
                      onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} />
                  </div>
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-semibold text-sm">Company Name</span></label>
                    <input className="input input-bordered w-full" value={form.companyName}
                      onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
                  </div>
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-semibold text-sm">Date of Birth</span></label>
                    <input type="date" className="input input-bordered w-full" value={form.dateOfBirth}
                      onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button onClick={save} disabled={saving} className="btn btn-primary flex-1 rounded-xl">
                      {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn btn-ghost flex-1 rounded-xl border border-base-300">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Profile complete card */}
                <div className="glass-card border border-base-300 rounded-2xl p-6">
                  <h3 className="font-black text-base mb-2">Profile Completeness</h3>
                  <p className="text-xs text-base-content/40 mb-4">Complete your profile to get the most out of AssetVerse</p>
                  {(() => {
                    const fields = [profile.displayName, profile.companyName, profile.dateOfBirth, profile.photoURL];
                    const filled = fields.filter(Boolean).length;
                    const pct = Math.round((filled / fields.length) * 100);
                    return (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold">{pct}% complete</span>
                          <span className="text-base-content/40">{filled}/{fields.length} fields</span>
                        </div>
                        <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }} />
                        </div>
                        {pct < 100 && (
                          <button onClick={startEdit} className="btn btn-ghost btn-sm mt-3 text-primary hover:bg-primary/10 rounded-full">
                            Complete your profile →
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Account info */}
                <div className="glass-card border border-base-300 rounded-2xl p-6">
                  <h3 className="font-black text-base mb-4">Account Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon:'🔖', label:'Role',    value: profile.role || '—'         },
                      { icon:'🏢', label:'Company', value: profile.companyName || '—'  },
                      { icon:'🎂', label:'DOB',     value: profile.dateOfBirth || '—'  },
                      { icon:'📧', label:'Email',   value: profile.email               },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="bg-base-300/30 rounded-xl p-4">
                        <p className="text-xs text-base-content/40 uppercase tracking-widest mb-1">{icon} {label}</p>
                        <p className="font-semibold text-sm truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
