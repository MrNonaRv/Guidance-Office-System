import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string | { message?: string };
  id?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

export const InputGroup = ({ label, name, value, onChange, required, error, id, placeholder, type = "text", disabled }: InputGroupProps) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  return (
    <div className="flex flex-col relative w-full" id={id || `field-${name}`}>
      <label className="text-[11px] font-bold text-[#0f2e60] mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <input 
        type={type} 
        name={name} 
        value={value || ''} 
        placeholder={placeholder}
        onChange={onChange} 
        disabled={disabled}
        className={`border rounded px-3 py-1.5 text-sm outline-none transition-colors w-full placeholder:text-gray-400 ${
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
        } ${
          errorMessage ? 'border-red-500 bg-red-50/40 focus:ring-1 focus:ring-red-500' : 'border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]'
        }`} 
      />
      {errorMessage && <span className="text-xs text-red-600 font-semibold mt-1">{errorMessage}</span>}
    </div>
  );
};
