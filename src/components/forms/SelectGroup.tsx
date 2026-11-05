import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  error?: string | { message?: string };
  id?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectGroup = ({ label, name, value, onChange, options, required, error, id, disabled, placeholder = 'Select' }: SelectGroupProps) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  return (
    <div className="flex flex-col relative w-full" id={id || `field-${name}`}>
      <label className="text-[11px] font-bold text-[#0f2e60] mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <div className="relative w-full">
        <select 
          name={name} 
          value={value || ''} 
          onChange={onChange} 
          disabled={disabled}
          className={`border rounded px-3 py-1.5 text-sm outline-none appearance-none transition-colors w-full ${
            !value ? 'text-gray-400' : 'text-gray-800'
          } ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
          } ${
            errorMessage ? 'border-red-500 bg-red-50/40 focus:ring-1 focus:ring-red-500' : 'border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]'
          }`}
        >
          <option value="" disabled className="text-gray-400">{placeholder}</option>
          {options.map((opt: string) => <option key={opt} value={opt} className="text-gray-800">{opt}</option>)}
        </select>
        <div className="absolute right-3 top-2.5 pointer-events-none">
          <ChevronDown className={`w-4 h-4 ${errorMessage ? 'text-red-500' : 'text-[#1e3a8a]'}`} />
        </div>
      </div>
      {errorMessage && <span className="text-xs text-red-600 font-semibold mt-1">Please select an option</span>}
    </div>
  );
};
