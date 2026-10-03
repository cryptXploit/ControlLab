import { create } from 'zustand';
import type { Project, LabType } from '@/services/storage/db';
import { projectService } from '@/services/storage/projectService';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  loadProjects: () => Promise<void>;
  refreshFromStorage: () => Promise<void>;
  addProject: (
    name: string,
    labType: LabType,
    parameters: Record<string, number>,
    notes?: string
  ) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await projectService.getAllProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to load projects', error);
      set({ isLoading: false });
    }
  },

  refreshFromStorage: async () => {
    try {
      const projects = await projectService.getAllProjects();
      set({ projects });
    } catch (error) {
      console.error('Failed to refresh projects', error);
    }
  },

  addProject: async (name, labType, parameters, notes) => {
    try {
      const newProject = await projectService.createProject(name, labType, parameters, notes);
      set((state) => ({
        projects: [newProject, ...state.projects]
      }));
    } catch (error) {
      console.error('Failed to add project', error);
    }
  },

  removeProject: async (id) => {
    try {
      await projectService.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to remove project', error);
    }
  }
}));
