import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon, 
  QueueListIcon, TagIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Button, Card, Input } from '../../components/ui';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setSelectedCategory(cat);
      setFormData({ name: cat.name, description: cat.description || '' });
    } else {
      setSelectedCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory._id}`, formData);
        toast.success('Category updated');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Associated products may be affected.')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Service Categories</h1>
          <p className="text-slate-500">Group your products into logical service areas.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-6 h-full flex flex-col group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                  <TagIcon className="w-6 h-6" />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpenModal(cat)} className="p-2 text-slate-400 hover:text-primary-600 rounded-lg">
                     <PencilIcon className="w-5 h-5" />
                   </button>
                   <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg">
                     <TrashIcon className="w-5 h-5" />
                   </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
              <p className="text-sm text-slate-500 mt-2 flex-1">{cat.description || "No description provided."}</p>
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                 <span>{cat.productCount || 0} Products</span>
                 <span>ID: {cat._id.toString().slice(-4)}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                   <h2 className="text-xl font-bold">{selectedCategory ? 'Edit Category' : 'New Category'}</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><XMarkIcon className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                   <Input label="Category Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Electrical Services" required />
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Description</label>
                      <textarea className="input min-h-[100px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Briefly describe what this category covers..." />
                   </div>
                   <Button type="submit" className="w-full py-3">
                      {selectedCategory ? 'Save Changes' : 'Create Category'}
                   </Button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategoriesPage;
