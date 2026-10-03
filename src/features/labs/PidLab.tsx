import { usePidStore } from '@/store/usePidStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainPID } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import { Save, CheckCircle } from 'lucide-react';

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
    <div className="flex flex-col gap-4 max-w-5xl w-full mt-4 mb-16">
      
      {activeChallenge && activeChallenge.labType === 'PID' && (
        <div className={`p-4 rounded-xl border ${isCompleted ? 'bg-status-success/10 border-status-success' : 'bg-background-elevated border-accent-primary'} flex items-center justify-between shadow-sm transition-colors`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isCompleted ? <CheckCircle className="w-5 h-5 text-status-success" /> : <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />}
              <h3 className={`font-bold ${isCompleted ? 'text-status-success' : 'text-accent-primary'}`}>
                {isCompleted ? 'Challenge Completed ✓' : activeChallenge.title}
              </h3>
            </div>
            <p className="text-sm text-text-secondary">{activeChallenge.description}</p>
          </div>
          <div className="flex gap-2">
            {!isCompleted ? (
              <button 
                onClick={handleCheckSolution}
                className="px-4 py-2 bg-accent-primary text-white rounded font-medium hover:opacity-90 transition-opacity"
              >
                Check Solution
              </button>
            ) : (
              <button 
                onClick={clearChallenge}
                className="px-4 py-2 border border-border-strong text-text-secondary rounded font-medium hover:bg-background-surface transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-background-elevated border border-border-subtle p-8 rounded-xl shadow-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">PID Controller</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-background-surface border border-border-strong text-text-primary rounded-md font-medium hover:bg-background-base transition-colors"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Controls */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Proportional (Kp)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{Kp.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={Kp}
              onChange={(e) => setParameters(parseFloat(e.target.value), Ki, Kd, setpoint)}
              className="w-full accent-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Integral (Ki)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{Ki.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={Ki}
              onChange={(e) => setParameters(Kp, parseFloat(e.target.value), Kd, setpoint)}
              className="w-full accent-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Derivative (Kd)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{Kd.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={Kd}
              onChange={(e) => setParameters(Kp, Ki, parseFloat(e.target.value), setpoint)}
              className="w-full accent-accent-primary"
            />
          </div>

          {result && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-background-base border border-border-subtle p-3 rounded-md">
                <div className="text-xs text-text-muted font-medium uppercase mb-1">Overshoot</div>
                <div className="text-lg font-mono text-text-primary">{result.metrics.overshoot.toFixed(1)}%</div>
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
                setpoint={result.setpoint}
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
    </div>
  );
}
