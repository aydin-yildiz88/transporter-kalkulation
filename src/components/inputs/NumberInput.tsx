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
        {label}
        {unit && <span className="text-gray-500 text-sm ml-2">({unit})</span>}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${error ? 'border-red-500' : ''}`}
        />
        {unit && !isFocused && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};
