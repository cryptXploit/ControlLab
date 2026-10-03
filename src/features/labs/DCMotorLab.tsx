import { useRef, useState } from 'react';
import { useDCMotorStore } from '@/store/useDCMotorStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation } from '@/store/useLocaleStore';
import { useToastStore } from '@/store/useToastStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainDCMotor } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import DCMotorVisual from '@/components/DCMotorVisual';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, Square, CheckCircle } from 'lucide-react';
import { SaveDialog } from '@/components/ui/SaveDialog';

export default function DCMotorLab() {
  const { Kp, Kd, setpoint, result, setParameters } = useDCMotorStore();
  const { projects, addProject } = useProjectStore();
  const { isPro } = useSettingsStore();
  const { activeChallenge, isCompleted, evaluateChallenge, clearChallenge } = useChallengeStore();
  const { t } = useTranslation();

  const [isPlaying, setIsPlaying] = useState(false);
  const motorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const explanation = explainDCMotor(Kp, Kd, result?.metrics.overshoot || 0);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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
      'DC_MOTOR',
      { Kp, Kd, setpoint },
      (t as any)(explanation.whyKey)
    );
    HapticService.triggerSuccess();
    useToastStore.getState().showToast((t as any)('messages.projectSaved'), 'success');
    setIsSaveModalOpen(false);
    import('@/store/useDCMotorStore').then(m => m.useDCMotorStore.getState().markClean());
  };

  const handleCheckSolution = () => {
    if (result) {
      evaluateChallenge(result.metrics);
    }
  };

  const playAnimation = () => {
    if (!result) return;
    
    if (isPlaying) {
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
      if (motorRef.current) {
        motorRef.current.style.transform = `rotate(${result.output[result.output.length - 1]}deg)`;
      }
      return;
    }

    setIsPlaying(true);
    
    if (motorRef.current) {
      motorRef.current.style.transform = `rotate(0deg)`;
    }

    const DURATION_MS = result.time[result.time.length - 1] * 1000;
    const STEP_SIZE = 0.01;
    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      const elapsedMs = time - startTimeRef.current;
      const elapsedSec = elapsedMs / 1000;
      
      const index = Math.floor(elapsedSec / STEP_SIZE);

      if (index < result.output.length && elapsedMs < DURATION_MS) {
        if (motorRef.current) {
          motorRef.current.style.transform = `rotate(${result.output[index]}deg)`;
        }
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (motorRef.current) {
          motorRef.current.style.transform = `rotate(${result.output[result.output.length - 1]}deg)`;
        }
        setIsPlaying(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="w-full flex flex-col flex-1">
      {activeChallenge && activeChallenge.labType === 'DC_MOTOR' && (
        <div className={`m-4 p-4 rounded-xl border ${isCompleted ? 'bg-status-success/10 border-status-success' : 'bg-bg-surface-elevated border-accent-primary'} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isCompleted ? <CheckCircle className="w-5 h-5 text-status-success" /> : <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />}
              <h3 className={`font-bold ${isCompleted ? 'text-status-success' : 'text-accent-primary'}`}>
                {isCompleted ? 'Challenge Completed \uD83C\uDF89' : (t as any)(activeChallenge.titleKey)}
              </h3>
            </div>
            <p className="text-sm text-text-secondary">{(t as any)(activeChallenge.descKey)}</p>
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
        title={(t as any)('tools.dcMotor.title')}
        actions={<Button onClick={handleSaveClick} size="sm" variant="secondary">{(t as any)('common.save')}</Button>}
        graph={
          <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-center items-center p-4 bg-background-base rounded-lg border border-border-subtle shrink-0">
              <DCMotorVisual ref={motorRef} />
            </div>
            <div className="flex-1 min-h-[200px]">
              {result ? <Graph output={result.output} time={result.time} setpoint={result.setpoint} /> : <div />}
            </div>
          </div>
        }
        controls={
          <>
            <Button 
              onClick={playAnimation} 
              variant={isPlaying ? "danger" : "primary"} 
              className="w-full mb-4"
            >
              {isPlaying ? <><Square className="w-4 h-4 mr-2" /> Stop Simulation</> : <><Play className="w-4 h-4 mr-2" /> Play Animation</>}
            </Button>
            <SliderField label="Proportional (Kp)" max={5} min={0} step={0.1} value={Kp} onChange={(val) => setParameters(val, Kd, setpoint)} />
            <SliderField label="Derivative (Kd)" max={1} min={0} step={0.05} value={Kd} onChange={(val) => setParameters(Kp, val, setpoint)} />
            <SliderField label="Target Angle (°)" max={180} min={-180} step={5} unit="°" value={setpoint} onChange={(val) => setParameters(Kp, Kd, val)} />
          </>
        }
        metrics={
          result ? (
            <>
              <MetricCard label={(t as any)('metrics.overshoot')} unit="%" value={result.metrics.overshoot.toFixed(1)} />
              <MetricCard label={(t as any)('metrics.settlingTime')} unit="s" value={result.metrics.settlingTime.toFixed(2)} />
              <div className="col-span-2">
                <MetricCard label={(t as any)('metrics.steadyStateError')} unit="°" value={result.metrics.steadyStateError.toFixed(2)} />
              </div>
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
        defaultName={`DC Motor Kp=${Kp.toFixed(1)} Kd=${Kd.toFixed(2)}`} 
        onCancel={() => setIsSaveModalOpen(false)} 
        onSave={confirmSave} 
      />
    </div>
  );
}
