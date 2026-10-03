import { Button } from './Button';
import { useTranslation } from '@/store/useLocaleStore';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-bg-surface-elevated border border-border-subtle rounded-xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
        <p className="text-text-primary text-base mb-6 font-medium">{message}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="ghost">{(t as any)('common.cancel')}</Button>
          <Button onClick={onConfirm} variant="danger">{(t as any)('common.delete')}</Button>
        </div>
      </div>
    </div>
  );
}
