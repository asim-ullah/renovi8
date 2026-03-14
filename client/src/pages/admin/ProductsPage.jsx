import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  XMarkIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Button, Card, Input, Badge } from '../../components/ui';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    basePrice: '',
    installationCost: '',
    isFeatured: false,
    isActive: true,
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products/all'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data.categories);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        category: product.category?._id || '',
        description: product.description,
        basePrice: product.basePrice,
        installationCost: product.installationCost,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });
      setPreviewImages(product.images.map(img => `${api.defaults.baseURL}${img}`));
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        category: categories[0]?._id || '',
        description: '',
        basePrice: '',
        installationCost: '',
        isFeatured: false,
        isActive: true,
      });
      setPreviewImages([]);
    }
    setImages([]);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach(img => data.append('images', img));

    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, data);
        toast.success('Product updated');
      } else {
        await api.post('/products', data);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Product Management</h1>
          <p className="text-slate-500">Add and manage your service catalog products.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                      {p.images?.[0] ? (
                        <img src={`${api.defaults.baseURL}${p.images[0]}`} className="w-full h-full object-cover" alt="" />
                      ) : <ShoppingBagIcon className="w-6 h-6 text-slate-300" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      {p.isFeatured && <span className="text-[10px] font-bold text-primary-500 bg-primary-50 px-1 rounded uppercase">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{p.category?.name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">£{p.basePrice.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">Install: £{p.installationCost.toFixed(2)}</p>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={p.isActive ? 'green' : 'gray'}>{p.isActive ? 'ACTIVE' : 'INACTIVE'}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(p)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden">
               <div className="p-8 border-b flex items-center justify-between">
                 <h2 className="text-2xl font-black">{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Input label="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    <div className="space-y-1">
                       <label className="text-sm font-medium text-slate-700">Category</label>
                       <select className="input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <Input label="Base Price (£)" type="number" step="0.01" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} required />
                       <Input label="Install Cost (£)" type="number" step="0.01" value={formData.installationCost} onChange={(e) => setFormData({...formData, installationCost: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-medium text-slate-700">Description</label>
                       <textarea className="input min-h-[120px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                    </div>
                    <div className="flex items-center space-x-6">
                       <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="rounded text-primary-600" />
                          <span className="text-sm font-bold text-slate-700">Featured Product</span>
                       </label>
                       <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded text-primary-600" />
                          <span className="text-sm font-bold text-slate-700">Active</span>
                       </label>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Product Images</label>
                        <div className="grid grid-cols-3 gap-3">
                           {previewImages.map((src, idx) => (
                             <div key={idx} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                               <img src={src} className="w-full h-full object-cover" alt="" />
                             </div>
                           ))}
                           <label className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                              <PhotoIcon className="w-8 h-8 text-slate-300" />
                              <span className="text-xs font-bold text-slate-400 mt-2">Add Photo</span>
                              <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                           </label>
                        </div>
                     </div>
                     <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                        <h4 className="text-primary-900 font-bold mb-2">Pro Tip</h4>
                        <p className="text-sm text-primary-700 leading-relaxed">High-quality, bright photos from multiple angles will increase your conversion rates by up to 40%.</p>
                     </div>
                  </div>

                  <div className="md:col-span-2 pt-6 border-t flex justify-end">
                     <Button type="submit" className="px-12 py-3">
                        {selectedProduct ? 'Update Product' : 'Create Product'}
                     </Button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductsPage;
