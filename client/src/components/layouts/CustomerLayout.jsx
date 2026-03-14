import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, ShoppingBagIcon, 
  ClipboardDocumentListIcon, UserCircleIcon,
  Cog6ToothIcon, ArrowRightOnRectangleIcon,
  BellIcon, ChevronDownIcon,
  Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { logout } from '../../store/slices/authSlice';
import api from '../../api/axios';

import { useEffect } from 'react';

const CustomerLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Browse Services', path: '/dashboard/services', icon: ShoppingBagIcon },
    { name: 'My Orders', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
    { name: 'Profile', path: '/dashboard/profile', icon: UserCircleIcon },
    { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <NavLink to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">Renovi8</span>
            </NavLink>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 lg:hidden mr-2">
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
               {/* Breadcrumbs can go here */}
               <h2 className="text-sm font-semibold text-slate-600">
                 {navItems.find(i => location.pathname === i.path)?.name || 'Order Details'}
               </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-1 rounded-full hover:bg-slate-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 border border-primary-200 overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={`${api.defaults.baseURL}${user.profilePicture}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold text-sm">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="hidden md:block text-sm font-bold text-slate-700">{user?.name}</span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard/profile" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <UserCircleIcon className="w-5 h-5 text-slate-400" />
                        <span>Profile Settings</span>
                      </Link>
                      <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 w-full text-left">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
