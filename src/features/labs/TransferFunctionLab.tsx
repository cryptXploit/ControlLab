import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { calculateTransferFunctionFrequencyResponse, calculateMargins } from '@/core/engine/frequency';
import { useTransferFunctionStore } from '@/store/useTransferFunctionStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function TransferFunctionLab() {
  const { t } = useTranslation();
  
  const [numDegree, setNumDegree] = useState(0);
  const [denDegree, setDenDegree] = useState(1);

  const [numCoeffs, setNumCoeffs] = useState<number[]>([1, 0, 0, 0, 0]);
  const [denCoeffs, setDenCoeffs] = useState<number[]>([1, 1, 0, 0, 0, 0]);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useTransferFunctionStore();

  useEffect(() => {
    markDirty();
  }, [numDegree, denDegree, numCoeffs, denCoeffs, markDirty]);

  const activeNumCoeffs = useMemo(() => numCoeffs.slice(0, numDegree + 1), [numCoeffs, numDegree]);
  const activeDenCoeffs = useMemo(() => denCoeffs.slice(0, denDegree + 1), [denCoeffs, denDegree]);

  const result = useMemo(() => {
    const N = 500;
    const wArr = new Float32Array(N);
    const minW = -2;
    const maxW = 3;
    for (let i = 0; i < N; i++) {
      const exp = minW + (maxW - minW) * (i / (N - 1));
      wArr[i] = Math.pow(10, exp);
    }
    
    const res = calculateTransferFunctionFrequencyResponse(activeNumCoeffs, activeDenCoeffs, wArr);
    const margins = calculateMargins(wArr, res.magDbArr, res.phaseDegArr);
    
    return { wArr, ...res, margins };
  }, [activeNumCoeffs, activeDenCoeffs]);

  const handleSave = async (name: string) => {
    const params: Record<string, number> = { numDegree, denDegree };
    activeNumCoeffs.forEach((c, i) => { params[`num_${numDegree - i}`] = c; });
    activeDenCoeffs.forEach((c, i) => { params[`den_${denDegree - i}`] = c; });

    await projectService.createProject(
      name,
      'TRANSFER_FUNCTION',
      params,
      'Arbitrary Transfer Function Analysis'
    );
    markClean();
  };

  const handleNumChange = (index: number, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    const newCoeffs = [...numCoeffs];
    newCoeffs[index] = num;
    setNumCoeffs(newCoeffs);
  };

  const handleDenChange = (index: number, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    const newCoeffs = [...denCoeffs];
    newCoeffs[index] = num;
    setDenCoeffs(newCoeffs);
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.transferFunction.title') || 'Transfer Function Explorer'}
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
            <div className="flex-1 min-h-[200px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Magnitude (dB)</h4>
              <Graph time={result.wArr} output={result.magDbArr} />
            </div>
            <div className="flex-1 min-h-[200px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Phase (deg)</h4>
              <Graph time={result.wArr} output={result.phaseDegArr} />
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <Card className="p-3 bg-background-base border-border-subtle">
              <SliderField label={(t as any)('controls.numDegree') || 'Numerator Degree'} max={4} min={0} step={1} value={numDegree} onChange={setNumDegree} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {Array.from({ length: numDegree + 1 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="text-xs font-mono font-bold w-6">s^{numDegree - i}</label>
                    <input
                      type="number"
                      className="w-full bg-background-surface border border-border-strong rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                      value={numCoeffs[i]}
                      onChange={(e) => handleNumChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-3 bg-background-base border-border-subtle">
              <SliderField label={(t as any)('controls.denDegree') || 'Denominator Degree'} max={5} min={1} step={1} value={denDegree} onChange={setDenDegree} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {Array.from({ length: denDegree + 1 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="text-xs font-mono font-bold w-6">s^{denDegree - i}</label>
                    <input
                      type="number"
                      className="w-full bg-background-surface border border-border-strong rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                      value={denCoeffs[i]}
                      onChange={(e) => handleDenChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard label="Gain Margin (dB)" value={isFinite(result.margins.GM) ? result.margins.GM.toFixed(2) : '∞'} />
            <MetricCard label="Phase Margin (deg)" value={isFinite(result.margins.PM) ? result.margins.PM.toFixed(2) : '∞'} />
            <MetricCard label="ω_pc (rad/s)" value={isFinite(result.margins.w_pc) ? result.margins.w_pc.toFixed(2) : '∞'} />
            <MetricCard label="ω_gc (rad/s)" value={isFinite(result.margins.w_gc) ? result.margins.w_gc.toFixed(2) : '∞'} />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              Define arbitrary polynomials to analyze the generalized complex frequency response of any physical system.
            </p>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Transfer Function"
      />
    </div>
  );
}
