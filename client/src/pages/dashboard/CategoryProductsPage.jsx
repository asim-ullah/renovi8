import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ShoppingBagIcon,
  StarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';
import { Button, Card, Badge } from '../../components/ui';

const CategoryProductsPage = () => {
  const { catId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products?category=${catId}`);
        setProducts(data.products);
        if (data.products.length > 0) setCategory(data.products[0].category);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [catId]);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />)}
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link to="/dashboard/services" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{category?.name || 'Products'}</h1>
          <p className="text-slate-500 mt-1">Premium upgrades available in this category.</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/dashboard/products/${product._id}`}>
                <Card className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all h-full flex flex-col">
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {product.images?.[0] ? (
                      <img 
                        src={`${api.defaults.baseURL}${product.images[0]}`} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingBagIcon className="w-16 h-16" />
                      </div>
                    )}
                    {product.isFeatured && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="blue">Featured</Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">{product.name}</h3>
                    <div className="flex items-center space-x-1 mb-4">
                      {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                      <span className="text-xs text-slate-400 ml-1">(12 reviews)</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Starting from</p>
                        <p className="text-xl font-black text-slate-900">£{product.basePrice.toFixed(2)}</p>
                      </div>
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRightIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
           <ShoppingBagIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-900">No products found</h3>
           <p className="text-slate-500 mt-2">Check back soon for new upgrades in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
