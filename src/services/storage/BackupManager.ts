import { db } from './db';
import { projectService } from './projectService';
import { BackupSchema, type BackupData } from './schemaValidation';

export const BackupManager = {
  async exportBackup(): Promise<void> {
    const projects = await projectService.getAllProjects();
    const history = await db.history.toArray(); // we can query directly from db here as we own the abstraction layer

    const backupData: BackupData = {
      app: 'ControlLab',
      backupVersion: 1,
      createdAt: Date.now(),
      projects,
      history
    };

    const json = JSON.stringify(backupData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `controllab_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  async importBackup(jsonString: string): Promise<void> {
    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Invalid JSON format.');
    }

    try {
      const validData = BackupSchema.parse(parsedData);
      
      // Perform an atomic bulk transaction
      await db.transaction('rw', db.projects, db.history, async () => {
        if (validData.projects.length > 0) {
          await db.projects.bulkPut(validData.projects);
        }
        if (validData.history.length > 0) {
          await db.history.bulkPut(validData.history);
        }
      });
    } catch (error: any) {
      console.error('[BackupManager] Schema validation failed:', error);
      throw new Error(`Import failed: ${error.message || 'Data validation failed'}`);
    }
  }
};
