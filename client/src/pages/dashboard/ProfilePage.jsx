import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { updateUserProfile } from '../../store/slices/authSlice';
import { Button, Input, Card } from '../../components/ui';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch('/users/profile', formData);
      dispatch(updateUserProfile(data.user));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    setUploading(true);
    try {
      const { data } = await api.post('/users/upload-avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(updateUserProfile({ profilePicture: data.profilePicture }));
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and contact details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 text-center">
            <div className="relative inline-block group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full border-4 border-primary-50 overflow-hidden shadow-xl mb-4 mx-auto relative group-hover:opacity-80 transition-opacity">
                {user?.profilePicture ? (
                  <img src={`${api.defaults.baseURL}${user.profilePicture}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 font-black text-4xl">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 right-0 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg text-slate-600">
                <CameraIcon className="w-5 h-5" />
              </div>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-sm text-slate-500 mb-6 capitalize">{user?.role} Account</p>
            
            <div className="flex flex-col space-y-3">
               <div className="flex items-center justify-center text-sm font-semibold text-emerald-600 bg-emerald-50 py-2 rounded-xl">
                 <CheckCircleIcon className="w-4 h-4 mr-2" />
                 Verified Member
               </div>
            </div>
          </Card>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input 
                   label="Full Name" 
                   value={formData.name} 
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                   icon={UserCircleIcon}
                 />
                 <Input 
                   label="Email Address" 
                   readOnly 
                   disabled 
                   value={formData.email} 
                   className="bg-slate-50 cursor-not-allowed"
                   icon={EnvelopeIcon}
                 />
                 <Input 
                   label="Phone Number" 
                   value={formData.phone} 
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   icon={PhoneIcon}
                 />
                 <div className="md:col-span-2">
                   <Input 
                     label="Home Address" 
                     value={formData.address} 
                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                     icon={MapPinIcon}
                   />
                 </div>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                 <Button type="submit" disabled={loading} className="px-8 py-3">
                   {loading ? 'Saving Changes...' : 'Save Changes'}
                 </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
