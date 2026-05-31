import { useState } from 'react';
import { formatters, parsers } from '../../utils/formatters';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  decimals?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}

export const NumberInput = ({
  label,
  value,
  onChange,
  unit = '',
  decimals = 2,
  placeholder = '0',
  min,
  max,
  required = false,
  disabled = false,
  hint,
}: NumberInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      setError(null);
      onChange(0);
      return;
    }

    const numValue = parsers.number(inputValue);

    if (isNaN(numValue)) {
      setError('Ungültiges Format');
      return;
    }

    if (min !== undefined && numValue < min) {
      setError(`Mindest: ${min}${unit}`);
      return;
    }

    if (max !== undefined && numValue > max) {
      setError(`Maximum: ${max}${unit}`);
      return;
    }

    setError(null);
    onChange(numValue);
  };

  const displayValue = isFocused
    ? value.toString().replace('.', ',')
    : formatters.decimal(value, decimals);

  return (
    <div className="form-group">
      <label className="form-label">
        <span className="flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
          {unit && <span className="text-xs font-normal text-tertiary">({unit})</span>}
        </span>
      </label>
      <div className="relative group">
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input w-full transition-all ${
            error ? 'border-error focus:border-error' : ''
          } ${disabled ? 'opacity-50' : ''}`}
        />
        {unit && !isFocused && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-tertiary text-sm font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {hint && !error && <p className="form-hint text-xs">{hint}</p>}
      {error && <p className="form-error text-xs flex items-center gap-1">⚠️ {error}</p>}
    </div>
  );
};
