import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContexts';


const MyTeam = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;


  const {
    data: affiliation,
    isLoading: affiliationLoading,
    isError: affiliationError,
  } = useQuery({
    queryKey: ['affiliation', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/employeeAffiliation/${userEmail}`
      );
      return res.data;
    },
  });

  const hrEmail = affiliation?.hrEmail;

  
  const {
    data: team = [],
    isLoading: teamLoading,
    isError: teamError,
  } = useQuery({
    queryKey: ['team', hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/employeeAffiliation/hr/${hrEmail}`
      );
      return res.data;
    },
  });

  
  const {
    data: hrUser,
    isLoading: hrLoading,
    isError: hrError,
  } = useQuery({
    queryKey: ['hrUser', hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/users/${hrEmail}`
      );
      return res.data;
    },
  });

  
  if (affiliationLoading || teamLoading || hrLoading)
    return <p className="text-center">Loading...</p>;
  if (affiliationError || teamError || hrError)
    return <p className="text-center text-red-500">Something went wrong</p>;


  return (
    <div className="max-w-6xl mx-auto px-4">

     
      {hrUser && (
        <div className="card bg-base-200 shadow-md mb-8">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold mb-2">HR Info</h2>
            <p><strong>Name:</strong> {hrUser.name}</p>
            <p><strong>Email:</strong> {hrUser.email}</p>
            <p><strong>Role:</strong> {hrUser.role}</p>
            <p><strong>Company:</strong> {hrUser.companyName}</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-6">
        Team Members ({team.length})
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member._id} className="card bg-base-100 shadow-md">
            <div className="card-body text-center">
              <h3 className="card-title justify-center">{member.employeeName}</h3>
              <p><strong>Email:</strong> {member.employeeEmail}</p>
              <p><strong>Status:</strong> {member.status}</p>
              {member.assetName && <p><strong>Asset:</strong> {member.assetName}</p>}
              {member.assetType && <span className="badge badge-primary mt-2">{member.assetType}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
