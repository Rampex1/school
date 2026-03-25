"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        success:
          "border-green-500/30 bg-green-500/10 text-green-500 dark:border-green-500/20 dark:bg-green-500/5",
        error:
          "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/20 dark:bg-destructive/5",
        info: "border-primary/30 bg-primary/10 text-primary dark:border-primary/20 dark:bg-primary/5",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "success" | "error" | "info";
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

let toastCount = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = String(++toastCount);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = "ToastProvider";

interface ToastViewportProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastViewport({ toasts, onRemove }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-[420px] flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps extends VariantProps<typeof toastVariants> {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <div
      className={cn(
        toastVariants({ variant: toast.variant }),
        "animate-in slide-in-from-right-full"
      )}
      role="alert"
    >
      <div className="flex-1">
        {toast.title && (
          <div className="text-sm font-semibold">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:opacity-70"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}

export { toastVariants };
