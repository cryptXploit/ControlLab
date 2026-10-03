import { db, type Project, type LabType } from './db';

export const projectService = {
  async createProject(
    name: string,
    labType: LabType,
    parameters: Record<string, number>,
    notes?: string
  ): Promise<Project> {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      labType,
      parameters,
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.projects.add(newProject);
    return newProject;
  },

  async getProject(id: string): Promise<Project | undefined> {
    return await db.projects.get(id);
  },

  async getAllProjects(): Promise<Project[]> {
    return await db.projects.orderBy('createdAt').reverse().toArray();
  },

  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<number> {
    return await db.projects.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async deleteProject(id: string): Promise<void> {
    await db.projects.delete(id);
  },

  async clearAllData(): Promise<void> {
    await Promise.all([
      db.projects.clear(),
      db.history.clear()
    ]);
  }
};
