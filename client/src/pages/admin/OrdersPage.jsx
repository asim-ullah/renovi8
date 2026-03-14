import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  XMarkIcon,
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Button, Card, Badge } from '../../components/ui';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
    fetchWorkers();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch (err) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const fetchWorkers = async () => {
    try {
      const { data } = await api.get('/workers');
      setWorkers(data.workers);
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
      if (selectedOrder) setSelectedOrder(prev => ({ ...prev, status }));
    } catch (err) { toast.error('Update failed'); }
  };

  const handleAssignWorker = async (orderId, workerId) => {
    try {
      await api.patch(`/orders/${orderId}/assign-worker`, { workerId });
      toast.success('Technician assigned');
      fetchOrders();
    } catch (err) { toast.error('Assignment failed'); }
  };

  const statusColors = {
    pending: 'yellow',
    confirmed: 'blue',
    technician_assigned: 'purple',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'red',
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  if (loading) return <div className="p-8 font-bold text-slate-400 animate-pulse">Scanning orders database...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order Management</h1>
          <p className="text-slate-500">Monitor flow, assign specialists, and manage service status.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'technician_assigned', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterStatus === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {s.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID / Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product / Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Specialist</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-black text-slate-900">#{order._id.toString().slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{order.customer?.name}</p>
                  <p className="text-xs text-slate-500">{order.customer?.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{order.product?.name}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[150px]">{order.address}</p>
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="bg-transparent border-none text-xs font-bold text-slate-600 focus:outline-none cursor-pointer hover:text-primary-600"
                    value={order.worker?._id || ''}
                    onChange={(e) => handleAssignWorker(order._id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusColors[order.status]}>{order.status.replace('_', ' ').toUpperCase()}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh]">
                <div className="p-8 border-b flex items-center justify-between bg-slate-50">
                   <div>
                     <h2 className="text-2xl font-black">Order Details</h2>
                     <p className="text-sm font-bold text-slate-400 mt-1">Transaction Ref: {selectedOrder.payment?.stripePaymentIntentId || 'N/A'}</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <div className="p-10 overflow-y-auto max-h-[70vh] grid grid-cols-1 lg:grid-cols-3 gap-10">
                   {/* Col 1 & 2 */}
                   <div className="lg:col-span-2 space-y-10">
                      <div className="flex items-start justify-between">
                         <div className="flex space-x-6">
                            <div className="w-24 h-24 bg-slate-100 rounded-2xl shrink-0 overflow-hidden">
                               <img src={`${api.defaults.baseURL}${selectedOrder.product?.images?.[0]}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                               <Badge variant="blue" className="mb-2">{selectedOrder.serviceType.replace('+', ' & ').toUpperCase()}</Badge>
                               <h3 className="text-2xl font-black text-slate-900">{selectedOrder.product?.name}</h3>
                               <p className="text-slate-500 mt-2 line-clamp-2">{selectedOrder.product?.description}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Total Price</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">£{selectedOrder.totalPrice.toFixed(2)}</p>
                            <Badge variant={selectedOrder.payment?.status === 'paid' ? 'green' : 'red'} className="mt-2">{selectedOrder.payment?.status.toUpperCase() || 'UNPAID'}</Badge>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
                         <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                               <UserIcon className="w-4 h-4 mr-2" /> Customer Information
                            </h4>
                            <div>
                               <p className="font-bold text-slate-900 text-lg">{selectedOrder.customer?.name}</p>
                               <p className="text-slate-600">{selectedOrder.customer?.email}</p>
                               <p className="text-slate-600 font-medium">{selectedOrder.customer?.phone}</p>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                               <MapPinIcon className="w-4 h-4 mr-2" /> Deployment Location
                            </h4>
                            <p className="text-slate-600 font-medium leading-relaxed">{selectedOrder.address}</p>
                         </div>
                      </div>

                      <div className="space-y-4 pt-10 border-t border-slate-100">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <ClipboardDocumentIcon className="w-4 h-4 mr-2" /> Execution Timeline
                         </h4>
                         <div className="space-y-4 pl-2 border-l-2 border-slate-100 ml-2">
                            {selectedOrder.timeline?.map((t, idx) => (
                              <div key={idx} className="relative pl-6">
                                 <div className="absolute left-[-9px] top-1.5 w-4 h-4 bg-white border-2 border-primary-500 rounded-full" />
                                 <p className="text-sm font-black text-slate-900 uppercase">{(t.status || 'Update').replace('_', ' ')}</p>
                                 <p className="text-xs text-slate-500 mt-1">{t.message}</p>
                                 <p className="text-[10px] text-slate-400 font-bold mt-1">{new Date(t.timestamp).toLocaleString()}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Sidebar - Control Panel */}
                   <div className="space-y-8 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <div className="space-y-4">
                         <h4 className="text-sm font-black text-slate-900 border-b pb-2">Status Control</h4>
                         <div className="space-y-2">
                            {['confirmed', 'technician_assigned', 'in_progress', 'completed', 'cancelled'].map(s => (
                              <button
                                key={s}
                                onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${selectedOrder.status === s ? 'bg-primary-600 text-white border-primary-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}
                              >
                                {s.replace('_', ' ').toUpperCase()}
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4 border-t pt-8">
                         <h4 className="text-sm font-black text-slate-900 border-b pb-2">Assigned Specialist</h4>
                         <div className="space-y-3">
                            <select 
                               className="input text-xs font-bold"
                               value={selectedOrder.worker?._id || ''}
                               onChange={(e) => handleAssignWorker(selectedOrder._id, e.target.value)}
                            >
                               <option value="">Choose Specialist</option>
                               {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                            </select>
                            {selectedOrder.worker && (
                              <div className="p-4 bg-white rounded-xl border border-slate-200">
                                 <p className="font-bold text-slate-900 text-sm">{selectedOrder.worker.name}</p>
                                 <p className="text-xs text-slate-500">{selectedOrder.worker.specialization}</p>
                              </div>
                            )}
                         </div>
                      </div>

                      <div className="bg-slate-900 p-6 rounded-2xl text-white">
                         <div className="flex items-center space-x-3 mb-4">
                            <CalendarDaysIcon className="w-6 h-6 text-primary-400" />
                            <p className="text-sm font-bold">Planned Service</p>
                         </div>
                         <p className="text-2xl font-black">{new Date(selectedOrder.serviceDate).toLocaleDateString()}</p>
                         <div className="flex items-center space-x-2 mt-2 font-bold text-slate-400">
                            <ClockIcon className="w-4 h-4" />
                            <span>{selectedOrder.serviceTime}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrdersPage;
