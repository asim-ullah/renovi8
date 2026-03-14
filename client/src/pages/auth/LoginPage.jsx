import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { setCredentials } from '../../store/slices/authSlice';
import { Button, Input, Card } from '../../components/ui';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      dispatch(setCredentials(data));
      toast.success('Welcome back!');
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/50 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-2xl font-black text-slate-900">Renovi8</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your home upgrades</p>
        </div>

        <Card className="p-8 shadow-xl border-none glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-primary-600 mr-2" />
                Remember me
              </label>
              <Link to="/forgot-password" async className="font-semibold text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-slate-600 mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
            Start for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
