import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
  ClipboardDocumentCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';
import { Card, Badge } from '../../components/ui';

const DashboardHome = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, upcoming: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/orders');
        const orders = data.orders;
        setRecentOrders(orders.slice(0, 5));
        setStats({
          total: orders.length,
          completed: orders.filter(o => o.status === 'completed').length,
          pending: orders.filter(o => o.status === 'pending').length,
          upcoming: orders.filter(o => ['confirmed', 'technician_assigned', 'in_progress'].includes(o.status)).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Orders', value: stats.total, icon: ListBulletIcon, color: 'bg-primary-50 text-primary-600' },
    { title: 'Completed', value: stats.completed, icon: CheckCircleIcon, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'In Progress', value: stats.upcoming, icon: ClockIcon, color: 'bg-amber-50 text-amber-600' },
    { title: 'Pending', value: stats.pending, icon: ClipboardDocumentCheckIcon, color: 'bg-rose-50 text-rose-600' },
  ];

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Hi, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your home upgrade services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <button className="text-sm font-bold text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Card key={order._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center p-2">
                      {order.product?.images?.[0] ? (
                        <img src={`${api.defaults.baseURL}${order.product.images[0]}`} alt="" className="w-full h-full object-contain" />
                      ) : (
                         <ListBulletIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{order.product?.name}</h4>
                      <p className="text-xs text-slate-500">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={order.status === 'completed' ? 'green' : order.status === 'cancelled' ? 'red' : 'blue'}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <p className="text-sm font-bold text-slate-900 mt-1">£{order.totalPrice.toFixed(2)}</p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400">No orders yet. Start your first upgrade!</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 bg-gradient-to-br from-primary-600 to-violet-600 text-white h-full relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-primary-100 text-sm mb-6 leading-relaxed">Our support team is available 24/7 to help you with your home upgrades and service bookings.</p>
              <button className="w-full py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-colors">Contact Support</button>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
