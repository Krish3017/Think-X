import { useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

function notify() {
  listeners.forEach((listener) => listener(toasts));
}

export function toast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).substring(7);
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 3000);
}

export function useToast() {
  const [state, setState] = useState<Toast[]>(toasts);

  useState(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  });

  return state;
}
