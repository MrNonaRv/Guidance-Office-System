import React from 'react';
import { User } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { InputGroup } from './InputGroup';

export const StudyClassificationSection = ({ control, errors, formData, handleCheckboxChange }: any) => {
  return (
    <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
      <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
        <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
        <h3 className="font-bold text-[#1e3a8a] text-[13px]">Study Classification</h3>
      </div>
      <div className="p-3 sm:p-4">
        <div id="field-studentClassification" className={`rounded-xl p-3 transition-colors ${
          errors.studentClassification ? 'border border-red-500 bg-red-50/40 ring-1 ring-red-400/20' : 'border border-transparent'
        }`}>
          <label className="block text-[12px] font-bold text-[#0f2e60] mb-3 flex items-center gap-1">
            Which of the following classification best describe your current status? (Multiple responses) <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {[
              'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
              'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school', 'Rebel returnees', 'Child of a rebel returnees',
              'Dependent or child of OFW', 'Member of 4Ps', 'Member of Calamity or Disaster Affected Family', 'Orphan/Child in need of special protection',
              'Working Student', 'From geographically isolated & disadvantaged area (GIDA)', 'Muslim Student', 'Low income family/ Economically disadvantaged student',
              'Senior Citizen student', 'First Generation student (Parents did not complete a college degree, first in the immediate family to seek college admission)',
              'LGBTQ+ Community', 'Regular student (I do not belong to any of this group classification)'
            ].map(opt => (
              <label key={opt} className="flex items-start gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.studentClassification?.includes(opt)} 
                  onChange={() => handleCheckboxChange('studentClassification', opt)} 
                  className="w-3.5 h-3.5 mt-0.5 rounded-sm text-blue-600 focus:ring-blue-500 shrink-0" 
                />
                <span className="leading-snug">{opt}</span>
              </label>
            ))}
            <div className="col-span-1 sm:col-span-2 mt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.studentClassification?.includes('Others')} 
                  onChange={() => handleCheckboxChange('studentClassification', 'Others')} 
                  className="w-3.5 h-3.5 rounded-sm text-blue-600 focus:ring-blue-500 shrink-0" 
                /> 
                <span>others (Please specify)</span>
              </label>
              {formData.studentClassification?.includes('Others') && (
                <div className="mt-2 ml-6 max-w-lg">
                  <Controller name="studentClassificationOthers" control={control} render={({ field }) => (
                    <InputGroup
                      label="Please specify classification"
                      {...field}
                      placeholder="Please specify"
                      required
                      error={errors.studentClassificationOthers?.message}
                    />
                  )} />
                </div>
              )}
            </div>
          </div>
          {errors.studentClassification && <span className="text-xs text-red-600 font-semibold mt-2 block">{errors.studentClassification.message}</span>}
        </div>
        
        <div className="mt-8 space-y-6">
          <Controller name="workTypeIncome" control={control} render={({ field }) => (
            <InputGroup
              label="If you are working student, please indicate your type of work or source of income"
              {...field}
              required
              error={errors.workTypeIncome?.message}
            />
          )} />
          
          <Controller name="specialNeedsCondition" control={control} render={({ field }) => (
            <InputGroup
              label="If you are a student with special needs/Person with disability (PWD), please specify your condition or disability"
              {...field}
              required
              error={errors.specialNeedsCondition?.message}
            />
          )} />
          
          <Controller name="pdlReason" control={control} render={({ field }) => (
            <InputGroup
              label="If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted"
              {...field}
              required
              error={errors.pdlReason?.message}
            />
          )} />
        </div>
      </div>
    </div>
  );
};
