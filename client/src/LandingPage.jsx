import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, XMarkIcon, 
  LightBulbIcon, WrenchScrewdriverIcon, 
  ShieldCheckIcon, ShoppingBagIcon,
  HomeIcon, BoltIcon, FireIcon, KeyIcon
} from '@heroicons/react/24/outline';
import { Button } from './components/ui';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: 'Light Replacement', icon: LightBulbIcon, category: 'Electrical' },
    { name: 'Sink & Tap Installation', icon: WrenchScrewdriverIcon, category: 'Plumbing' },
    { name: 'Shower Upgrades', icon: FireIcon, category: 'Plumbing' },
    { name: 'Electrical Sockets', icon: BoltIcon, category: 'Electrical' },
    { name: 'Door & Lock Security', icon: KeyIcon, category: 'Security' },
    { name: 'Full Renovation', icon: HomeIcon, category: 'General' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Renovi8</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Services</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">How it Works</a>
            {isAuthenticated ? (
              <Button onClick={() => window.location.href = user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-semibold text-slate-900">Sign in</Link>
                <Link to="/register"><Button>Get Started</Button></Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50 to-white -z-10" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest uppercase text-primary-600 bg-primary-50 rounded-full">
              Innovative Home Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
              Smart Home Upgrades <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-500">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Professional installation and premium products for your home. From smart lighting to full kitchen tap replacements, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto px-10 py-4 text-lg">Book a Service</Button>
              </Link>
              <a href="#services">
                <Button variant="secondary" className="w-full sm:w-auto px-10 py-4 text-lg">Browse Catalog</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Services</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Expert solutions for every corner of your home, delivered by professionals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{item.category}</span>
                <h3 className="text-xl font-bold mt-2 text-slate-900">{item.name}</h3>
                <p className="mt-3 text-slate-500 leading-relaxed">Premium products paired with expert installation. Reliable, fast, and guaranteed quality.</p>
                <Link to="/register" className="inline-flex items-center mt-6 text-sm font-bold text-primary-600 hover:text-primary-700">
                  Book now <Bars3Icon className="w-4 h-4 ml-1 rotate-180" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">
                Quality You Can Trust, <br />
                Innovation You Can See
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Vetted Professionals', desc: 'All technicians are strictly managed and verified.' },
                  { title: 'Seamless Booking', desc: 'Book in minutes with our transparent pricing model.' },
                  { title: 'Premium Products', desc: 'We only use top-tier hardware for your home upgrades.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <ShieldCheckIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="aspect-square bg-gradient-to-br from-primary-600 to-violet-500 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center text-white">
                 <div className="text-center p-12">
                   <ShoppingBagIcon className="w-32 h-32 mx-auto mb-8 opacity-20" />
                   <p className="text-4xl font-black mb-4">500+</p>
                   <p className="text-lg opacity-80">Successful Home Upgrades Completed</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-white text-primary-600 rounded-xl flex items-center justify-center">
                  <span className="font-black text-xl">R</span>
                </div>
                <span className="text-2xl font-black tracking-tight">Renovi8</span>
              </Link>
              <p className="text-slate-400 max-w-xs leading-relaxed">
                Smart home upgrades made simple. Professional installation services at your doorstep.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/register">Lighting</Link></li>
                <li><Link to="/register">Plumbing</Link></li>
                <li><Link to="/register">Security</Link></li>
                <li><Link to="/register">Electrical</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-xs">
            © 2026 Renovi8 Platform. Built for Excellence.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
