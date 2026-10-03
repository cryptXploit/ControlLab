import { usePidStore } from '@/store/usePidStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainPID } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function PidLab() {
  const { Kp, Ki, Kd, setpoint, result, setParameters } = usePidStore();
  const { projects, addProject } = useProjectStore();
  const { isPro } = useSettingsStore();
  const { activeChallenge, isCompleted, evaluateChallenge, clearChallenge } = useChallengeStore();

  const explanation = explainPID(
    Kp, Ki, Kd, 
    result?.metrics.overshoot || 0, 
    result?.metrics.steadyStateError || 0
  );

  const handleSave = async () => {
    const { allowed, message } = EntitlementEngine.canSaveNewProject(projects.length, isPro);
    if (!allowed) {
      HapticService.triggerWarning();
      alert(message);
      return;
    }

    await addProject(
      `PID Lab Kp=${Kp.toFixed(1)} Ki=${Ki.toFixed(1)} Kd=${Kd.toFixed(1)}`,
      'PID',
      { Kp, Ki, Kd, setpoint },
      explanation.why
    );
    HapticService.triggerSuccess();
    alert('Project Saved Successfully!');
  };

  const handleCheckSolution = () => {
    if (result) {
      evaluateChallenge(result.metrics);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      {activeChallenge && activeChallenge.labType === 'PID' && (
        <div className={`m-4 p-4 rounded-xl border ${isCompleted ? 'bg-status-success/10 border-status-success' : 'bg-bg-surface-elevated border-accent-primary'} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isCompleted ? <CheckCircle className="w-5 h-5 text-status-success" /> : <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />}
              <h3 className={`font-bold ${isCompleted ? 'text-status-success' : 'text-accent-primary'}`}>
                {isCompleted ? 'Challenge Completed \uD83C\uDF89' : activeChallenge.title}
              </h3>
            </div>
            <p className="text-sm text-text-secondary">{activeChallenge.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {!isCompleted ? (
              <Button onClick={handleCheckSolution} size="sm">Check Solution</Button>
            ) : (
              <Button variant="secondary" onClick={clearChallenge} size="sm">Dismiss</Button>
            )}
          </div>
        </div>
      )}

      <SimulatorWorkspace 
        title="PID Controller"
        actions={<Button onClick={handleSave} size="sm" variant="secondary">Save</Button>}
        graph={result ? <Graph output={result.output} time={result.time} setpoint={result.setpoint} /> : <div />}
        controls={
          <>
            <SliderField label="Proportional (Kp)" max={10} min={0} step={0.1} value={Kp} onChange={(val) => setParameters(val, Ki, Kd, setpoint)} />
            <SliderField label="Integral (Ki)" max={10} min={0} step={0.1} value={Ki} onChange={(val) => setParameters(Kp, val, Kd, setpoint)} />
            <SliderField label="Derivative (Kd)" max={10} min={0} step={0.1} value={Kd} onChange={(val) => setParameters(Kp, Ki, val, setpoint)} />
          </>
        }
        metrics={
          result ? (
            <>
              <MetricCard label="Overshoot" unit="%" value={result.metrics.overshoot.toFixed(1)} />
              <MetricCard label="Settling Time" unit="s" value={result.metrics.settlingTime.toFixed(2)} />
              <div className="col-span-2">
                <MetricCard label="Steady-State Error" value={result.metrics.steadyStateError.toFixed(2)} />
              </div>
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
    </div>
  );
}
