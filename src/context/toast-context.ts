import { createContext } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastContextType {
  show: (message: string, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
