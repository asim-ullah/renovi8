import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Squares2X2Icon, TagIcon, 
  QueueListIcon, UsersIcon,
  ChatBubbleBottomCenterTextIcon, ChartBarIcon,
  Cog6ToothIcon, ArrowRightOnRectangleIcon,
  UserGroupIcon, BellIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { logout } from '../../store/slices/authSlice';
import api from '../../api/axios';
import { useEffect } from 'react';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      toast.success('Admin logged out');
      navigate('/login');
    } catch (err) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: Squares2X2Icon },
    { name: 'Products', path: '/admin/products', icon: TagIcon },
    { name: 'Categories', path: '/admin/categories', icon: QueueListIcon },
    { name: 'Orders', path: '/admin/orders', icon: Squares2X2Icon }, 
    { name: 'Workers', path: '/admin/workers', icon: UserGroupIcon },
    { name: 'Customers', path: '/admin/users', icon: UsersIcon },
    { name: 'Reviews', path: '/admin/reviews', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
  ];

  // Helper because ClipboardDocumentListIcon was missing in previous import if not careful
  const ClipboardIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m.75-12H6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 6 23.25h12a2.25 2.25 0 0 0 2.25-2.25V8.25A2.25 2.25 0 0 0 18 6h-3.75M15 1.5l3.75 3.75M3.75 6.75h1.5M3.75 8.25h1.5" /></svg>;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6">
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">Renovi8</span>
            <span className="text-[10px] font-bold bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded border border-primary-500/30">ADMIN</span>
          </NavLink>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {item.name === 'Orders' ? <ClipboardIcon className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all">
             <ArrowRightOnRectangleIcon className="w-5 h-5" />
             <span>Sign out</span>
           </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 rounded-tl-[2.5rem] mt-4 ml-4 overflow-hidden border-t border-l border-slate-200">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-6">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center space-x-3 border-l pl-6 border-slate-200 uppercase tracking-tighter">
               <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">A</div>
               <div>
                 <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                 <p className="text-[10px] font-bold text-slate-400">System Administrator</p>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
           {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
