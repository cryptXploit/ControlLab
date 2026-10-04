import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import { calculateRouthArray } from '@/core/engine/algebra';
import { useRouthStore } from '@/store/useRouthStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function RouthLab() {
  const { t } = useTranslation();
  
  const [degree, setDegree] = useState(3);
  const [coeffs, setCoeffs] = useState<number[]>([1, 1, 2, 24, 0, 0, 0]);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useRouthStore();

  useEffect(() => {
    markDirty();
  }, [degree, coeffs, markDirty]);

  const activeCoeffs = useMemo(() => {
    return coeffs.slice(0, degree + 1);
  }, [coeffs, degree]);

  const result = useMemo(() => {
    return calculateRouthArray(activeCoeffs);
  }, [activeCoeffs]);

  const handleSave = async (name: string) => {
    await projectService.createProject(
      name,
      'ROUTH',
      { degree, ...Object.fromEntries(activeCoeffs.map((c, i) => [`a${degree - i}`, c])) },
      'Routh-Hurwitz Stability Analysis'
    );
    markClean();
  };

  const handleCoeffChange = (index: number, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    const newCoeffs = [...coeffs];
    newCoeffs[index] = num;
    setCoeffs(newCoeffs);
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.routh.title') || 'Routh-Hurwitz'}
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
          <div className="flex flex-col h-full min-h-[400px] bg-background-base p-4 rounded-lg border border-border-subtle overflow-auto">
            <h4 className="text-xs font-bold text-text-secondary uppercase mb-4">Routh Array</h4>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-background-surface text-text-secondary">
                  <tr>
                    <th className="px-4 py-2 border border-border-subtle font-mono text-center w-16">Row</th>
                    <th className="px-4 py-2 border border-border-subtle">C1 (Pivot)</th>
                    <th className="px-4 py-2 border border-border-subtle">C2</th>
                    <th className="px-4 py-2 border border-border-subtle">C3</th>
                    <th className="px-4 py-2 border border-border-subtle">C4</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((row, i) => (
                    <tr key={i} className="hover:bg-background-surface/30">
                      <td className="px-4 py-2 border border-border-subtle font-mono font-bold bg-background-surface/50 text-center text-text-secondary">
                        s^{degree - i}
                      </td>
                      <td className={`px-4 py-2 border border-border-subtle font-mono ${row[0] < 0 ? 'text-status-error font-bold' : 'text-text-primary'}`}>
                        {row[0]?.toFixed(4) ?? '0.0000'}
                      </td>
                      <td className="px-4 py-2 border border-border-subtle font-mono text-text-secondary">
                        {row[1]?.toFixed(4) ?? ''}
                      </td>
                      <td className="px-4 py-2 border border-border-subtle font-mono text-text-secondary">
                        {row[2]?.toFixed(4) ?? ''}
                      </td>
                      <td className="px-4 py-2 border border-border-subtle font-mono text-text-secondary">
                        {row[3]?.toFixed(4) ?? ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <Card className="p-3 bg-background-base border-border-subtle">
              <SliderField label={(t as any)('params.degree') || 'Polynomial Degree'} max={6} min={2} step={1} value={degree} onChange={setDegree} />
            </Card>

            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-3">
                {(t as any)('controls.coefficients') || 'Coefficients'}
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: degree + 1 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="text-xs font-mono font-bold w-6">s^{degree - i}</label>
                    <input
                      type="number"
                      className="w-full bg-background-surface border border-border-strong rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                      value={coeffs[i]}
                      onChange={(e) => handleCoeffChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard 
              label={(t as any)('metrics.systemState') || 'System State'} 
              value={result.isStable ? ((t as any)('labels.stable') || 'Stable') : ((t as any)('labels.unstable') || 'Unstable')} 
            />
            <MetricCard 
              label={(t as any)('metrics.signChanges') || 'Sign Changes (RHP Poles)'} 
              value={result.rhpPoles.toString()} 
            />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              The Routh-Hurwitz criterion determines absolute stability algebraically. The number of sign changes in the first column (Pivot) exactly equals the number of roots in the Right-Half Plane (RHP).
            </p>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Routh Stability"
      />
    </div>
  );
}
