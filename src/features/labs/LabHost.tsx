import { useRoute, useLocation } from 'wouter';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import { useTranslation } from '@/store/useLocaleStore';
import { Button } from '@/components/ui/Button';

export function LabHost() {
  const [match, params] = useRoute('/labs/:id');
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

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
