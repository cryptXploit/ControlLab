import { useProjectStore } from '@/store/useProjectStore';
import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useSecondOrderStore } from '@/store/useSecondOrderStore';
import { usePidStore } from '@/store/usePidStore';
import { useDCMotorStore } from '@/store/useDCMotorStore';
import { Play, Trash2 } from 'lucide-react';
import type { Project } from '@/services/storage/db';
import { useLocation } from 'wouter';

export default function ProjectsScreen() {
  const { projects, removeProject } = useProjectStore();
  const [, setLocation] = useLocation();

  const handleLoad = (project: Project) => {
    const p = project.parameters as any;
    switch (project.labType) {
      case 'FIRST_ORDER':
        useFirstOrderStore.getState().setParameters(p.K, p.tau);
        break;
      case 'SECOND_ORDER':
        useSecondOrderStore.getState().setParameters(p.K, p.zeta, p.wn);
        break;
      case 'PID':
        usePidStore.getState().setParameters(p.Kp, p.Ki, p.Kd, p.setpoint);
        break;
      case 'DC_MOTOR':
        useDCMotorStore.getState().setParameters(p.Kp, p.Kd, p.setpoint);
        break;
    }
    const mapping: Record<string, string> = {
      'FIRST_ORDER': 'first-order',
      'SECOND_ORDER': 'second-order',
      'PID': 'pid',
      'DC_MOTOR': 'dc-motor'
    };
    setLocation(`/labs/${mapping[project.labType] || project.labType}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto pb-24">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-text-primary">My Labs</h1>
        <p className="text-text-secondary">Your saved experiments and configurations.</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center text-text-muted py-12 border border-dashed border-border-strong rounded-xl bg-background-surface">
          No projects found. Head to the Labs to save an experiment!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="flex items-center justify-between p-5 rounded-xl border border-border-subtle bg-background-elevated shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-left flex-1">
                <h3 className="font-semibold text-lg text-text-primary mb-1">{project.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs bg-background-base text-accent-primary px-2 py-1 rounded">
                    {project.labType}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {project.notes && (
                  <p className="text-sm text-text-secondary mt-2 border-l-2 border-border-strong pl-2">
                    {project.notes}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleLoad(project)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-accent-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  <Play className="w-4 h-4" /> Load
                </button>
                <button
                  onClick={() => removeProject(project.id)}
                  className="p-2 text-text-muted hover:text-status-error hover:bg-status-error/10 rounded-md transition-colors"
                  aria-label="Delete Project"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
