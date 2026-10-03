import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import { useTranslation } from '@/store/useLocaleStore';
import { Button } from '@/components/ui/Button';
import { useProjectStore } from '@/store/useProjectStore';
import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useSecondOrderStore } from '@/store/useSecondOrderStore';
import { usePidStore } from '@/store/usePidStore';
import { useDCMotorStore } from '@/store/useDCMotorStore';

export function LabHost() {
  const [match, params] = useRoute('/labs/:id');
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!match || !params) return;
    const search = new URLSearchParams(window.location.search);
    const projectId = search.get('projectId');
    if (projectId) {
      const project = useProjectStore.getState().projects.find(p => p.id === projectId);
      if (project) {
        const p = project.parameters as any;
        switch (project.labType) {
          case 'FIRST_ORDER':
            useFirstOrderStore.getState().setParameters(p.K, p.tau);
            useFirstOrderStore.getState().markClean();
            break;
          case 'SECOND_ORDER':
            useSecondOrderStore.getState().setParameters(p.K, p.zeta, p.wn);
            useSecondOrderStore.getState().markClean();
            break;
          case 'PID':
            usePidStore.getState().setParameters(p.Kp, p.Ki, p.Kd, p.setpoint);
            usePidStore.getState().markClean();
            break;
          case 'DC_MOTOR':
            useDCMotorStore.getState().setParameters(p.Kp, p.Kd, p.setpoint);
            useDCMotorStore.getState().markClean();
            break;
        }
      }
      setLocation('/labs/' + params.id, { replace: true });
    }
  }, [match, params, setLocation]);

  if (!match || !params) return null;

  const tool = TOOL_REGISTRY.find(t => t.id === params.id);
  
  if (!tool) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-text-primary mb-4">{(t as any)('errors.toolNotFound')}</h2>
        <Button onClick={() => setLocation('/labs')}>Return to Explorer</Button>
      </div>
    );
  }

  const ActiveComponent = tool.component;
  return <ActiveComponent />;
}
