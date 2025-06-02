import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Global state for toasts
let toasts: ToastProps[] = [];
let listeners: ((toasts: ToastProps[]) => void)[] = [];

// Toast management functions
export const toast = {
  show: (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };
    toasts = [...toasts, newToast];
    listeners.forEach(listener => listener(toasts));
    
    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    
    return id;
  },
  success: (message: string, duration?: number) => toast.show(message, 'success', duration),
  error: (message: string, duration?: number) => toast.show(message, 'error', duration),
  warning: (message: string, duration?: number) => toast.show(message, 'warning', duration),
  info: (message: string, duration?: number) => toast.show(message, 'info', duration),
  dismiss: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(toasts));
  },
  clear: () => {
    toasts = [];
    listeners.forEach(listener => listener(toasts));
  }
};

export const Toaster: React.FC = () => {
  const [currentToasts, setCurrentToasts] = useState<ToastProps[]>(toasts);
  
  useEffect(() => {
    const listener = (updatedToasts: ToastProps[]) => {
      setCurrentToasts([...updatedToasts]);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-white" />;
      case 'error':
        return <X className="h-5 w-5 text-white" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-white" />;
      case 'info':
        return <Info className="h-5 w-5 text-white" />;
    }
  };
  
  const getBackgroundColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-success-500';
      case 'error':
        return 'bg-error-500';
      case 'warning':
        return 'bg-warning-500';
      case 'info':
        return 'bg-primary-500';
    }
  };
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end space-y-2 max-w-sm">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center w-full p-3 rounded-lg shadow-md text-white animate-slide-up ${getBackgroundColor(t.type)}`}
        >
          <div className="mr-3">{getIcon(t.type)}</div>
          <div className="flex-1">{t.message}</div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-3 p-1 rounded-full hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};