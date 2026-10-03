import { forwardRef } from 'react';

interface DCMotorVisualProps {
  className?: string;
}

const DCMotorVisual = forwardRef<HTMLDivElement, DCMotorVisualProps>(({ className = '' }, ref) => {
  return (
    <div className={`relative w-48 h-48 rounded-full border-4 border-border-strong bg-background-surface flex items-center justify-center shadow-inner overflow-hidden ${className}`}>
      {/* Center Hub */}
      <div className="absolute w-6 h-6 rounded-full bg-border-strong z-10" />
      
      {/* Rotational Element */}
      <div 
        ref={ref} 
        className="absolute w-full h-full flex items-center justify-end"
        style={{ transformOrigin: 'center center' }}
      >
        {/* The Shaft Indicator (Points to 0 degrees which is right/East by default in CSS) */}
        <div className="w-1/2 h-2 bg-accent-primary rounded-r-md shadow-md" />
      </div>

      {/* Angle markings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-mono text-text-muted">-90°</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono text-text-muted">90°</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">±180°</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">0°</div>
      </div>
    </div>
  );
});

DCMotorVisual.displayName = 'DCMotorVisual';
export default DCMotorVisual;
