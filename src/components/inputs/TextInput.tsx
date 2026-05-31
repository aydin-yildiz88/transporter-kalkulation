import { useState } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  pattern?: string;
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  maxLength,
  required = false,
  disabled = false,
  hint,
  pattern,
}: TextInputProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (pattern && !new RegExp(pattern).test(inputValue)) {
      setError('Format ungültig');
      return;
    }

    setError(null);
    onChange(inputValue);
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={`form-input ${error ? 'border-red-500' : ''}`}
      />
      {maxLength && (
        <p className="text-xs text-gray-500 mt-1">
          {value.length}/{maxLength}
        </p>
      )}
      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};
