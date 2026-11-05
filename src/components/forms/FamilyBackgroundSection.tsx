import React from 'react';
import { User } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { InputGroup } from './InputGroup';
import { SelectGroup } from './SelectGroup';
import { RadioGroup } from './RadioGroup';

export const FamilyBackgroundSection = ({ control, errors }: any) => {
  return (
    <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
      <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
        <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
        <h3 className="font-bold text-[#1e3a8a] text-[13px]">Family Background</h3>
      </div>
      <div className="p-3 sm:p-4 space-y-6">
        <div>
          <div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Father Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] gap-3 sm:gap-4">
            <Controller name="fatherName" control={control} render={({ field }) => <InputGroup label="Name" {...field} required placeholder="e.g. Rafael Tuvera" error={errors.fatherName?.message || errors.fatherName} />} />
            <Controller name="fatherOccupation" control={control} render={({ field }) => <InputGroup label="Occupation" {...field} required placeholder="e.g. Farmer / Deceased / N/A" error={errors.fatherOccupation?.message || errors.fatherOccupation} />} />
            <Controller name="fatherContact" control={control} render={({ field }) => <InputGroup label="Contact No." {...field} required placeholder="09xxxxxxxxxxxx / N/A" error={errors.fatherContact?.message || errors.fatherContact} />} />
          </div>
        </div>
        <div>
          <div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Mother Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] gap-3 sm:gap-4">
            <Controller name="motherName" control={control} render={({ field }) => <InputGroup label="Name (Maiden Name)" {...field} required placeholder="e.g. Maria A. Sermon" error={errors.motherName?.message || errors.motherName} />} />
            <Controller name="motherOccupation" control={control} render={({ field }) => <InputGroup label="Occupation" {...field} required placeholder="e.g. Housewife / Deceased / N/A" error={errors.motherOccupation?.message || errors.motherOccupation} />} />
            <Controller name="motherContact" control={control} render={({ field }) => <InputGroup label="Contact No." {...field} required placeholder="09xxxxxxxxxxxx / N/A" error={errors.motherContact?.message || errors.motherContact} />} />
          </div>
        </div>
        <div>
          <div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Guardian Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] gap-3 sm:gap-4">
            <Controller name="guardianName" control={control} render={({ field }) => <InputGroup label="Name" {...field} required placeholder="e.g. Martin L. Dela Cruz / N/A" error={errors.guardianName?.message || errors.guardianName} />} />
            <Controller name="guardianOccupation" control={control} render={({ field }) => <InputGroup label="Occupation" {...field} required placeholder="e.g. Employee / N/A" error={errors.guardianOccupation?.message || errors.guardianOccupation} />} />
            <Controller name="guardianContact" control={control} render={({ field }) => <InputGroup label="Contact No." {...field} required placeholder="09xxxxxxxxxxxx / N/A" error={errors.guardianContact?.message || errors.guardianContact} />} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] gap-4 sm:gap-6 mt-2">
          <Controller name="parentEduAttainment" control={control} render={({ field }) => (
            <SelectGroup 
              label="Highest Educational Attainment of Parent/Guardian"
              {...field}
              options={['Elementary Level', 'Elementary Graduate', 'High school Graduate', 'College Graduate', 'High School Level', 'College Level', 'post Graduate level/degree']}
              required
              error={errors.parentEduAttainment?.message || errors.parentEduAttainment}
            />
          )} />
          <Controller name="monthlyIncome" control={control} render={({ field }) => (
            <SelectGroup 
              label="Family Monthly Income"
              {...field}
              options={['below ₱ 10,000', '₱ 10,001 - ₱ 20,000', '₱ 20,001 - ₱ 30,000', 'Above ₱ 30,000']}
              required
              error={errors.monthlyIncome?.message || errors.monthlyIncome}
            />
          )} />
          <Controller name="firstInFamily" control={control} render={({ field }) => (
            <RadioGroup
              label="Are you the first in family to attend college?"
              {...field}
              options={['Yes', 'No']}
              onChange={field.onChange}
              required
              error={errors.firstInFamily?.message || errors.firstInFamily}
            />
          )} />
        </div>
      </div>
    </div>
  );
};
