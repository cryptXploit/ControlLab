import { useRef, useState } from 'react';
import { useDCMotorStore } from '@/store/useDCMotorStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { EntitlementEngine } from '@/core/entitlements/EntitlementEngine';
import { HapticService } from '@/services/haptics/HapticService';
import { explainDCMotor } from '@/core/rules/explainWhy';
import Graph from '@/components/Graph';
import DCMotorVisual from '@/components/DCMotorVisual';
import { Save, Play, Square, CheckCircle } from 'lucide-react';

export default function DCMotorLab() {
  const { Kp, Kd, setpoint, result, setParameters } = useDCMotorStore();
  const { projects, addProject } = useProjectStore();
  const { isPro } = useSettingsStore();
  const { activeChallenge, isCompleted, evaluateChallenge, clearChallenge } = useChallengeStore();
  const motorRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const explanation = explainDCMotor(Kp, Kd, result?.metrics.overshoot || 0);

  const handleSave = async () => {
    const { allowed, message } = EntitlementEngine.canSaveNewProject(projects.length, isPro);
    if (!allowed) {
      HapticService.triggerWarning();
      alert(message);
      return;
    }

    await addProject(
      `DC Motor Pos Kp=${Kp.toFixed(1)} Kd=${Kd.toFixed(1)} Tgt=${setpoint}°`,
      'DC_MOTOR',
      { Kp, Kd, setpoint },
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

  const playAnimation = () => {
    if (!result) return;
    if (isPlaying) {
      cancelAnimationFrame(animationRef.current!);
      setIsPlaying(false);
      // Reset position
      if (motorRef.current) motorRef.current.style.transform = `rotate(0deg)`;
      return;
    }

    setIsPlaying(true);
    
    // Start at initial state 0 degrees
    if (motorRef.current) motorRef.current.style.transform = `rotate(0deg)`;

    const DURATION_MS = 5000; // 5 seconds
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
        // Snap to final state
        if (motorRef.current) {
          motorRef.current.style.transform = `rotate(${result.output[result.output.length - 1]}deg)`;
        }
        setIsPlaying(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl w-full mt-4 mb-16">
      
      {activeChallenge && activeChallenge.labType === 'DC_MOTOR' && (
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
          <h2 className="text-2xl font-bold text-text-primary">DC Motor Position Control</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" /> Save to Projects
          </button>
        </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Visual & Controls */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="bg-background-base border border-border-subtle p-6 rounded-lg flex flex-col items-center gap-6">
            <DCMotorVisual ref={motorRef} />
            <button
              onClick={playAnimation}
              className={`flex items-center gap-2 px-6 py-3 text-white rounded-md font-bold transition-all ${
                isPlaying ? 'bg-status-warning hover:bg-status-warning/90' : 'bg-status-success hover:bg-status-success/90'
              }`}
            >
              {isPlaying ? <><Square className="w-5 h-5" /> Stop Simulation</> : <><Play className="w-5 h-5" /> Play Animation</>}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Proportional Gain (Kp)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{Kp.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={Kp}
              onChange={(e) => setParameters(parseFloat(e.target.value), Kd, setpoint)}
              className="w-full accent-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Derivative Gain (Kd)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{Kd.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={Kd}
              onChange={(e) => setParameters(Kp, parseFloat(e.target.value), setpoint)}
              className="w-full accent-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Target Angle (°)</span>
              <span className="font-mono text-accent-primary bg-background-base px-2 py-0.5 rounded">{setpoint.toFixed(0)}°</span>
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={setpoint}
              onChange={(e) => setParameters(Kp, Kd, parseFloat(e.target.value))}
              className="w-full accent-accent-primary"
            />
          </div>
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

          {result && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background-base border border-border-subtle p-3 rounded-md">
                <div className="text-xs text-text-muted font-medium uppercase mb-1">Overshoot</div>
                <div className="text-lg font-mono text-text-primary">{result.metrics.overshoot.toFixed(1)}%</div>
              </div>
              <div className="bg-background-base border border-border-subtle p-3 rounded-md">
                <div className="text-xs text-text-muted font-medium uppercase mb-1">Settling Time</div>
                <div className="text-lg font-mono text-text-primary">{result.metrics.settlingTime.toFixed(2)}s</div>
              </div>
              <div className="bg-background-base border border-border-subtle p-3 rounded-md">
                <div className="text-xs text-text-muted font-medium uppercase mb-1">Steady-State Error</div>
                <div className="text-lg font-mono text-text-primary">{result.metrics.steadyStateError.toFixed(2)}°</div>
              </div>
            </div>
          )}

          <div className="bg-background-surface border border-accent-primary/20 p-5 rounded-lg mt-auto">
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
