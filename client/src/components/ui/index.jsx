import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`btn ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input className={`input ${error ? 'border-rose-500 focus:ring-rose-500' : ''} ${className}`} {...props} />
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);

export const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    gray: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-rose-100 text-rose-700',
    purple: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);
