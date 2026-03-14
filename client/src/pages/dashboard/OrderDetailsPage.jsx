import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  CalendarIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Card, Badge, Button } from '../../components/ui';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data.order);
      } catch (err) {
        toast.error('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleDownloadInvoice = () => {
    window.open(`${api.defaults.baseURL}/orders/${orderId}/invoice`, '_blank');
  };

  if (loading) return <div className="text-center py-20">Loading order info...</div>;

  const steps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'technician_assigned', label: 'Technician Assigned' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const currentStep = steps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/orders" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order #{order._id.toString().slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-slate-500">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {order.status === 'completed' && (
            <Link to={`/dashboard/orders/${orderId}/review`}>
              <Button variant="secondary">Leave Review</Button>
            </Link>
          )}
          <Button variant="outline" onClick={handleDownloadInvoice}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tracker */}
          <Card className="p-8">
            <h3 className="font-bold text-slate-900 mb-8">Service Status Tracker</h3>
            {isCancelled ? (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center">
                  <XMarkIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-rose-900 text-lg">Order Cancelled</p>
                  <p className="text-rose-600">{order.cancelReason || 'This order was cancelled.'}</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-[18px] left-[18px] bottom-[18px] w-0.5 bg-slate-100" />
                <div className="space-y-10">
                  {steps.map((step, idx) => {
                    const isActive = idx <= currentStep;
                    const isCompleted = idx < currentStep || order.status === 'completed';
                    return (
                      <div key={idx} className="relative flex items-center space-x-6">
                        <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-primary-600 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                          {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : isActive ? <ClockIcon className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <p className={`font-bold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                          <p className="text-xs text-slate-500">
                            {isActive ? order.timeline.find(t => t.status === step.key)?.message || 'Current stage' : 'Awaiting previous steps'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Details */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Service Details</h3>
            </div>
            <div className="p-6 flex space-x-6">
               <div className="w-24 h-24 bg-slate-100 rounded-xl shrink-0">
                  <img src={`${api.defaults.baseURL}${order.product?.images?.[0]}`} className="w-full h-full object-cover" alt="" />
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg">{order.product?.name}</h4>
                  <p className="text-sm text-slate-500 mt-1 uppercase font-bold tracking-widest">{order.serviceType.replace('+', ' & ').toUpperCase()}</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Unit Price</p>
                      <p className="font-black">£{order.productPrice.toFixed(2)}</p>
                    </div>
                    {order.installationCost > 0 && (
                      <div className="bg-slate-50 px-4 py-2 rounded-lg">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Installation</p>
                        <p className="font-black">£{order.installationCost.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="bg-primary-50 px-4 py-2 rounded-lg">
                      <p className="text-[10px] font-bold text-primary-400 uppercase">Total Paid</p>
                      <p className="font-black text-primary-600">£{order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
               </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center">
               <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
               Deployment Location
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">{order.address}</p>
            <div className="mt-6 pt-6 border-t border-slate-100">
               <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                 <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
                 Scheduled Time
               </h4>
               <p className="text-sm text-slate-600">
                 {new Date(order.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
               </p>
               <p className="text-lg font-black text-slate-900 mt-1">{order.serviceTime}</p>
            </div>
          </Card>

          {order.worker && (
            <Card className="p-6 bg-slate-900 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center">
                   <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                   Assigned Specialist
                 </h4>
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black text-lg">
                      {order.worker.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{order.worker.name}</p>
                      <p className="text-xs text-slate-400">{order.worker.specialization}</p>
                    </div>
                 </div>
                 <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all flex items-center justify-center">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 mr-2" />
                    Contact Specialist
                 </button>
               </div>
               <div className="absolute top-[-50%] left-[-50%] w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
            </Card>
          )}

          {order.notes && (
             <Card className="p-6">
               <h4 className="font-bold text-slate-900 text-sm mb-2">My Service Notes</h4>
               <p className="text-sm text-slate-500 italic">"{order.notes}"</p>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Help with missing XMarkIcon import in previous block if relevant
const XMarkIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;

export default OrderDetailsPage;
