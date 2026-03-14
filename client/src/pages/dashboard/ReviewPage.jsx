import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Button, Card, Badge } from '../../components/ui';

const ReviewPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data.order);
      } catch (err) {
        toast.error('Order not found');
        navigate('/dashboard/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        orderId,
        productId: order.product?._id,
        rating,
        comment
      });
      toast.success('Thank you for your feedback!');
      navigate(`/dashboard/orders/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link to={`/dashboard/orders/${orderId}`} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Share Your Experience</h1>
      </div>

      <Card className="p-8">
        <div className="flex items-center space-x-4 mb-8">
           <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden">
              <img src={`${api.defaults.baseURL}${order.product?.images?.[0]}`} className="w-full h-full object-cover" alt="" />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reviewing Service</p>
              <h3 className="text-lg font-bold text-slate-900">{order.product?.name}</h3>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="text-center">
              <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-tighter">How would you rate our service?</p>
              <div className="flex justify-center space-x-2">
                 {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-all transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                       <StarIcon className="w-12 h-12" />
                    </button>
                 ))}
              </div>
              <p className="mt-2 text-sm font-black text-slate-900">
                 {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Disappointing'}
              </p>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                 <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2 text-primary-600" />
                 Additional Comments
              </label>
              <textarea 
                className="input min-h-[150px] resize-none" 
                placeholder="What did you like about the installation? Any tips for other customers?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
           </div>

           <Button type="submit" disabled={submitting} className="w-full py-4 text-lg">
              {submitting ? 'Submitting Feedback...' : 'Post Review'}
           </Button>
        </form>
      </Card>
    </div>
  );
};

export default ReviewPage;
