import React, { useState, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import AuthContext from '../contexts/AuthContexts';
import { toast } from 'react-toastify';

const roleColor = { hr: 'badge-primary', employee: 'badge-secondary' };
const roleBg   = { hr: 'from-primary to-blue-600', employee: 'from-secondary to-purple-600' };

const Profile = () => {
  const { user } = useContext(AuthContext);
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', user.email],
    enabled: !!user.email,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/users/${user.email}`)).data,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  const avatar = profile.photoURL || user.photoURL;
  const initials = (profile.displayName || user.email || '?')[0].toUpperCase();

  const startEdit = () => {
    setForm({ displayName: profile.displayName || '', companyName: profile.companyName || '', dateOfBirth: profile.dateOfBirth || '' });
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
    <div className="min-h-screen bg-base-200 pb-12">

      {/* Cover + avatar */}
      <div className={`h-44 bg-gradient-to-r ${roleBg[profile.role] || 'from-primary to-secondary'} relative`}>
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          {avatar
            ? <img src={avatar} alt="" className="w-28 h-28 rounded-full object-cover ring-4 ring-base-100 shadow-xl" />
            : <div className="w-28 h-28 rounded-full bg-base-100 ring-4 ring-base-100 shadow-xl flex items-center justify-center text-4xl font-extrabold text-primary">{initials}</div>
          }
        </div>
      </div>

      {/* Name block */}
      <div className="text-center mt-16 px-4">
        <h1 className="text-2xl font-extrabold">{profile.displayName || 'Unnamed User'}</h1>
        <p className="text-base-content/50 text-sm mt-1">{profile.email}</p>
        <span className={`badge ${roleColor[profile.role] || 'badge-neutral'} badge-md mt-2 capitalize`}>{profile.role}</span>
      </div>

      {/* Stats row */}
      <div className="flex justify-center gap-8 mt-6 px-4">
        {[
          { label: 'Company', value: profile.companyName || '—' },
          { label: 'Role',    value: profile.role || '—' },
          { label: 'DOB',     value: profile.dateOfBirth || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-bold text-base-content truncate max-w-[100px]">{value}</p>
            <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Edit button */}
      {!editing && (
        <div className="flex justify-center mt-6">
          <button onClick={startEdit} className="btn btn-outline btn-sm px-8 rounded-full">
            Edit Profile
          </button>
        </div>
      )}

      {/* Info cards */}
      {!editing && (
        <div className="max-w-xl mx-auto mt-8 px-4 grid grid-cols-1 gap-4">
          {[
            { icon: '🏢', label: 'Company',       value: profile.companyName || 'N/A' },
            { icon: '📧', label: 'Email',          value: profile.email },
            { icon: '🎂', label: 'Date of Birth',  value: profile.dateOfBirth || 'N/A' },
            { icon: '🔖', label: 'Role',           value: profile.role },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-base-100 border border-base-300 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-xs text-base-content/40 uppercase tracking-wide">{label}</p>
                <p className="font-semibold text-base-content break-all">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="max-w-xl mx-auto mt-8 px-4">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="label text-sm font-medium pb-1">Display Name</label>
                <input className="input input-bordered w-full" value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} />
              </div>
              <div>
                <label className="label text-sm font-medium pb-1">Company Name</label>
                <input className="input input-bordered w-full" value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
              </div>
              <div>
                <label className="label text-sm font-medium pb-1">Date of Birth</label>
                <input type="date" className="input input-bordered w-full" value={form.dateOfBirth}
                  onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={save} disabled={saving} className="btn btn-primary flex-1">
                  {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="btn btn-ghost flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
