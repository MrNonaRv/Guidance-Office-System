import React from 'react';
import { User } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { RadioGroup } from './RadioGroup';

export const AccessToResourcesSection = ({ control, errors, formData, handleCheckboxChange }: any) => {
  return (
    <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
      <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
        <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
        <h3 className="font-bold text-[#1e3a8a] text-[13px]">Access to Resources</h3>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div id="field-accessToResources" className={`rounded-xl p-2.5 transition-colors ${
            errors.accessToResources ? 'border border-red-500 bg-red-50/40 ring-1 ring-red-400/20' : 'border border-transparent'
          }`}>
            <label className="block text-[12px] font-bold text-[#0f2e60] mb-3 flex items-center gap-1">
              Do you have access of the following at home? <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="space-y-2">
              {['Personal Computer/Laptop', 'Internet Connection', 'Study space', 'Textbooks and learning materials', 'None of the above'].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.accessToResources?.includes(opt)} 
                    onChange={() => handleCheckboxChange('accessToResources', opt)} 
                    className="w-3.5 h-3.5 rounded-sm text-blue-600 focus:ring-blue-500" 
                  /> {opt}
                </label>
              ))}
            </div>
            {errors.accessToResources && <span className="text-xs text-red-600 font-semibold mt-2 block">{errors.accessToResources.message}</span>}
          </div>
          <div>
            <Controller name="workingStudent" control={control} render={({ field }) => (
              <RadioGroup
                label="Do you work while studying?"
                {...field}
                options={['Yes, full-time', 'Yes, part-time', 'No']}
                onChange={field.onChange}
                required
                error={errors.workingStudent?.message}
              />
            )} />
          </div>
        </div>
      </div>
    </div>
  );
};
