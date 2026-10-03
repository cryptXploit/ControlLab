import React, { useRef, useState, useEffect } from 'react';
import { HapticService } from '@/services/haptics/HapticService';

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
  const lastInt = useRef(Math.floor(value));
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (val: number) => {
    const newInt = Math.floor(val);
    if (newInt !== lastInt.current) {
      HapticService.triggerSelection();
      lastInt.current = newInt;
    }
    onChange(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    let val = parseFloat(inputValue);
    if (isNaN(val)) {
      setInputValue(value.toString());
      return;
    }
    if (val < min) val = min;
    if (val > max) val = max;
    
    setInputValue(val.toString());
    if (val !== value) {
      handleChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        <div className="flex items-center gap-1">
          <input 
            type="number" 
            value={inputValue} 
            min={min} 
            max={max} 
            step={step}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-20 px-2 py-1 text-sm text-right bg-background-surface border border-border-strong rounded-md focus:outline-none focus:border-accent-primary text-text-primary font-mono tabular-nums tracking-tight"
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
        onChange={(e) => handleChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-border-strong rounded-lg appearance-none cursor-pointer accent-accent-primary"
      />
    </div>
  );
}
