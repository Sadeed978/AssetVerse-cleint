import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContexts';

const MyTeam = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;

  const { data: affiliation, isLoading: affL } = useQuery({
    queryKey: ['affiliation', userEmail], enabled: !!userEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`)).data,
  });

  const hrEmail = affiliation?.hrEmail;

  const { data: team = [], isLoading: teamL } = useQuery({
    queryKey: ['team', hrEmail], enabled: !!hrEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`)).data,
  });

  const { data: hrUser, isLoading: hrL } = useQuery({
    queryKey: ['hrUser', hrEmail], enabled: !!hrEmail,
    queryFn: async () => (await axios.get(`https://asset-verse-server-phi.vercel.app/users/${hrEmail}`)).data,
  });

  if (affL || teamL || hrL) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">My Team</h1>
        <p className="text-base-content/50 text-sm mt-1">{team.length} member{team.length !== 1 ? 's' : ''}</p>
      </div>

      {/* HR card */}
      {hrUser && (
        <div className="bg-base-100 border border-primary/30 rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
            {(hrUser.displayName || hrUser.email)?.[0]?.toUpperCase() || 'H'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{hrUser.displayName || hrUser.name || 'HR Manager'}</h3>
              <span className="badge badge-primary badge-sm">HR</span>
            </div>
            <p className="text-sm text-base-content/50">{hrUser.email}</p>
            {hrUser.companyName && <p className="text-xs text-base-content/40 mt-0.5">🏢 {hrUser.companyName}</p>}
          </div>
        </div>
      )}

      {/* Team grid */}
      {team.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🤝</div>
          <p className="text-base-content/40 text-lg">No team members yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member) => (
            <div key={member._id} className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-secondary/15 flex items-center justify-center text-lg font-bold text-secondary shrink-0">
                  {member.employeeName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm truncate">{member.employeeName}</h3>
                  <p className="text-xs text-base-content/40 truncate">{member.employeeEmail}</p>
                </div>
              </div>
              <div className="bg-base-200 rounded-xl px-4 py-3 text-sm flex flex-col gap-1">
                {member.assetName && (
                  <div className="flex justify-between">
                    <span className="text-base-content/50">Asset</span>
                    <span className="font-medium">{member.assetName}</span>
                  </div>
                )}
                {member.assetType && (
                  <div className="flex justify-between">
                    <span className="text-base-content/50">Type</span>
                    <span className="font-medium">{member.assetType}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-base-content/50">Status</span>
                  <span className={`badge badge-xs ${member.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{member.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeam;
