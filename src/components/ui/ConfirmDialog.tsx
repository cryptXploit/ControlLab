import { Button } from './Button';
import { useTranslation } from '@/store/useLocaleStore';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  description?: string;
  confirmText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ 
  isOpen, 
  title,
  message, 
  description,
  confirmText,
  isDanger,
  onConfirm, 
  onCancel 
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-bg-surface-elevated border border-border-subtle rounded-xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
        {title && <h3 className="text-text-primary text-lg font-bold mb-2">{title}</h3>}
        <p className="text-text-primary text-base mb-6 font-medium">{description || message}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="ghost">{(t as any)('common.cancel')}</Button>
          <Button onClick={onConfirm} variant={isDanger ? "danger" : "primary"}>{confirmText || (t as any)('common.delete')}</Button>
        </div>
      </div>
    </div>
  );
}
