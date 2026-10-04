import { useState, useMemo } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { useProjectStore } from '@/store/useProjectStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { 
  simulateFirstOrderStep, 
  simulateSecondOrderStep, 
  simulatePIDStep, 
  simulateDCMotor 
} from '@/core/engine/solver';
import type { SimulationResult } from '@/core/engine/types';
import { HapticService } from '@/services/haptics/HapticService';
type DomainOption = 'FIRST_ORDER' | 'SECOND_ORDER' | 'PID' | 'DC_MOTOR';

export default function CompareLab() {
  const { t } = useTranslation();
  const { projects } = useProjectStore();
  
  const [domain, setDomain] = useState<DomainOption>('PID');
  const [projAId, setProjAId] = useState<string>('');
  const [projBId, setProjBId] = useState<string>('');

  const domainProjects = useMemo(() => {
    return projects.filter(p => p.labType === domain);
  }, [projects, domain]);

  const projA = useMemo(() => domainProjects.find(p => p.id === projAId), [domainProjects, projAId]);
  const projB = useMemo(() => domainProjects.find(p => p.id === projBId), [domainProjects, projBId]);

  const results = useMemo(() => {
    if (!projA || !projB) return null;

    let resA: SimulationResult;
    let resB: SimulationResult;

    const duration = 15;
    const stepSize = 0.05;

    switch (domain) {
      case 'FIRST_ORDER':
        resA = simulateFirstOrderStep(Number(projA.parameters.K) || 1, Number(projA.parameters.tau) || 1, duration, stepSize);
        resB = simulateFirstOrderStep(Number(projB.parameters.K) || 1, Number(projB.parameters.tau) || 1, duration, stepSize);
        break;
      case 'SECOND_ORDER':
        resA = simulateSecondOrderStep(Number(projA.parameters.K) || 1, Number(projA.parameters.zeta) || 0.5, Number(projA.parameters.wn) || 10, duration, stepSize);
        resB = simulateSecondOrderStep(Number(projB.parameters.K) || 1, Number(projB.parameters.zeta) || 0.5, Number(projB.parameters.wn) || 10, duration, stepSize);
        break;
      case 'PID':
        resA = simulatePIDStep(Number(projA.parameters.Kp) || 1, Number(projA.parameters.Ki) || 0, Number(projA.parameters.Kd) || 0, 1, duration, stepSize);
        resB = simulatePIDStep(Number(projB.parameters.Kp) || 1, Number(projB.parameters.Ki) || 0, Number(projB.parameters.Kd) || 0, 1, duration, stepSize);
        break;
      case 'DC_MOTOR':
        resA = simulateDCMotor(Number(projA.parameters.Kp) || 1, Number(projA.parameters.Kd) || 0, 1, duration, stepSize);
        resB = simulateDCMotor(Number(projB.parameters.Kp) || 1, Number(projB.parameters.Kd) || 0, 1, duration, stepSize);
        break;
    }

    return { resA, resB };
  }, [projA, projB, domain]);

  const formatDelta = (a: number, b: number) => {
    const delta = b - a;
    if (delta > 0) return <span className="text-status-error">+{delta.toFixed(2)}</span>;
    if (delta < 0) return <span className="text-status-success">{delta.toFixed(2)}</span>;
    return <span className="text-text-muted">0.00</span>;
  };

  const getMetricKeys = () => {
    if (!results) return [];
    return Object.keys(results.resA.metrics);
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.compare.title') || 'Experiment Compare'}
        actions={null}
        graph={
          <div className="flex flex-col gap-4 h-full min-h-[400px]">
            <div className="flex-1 min-h-[250px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Time Response</h4>
              {results ? (
                <Graph 
                  output={results.resA.output} 
                  outputB={results.resB.output}
                  time={results.resA.time}
                  setpoint={results.resA.setpoint}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-text-muted bg-background-base rounded-md border border-border-subtle">
                  Select two projects to compare
                </div>
              )}
            </div>

            {results && (
              <div className="bg-background-base border border-border-subtle rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-background-surface text-text-secondary text-xs uppercase border-b border-border-subtle">
                    <tr>
                      <th className="px-4 py-2">Metric</th>
                      <th className="px-4 py-2 text-graph-primary">Proj A</th>
                      <th className="px-4 py-2 text-graph-secondary">Proj B</th>
                      <th className="px-4 py-2">&Delta; (B - A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMetricKeys().map((key) => (
                      <tr key={key} className="border-b border-border-subtle last:border-0 hover:bg-background-surface/50">
                        <td className="px-4 py-2 capitalize font-medium text-text-primary">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                        <td className="px-4 py-2 text-text-primary">{results.resA.metrics[key].toFixed(2)}</td>
                        <td className="px-4 py-2 text-text-primary">{results.resB.metrics[key].toFixed(2)}</td>
                        <td className="px-4 py-2 font-mono">{formatDelta(results.resA.metrics[key], results.resB.metrics[key])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Domain</label>
              <select 
                className="w-full bg-background-base border border-border-strong rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value as DomainOption);
                  setProjAId('');
                  setProjBId('');
                  HapticService.triggerSelection();
                }}
              >
                <option value="FIRST_ORDER">First Order</option>
                <option value="SECOND_ORDER">Second Order</option>
                <option value="PID">PID Controller</option>
                <option value="DC_MOTOR">DC Motor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-graph-primary uppercase">Project A (Blue)</label>
              <select 
                className="w-full bg-background-base border border-border-strong rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-graph-primary transition-colors"
                value={projAId}
                onChange={(e) => {
                  setProjAId(e.target.value);
                  HapticService.triggerSelection();
                }}
              >
                <option value="">-- Select Project A --</option>
                {domainProjects.map(p => (
                  <option key={`A-${p.id}`} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-graph-secondary uppercase">Project B (Amber)</label>
              <select 
                className="w-full bg-background-base border border-border-strong rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-graph-secondary transition-colors"
                value={projBId}
                onChange={(e) => {
                  setProjBId(e.target.value);
                  HapticService.triggerSelection();
                }}
              >
                <option value="">-- Select Project B --</option>
                {domainProjects.map(p => (
                  <option key={`B-${p.id}`} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {projA && projB && (
              <div className="mt-4 flex gap-2">
                <Card className="flex-1 p-3 bg-background-base border-graph-primary/30">
                  <h5 className="text-[10px] font-bold text-graph-primary uppercase mb-2">Params A</h5>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-text-secondary">
                    {Object.entries(projA.parameters).map(([k, v]) => (
                      <span key={k}>{k}: {v}</span>
                    ))}
                  </div>
                </Card>
                <Card className="flex-1 p-3 bg-background-base border-graph-secondary/30">
                  <h5 className="text-[10px] font-bold text-graph-secondary uppercase mb-2">Params B</h5>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-text-secondary">
                    {Object.entries(projB.parameters).map(([k, v]) => (
                      <span key={k}>{k}: {v}</span>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        }
        metrics={null}
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              Superimpose two saved projects from the same domain to instantly visualize the performance impact of parameter changes.
            </p>
          </Card>
        }
      />
    </div>
  );
}
