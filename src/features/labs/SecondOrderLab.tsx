import { useState } from 'react';
import { useSecondOrderStore } from '@/store/useSecondOrderStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation } from '@/store/useLocaleStore';
import { useToastStore } from '@/store/useToastStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainSecondOrder } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SaveDialog } from '@/components/ui/SaveDialog';

export default function SecondOrderLab() {
  const { K, zeta, wn, result, setParameters } = useSecondOrderStore();
  const { projects, addProject } = useProjectStore();
  const { isPro } = useSettingsStore();
  const { t } = useTranslation();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const explanation = explainSecondOrder(K, zeta, wn);

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
      'SECOND_ORDER',
      { K, zeta, wn },
      (t as any)(explanation.whyKey)
    );
    HapticService.triggerSuccess();
    useToastStore.getState().showToast((t as any)('messages.projectSaved'), 'success');
    setIsSaveModalOpen(false);
    import('@/store/useSecondOrderStore').then(m => m.useSecondOrderStore.getState().markClean());
  };

  return (
    <>
      <SimulatorWorkspace 
        title={(t as any)('tools.secondOrder.title')}
        actions={<Button onClick={handleSaveClick} size="sm">{(t as any)('common.save')}</Button>}
        graph={result ? <Graph output={result.output} time={result.time} width={600} height={300} /> : <div />}
        controls={
          <>
            <SliderField label={(t as any)('params.gain')} max={5} min={0.1} step={0.1} value={K} onChange={(val) => setParameters(val, zeta, wn)} />
            <SliderField label={(t as any)('params.zeta')} max={3.0} min={0.1} step={0.1} value={zeta} onChange={(val) => setParameters(K, val, wn)} />
            <SliderField label={(t as any)('params.wn')} max={10.0} min={0.1} step={0.1} unit="rad/s" value={wn} onChange={(val) => setParameters(K, zeta, val)} />
          </>
        }
        metrics={
          result ? (
            <>
              <MetricCard label={(t as any)('metrics.overshoot')} unit="%" value={result.metrics.overshoot.toFixed(1)} />
              <MetricCard label={(t as any)('metrics.peakTime')} unit="s" value={result.metrics.peakTime > 0 ? result.metrics.peakTime.toFixed(2) : '-'} />
              <MetricCard label={(t as any)('metrics.settlingTime')} unit="s" value={result.metrics.settlingTime.toFixed(2)} />
              <MetricCard label={(t as any)('metrics.steadyStateError')} value={result.metrics.steadyStateError.toFixed(2)} />
            </>
          ) : null
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">{(t as any)(explanation.whyKey)}</p>
            <div className="text-xs text-text-secondary bg-background-base p-2 rounded inline-block">
              <strong className="text-text-primary">Suggestion:</strong> {(t as any)(explanation.actionKey)}
            </div>
          </Card>
        }
      />
      <SaveDialog 
        isOpen={isSaveModalOpen} 
        defaultName={`Second-Order Lab K=${K.toFixed(1)} ζ=${zeta.toFixed(1)} ωn=${wn.toFixed(1)}`} 
        onCancel={() => setIsSaveModalOpen(false)} 
        onSave={confirmSave} 
      />
    </>
  );
}
