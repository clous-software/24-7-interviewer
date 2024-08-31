import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  error: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  error,
}) => (
  <section className="relative mb-6">
    <label className={`block text-gray-700 text-sm font-bold mb-2 transition-all duration-300 ease-in-out ${value ? 'transform -translate-y-6 scale-75' : 'absolute left-3 top-3'}`}>
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="w-96 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
    />
    {error && (
      <p className="absolute top-10 text-red-500 text-sm flex items-center">
        <span>{error}</span>
      </p>
    )}
  </section>
);

export default FormField;
