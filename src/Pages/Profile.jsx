import React, { useState, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CgProfile } from 'react-icons/cg';
import AuthContext from '../contexts/AuthContexts';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user.email;

  const queryClient = useQueryClient();

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

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    companyName: '',
    dateOfBirth: '',
    role: '',
    photoURL: '',
  });

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;

  const handleEditClick = () => {
    setFormData({
      displayName: profile.displayName || '',
      companyName: profile.companyName || '',
      dateOfBirth: profile.dateOfBirth || '',
      role: profile.role || '',
      photoURL: profile.photoURL || '',
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photoURL' && files.length > 0) {
      // convert image to Base64 or URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `https://asset-verse-server-phi.vercel.app/users/${userEmail}`,
        formData
      );
      queryClient.invalidateQueries(['userProfile', userEmail]);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 px-4 py-8 mx-auto min-h-screen">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl p-8 mx-auto">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          {formData.photoURL ? (
            <img
              src={formData.photoURL}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-7xl text-gray-500 border-4 border-blue-500">
              <CgProfile />
            </div>
          )}

          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="input input-bordered w-full"
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Role"
                  className="input input-bordered w-full"
                />
                <input
                  type="file"
                  name="photoURL"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input file-input-bordered w-full"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleSave} className="btn btn-primary">Save</button>
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold">{profile.displayName || 'Unnamed User'}</h2>
                <p className="text-gray-500 capitalize text-lg">{profile.role}</p>
                <p className="text-sm text-gray-400">{profile.email}</p>
              </>
            )}
          </div>

          {!isEditing && (
            <div>
              <button onClick={handleEditClick} className="btn btn-neutral">Edit Profile</button>
            </div>
          )}
        </div>

        {/* Profile Details */}
        {!isEditing && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg">
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="font-semibold text-lg">{profile.companyName || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold text-lg">{profile.dateOfBirth || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-semibold text-lg capitalize">{profile.role}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg md:col-span-3">
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-semibold text-lg break-all">{profile.email}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
