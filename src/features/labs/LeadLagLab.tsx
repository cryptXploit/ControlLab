import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { calculateTransferFunctionFrequencyResponse, calculateMargins } from '@/core/engine/frequency';
import { useLeadLagStore } from '@/store/useLeadLagStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function LeadLagLab() {
  const { t } = useTranslation();
  
  // Plant Parameters: Gp(s) = Kp / (s * (s + p1))
  const [Kp, setKp] = useState(10.0);
  const [p1, setP1] = useState(2.0);

  // Compensator Parameters: C(s) = Kc * (s + z) / (s + p)
  const [Kc, setKc] = useState(1.0);
  const [z, setZ] = useState(1.0);
  const [p, setP] = useState(10.0);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useLeadLagStore();

  useEffect(() => {
    markDirty();
  }, [Kp, p1, Kc, z, p, markDirty]);

  const result = useMemo(() => {
    const N = 500;
    const wArr = new Float32Array(N);
    const minW = -2;
    const maxW = 3;
    for (let i = 0; i < N; i++) {
      const exp = minW + (maxW - minW) * (i / (N - 1));
      wArr[i] = Math.pow(10, exp);
    }
    
    // Plant: Gp(s) = Kp / (s^2 + p1*s)
    const plantNum = [Kp];
    const plantDen = [1, p1, 0];
    const resPlant = calculateTransferFunctionFrequencyResponse(plantNum, plantDen, wArr);
    
    // Compensator: C(s) = Kc * (s + z) / (s + p) = (Kc*s + Kc*z) / (s + p)
    const compNum = [Kc, Kc * z];
    const compDen = [1, p];
    const resComp = calculateTransferFunctionFrequencyResponse(compNum, compDen, wArr);

    // Total System
    const magTotal = new Float32Array(N);
    const phaseTotal = new Float32Array(N);
    for(let i = 0; i < N; i++) {
      magTotal[i] = resPlant.magDbArr[i] + resComp.magDbArr[i];
      phaseTotal[i] = resPlant.phaseDegArr[i] + resComp.phaseDegArr[i];
    }
    
    // Wrap total phase to maintain continuity if necessary, but addition shouldn't cause weird jumps if they were unwrapped individually, except simple offsets.
    for (let i = 1; i < N; i++) {
      while (phaseTotal[i] - phaseTotal[i - 1] > 180) phaseTotal[i] -= 360;
      while (phaseTotal[i] - phaseTotal[i - 1] < -180) phaseTotal[i] += 360;
    }

    const plantMargins = calculateMargins(wArr, resPlant.magDbArr, resPlant.phaseDegArr);
    const totalMargins = calculateMargins(wArr, magTotal, phaseTotal);
    
    return { 
      wArr, 
      magPlant: resPlant.magDbArr, 
      phasePlant: resPlant.phaseDegArr,
      magTotal, 
      phaseTotal,
      plantMargins,
      totalMargins
    };
  }, [Kp, p1, Kc, z, p]);

  const handleSave = async (name: string) => {
    await projectService.createProject(
      name,
      'LEAD_LAG',
      { Kp, p1, Kc, z, p },
      'Lead-Lag Compensator Design'
    );
    markClean();
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.leadLag.title') || 'Lead/Lag Compensator'}
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
          <div className="flex flex-col gap-4 h-full min-h-[400px]">
            <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">
              Compensated System (Blue) vs Uncompensated Plant (Amber)
            </h4>
            <div className="flex-1 min-h-[200px]">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-1">Magnitude (dB)</h5>
              <Graph time={result.wArr} output={result.magTotal} outputB={result.magPlant} />
            </div>
            <div className="flex-1 min-h-[200px]">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-1">Phase (deg)</h5>
              <Graph time={result.wArr} output={result.phaseTotal} outputB={result.phasePlant} />
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">
                {(t as any)('labels.plantParams') || 'Plant Parameters'} ( Kp / s(s+p1) )
              </h5>
              <div className="flex flex-col gap-1">
                <SliderField label="Gain (Kp)" max={50} min={0.1} step={0.1} value={Kp} onChange={setKp} />
                <SliderField label="Pole (p1)" max={20} min={0.1} step={0.1} value={p1} onChange={setP1} />
              </div>
            </Card>

            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-graph-primary uppercase mb-2">
                {(t as any)('labels.compParams') || 'Compensator Parameters'}
              </h5>
              <div className="flex flex-col gap-1">
                <SliderField label="Gain (Kc)" max={20} min={0.1} step={0.1} value={Kc} onChange={setKc} />
                <SliderField label={(t as any)('labels.compZero') || 'Compensator Zero (z)'} max={20} min={0.1} step={0.1} value={z} onChange={setZ} />
                <SliderField label={(t as any)('labels.compPole') || 'Compensator Pole (p)'} max={50} min={0.1} step={0.1} value={p} onChange={setP} />
              </div>
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard 
              label={(t as any)('labels.uncompPhaseMargin') || 'Uncompensated PM'} 
              value={isFinite(result.plantMargins.PM) ? result.plantMargins.PM.toFixed(2) : '∞'} 
              unit="deg" 
            />
            <MetricCard 
              label={(t as any)('labels.compPhaseMargin') || 'Compensated PM'} 
              value={isFinite(result.totalMargins.PM) ? result.totalMargins.PM.toFixed(2) : '∞'} 
              unit="deg" 
            />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              A Lead compensator ($z &lt; p$) adds phase lead at crossover frequencies to improve Phase Margin and stability. A Lag compensator ($z &gt; p$) adds low-frequency gain to reduce steady-state error.
            </p>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Lead-Lag Design"
      />
    </div>
  );
}
