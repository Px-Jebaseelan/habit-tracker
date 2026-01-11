'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
}

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (props: ToastProps) => {
    const id = `toast-${toastId++}`;
    setToasts((prev) => [...prev, { ...props, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, props.duration || 3000);
  };

  return { toasts, showToast };
};

export default function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
