import { useState } from 'react';
import { Button } from './Button';
import { useTranslation } from '@/store/useLocaleStore';

interface SaveDialogProps {
  isOpen: boolean;
  defaultName?: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function SaveDialog({ isOpen, defaultName = '', onSave, onCancel }: SaveDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(defaultName);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div className="bg-background-elevated border border-border-subtle rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{(t as any)('projects.save.title')}</h3>
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={(t as any)('projects.save.placeholder')}
          className="w-full px-3 py-2 mb-6 bg-background-surface border border-border-strong rounded-md focus:outline-none focus:border-accent-primary text-text-primary placeholder:text-text-muted"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="ghost">{(t as any)('common.cancel')}</Button>
          <Button disabled={!name.trim()} onClick={handleSave} variant="primary">{(t as any)('projects.save.action')}</Button>
        </div>
      </div>
    </div>
  );
}
