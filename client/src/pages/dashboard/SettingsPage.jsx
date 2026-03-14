import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyIcon, 
  BellIcon, 
  ShieldExclamationIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Button, Input, Card } from '../../components/ui';

const SettingsPage = () => {
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.patch('/users/change-password', passwordData);
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 font-sans tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your security and notification preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Password Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-slate-900">
             <KeyIcon className="w-6 h-6 text-primary-600" />
             <h2 className="text-xl font-bold">Change Password</h2>
          </div>
          <Card className="p-8">
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
              <Input 
                label="Current Password" 
                type="password" 
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <Input 
                label="New Password" 
                type="password" 
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </Card>
        </section>

        {/* Notifications Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-slate-900">
             <BellIcon className="w-6 h-6 text-primary-600" />
             <h2 className="text-xl font-bold">Preferences</h2>
          </div>
          <Card className="p-6">
             <div className="flex items-center justify-between">
                <div>
                   <p className="font-bold text-slate-900">Email Notifications</p>
                   <p className="text-sm text-slate-500 mt-0.5">Receive order status updates and service reminders.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </div>
             </div>
          </Card>
        </section>

        {/* Security / Dangerous Section */}
        <section className="space-y-4 pt-8">
           <div className="flex items-center space-x-3 text-slate-900">
             <ShieldExclamationIcon className="w-6 h-6 text-rose-600" />
             <h2 className="text-xl font-bold">Danger Zone</h2>
          </div>
          <Card className="p-6 border-rose-100 bg-rose-50/30">
             <div className="flex items-center justify-between">
                <div>
                   <p className="font-bold text-rose-900">Delete Account</p>
                   <p className="text-sm text-rose-600/70 mt-0.5">Permanently delete your account and all service history.</p>
                </div>
                <Button variant="danger" className="shrink-0">
                  Delete Account
                </Button>
             </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
