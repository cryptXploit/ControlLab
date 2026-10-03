import React from 'react';

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (val: number) => void;
}

export function SliderField({ label, value, min, max, step, unit = '', onChange }: SliderFieldProps) {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      if (val < min) val = min;
      if (val > max) val = max;
      onChange(val);
    }
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        <div className="flex items-center gap-1">
          <input 
            type="number" 
            value={value} 
            min={min} 
            max={max} 
            step={step}
            onChange={handleNumberChange}
            className="w-20 px-2 py-1 text-sm text-right bg-bg-surface border border-border-strong rounded-md focus:outline-none focus:border-accent-primary text-text-primary"
          />
          {unit && <span className="text-xs text-text-secondary w-6">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-accent-primary"
      />
    </div>
  );
}
