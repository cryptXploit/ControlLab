import { useRef } from 'react';
import { BackupManager } from '@/services/storage/BackupManager';
import { useProjectStore } from '@/store/useProjectStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshFromStorage } = useProjectStore();
  const { setTheme } = useThemeStore();

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
    <div className="bg-background-elevated border border-border-subtle p-8 rounded-xl shadow-lg max-w-2xl w-full text-center mt-8">
      <h2 className="text-xl font-semibold mb-2">Data Management</h2>
      <p className="text-text-secondary mb-6">Phase P0.7: Backup & Import Foundation (100% Offline)</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-background-surface border border-border-strong text-text-primary rounded-md font-medium hover:bg-background-base transition-colors"
        >
          Export Backup (.json)
        </button>

        <button
          onClick={handleImportClick}
          className="px-6 py-2 bg-accent-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Import Backup
        </button>
        
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
      
      <div className="border-t border-border-subtle mt-8 pt-6">
        <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wide">Theme Tester</h3>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setTheme('light')}
            className="px-4 py-1.5 rounded border border-border-strong text-text-primary hover:bg-background-base text-sm"
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className="px-4 py-1.5 rounded border border-border-strong text-text-primary hover:bg-background-base text-sm"
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}
