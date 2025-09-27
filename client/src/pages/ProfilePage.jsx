import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setPhone(userInfo.phone || '');
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    if (!currentPassword) {
      setError('Current password is required to save changes.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const res = await axios.put(
        'http://localhost:5001/api/users/profile',
        { name, email, phone, newPassword, currentPassword },
        config
      );
      
      dispatch(setCredentials({ ...res.data, token: userInfo.token }));
      setMessage('Profile updated successfully!');
      
      // Clear password fields after successful update
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="w-full max-w-lg mx-auto bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
          </div>

          <hr className="border-gray-600" />

          <p className="text-gray-400 text-sm">Change Password (optional)</p>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">New Password</label>
            <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm New Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
          </div>

          <hr className="border-gray-600" />

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-bold text-violet-400">Current Password</label>
            <p className="text-xs text-gray-400 mb-2">Required to save any changes</p>
            <input id="currentPassword" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
          </div>
          
          {/* Display success or error messages */}
          {message && <p className="text-center text-sm text-green-400">{message}</p>}
          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;