import { useEffect, useRef, useState } from 'react';
import uPlot, { type Options } from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from '@/store/useLocaleStore';
import { Button } from '@/components/ui/Button';

interface GraphProps {
  time: Float32Array;
  output: Float32Array;
  setpoint?: Float32Array;
}

export default function Graph({ time, output, setpoint }: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const initChart = () => {
      const getColor = (varName: string, fallback: string) => {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
      };

      const rect = containerRef.current!.getBoundingClientRect();
      const initialWidth = rect.width > 0 ? rect.width : 600;
      const initialHeight = rect.height > 0 ? rect.height : 300;

      const seriesOptions: any[] = [
        {},
        {
          stroke: getColor('--graph-primary', '#0ea5e9'),
          width: 2
        }
      ];

      if (setpoint) {
        seriesOptions.push({
          stroke: getColor('--text-muted', '#64748b'),
          width: 1,
          dash: [5, 5]
        });
      }

      const options: Options = {
        width: initialWidth,
        height: initialHeight,
        axes: [
          {
            stroke: getColor('--text-secondary', '#334155'),
            grid: { stroke: getColor('--border-subtle', '#e2e8f0'), width: 1 }
          },
          {
            stroke: getColor('--text-secondary', '#334155'),
            grid: { stroke: getColor('--border-subtle', '#e2e8f0'), width: 1 }
          }
        ],
        series: seriesOptions,
        hooks: {
          setSelect: [
            () => {
              setIsZoomed(true);
            }
          ]
        }
      };

      const data: any[] = [
        Array.from(time),
        Array.from(output)
      ];

      if (setpoint) {
        data.push(Array.from(setpoint));
      }

      if (plotRef.current) {
        plotRef.current.destroy();
      }
      
      plotRef.current = new uPlot(options, data as uPlot.AlignedData, containerRef.current!);
    };

    // Initialize or Reinitialize when theme / setpoint presence changes
    setTimeout(initChart, 50);

    return () => {
      if (plotRef.current) {
        plotRef.current.destroy();
        plotRef.current = null;
      }
    };
  }, [theme, !!setpoint]); 

  useEffect(() => {
    if (plotRef.current) {
      const data: any[] = [Array.from(time), Array.from(output)];
      if (setpoint) data.push(Array.from(setpoint));
      plotRef.current.setData(data as uPlot.AlignedData);
      setIsZoomed(false);
    }
  }, [time, output, setpoint]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      if (!plotRef.current) return;
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          plotRef.current.setSize({ width, height });
        }
      }
    });
    
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleResetZoom = () => {
    if (!plotRef.current) return;
    const data: any[] = [Array.from(time), Array.from(output)];
    if (setpoint) data.push(Array.from(setpoint));
    plotRef.current.setData(data as uPlot.AlignedData);
    setIsZoomed(false);
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div 
        ref={containerRef} 
        className="w-full h-full bg-bg-surface overflow-hidden rounded-lg" 
      />
      {isZoomed && (
        <div className="absolute top-2 right-2 z-10 animate-in fade-in">
          <Button onClick={handleResetZoom} size="sm" variant="secondary">
            {(t as any)('graph.resetZoom')}
          </Button>
        </div>
      )}
    </div>
  );
}
