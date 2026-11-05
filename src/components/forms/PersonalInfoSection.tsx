import React from 'react';
import { User } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { InputGroup } from './InputGroup';
import { SelectGroup } from './SelectGroup';
import { RadioGroup } from './RadioGroup';
import { capizMunicipalities } from '../../lib/capiz';

export const PersonalInfoSection = ({ control, errors, handlePhotoUpload, formData }: any) => {
  return (
    <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
      <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
        <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
        <h3 className="font-bold text-[#1e3a8a] text-[13px]">Personal Information</h3>
      </div>
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <div className="w-[120px] flex-shrink-0 flex flex-col items-center" id="field-photo2x2">
          <label className={`w-[110px] h-[110px] border-2 border-dashed mb-2 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-colors group relative rounded ${
            errors.photo2x2 ? 'border-red-500 bg-red-50/40 ring-1 ring-red-400/20' : 'border-[#1e3a8a] bg-white hover:bg-blue-50/50'
          }`}>
            {formData.photo2x2 ? (
              <img src={formData.photo2x2} alt="2x2" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <User className={`w-8 h-8 ${errors.photo2x2 ? 'text-red-500' : 'text-gray-300 group-hover:text-[#1e3a8a]'} transition-colors`} />
                <span className={`text-[9px] ${errors.photo2x2 ? 'text-red-600 font-bold' : 'text-gray-500 group-hover:text-[#1e3a8a]'} mt-1 font-semibold`}>Upload Photo</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          <label className="text-[11px] font-bold text-[#1e3a8a] underline underline-offset-2 cursor-pointer hover:text-blue-700 flex items-center gap-1">
            2 × 2 Picture <span className="text-red-500 font-bold">*</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          {errors.photo2x2 && <span className="text-xs text-red-600 font-semibold mt-1 text-center">This field is required</span>}
        </div>
        <div className="flex-1 w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
            <Controller name="familyName" control={control} render={({ field }) => <InputGroup label="Last Name" {...field} required placeholder="e.g. Dela Cruz" error={errors.familyName?.message} />} />
            <Controller name="firstName" control={control} render={({ field }) => <InputGroup label="First Name" {...field} required placeholder="e.g. Juan" error={errors.firstName?.message} />} />
            <Controller name="middleName" control={control} render={({ field }) => <InputGroup label="Middle Name" {...field} required placeholder="e.g. Santos" error={errors.middleName?.message} />} />
            <Controller name="suffix" control={control} render={({ field }) => <InputGroup label="Suffix" {...field} required placeholder="e.g. Jr. or N/A" error={errors.suffix?.message} />} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Controller name="birthdate" control={control} render={({ field }) => (
              <div className="flex flex-col relative" id="field-birthdate">
                <label className="text-[11px] font-bold text-[#0f2e60] mb-1 flex items-center gap-1">Birthdate <span className="text-red-500 font-bold">*</span></label>
                <input type="date" {...field} className={`w-full border rounded px-3 py-1.5 text-sm outline-none transition-colors ${errors.birthdate ? 'border-red-500 bg-red-50/40' : 'border-[#1e3a8a] bg-white'}`} />
                {errors.birthdate && <span className="text-xs text-red-600 font-semibold mt-1">{errors.birthdate.message}</span>}
              </div>
            )} />
            <Controller name="age" control={control} render={({ field }) => <InputGroup label="Age" {...field} required placeholder="e.g. 18" error={errors.age?.message} />} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1">
            <Controller name="sex" control={control} render={({ field }) => <RadioGroup label="Sex" {...field} options={['Male', 'Female']} onChange={field.onChange} required error={errors.sex?.message} />} />
            <Controller name="civilStatus" control={control} render={({ field }) => <RadioGroup label="Civil Status" {...field} options={['Single', 'Married']} onChange={field.onChange} required error={errors.civilStatus?.message} />} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Controller name="yearLevel" control={control} render={({ field }) => <SelectGroup label="Year Level" {...field} options={['1st Year', '2nd Year', '3rd Year', '4th Year']} required error={errors.yearLevel?.message} />} />
            <Controller name="course" control={control} render={({ field }) => <SelectGroup label="Course" {...field} options={['BSCS', 'BSOA', 'BSFT', 'BAEL']} required error={errors.course?.message} />} />
            <Controller name="section" control={control} render={({ field }) => <SelectGroup label="Section" {...field} options={['A', 'B', 'C']} required error={errors.section?.message} />} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Controller name="contactNo" control={control} render={({ field }) => <InputGroup label="Contact No." {...field} required placeholder="09xxxxxxxxxxxx" error={errors.contactNo?.message} />} />
            <Controller name="email" control={control} render={({ field }) => <InputGroup label="Email" {...field} required placeholder="student@capsu.edu" error={errors.email?.message} />} />
          </div>
        </div>
      </div>
    </div>
  );
};
