'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: { bg: '#dcfce7', border: '#86efac', icon: '#16a34a', text: '#166534' },
    error: { bg: '#fee2e2', border: '#fca5a5', icon: '#dc2626', text: '#991b1b' },
    info: { bg: '#dbeafe', border: '#93c5fd', icon: '#2563eb', text: '#1e40af' },
    warning: { bg: '#fef3c7', border: '#fde047', icon: '#d97706', text: '#92400e' },
  };

  const Icon = icons[toast.type];
  const color = colors[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
      }}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: color.icon }} />
      <p className="flex-1 text-sm font-medium" style={{ color: color.text }}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
        style={{ color: color.icon }}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
