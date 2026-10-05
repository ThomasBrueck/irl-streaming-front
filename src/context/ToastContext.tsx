import { useCallback, useRef, useState, type ReactNode } from "react";
import { ToastContext, type ToastVariant } from "./toast-context";
import Icon, { type IconName } from "../components/ui/Icon";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const ICON_COLOR: Record<ToastVariant, string> = {
  success: "text-cat-gaming",
  error: "text-[#ff8a9a]",
  info: "text-[#b9a4ff]",
};

const ICON: Record<ToastVariant, IconName> = {
  success: "check",
  error: "warning",
  info: "dot",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className="pointer-events-auto flex cursor-pointer items-start gap-2.5 rounded-2xl bg-ink px-4 py-3 text-[15px] text-paper shadow-[0_20px_40px_-20px_rgba(12,10,20,.6)] [animation:auth-rise_.4s_cubic-bezier(.16,1,.3,1)_both]"
          >
            <Icon name={ICON[t.variant]} size={16} strokeWidth={2} className={`mt-0.5 shrink-0 ${ICON_COLOR[t.variant]}`} />
            <span className="leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
