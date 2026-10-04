import { useState, useMemo } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { simulateSecondOrderStep, simulatePIDStep } from '@/core/engine/solver';
import { HapticService } from '@/services/haptics/HapticService';

type Domain = 'PID' | 'SECOND_ORDER';
type PidParam = 'Kp' | 'Ki' | 'Kd';
type SoParam = 'K' | 'zeta' | 'wn';

export default function SweepLab() {
  const { t } = useTranslation();
  
  const [domain, setDomain] = useState<Domain>('PID');
  
  // PID constants
  const [pidKp, setPidKp] = useState(1);
  const [pidKi, setPidKi] = useState(0.1);
  const [pidKd, setPidKd] = useState(0.1);
  const [pidSweepParam, setPidSweepParam] = useState<PidParam>('Kp');
  
  // SO constants
  const [soK, setSoK] = useState(1);
  const [soZeta, setSoZeta] = useState(0.5);
  const [soWn, setSoWn] = useState(10);
  const [soSweepParam, setSoSweepParam] = useState<SoParam>('zeta');

  const [sweepMin, setSweepMin] = useState(0.1);
  const [sweepMax, setSweepMax] = useState(5.0);
  
  const [targetMetric, setTargetMetric] = useState<string>('overshoot');

  const results = useMemo(() => {
    const N = 50;
    const xArray = new Float32Array(N);
    const yArray = new Float32Array(N);
    let minVal = Infinity;
    let maxVal = -Infinity;

    const duration = 15;
    const stepSize = 0.05;

    for (let i = 0; i < N; i++) {
      const p = sweepMin + (sweepMax - sweepMin) * (i / (N - 1));
      xArray[i] = p;

      let metricVal = 0;
      if (domain === 'PID') {
        const Kp = pidSweepParam === 'Kp' ? p : pidKp;
        const Ki = pidSweepParam === 'Ki' ? p : pidKi;
        const Kd = pidSweepParam === 'Kd' ? p : pidKd;
        const res = simulatePIDStep(Kp, Ki, Kd, 1, duration, stepSize);
        metricVal = (res.metrics as any)[targetMetric] ?? 0;
      } else {
        const K = soSweepParam === 'K' ? p : soK;
        const zeta = soSweepParam === 'zeta' ? p : soZeta;
        const wn = soSweepParam === 'wn' ? p : soWn;
        const res = simulateSecondOrderStep(K, zeta, wn, duration, stepSize);
        metricVal = (res.metrics as any)[targetMetric] ?? 0;
      }

      yArray[i] = metricVal;
      if (metricVal < minVal) minVal = metricVal;
      if (metricVal > maxVal) maxVal = metricVal;
    }

    return { xData: xArray, yData: yArray, minVal, maxVal };
  }, [domain, pidKp, pidKi, pidKd, pidSweepParam, soK, soZeta, soWn, soSweepParam, sweepMin, sweepMax, targetMetric]);

  const handleDomainChange = (e: any) => {
    const val = e.target.value as Domain;
    setDomain(val);
    setTargetMetric(val === 'PID' ? 'overshoot' : 'overshoot');
    HapticService.triggerSelection();
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.sweep.title') || 'Parameter Sweep'}
        actions={null}
        graph={
          <div className="flex flex-col gap-4 h-full min-h-[400px]">
            <div className="flex-1 min-h-[250px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">
                {targetMetric} vs {domain === 'PID' ? pidSweepParam : soSweepParam}
              </h4>
              <Graph 
                xData={results.xData}
                output={results.yData} 
              />
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Domain</label>
              <select 
                className="w-full bg-background-base border border-border-strong rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                value={domain}
                onChange={handleDomainChange}
              >
                <option value="SECOND_ORDER">Second Order</option>
                <option value="PID">PID Controller</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Parameter to Sweep</label>
              <select 
                className="w-full bg-background-base border border-border-strong rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                value={domain === 'PID' ? pidSweepParam : soSweepParam}
                onChange={(e) => {
                  if (domain === 'PID') setPidSweepParam(e.target.value as PidParam);
                  else setSoSweepParam(e.target.value as SoParam);
                  HapticService.triggerSelection();
                }}
              >
                {domain === 'PID' ? (
                  <>
                    <option value="Kp">Kp (Proportional)</option>
                    <option value="Ki">Ki (Integral)</option>
                    <option value="Kd">Kd (Derivative)</option>
                  </>
                ) : (
                  <>
                    <option value="K">K (Gain)</option>
                    <option value="zeta">ζ (Damping)</option>
                    <option value="wn">ωn (Natural Freq)</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Target Metric</label>
              <select 
                className="w-full bg-background-base border border-border-strong rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                value={targetMetric}
                onChange={(e) => {
                  setTargetMetric(e.target.value);
                  HapticService.triggerSelection();
                }}
              >
                {domain === 'PID' ? (
                  <>
                    <option value="overshoot">Overshoot (%)</option>
                    <option value="settlingTime">Settling Time (s)</option>
                    <option value="steadyStateError">Steady-State Error</option>
                  </>
                ) : (
                  <>
                    <option value="overshoot">Overshoot (%)</option>
                    <option value="peakTime">Peak Time (s)</option>
                    <option value="settlingTime">Settling Time (s)</option>
                    <option value="steadyStateError">Steady-State Error</option>
                  </>
                )}
              </select>
            </div>

            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">Sweep Range</h5>
              <div className="flex gap-2">
                <div className="flex-1">
                  <SliderField label="Min" max={10} min={0} step={0.1} value={sweepMin} onChange={setSweepMin} />
                </div>
                <div className="flex-1">
                  <SliderField label="Max" max={50} min={1} step={0.1} value={sweepMax} onChange={setSweepMax} />
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">Constant Parameters</h5>
              {domain === 'PID' ? (
                <>
                  {pidSweepParam !== 'Kp' && <SliderField label="Kp" max={10} min={0} step={0.1} value={pidKp} onChange={setPidKp} />}
                  {pidSweepParam !== 'Ki' && <SliderField label="Ki" max={10} min={0} step={0.1} value={pidKi} onChange={setPidKi} />}
                  {pidSweepParam !== 'Kd' && <SliderField label="Kd" max={10} min={0} step={0.1} value={pidKd} onChange={setPidKd} />}
                </>
              ) : (
                <>
                  {soSweepParam !== 'K' && <SliderField label="K" max={10} min={0.1} step={0.1} value={soK} onChange={setSoK} />}
                  {soSweepParam !== 'zeta' && <SliderField label="ζ" max={2} min={0.05} step={0.05} value={soZeta} onChange={setSoZeta} />}
                  {soSweepParam !== 'wn' && <SliderField label="ωn" max={50} min={1} step={1} value={soWn} onChange={setSoWn} />}
                </>
              )}
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard label={`Min ${targetMetric}`} value={isFinite(results.minVal) ? results.minVal.toFixed(2) : '∞'} />
            <MetricCard label={`Max ${targetMetric}`} value={isFinite(results.maxVal) ? results.maxVal.toFixed(2) : '∞'} />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              Sweep a parameter across a range to observe its non-linear effect on the target metric. This reveals sensitivity and optimal operating zones.
            </p>
          </Card>
        }
      />
    </div>
  );
}
