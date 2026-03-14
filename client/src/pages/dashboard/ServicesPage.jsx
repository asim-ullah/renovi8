import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  ArrowRightIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';
import { Card, Button } from '../../components/ui';

const ServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)}
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Available Services</h1>
          <p className="text-slate-500 mt-1">Select a category to explore our premium home upgrade products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link to={`/dashboard/services/${cat._id}`}>
              <Card className="group relative h-full overflow-hidden p-6 hover:border-primary-300 transition-all cursor-pointer">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary-50 group-hover:bg-primary-600 group-hover:text-white text-primary-600 rounded-xl flex items-center justify-center mb-6 transition-all duration-300">
                    <TagIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 mb-2 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{cat.description || "Browse our high-quality selection."}</p>
                  
                  <div className="flex items-center text-sm font-bold text-primary-600">
                    View Products
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:ml-4 transition-all" />
                  </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-slate-50 rounded-full group-hover:bg-primary-50 group-hover:scale-110 transition-all duration-300" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
