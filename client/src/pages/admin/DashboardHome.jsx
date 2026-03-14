import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyPoundIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentCheckIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import api from '../../api/axios';
import { Card } from '../../components/ui';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, totalUsers: 0 });
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, chartRes, productsRes] = await Promise.all([
          api.get('/analytics/stats'),
          api.get('/analytics/revenue-chart'),
          api.get('/analytics/top-products')
        ]);
        setStats(statsRes.data.stats);
        setChartData(chartRes.data.chartData);
        setTopProducts(productsRes.data.topProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `£${stats.totalRevenue.toLocaleString()}`, icon: CurrencyPoundIcon, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBagIcon, color: 'text-primary-500 bg-primary-500/10' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: ClipboardDocumentCheckIcon, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Total Customers', value: stats.totalUsers, icon: UsersIcon, color: 'text-violet-500 bg-violet-500/10' },
  ];

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Loading analytics...</div>;

  return (
    <div className="space-y-10">
      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 border-none shadow-sm h-full flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-8 border-none shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Revenue Overview</h3>
              <p className="text-sm text-slate-500">Monthly revenue trends for the past 12 months.</p>
            </div>
            <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
               LAST 12 MONTHS
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} tickFormatter={(val) => `£${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  formatter={(val) => [`£${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-8 border-none shadow-sm h-full">
          <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Most Ordered Services</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={24}>
                   {topProducts.map((entry, index) => (
                     <Cell key={index} fill={['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][index % 5]} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
