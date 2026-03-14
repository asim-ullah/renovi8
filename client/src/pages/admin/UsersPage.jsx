import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Card, Badge, Input } from '../../components/ui';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users/all');
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 font-bold text-slate-400">Accessing customer database...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Customer Management</h1>
          <p className="text-slate-500">View and manage registered customers and their profiles.</p>
        </div>
        <div className="relative w-full md:w-80">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, idx) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-6 hover:shadow-xl transition-all border-none shadow-sm">
               <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl">
                    {user.profilePicture ? (
                       <img src={`${api.defaults.baseURL}${user.profilePicture}`} className="w-full h-full object-cover rounded-2xl" alt="" />
                    ) : user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-lg font-bold text-slate-900 truncate">{user.name}</h3>
                     <Badge variant={user.role === 'admin' ? 'purple' : 'blue'} className="mt-1">
                        {user.role.toUpperCase()}
                     </Badge>
                  </div>
               </div>

               <div className="space-y-3 border-t border-slate-50 pt-6">
                  <div className="flex items-center text-sm text-slate-600">
                     <EnvelopeIcon className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                     <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                     <PhoneIcon className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                     {user.phone || 'No phone set'}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                     <MapPinIcon className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                     <span className="line-clamp-1">{user.address || 'No address set'}</span>
                  </div>
               </div>

               <div className="mt-8 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  <span className="flex items-center">
                    <ShieldCheckIcon className="w-3 h-3 mr-1 text-emerald-500" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span>ID: {user._id.toString().slice(-6)}</span>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No customers match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
