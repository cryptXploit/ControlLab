import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainFirstOrder } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import { Save } from 'lucide-react';

export default function FirstOrderLab() {
  const { K, tau, result, setParameters } = useFirstOrderStore();
  const { projects, addProject } = useProjectStore();
  const { isPro } = useSettingsStore();

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
    <div className="bg-background-elevated border border-border-subtle p-8 rounded-xl shadow-lg max-w-5xl w-full mt-4 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">First-Order System (Step Response)</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" /> Save to Projects
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Controls */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Gain (K)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{K.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={K}
              onChange={(e) => setParameters(parseFloat(e.target.value), tau)}
              className="w-full accent-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Time Constant (τ)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{tau.toFixed(1)}s</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={tau}
              onChange={(e) => setParameters(K, parseFloat(e.target.value))}
              className="w-full accent-accent-primary"
            />
          </div>

          {result && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-background-base border border-border-subtle p-3 rounded-md">
                <div className="text-xs text-text-muted font-medium uppercase mb-1">Rise Time</div>
                <div className="text-lg font-mono text-text-primary">{result.metrics.riseTime.toFixed(2)}s</div>
              </div>
              <div className="bg-background-base border border-border-subtle p-3 rounded-md">
                <div className="text-xs text-text-muted font-medium uppercase mb-1">Settling Time</div>
                <div className="text-lg font-mono text-text-primary">{result.metrics.settlingTime.toFixed(2)}s</div>
              </div>
              <div className="bg-background-base border border-border-subtle p-3 rounded-md col-span-2">
                <div className="text-xs text-text-muted font-medium uppercase mb-1">Steady-State Error</div>
                <div className="text-lg font-mono text-text-primary">{result.metrics.steadyStateError.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Graph & Explain */}
        <div className="flex-[2] flex flex-col gap-6">
          <div className="w-full min-h-[300px]">
            {result && (
              <Graph 
                time={result.time} 
                output={result.output} 
                width={600} 
                height={300} 
              />
            )}
          </div>

          <div className="bg-background-surface border border-accent-primary/20 p-5 rounded-lg">
            <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wider mb-2">Explain Why</h3>
            <p className="text-text-primary leading-relaxed">{explanation.why}</p>
            <div className="mt-3 text-sm text-text-secondary bg-background-base p-2 rounded inline-block">
              <strong className="text-text-primary">Suggestion:</strong> {explanation.nextAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
