import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiCamera, FiLock } from 'react-icons/fi';
import Navbar from '../component/layout/Navbar.jsx';
import { Button, Input, Textarea } from '../component/common/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Profile = () => {
  const { user, dispatch } = useAuth();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' },
  });

  const { register: registerPass, handleSubmit: handlePassSubmit, formState: { errors: passErrors }, reset: resetPass, watch } = useForm();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profileImage', file);
    setAvatarLoading(true);
    try {
      const res = await api.patch('/users/profile/image', formData);
      dispatch({ type: 'UPDATE_USER', payload: { profileImage: res.data.profileImage } });
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally { setAvatarLoading(false); }
  };

  const onProfileSave = async (data) => {
    setProfileLoading(true);
    try {
      const res = await api.patch('/users/profile', data);
      dispatch({ type: 'UPDATE_USER', payload: res.data });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally { setProfileLoading(false); }
  };

  const onPasswordChange = async (data) => {
    setPassLoading(true);
    try {
      await api.patch('/users/change-password', { currentPassword: data.current, newPassword: data.newPass });
      toast.success('Password changed successfully!');
      resetPass();
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally { setPassLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

        <div className="space-y-6">
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <h2 className="font-semibold text-white mb-4">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{user?.name?.[0]}</span>
                  </div>
                )}
                {avatarLoading && (
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <label className="btn-secondary cursor-pointer flex items-center gap-2 text-sm px-4 py-2">
                  <FiCamera size={14} /> Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
                <p className="text-xs text-slate-500 mt-1.5">JPG, PNG or WebP. Max 5MB.</p>
              </div>
            </div>
          </motion.div>

          {/* Profile info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <h2 className="font-semibold text-white mb-4">Personal Information</h2>
            <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4">
              <div className="relative">
                <FiUser className="absolute left-3 top-9 text-slate-400" size={15} />
                <Input label="Full Name" placeholder="John Doe" className="pl-10" error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })} />
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-9 text-slate-400" size={15} />
                <Input label="Email" value={user?.email || ''} className="pl-10" disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
              <div className="relative">
                <FiPhone className="absolute left-3 top-9 text-slate-400" size={15} />
                <Input label="Phone (optional)" placeholder="+1 234 567 8900" className="pl-10"
                  {...register('phone')} />
              </div>
              <Textarea label="Bio (optional)" placeholder="Tell us a bit about yourself..." rows={3}
                {...register('bio', { maxLength: { value: 300, message: 'Bio cannot exceed 300 characters' } })}
                error={errors.bio?.message} />
              <Button type="submit" loading={profileLoading}>Save Changes</Button>
            </form>
          </motion.div>

          {/* Change password */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiLock size={16} /> Change Password
            </h2>
            <form onSubmit={handlePassSubmit(onPasswordChange)} className="space-y-4">
              <Input label="Current Password" type="password" placeholder="••••••••"
                error={passErrors.current?.message}
                {...registerPass('current', { required: 'Current password is required' })} />
              <Input label="New Password" type="password" placeholder="Min. 8 characters"
                error={passErrors.newPass?.message}
                {...registerPass('newPass', { required: 'New password is required', minLength: { value: 8, message: 'Min. 8 characters' } })} />
              <Input label="Confirm New Password" type="password" placeholder="Repeat new password"
                error={passErrors.confirm?.message}
                {...registerPass('confirm', {
                  required: 'Please confirm your password',
                  validate: (v) => v === watch('newPass') || 'Passwords do not match',
                })} />
              <Button type="submit" loading={passLoading} variant="secondary">Update Password</Button>
            </form>
          </motion.div>

          {/* Account info */}
          <div className="card p-4 flex items-center justify-between text-sm">
            <div>
              <p className="text-slate-400">Account type: <span className="text-white font-medium capitalize">{user?.role}</span></p>
              <p className="text-slate-500 text-xs mt-0.5">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
            <span className="badge-green">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
