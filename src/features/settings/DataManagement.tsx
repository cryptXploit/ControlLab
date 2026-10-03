import { useRef } from 'react';
import { BackupManager } from '@/services/storage/BackupManager';
import { useProjectStore } from '@/store/useProjectStore';
import { useTranslation } from '@/store/useLocaleStore';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshFromStorage } = useProjectStore();
  const { t } = useTranslation();

  const handleExport = async () => {
    try {
      await BackupManager.exportBackup();
      // Optional: alert('Backup exported successfully.');
    } catch (error: any) {
      alert(`Export failed: ${error.message}`);
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
          alert('Backup imported successfully! Your labs are restored.');
        } catch (error: any) {
          alert(error.message);
        }
      }
    };
    reader.onerror = () => {
      alert('Failed to read the file.');
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4">
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-bg-surface border border-border-strong text-text-primary rounded-md font-medium hover:bg-bg-base transition-colors flex-1"
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
    </div>
  );
}
