import { useRef, useState } from 'react';
import { BackupManager } from '@/services/storage/BackupManager';
import { useProjectStore } from '@/store/useProjectStore';
import { useTranslation } from '@/store/useLocaleStore';
import { useToastStore } from '@/store/useToastStore';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { db } from '@/services/storage/db';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshFromStorage } = useProjectStore();
  const { t } = useTranslation();
  const { showToast } = useToastStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleExport = async () => {
    try {
      await BackupManager.exportBackup();
      showToast((t as any)('messages.exportSuccess') || 'Backup exported successfully', 'success');
    } catch (error: any) {
      showToast(`Export failed: ${error.message}`, 'error');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        try {
          await BackupManager.importBackup(text);
          await refreshFromStorage();
          showToast((t as any)('messages.importSuccess') || 'Backup imported successfully', 'success');
        } catch (error: any) {
          showToast(error.message, 'error');
        }
      }
    };
    reader.onerror = () => {
      showToast('Failed to read the file.', 'error');
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleClearData = async () => {
    try {
      await db.projects.clear();
      await db.history.clear();
      await refreshFromStorage();
      setIsConfirmOpen(false);
      showToast((t as any)('messages.dataCleared') || 'All data cleared', 'success');
    } catch (error: any) {
      showToast(`Failed to clear data: ${error.message}`, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4">
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-background-surface border border-border-strong text-text-primary rounded-md font-medium hover:bg-background-base transition-colors flex-1"
        >
          {(t as any)('settings.data.export') || 'Export Backup'}
        </button>

        <button
          onClick={handleImportClick}
          className="px-6 py-2 bg-accent-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity flex-1"
        >
          {(t as any)('settings.data.import') || 'Import Backup'}
        </button>
        
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
      
      <div className="flex justify-center mt-2">
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="px-6 py-2 w-full bg-status-error/10 border border-status-error/30 text-status-error rounded-md font-medium hover:bg-status-error/20 transition-colors"
        >
          {(t as any)('settings.data.clear') || 'Clear All Data'}
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={(t as any)('settings.data.clear') || 'Clear All Data'}
        description={(t as any)('messages.clearWarning') || 'Are you sure you want to delete all saved projects and history?'}
        confirmText={(t as any)('common.delete') || 'Delete'}
        onConfirm={handleClearData}
        onCancel={() => setIsConfirmOpen(false)}
        isDanger
      />
    </div>
  );
}
