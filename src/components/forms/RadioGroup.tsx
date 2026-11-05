import React from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  options: (RadioOption | string)[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | { message?: string };
  id?: string;
}

export const RadioGroup = ({ label, name, value, options, onChange, required, error, id }: RadioGroupProps) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const normalizedOptions: RadioOption[] = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  return (
    <div className="flex flex-col relative w-full" id={id || `field-${name}`}>
      <label className="text-[11px] font-bold text-[#0f2e60] mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <div className={`flex flex-wrap items-center gap-6 px-3 py-2 rounded-lg transition-colors ${
        errorMessage 
          ? 'border border-red-500 bg-red-50/40 ring-1 ring-red-400/20' 
          : 'border border-[#1e3a8a]/20 bg-gray-50/20'
      }`}>
        {normalizedOptions.map(opt => (
          <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer">
            <input 
              type="radio" 
              name={name} 
              value={opt.value} 
              checked={value === opt.value} 
              onChange={() => onChange(opt.value)} 
              className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {errorMessage && <span className="text-xs text-red-600 font-semibold mt-1">Please select an option</span>}
    </div>
  );
};
