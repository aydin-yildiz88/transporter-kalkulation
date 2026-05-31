import { useState } from 'react';
import { formatters, parsers } from '../../utils/formatters';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}

export const CurrencyInput = ({
  label,
  value,
  onChange,
  placeholder = '0,00 €',
  min,
  max,
  required = false,
  disabled = false,
  hint,
}: CurrencyInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      setError(null);
      onChange(0);
      return;
    }

    const numValue = parsers.currency(inputValue);

    if (isNaN(numValue)) {
      setError('Ungültiges Format');
      return;
    }

    if (min !== undefined && numValue < min) {
      setError(`Mindestbetrag: ${formatters.currency(min)}`);
      return;
    }

    if (max !== undefined && numValue > max) {
      setError(`Maximalbetrag: ${formatters.currency(max)}`);
      return;
    }

    setError(null);
    onChange(numValue);
  };

  const displayValue = isFocused
    ? value.toString().replace('.', ',')
    : formatters.currency(value);

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
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
      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};
