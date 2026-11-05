import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ScholarshipCategorySection = ({ 
  formData, 
  handleFundTypeChange, 
  handleScholarshipToggle, 
  errors, 
  scholarshipStructure 
}: any) => {
  return (
    <>
      <div className="bg-[#1846b0] text-white text-center py-2.5 rounded-lg font-bold tracking-wider mb-6 text-sm mt-8">SCHOLARSHIP CATEGORY</div>
      
      <div 
        id="scholarship-category-section" 
        className={`p-4 sm:p-6 rounded-xl border shadow-sm mb-6 scroll-mt-20 transition-all ${
          errors.scholarship 
            ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' 
            : 'bg-[#f8faff] sm:bg-[#fcfdff] border-[#93c5fd]'
        }`}
      >
        {errors.scholarship && (
          <div className="p-3 mb-5 bg-red-50 border border-red-500 rounded-lg text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errors.scholarship.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleFundTypeChange('Internal')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              formData.scholarshipFundType === 'Internal'
                ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div>
              <div className="font-bold text-sm text-[#1e3a8a] flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${formData.scholarshipFundType === 'Internal' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                  {formData.scholarshipFundType === 'Internal' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                A. Internally-Funded
              </div>
              <p className="text-xs text-gray-500 mt-1 pl-6">University academic, leadership, and socio-cultural grants</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleFundTypeChange('External')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              formData.scholarshipFundType === 'External'
                ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div>
              <div className="font-bold text-sm text-[#1e3a8a] flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${formData.scholarshipFundType === 'External' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                  {formData.scholarshipFundType === 'External' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                B. Externally-Funded
              </div>
              <p className="text-xs text-gray-500 mt-1 pl-6">CHED, UniFAST, DOST, Merit, LGU, and DSWD grants</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};
