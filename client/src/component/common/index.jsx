import { motion } from 'framer-motion';


// ── Button ──────────────────────────────────────────────────────────────────
export const Button = ({ children, variant = 'primary', loading = false, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm';
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500/10',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-700',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
};

// ── Input ────────────────────────────────────────────────────────────────────
import React, { forwardRef } from "react";

export const Input = forwardRef(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      <input
        ref={ref}
        className={`input-field ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : ""
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
);

Input.displayName = "Input";

// ── Textarea ─────────────────────────────────────────────────────────────────


export const Textarea = forwardRef(
  ({ label, error, className = "", rows = 4, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        className={`input-field resize-none ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);

Textarea.displayName = "Textarea";
// ── Select ────────────────────────────────────────────────────────────────────
export const Select = forwardRef(
  ({ label, error, options = [], className = "", ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      <select
        ref={ref}
        className={`input-field ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  return (
    <div className={`${sizes[size]} border-primary-500 border-t-transparent rounded-full animate-spin ${className}`} />
  );
};

export const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

// ── EmptyState ────────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    {icon && <div className="text-5xl mb-4">{icon}</div>}
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    {description && <p className="text-slate-400 text-sm mb-6 max-w-sm">{description}</p>}
    {action}
  </div>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`bg-slate-700/60 rounded-lg animate-pulse ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <div className="flex gap-2">
      <Skeleton className="h-7 w-16 rounded-full" />
      <Skeleton className="h-7 w-16 rounded-full" />
    </div>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full ${maxWidth} card p-6 shadow-2xl`}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
        )}
        {children}
      </motion.div>
    </div>
  );
};

// ── StarRating ────────────────────────────────────────────────────────────────
export const StarRating = ({ rating, size = 'sm', interactive = false, onRate }) => {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  return (
    <div className={`flex gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            star <= rating ? 'text-yellow-400' : 'text-slate-600'
          }`}
        >★</span>
      ))}
    </div>
  );
};

// ── Badge ─────────────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    pending: 'badge-yellow',
    accepted: 'badge-blue',
    ongoing: 'badge-blue',
    completed: 'badge-green',
    rejected: 'badge-red',
    cancelled: 'badge-red',
    open: 'badge-blue',
    matched: 'badge-purple',
    resolved: 'badge-green',
  };
  return <span className={map[status] || 'badge-blue'}>{status}</span>;
};