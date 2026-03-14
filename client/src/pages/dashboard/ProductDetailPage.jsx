import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  WrenchIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Button, Card, Input, Badge } from '../../components/ui';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Selection state
  const [serviceType, setServiceType] = useState('product+installation');
  const [address, setAddress] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data.product);
        setAddress(JSON.parse(localStorage.getItem('user'))?.address || '');
      } catch (err) {
        toast.error('Product not found');
        navigate('/dashboard/services');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const handleOrder = async () => {
    if (!serviceDate || !serviceTime) {
      toast.error('Please select preferred date and time');
      return;
    }
    
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        productId,
        serviceType,
        serviceDate,
        serviceTime,
        notes,
        address
      });
      
      toast.success('Service requested! Redirecting to checkout...');
      
      // Initiate Stripe payment
      const { data: payData } = await api.post('/payments/create-checkout-session', {
        orderId: data.order._id
      });
      
      window.location.href = payData.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading product...</div>;

  const total = serviceType === 'product+installation' 
    ? product.basePrice + product.installationCost 
    : product.basePrice;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link to={`/dashboard/services/${product.category?._id}`} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="text-sm font-medium text-slate-400">
          Services / {product.category?.name} / {product.name}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
          >
            {product.images?.[selectedImage] ? (
              <img 
                src={`${api.defaults.baseURL}${product.images[selectedImage]}`} 
                alt="" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ShoppingBagIcon className="w-32 h-32" />
              </div>
            )}
          </motion.div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent hover:border-slate-200'}`}
              >
                <img src={`${api.defaults.baseURL}${img}`} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details & Config */}
        <div className="space-y-8">
          <div>
            <Badge variant="blue">{product.category?.name}</Badge>
            <h1 className="text-4xl font-black text-slate-900 mt-4 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-amber-400">
                {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-5 h-5" />)}
              </div>
              <span className="text-sm font-semibold text-slate-500">4.9 (128 Customer Reviews)</span>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button
               onClick={() => setServiceType('product+installation')}
               className={`p-4 rounded-2xl border-2 text-left transition-all ${serviceType === 'product+installation' ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
             >
               <WrenchIcon className={`w-8 h-8 mb-2 ${serviceType === 'product+installation' ? 'text-primary-600' : 'text-slate-400'}`} />
               <p className="font-bold text-slate-900">Product + Expert Installation</p>
               <p className={`text-sm ${serviceType === 'product+installation' ? 'text-primary-700' : 'text-slate-500'}`}>Full service guarantee.</p>
             </button>
             <button
               onClick={() => setServiceType('product')}
               className={`p-4 rounded-2xl border-2 text-left transition-all ${serviceType === 'product' ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
             >
               <ShoppingBagIcon className={`w-8 h-8 mb-2 ${serviceType === 'product' ? 'text-primary-600' : 'text-slate-400'}`} />
               <p className="font-bold text-slate-900">Product Only</p>
               <p className={`text-sm ${serviceType === 'product' ? 'text-primary-700' : 'text-slate-500'}`}>Fast delivery to your door.</p>
             </button>
          </div>

          <Card className="p-6 space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2 text-primary-600" />
              Service Appointment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="date" 
                label="Preferred Date" 
                min={new Date().toISOString().split('T')[0]}
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
              <Input 
                type="time" 
                label="Preferred Time" 
                value={serviceTime}
                onChange={(e) => setServiceTime(e.target.value)}
              />
            </div>
            <Input 
              label="Service Address" 
              placeholder="Where should we come?"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Special Notes</label>
              <textarea 
                className="input min-h-[100px]" 
                placeholder="Any gate codes or specific instructions?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </Card>

          <div className="border-t border-slate-200 pt-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-500 font-medium">Total Price</p>
                <p className="text-4xl font-black text-slate-900">£{total.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 line-through">£{(total * 1.2).toFixed(2)}</p>
                <p className="text-green-600 text-sm font-bold">You save 20% today</p>
              </div>
            </div>
            <Button 
              onClick={handleOrder} 
              disabled={submitting} 
              className="w-full py-5 text-xl shadow-xl shadow-primary-200"
            >
              {submitting ? 'Preparing Checkout...' : 'Confirm & Pay Securely'}
            </Button>
            <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center">
               <ShieldCheckIcon className="w-4 h-4 mr-1" />
               Secure SSL Encrypted Payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
