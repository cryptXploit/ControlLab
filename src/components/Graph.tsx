import { useEffect, useRef } from 'react';
import uPlot, { type Options } from 'uplot';
import 'uplot/dist/uPlot.min.css';

interface GraphProps {
  time: Float32Array;
  output: Float32Array;
  setpoint?: Float32Array;
  width?: number;
  height?: number;
}

export default function Graph({ time, output, setpoint, width = 600, height = 300 }: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Helper to get actual color from CSS variable for Canvas
    const getColor = (varName: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#0ea5e9';
    };

    const seriesOptions: any[] = [
      {},
      {
        stroke: getColor('--graph-primary'),
        width: 2
      }
    ];

    if (setpoint) {
      seriesOptions.push({
        stroke: getColor('--text-muted'),
        width: 1,
        dash: [5, 5] // Dashed line for setpoint
      });
    }

    const options: Options = {
      width,
      height,
      axes: [
        {
          stroke: getColor('--text-secondary'),
          grid: { stroke: getColor('--border-subtle'), width: 1 }
        },
        {
          stroke: getColor('--text-secondary'),
          grid: { stroke: getColor('--border-subtle'), width: 1 }
        }
      ],
      series: seriesOptions
    };

    const data: any[] = [
      Array.from(time),
      Array.from(output)
    ];

    if (setpoint) {
      data.push(Array.from(setpoint));
    }

    plotRef.current = new uPlot(options, data as uPlot.AlignedData, containerRef.current);

    return () => {
      plotRef.current?.destroy();
      plotRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, !!setpoint]); // Re-init if setpoint presence changes

  useEffect(() => {
    if (plotRef.current) {
      const data: any[] = [Array.from(time), Array.from(output)];
      if (setpoint) data.push(Array.from(setpoint));
      plotRef.current.setData(data as uPlot.AlignedData);
    }
  }, [time, output, setpoint]);

  return <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-background-surface rounded-md border border-border-subtle overflow-hidden" />;
}
