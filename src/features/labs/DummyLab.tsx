import { useLabStore } from '@/store/useLabStore';
import Graph from '@/components/Graph';

export default function DummyLab() {
  const { gain, timeConstant, result, setParameters } = useLabStore();

  return (
    <div className="bg-background-elevated border border-border-subtle p-8 rounded-xl shadow-lg max-w-4xl w-full mt-8">
      <h2 className="text-xl font-semibold mb-6">Simulation Engine Test (60FPS)</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Gain (K)</span>
              <span className="font-mono text-accent-primary">{gain.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={gain}
              onChange={(e) => setParameters(parseFloat(e.target.value), timeConstant)}
              className="w-full accent-accent-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary flex justify-between">
              <span>Time Constant (τ)</span>
              <span className="font-mono text-accent-primary">{timeConstant.toFixed(2)}s</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={timeConstant}
              onChange={(e) => setParameters(gain, parseFloat(e.target.value))}
              className="w-full accent-accent-primary"
            />
          </div>

          {result && (
            <div className="mt-4 p-4 rounded-md bg-background-base border border-border-subtle">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Real-time Metrics</h3>
              <div className="flex justify-between text-sm">
                <span>Steady State: <strong className="font-mono">{result.metrics.steadyState.toFixed(2)}</strong></span>
                <span>Settling Time: <strong className="font-mono">{result.metrics.settlingTime.toFixed(2)}s</strong></span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-[2] min-h-[300px]">
          {result && (
            <Graph 
              time={result.time} 
              output={result.output} 
              width={500} 
              height={300} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
