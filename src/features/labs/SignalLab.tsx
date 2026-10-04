import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { simulateFirstOrderStep, simulateSecondOrderStep, calculateDerivative, calculateIntegral } from '@/core/engine/solver';
import { useSignalStore } from '@/store/useSignalStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default function SignalLab() {
  const { t } = useTranslation();
  
  const [systemType, setSystemType] = useState<'FIRST_ORDER' | 'SECOND_ORDER'>('FIRST_ORDER');
  const [signalType, setSignalType] = useState<'STEP' | 'RAMP' | 'IMPULSE'>('STEP');

  // First Order Params
  const [K1, setK1] = useState(1.0);
  const [tau, setTau] = useState(2.0);

  // Second Order Params
  const [K2, setK2] = useState(1.0);
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(5.0);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useSignalStore();

  useEffect(() => {
    markDirty();
  }, [systemType, signalType, K1, tau, K2, zeta, wn, markDirty]);

  const handleSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSystemType(e.target.value as any);
    if (Capacitor.isNativePlatform()) Haptics.impact({ style: ImpactStyle.Light });
  };
  
  const handleSignalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSignalType(e.target.value as any);
    if (Capacitor.isNativePlatform()) Haptics.impact({ style: ImpactStyle.Light });
  };

  const result = useMemo(() => {
    const duration = 15;
    const dt = 0.01;
    
    // 1. Calculate Base Step Response
    let baseStep;
    if (systemType === 'FIRST_ORDER') {
      baseStep = simulateFirstOrderStep(K1, tau, duration, dt);
    } else {
      baseStep = simulateSecondOrderStep(K2, zeta, wn, duration, dt);
    }

    const N = baseStep.time.length;
    let finalOutput = baseStep.output;
    const inputSignal = new Float32Array(N);

    // 2. Derive/Integrate based on selected signal
    if (signalType === 'STEP') {
      inputSignal.fill(1.0);
    } else if (signalType === 'RAMP') {
      finalOutput = calculateIntegral(baseStep.output, dt);
      for (let i = 0; i < N; i++) inputSignal[i] = baseStep.time[i];
    } else if (signalType === 'IMPULSE') {
      finalOutput = calculateDerivative(baseStep.output, dt);
      // Stylized spike at t=0
      inputSignal[0] = 1.0 / dt; 
      for (let i = 1; i < N; i++) inputSignal[i] = 0;
    }

    const sse = Math.abs(inputSignal[N - 1] - finalOutput[N - 1]);

    return {
      time: baseStep.time,
      output: finalOutput,
      inputSignal,
      sse
    };
  }, [systemType, signalType, K1, tau, K2, zeta, wn]);

  const handleSave = async (name: string) => {
    const params: Record<string, number | string> = { systemType, signalType };
    if (systemType === 'FIRST_ORDER') {
      params.K1 = K1; params.tau = tau;
    } else {
      params.K2 = K2; params.zeta = zeta; params.wn = wn;
    }

    await projectService.createProject(
      name,
      'SIGNAL_RESPONSE',
      params as any,
      'Signal Response Analysis'
    );
    markClean();
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.signal.title') || 'Signal Response Explorer'}
        actions={
          <div className="flex gap-2 relative z-10">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSaveOpen(true)}
              className="relative overflow-hidden"
            >
              <Save className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">{(t as any)('actions.save')}</span>
              {isDirty && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-status-warning rounded-full border-2 border-accent-primary transform translate-x-1/3 -translate-y-1/3" />
              )}
            </Button>
          </div>
        }
        graph={
          <div className="flex flex-col h-full min-h-[400px]">
            <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">
              System Output (Blue) vs Input Signal (Amber)
            </h4>
            <div className="flex-1 min-h-[300px]">
              <Graph time={result.time} output={result.output} outputB={result.inputSignal} />
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">Configuration</h5>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-text-secondary">{(t as any)('labels.systemType') || 'System Type'}</label>
                  <select 
                    value={systemType} 
                    onChange={handleSystemChange}
                    className="w-full bg-background-surface border border-border-strong rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  >
                    <option value="FIRST_ORDER">First Order</option>
                    <option value="SECOND_ORDER">Second Order</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-text-secondary">{(t as any)('labels.inputSignal') || 'Input Signal'}</label>
                  <select 
                    value={signalType} 
                    onChange={handleSignalChange}
                    className="w-full bg-background-surface border border-border-strong rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  >
                    <option value="STEP">{(t as any)('labels.step') || 'Step'}</option>
                    <option value="RAMP">{(t as any)('labels.ramp') || 'Ramp'}</option>
                    <option value="IMPULSE">{(t as any)('labels.impulse') || 'Impulse'}</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">Parameters</h5>
              <div className="flex flex-col gap-1">
                {systemType === 'FIRST_ORDER' ? (
                  <>
                    <SliderField label="K (Gain)" max={10} min={0.1} step={0.1} value={K1} onChange={setK1} />
                    <SliderField label="τ (Time Const)" max={10} min={0.1} step={0.1} value={tau} onChange={setTau} />
                  </>
                ) : (
                  <>
                    <SliderField label="K (Gain)" max={10} min={0.1} step={0.1} value={K2} onChange={setK2} />
                    <SliderField label="ζ (Damping)" max={2} min={0.05} step={0.05} value={zeta} onChange={setZeta} />
                    <SliderField label="ωn (Nat Freq)" max={20} min={0.1} step={0.1} value={wn} onChange={setWn} />
                  </>
                )}
              </div>
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard label="Steady-State Error" value={signalType === 'IMPULSE' ? 'N/A' : result.sse.toFixed(4)} />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              Analyze how systems respond to different excitations. Mathematically, the Impulse response is the derivative of the Step response, and the Ramp response is the integral of the Step response.
            </p>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName={`Signal Response (${signalType})`}
      />
    </div>
  );
}
