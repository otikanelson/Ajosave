import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
};

const STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_COLORS = {
  success: 'text-green-500',
  error:   'text-red-500',
  warning: 'text-yellow-500',
  info:    'text-blue-500',
};

const ToastItem = ({ id, type = 'info', message, onRemove }) => {
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 5000);
    return () => clearTimeout(t);
  }, [id, onRemove]);

  const Icon = ICONS[type] || Info;

  return (
    <div className={`flex items-start gap-3 border rounded-lg px-4 py-3 shadow-lg w-80 pointer-events-auto ${STYLES[type]}`}
      style={{ animation: 'slideIn 0.2s ease-out' }}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${ICON_COLORS[type]}`} />
      <p className="text-sm flex-1 leading-snug">{message}</p>
      <button onClick={() => onRemove(id)} className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
  }, []);

  // Stable object with typed helpers
  const api = useRef({
    show,
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error'),
    warning: (msg) => show(msg, 'warning'),
    info:    (msg) => show(msg, 'info'),
  });

  // Keep helpers pointing to latest show
  useEffect(() => {
    api.current.show    = show;
    api.current.success = (msg) => show(msg, 'success');
    api.current.error   = (msg) => show(msg, 'error');
    api.current.warning = (msg) => show(msg, 'warning');
    api.current.info    = (msg) => show(msg, 'info');
  }, [show]);

  return (
    <ToastContext.Provider value={api.current}>
      {children}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(100%); } to { opacity:1; transform:translateX(0); } }`}</style>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
