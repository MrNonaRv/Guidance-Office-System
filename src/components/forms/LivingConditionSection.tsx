import React from 'react';
import { User } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { InputGroup } from './InputGroup';
import { SelectGroup } from './SelectGroup';

export const LivingConditionSection = ({ control, errors, livingWith, housingType }: any) => {
  return (
    <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
      <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
        <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
        <h3 className="font-bold text-[#1e3a8a] text-[13px]">Living Condition</h3>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Controller name="livingWith" control={control} render={({ field }) => (
              <SelectGroup 
                label="With whom do you currently live?"
                {...field}
                options={['Parents/Guardians', 'Relatives', 'Alone', 'Boarding house', 'Others']}
                required
                error={errors.livingWith?.message}
              />
            )} />
            {livingWith === 'Others' && (
              <div className="mt-2 ml-1">
                <Controller name="livingWithOthers" control={control} render={({ field }) => (
                  <InputGroup
                    label="Please specify living arrangement"
                    {...field}
                    placeholder="Please specify"
                    required
                    error={errors.livingWithOthers?.message}
                  />
                )} />
              </div>
            )}
          </div>
          <div>
            <Controller name="housingType" control={control} render={({ field }) => (
              <SelectGroup 
                label="Type of Housing"
                {...field}
                options={['Own house', 'Rented house or apartment', 'Boarding house', 'Others']}
                required
                error={errors.housingType?.message}
              />
            )} />
            {housingType === 'Others' && (
              <div className="mt-2 ml-1">
                <Controller name="housingTypeOthers" control={control} render={({ field }) => (
                  <InputGroup
                    label="Please specify housing type"
                    {...field}
                    placeholder="Please specify"
                    required
                    error={errors.housingTypeOthers?.message}
                  />
                )} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
