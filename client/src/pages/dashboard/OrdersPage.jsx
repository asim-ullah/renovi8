import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardDocumentIcon, 
  MapPinIcon, 
  CalendarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';
import { Card, Badge, Button } from '../../components/ui';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusColors = {
    pending: 'yellow',
    confirmed: 'blue',
    technician_assigned: 'purple',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'red',
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 bg-slate-200 rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage your service bookings.</p>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/dashboard/orders/${order._id}`}>
                <Card className="p-0 overflow-hidden hover:border-primary-400 group transition-all">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 aspect-square bg-slate-50 shrink-0">
                      {order.product?.images?.[0] ? (
                        <img src={`${api.defaults.baseURL}${order.product.images[0]}`} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ClipboardDocumentIcon className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">#{order._id.toString().slice(-8).toUpperCase()}</span>
                            <Badge variant={statusColors[order.status]}>{order.status.replace('_', ' ').toUpperCase()}</Badge>
                            {order.payment?.status === 'paid' && <Badge variant="green">PAID</Badge>}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{order.product?.name}</h3>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-2xl font-black text-slate-900">£{order.totalPrice.toFixed(2)}</p>
                          <p className="text-xs text-slate-500">{order.serviceType === 'product+installation' ? 'Product + Installation' : 'Product Only'}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-6 border-t border-slate-100 pt-6">
                        <div className="flex items-center text-sm text-slate-500">
                          <MapPinIcon className="w-5 h-5 mr-2 text-slate-400" />
                          <span className="truncate max-w-[200px]">{order.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <CalendarIcon className="w-5 h-5 mr-2 text-slate-400" />
                          <span>{new Date(order.serviceDate).toLocaleDateString()} at {order.serviceTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 w-full md:w-16 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 group-hover:bg-primary-50 transition-colors">
                      <ChevronRightIcon className="w-6 h-6 text-slate-400 group-hover:text-primary-600" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
           <ClipboardDocumentIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-900">No matching orders</h3>
           <p className="text-slate-500 mt-2">Browse our services to make your first upgrade.</p>
           <Link to="/dashboard/services" className="mt-6 inline-block">
             <Button>Explore Services</Button>
           </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
