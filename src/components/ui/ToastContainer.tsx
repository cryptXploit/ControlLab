import { useToastStore } from '@/store/useToastStore';

export function ToastContainer() {
  const { toasts } = useToastStore();
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pointer-events-auto flex items-center justify-between px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-status-success text-white' : 
          toast.type === 'error' ? 'bg-status-error text-white' : 
          'bg-bg-surface-elevated text-text-primary border border-border-strong'
        }`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
