import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation } from '@/store/useLocaleStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainFirstOrder } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function FirstOrderLab() {
  const { K, tau, result, setParameters } = useFirstOrderStore();
  const { projects, addProject } = useProjectStore();
  const { isPro } = useSettingsStore();
  const { t } = useTranslation();

  const explanation = explainFirstOrder(K, tau);

  const handleSave = async () => {
    const { allowed, message } = EntitlementEngine.canSaveNewProject(projects.length, isPro);
    if (!allowed) {
      HapticService.triggerWarning();
      alert(message);
      return;
    }

    await addProject(
      `First-Order Lab K=${K.toFixed(1)} τ=${tau.toFixed(1)}`,
      'FIRST_ORDER',
      { K, tau },
      explanation.why
    );
    HapticService.triggerSuccess();
    alert('Project Saved Successfully!');
  };

  return (
    <SimulatorWorkspace 
      title={(t as any)('tools.firstOrder.title')}
      actions={<Button onClick={handleSave} size="sm">{(t as any)('common.save')}</Button>}
      graph={result ? <Graph output={result.output} time={result.time} width={600} height={300} /> : <div />}
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
          <p className="text-sm text-text-primary mb-2 leading-relaxed">{explanation.why}</p>
          <div className="text-xs text-text-secondary bg-background-base p-2 rounded inline-block">
            <strong className="text-text-primary">Suggestion:</strong> {explanation.nextAction}
          </div>
        </Card>
      }
    />
  );
}
