import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon, 
  UserGroupIcon, WrenchScrewdriverIcon, EnvelopeIcon, PhoneIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Button, Card, Input, Badge } from '../../components/ui';

const AdminWorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    status: 'active'
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const { data } = await api.get('/workers');
      setWorkers(data.workers);
    } catch (err) {
      toast.error('Failed to load specialists');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (worker = null) => {
    if (worker) {
      setSelectedWorker(worker);
      setFormData({
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        specialization: worker.specialization,
        status: worker.status || 'active'
      });
    } else {
      setSelectedWorker(null);
      setFormData({ name: '', email: '', phone: '', specialization: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedWorker) {
        await api.put(`/workers/${selectedWorker._id}`, formData);
        toast.success('Specialist updated');
      } else {
        await api.post('/workers', formData);
        toast.success('Specialist added');
      }
      setIsModalOpen(false);
      fetchWorkers();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this specialist from the team?')) return;
    try {
      await api.delete(`/workers/${id}`);
      toast.success('Specialist removed');
      fetchWorkers();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-bold">Deploying specialist roster...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Service Specialists</h1>
          <p className="text-slate-500">Manage your team of professional technicians and installers.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Specialist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {workers.map((worker, idx) => (
          <motion.div
            key={worker._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-6 relative group overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <WrenchScrewdriverIcon className="w-8 h-8" />
                </div>
                <div className="flex space-x-1">
                   <button onClick={() => handleOpenModal(worker)} className="p-2 text-slate-400 hover:text-primary-600 rounded-lg">
                     <PencilIcon className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleDelete(worker._id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg">
                     <TrashIcon className="w-4 h-4" />
                   </button>
                </div>
              </div>

              <div className="mt-6 relative z-10">
                 <h3 className="text-xl font-bold text-slate-900">{worker.name}</h3>
                 <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mt-1">{worker.specialization}</p>
                 
                 <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-slate-500">
                       <EnvelopeIcon className="w-4 h-4 mr-3 text-slate-300" />
                       {worker.email}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                       <PhoneIcon className="w-4 h-4 mr-3 text-slate-300" />
                       {worker.phone}
                    </div>
                 </div>

                 <div className="mt-8 flex items-center justify-between">
                    <Badge variant={worker.status === 'active' ? 'green' : 'gray'}>
                       {worker.status?.toUpperCase() || 'ACTIVE'}
                    </Badge>
                    <span className="text-[10px] font-black text-slate-300 uppercase letter-spacing-2">ID: {worker._id.toString().slice(-6)}</span>
                 </div>
              </div>

              {/* Decorative background icon */}
              <div className="absolute bottom-[-20%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                 <WrenchScrewdriverIcon className="w-40 h-40" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-8 border-b flex items-center justify-between bg-slate-50">
                   <h2 className="text-2xl font-black">Specialist Profile</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                   <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                   <div className="grid grid-cols-2 gap-4">
                      <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                      <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                   </div>
                   <Input label="Area of Specialization" placeholder="e.g. Master Electrician" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required />
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Service Status</label>
                      <select className="input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                         <option value="active">Active & Available</option>
                         <option value="inactive">On Leave / Inactive</option>
                      </select>
                   </div>
                   <Button type="submit" className="w-full py-4 text-lg mt-4">
                      {selectedWorker ? 'Update Roster' : 'Join the Team'}
                   </Button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminWorkersPage;
