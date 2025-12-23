import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CgProfile } from 'react-icons/cg';
import AuthContext from '../contexts/AuthContexts';

const UserProfile = () => {
  const { user } = use(AuthContext);
  const userEmail = user.email;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axios.get(
        `https://asset-verse-server-phi.vercel.app/users/${userEmail}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 mx-auto">
    
      <div className="bg-white shadow-xl rounded-xl w-full p-8">

       
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-7xl text-gray-500 border-4 border-blue-500">
              <CgProfile />
            </div>
          )}

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">
              {profile?.displayName || 'Unnamed User'}
            </h2>
            <p className="text-gray-500 capitalize text-lg">
              {profile?.role}
            </p>
            <p className="text-sm text-gray-400">
              {profile?.email}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-50 p-5 rounded-lg">
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="font-semibold text-lg">
              {profile?.companyName || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-semibold text-lg">
              {profile?.dateOfBirth || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold text-lg capitalize">
              {profile?.role}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg md:col-span-3">
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-semibold text-lg break-all">
              {profile?.email}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
