"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "error" | "success" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface PapyrusToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const PapyrusToast: React.FC<PapyrusToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const typeStyles = {
    error: "bg-red-50 border-red-600 text-red-900",
    success: "bg-green-50 border-green-600 text-green-900",
    warning: "bg-yellow-50 border-yellow-600 text-yellow-900",
    info: "bg-blue-50 border-blue-600 text-blue-900",
  };

  const iconPaths = {
    error: "M6 18L18 6M6 6l12 12",
    success: "M5 13l4 4L19 7",
    warning:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border-2 papyrus-shadow mb-3 papyrus-texture-overlay",
        "transition-all duration-300 font-body",
        typeStyles[toast.type],
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      )}
    >
      <svg
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconPaths[toast.type]}
        />
      </svg>
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default PapyrusToast;
