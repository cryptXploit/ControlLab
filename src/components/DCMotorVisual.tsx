import { forwardRef } from 'react';

interface DCMotorVisualProps {
  className?: string;
}

const DCMotorVisual = forwardRef<HTMLDivElement, DCMotorVisualProps>(({ className = '' }, ref) => {
  return (
    <div className={`w-full max-w-[200px] md:max-w-[250px] aspect-square relative flex items-center justify-center rounded-full border-4 border-border-strong bg-bg-surface-elevated shadow-inner overflow-hidden ${className}`}>
      {/* Center Hub */}
      <div className="absolute w-[15%] h-[15%] rounded-full bg-border-strong z-10" />
      
      {/* Rotational Element */}
      <div 
        ref={ref} 
        className="absolute w-full h-full flex items-center justify-end"
        style={{ transformOrigin: 'center center' }}
      >
        {/* The Shaft Indicator (Points to 0 degrees which is right/East by default in CSS) */}
        <div className="w-[45%] h-1 md:h-1.5 bg-accent-primary rounded-r-md shadow-md" />
      </div>

      {/* Angle markings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-mono text-text-muted">-90°</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-mono text-text-muted">90°</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-mono text-text-muted">±180°</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-mono text-text-muted">0°</div>
      </div>
    </div>
  );
});

DCMotorVisual.displayName = 'DCMotorVisual';
export default DCMotorVisual;
