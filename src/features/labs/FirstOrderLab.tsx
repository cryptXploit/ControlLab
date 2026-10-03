import { useState } from 'react';
import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation } from '@/store/useLocaleStore';
import { useToastStore } from '@/store/useToastStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainFirstOrder } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SaveDialog } from '@/components/ui/SaveDialog';

export default function FirstOrderLab() {
  const { K, tau, result, setParameters } = useFirstOrderStore();
  const { projects, addProject } = useProjectStore();
  const { isPro } = useSettingsStore();
  const { t } = useTranslation();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const explanation = explainFirstOrder(K, tau);

  const handleSaveClick = () => {
    const { allowed, message } = EntitlementEngine.canSaveNewProject(projects.length, isPro);
    if (!allowed) {
      HapticService.triggerWarning();
      useToastStore.getState().showToast(message || 'Upgrade required', 'error');
      return;
    }
    setIsSaveModalOpen(true);
  };

  const confirmSave = async (projectName: string) => {
    await addProject(
      projectName,
      'FIRST_ORDER',
      { K, tau },
      (t as any)(explanation.whyKey)
    );
    HapticService.triggerSuccess();
    useToastStore.getState().showToast((t as any)('messages.projectSaved'), 'success');
    setIsSaveModalOpen(false);
    import('@/store/useFirstOrderStore').then(m => m.useFirstOrderStore.getState().markClean());
  };

  return (
    <>
      <SimulatorWorkspace 
        title={(t as any)('tools.firstOrder.title')}
        actions={<Button onClick={handleSaveClick} size="sm">{(t as any)('common.save')}</Button>}
        graph={result ? <Graph output={result.output} time={result.time} /> : <div />}
        controls={
          <>
            <SliderField label={(t as any)('params.gain')} max={5} min={0.1} step={0.1} value={K} onChange={(val) => setParameters(val, tau)} />
            <SliderField label={(t as any)('params.tau')} max={5} min={0.1} step={0.1} unit="s" value={tau} onChange={(val) => setParameters(K, val)} />
          </>
        }
        metrics={
          result ? (
            <>
              <MetricCard label={(t as any)('metrics.riseTime')} unit="s" value={result.metrics.riseTime?.toFixed(2) || '-'} />
              <MetricCard label={(t as any)('metrics.settlingTime')} unit="s" value={result.metrics.settlingTime?.toFixed(2) || '-'} />
              <MetricCard label={(t as any)('metrics.steadyStateError')} value={result.metrics.steadyStateError.toFixed(2)} />
            </>
          ) : null
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">{(t as any)(explanation.whyKey)}</p>
            <div className="text-xs text-text-secondary bg-background-base p-2 rounded inline-block">
              <strong className="text-text-primary">{(t as any)('common.suggestion')}</strong> {(t as any)(explanation.actionKey)}
            </div>
          </Card>
        }
      />
      <SaveDialog 
        isOpen={isSaveModalOpen} 
        defaultName={`First-Order Lab K=${K.toFixed(1)} τ=${tau.toFixed(1)}`} 
        onCancel={() => setIsSaveModalOpen(false)} 
        onSave={confirmSave} 
      />
    </>
  );
}
