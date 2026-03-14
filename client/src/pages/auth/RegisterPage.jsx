import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { setCredentials } from '../../store/slices/authSlice';
import { Button, Input, Card } from '../../components/ui';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      dispatch(setCredentials(data));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100/50 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-2xl font-black text-slate-900">Renovi8</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-2">Join Renovi8 and start upgrading your home today</p>
        </div>

        <Card className="p-8 shadow-xl border-none glass">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+44 123 456 7890"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="md:col-span-2">
              <Input
                label="Home Address"
                placeholder="123 Street, City, ZIP"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading} className="w-full py-3 text-base mt-2">
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-slate-600 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Sign in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
