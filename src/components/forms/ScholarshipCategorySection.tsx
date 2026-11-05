import React from 'react';
import { AlertCircle, Award } from 'lucide-react';

export const ScholarshipCategorySection = ({ 
  formData, 
  handleChange,
  handleFundTypeChange, 
  handleScholarshipToggle, 
  errors, 
  scholarshipStructure 
}: any) => {
  const scholarshipError = errors.scholarship?.message || errors.scholarship;

  return (
    <>
      <div className="bg-[#1846b0] text-white text-center py-2.5 rounded-lg font-bold tracking-wider mb-6 text-sm mt-8">SCHOLARSHIP CATEGORY</div>
      
      <div 
        id="scholarship-category-section" 
        className={`p-4 sm:p-6 rounded-xl border shadow-sm mb-6 scroll-mt-20 transition-all ${
          scholarshipError 
            ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' 
            : 'bg-[#f8faff] sm:bg-[#fcfdff] border-[#93c5fd]'
        }`}
      >
        {scholarshipError && (
          <div className="p-3 mb-5 bg-red-50 border border-red-500 rounded-lg text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{typeof scholarshipError === 'string' ? scholarshipError : scholarshipError.message}</span>
          </div>
        )}

        {/* FUNDING SOURCE TABS / RADIOS */}
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
            {formData.scholarshipFundType === 'Internal' && (formData.selectedScholarships || []).length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shrink-0 whitespace-nowrap ml-2">
                {(formData.selectedScholarships || []).length} / 2
              </span>
            )}
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
            {formData.scholarshipFundType === 'External' && (formData.selectedScholarships || []).length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shrink-0 whitespace-nowrap ml-2">
                {(formData.selectedScholarships || []).length} / 2
              </span>
            )}
          </button>
        </div>

        {/* SELECTION GROUPS */}
        {formData.scholarshipFundType && (
          <div className="space-y-6">
            {(formData.scholarshipFundType === 'Internal' ? scholarshipStructure.Internal : scholarshipStructure.External).map((group: any) => {
              const isCurrentCategoryGroup = formData.scholarshipSubCategory === group.subCategory;
              const groupSelections = isCurrentCategoryGroup ? (formData.selectedScholarships || []) : [];
              const isGroupFull = groupSelections.length >= 2;

              return (
                <div
                  key={group.subCategory}
                  className="mb-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0f2e60]">{group.title}</h4>
                        {isCurrentCategoryGroup && groupSelections.length > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isGroupFull ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {groupSelections.length} of 2 Selected {isGroupFull ? '(Max)' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {isCurrentCategoryGroup && groupSelections.length > 0 && (
                      <span className="text-[11px] text-gray-500 italic">
                        {2 - groupSelections.length === 1 ? '1 more scholarship may be added in this category' : 'Maximum 2 scholarships selected'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.options.map((opt: any) => {
                      const isSelected = isCurrentCategoryGroup && groupSelections.includes(opt.id);
                      const allocationIndex = isSelected ? groupSelections.indexOf(opt.id) + 1 : null;
                      const fundType = formData.scholarshipFundType as 'Internal' | 'External';

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-lg border transition-all w-full ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/90 shadow-xs'
                              : isCurrentCategoryGroup && isGroupFull
                              ? 'border-gray-200 bg-gray-50/60 opacity-60'
                              : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50/50'
                          }`}
                        >
                          <label className="flex flex-col gap-2 cursor-pointer">
                            <div className="pt-0.5">
                              <input
                                type="checkbox"
                                name={`scholarship-${opt.id}`}
                                checked={isSelected}
                                onChange={() => handleScholarshipToggle(group.subCategory, opt.id, fundType)}
                                className="w-4 h-4 text-blue-600 rounded-sm border-gray-400 focus:ring-blue-500 cursor-pointer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-[13px] font-semibold ${isSelected ? 'text-[#1e3a8a] font-bold' : 'text-[#0f2e60]'}`}>
                                  {opt.label}
                                </span>
                                {isSelected && allocationIndex && (
                                  <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold shrink-0">
                                    #{allocationIndex}
                                  </span>
                                )}
                              </div>

                              {/* Inline details for specified fields */}
                              {isSelected && opt.hasSpecifyField === 'internalCategoryOthers' && (
                                <div className="mt-2">
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Please specify:</label>
                                  <input
                                    type="text"
                                    name="internalCategoryOthers"
                                    value={formData.internalCategoryOthers || ''}
                                    onChange={handleChange}
                                    placeholder="e.g., Campus Grant Name"
                                    className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                  />
                                </div>
                              )}

                              {isSelected && opt.hasSpecifyField === 'chedCongressionalDistrict' && (
                                <div className="mt-2">
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Specify District:</label>
                                  <input
                                    type="text"
                                    name="chedCongressionalDistrict"
                                    value={formData.chedCongressionalDistrict || ''}
                                    onChange={handleChange}
                                    placeholder="e.g., 1st District / 2nd District"
                                    className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                  />
                                </div>
                              )}

                              {isSelected && opt.hasSpecifyField === 'chedOneTown' && (
                                <div className="mt-2">
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Specify Town/Municipality:</label>
                                  <input
                                    type="text"
                                    name="chedOneTown"
                                    value={formData.chedOneTown || ''}
                                    onChange={handleChange}
                                    placeholder="e.g., Roxas City"
                                    className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                  />
                                </div>
                              )}

                              {isSelected && opt.hasSpecifyField === 'chedTulongDunong' && (
                                <div className="mt-2">
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Specify Details:</label>
                                  <input
                                    type="text"
                                    name="chedTulongDunong"
                                    value={formData.chedTulongDunong || ''}
                                    onChange={handleChange}
                                    placeholder="e.g., TDP-TES Batch"
                                    className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                  />
                                </div>
                              )}

                              {isSelected && opt.hasSpecifyField === 'chedOthers' && (
                                <div className="mt-2">
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Specify CHED Program:</label>
                                  <input
                                    type="text"
                                    name="chedOthers"
                                    value={formData.chedOthers || ''}
                                    onChange={handleChange}
                                    placeholder="Program name"
                                    className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                  />
                                </div>
                              )}

                              {isSelected && opt.hasSpecifyField === 'meritChedAndOthers' && (
                                <div className="mt-2">
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Specify Program:</label>
                                  <input
                                    type="text"
                                    name="meritChedAndOthers"
                                    value={formData.meritChedAndOthers || ''}
                                    onChange={handleChange}
                                    placeholder="Program name"
                                    className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                  />
                                </div>
                              )}

                              {isSelected && opt.hasSpecifyField === 'lguContact' && (
                                <div className="mt-2">
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Contact Person / Issuing Office:</label>
                                  <input
                                    type="text"
                                    name="lguContact"
                                    value={formData.lguContact || ''}
                                    onChange={handleChange}
                                    placeholder="e.g., Mayor's Office / Landline No."
                                    className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                  />
                                </div>
                              )}

                              {isSelected && opt.hasSpecifyField === 'dswdFields' && (
                                <div className="mt-2 space-y-2 pt-1">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-gray-600">Municipality:</label>
                                    <input
                                      type="text"
                                      name="dswdMunicipality"
                                      value={formData.dswdMunicipality || ''}
                                      onChange={handleChange}
                                      placeholder="Municipality"
                                      className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-gray-600">Contact Person:</label>
                                    <input
                                      type="text"
                                      name="dswdContact"
                                      value={formData.dswdContact || ''}
                                      onChange={handleChange}
                                      placeholder="Contact person"
                                      className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-gray-600">Designation:</label>
                                    <input
                                      type="text"
                                      name="dswdDesignation"
                                      value={formData.dswdDesignation || ''}
                                      onChange={handleChange}
                                      placeholder="Designation"
                                      className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!formData.scholarshipFundType && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            <Award className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold">Please select a funding category above to view available scholarships</p>
            <p className="text-xs text-gray-400 mt-1">Choose between Internally-Funded or Externally-Funded</p>
          </div>
        )}
      </div>
    </>
  );
};
