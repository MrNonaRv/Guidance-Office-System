import React from 'react';
import { 
  User, 
  Users, 
  Home, 
  GraduationCap, 
  Award, 
  FileText, 
  Edit3, 
  CheckCircle2, 
  ArrowLeft, 
  Check, 
  Eye, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Briefcase, 
  Sparkles,
  Info
} from 'lucide-react';

interface SubmissionReviewSummaryProps {
  formData: any;
  files: any[];
  existingId?: string | null;
  isUpdate?: boolean;
  isSubmitting: boolean;
  onEditStep: (stepNumber: number, sectionTargetId?: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onPreviewFile: (file: any) => void;
}

export function SubmissionReviewSummary({
  formData,
  files,
  existingId,
  isUpdate = false,
  isSubmitting,
  onEditStep,
  onSubmit,
  onBack,
  onPreviewFile
}: SubmissionReviewSummaryProps) {
  const isEditingExisting = isUpdate || !!existingId;

  const fullName = `${formData.familyName ? formData.familyName + ',' : ''} ${formData.firstName || ''} ${formData.middleName || ''}`.trim() || 'Not specified';
  
  // Format Scholarship program label
  const getScholarshipProgramLabel = () => {
    if (formData.scholarshipFundType === 'Internal') {
      return `Internally-Funded — ${formData.internalCategory || 'Institutional'}${formData.internalCategoryOthers ? ` (${formData.internalCategoryOthers})` : ''}`;
    }
    if (formData.scholarshipFundType === 'External') {
      const selected = formData.externalCategory || formData.chedSubCategory || formData.meritSubCategory || 'Government / External';
      let extDetails = selected;
      if (selected === 'Congressional District' && formData.chedCongressionalDistrict) {
        extDetails += ` - District: ${formData.chedCongressionalDistrict}`;
      } else if (selected === 'One Town One Scholar' && formData.chedOneTown) {
        extDetails += ` - ${formData.chedOneTown}`;
      } else if (selected === 'Tulong Dunong' && formData.chedTulongDunong) {
        extDetails += ` - ${formData.chedTulongDunong}`;
      } else if (selected === 'Others' && formData.chedOthers) {
        extDetails += ` - ${formData.chedOthers}`;
      } else if (selected === 'LGU' && formData.lguContact) {
        extDetails += ` (Contact: ${formData.lguContact})`;
      } else if (selected === 'DSWD') {
        const dswdParts = [
          formData.dswdMunicipality ? `Municipality: ${formData.dswdMunicipality}` : '',
          formData.dswdContact ? `Contact: ${formData.dswdContact}` : ''
        ].filter(Boolean);
        if (dswdParts.length > 0) extDetails += ` (${dswdParts.join(', ')})`;
      }
      return `Externally-Funded — ${extDetails}`;
    }
    return formData.externalCategory || formData.internalCategory || formData.chedSubCategory || formData.meritSubCategory || 'General Scholarship';
  };

  const rfFile = files.find(f => f.category === 'RF');
  const gwaFile = files.find(f => f.category === 'GWA');
  const idFile = files.find(f => f.category === 'ID');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* SECTION 1: Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#e0e7ff] px-4 sm:px-6 py-3 border-b border-[#c7d2fe] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm sm:text-base">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a8a]" />
            <span>A. Personal Information & Demographics</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1, 'personal-info')}
            className="text-xs font-bold text-[#1e3a8a] hover:text-[#152c6b] hover:bg-blue-100/70 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 border-b border-gray-100">
            {/* 2x2 Photo preview */}
            <div className="w-28 flex flex-col items-center shrink-0">
              <div className="w-24 h-24 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shadow-xs">
                {formData.photo2x2 ? (
                  <img src={formData.photo2x2} alt="2x2 Photo" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-500 mt-1.5">2×2 ID Photo</span>
            </div>

            {/* Main personal data grid */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 text-[10px] font-bold uppercase block">Full Name</span>
                <span className="font-bold text-[#0c2340] text-sm truncate block mt-0.5">{fullName}</span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 text-[10px] font-bold uppercase block">Course & Year</span>
                <span className="font-bold text-[#0c2340] text-sm block mt-0.5">
                  {formData.course || 'BSCS'} — {formData.yearLevel || '1st Year'} {formData.section ? `(Sec ${formData.section})` : ''}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 text-[10px] font-bold uppercase block">Birthdate & Age</span>
                <span className="font-semibold text-gray-800 text-xs block mt-0.5">
                  {formData.birthdate || 'Not set'} {formData.age ? `(${formData.age} y/o)` : ''}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 text-[10px] font-bold uppercase block">Sex & Civil Status</span>
                <span className="font-semibold text-gray-800 text-xs block mt-0.5">
                  {formData.sex || 'Not set'} • {formData.civilStatus || 'Single'}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 text-[10px] font-bold uppercase block">Contact Number</span>
                <span className="font-semibold text-gray-800 text-xs flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-blue-700 shrink-0" />
                  {formData.contactNo || 'Not specified'}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 text-[10px] font-bold uppercase block">Email Address</span>
                <span className="font-semibold text-gray-800 text-xs flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="w-3 h-3 text-blue-700 shrink-0" />
                  {formData.email || 'Not specified'}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 sm:col-span-2 md:col-span-3">
                <span className="text-gray-500 text-[10px] font-bold uppercase block">Permanent Address</span>
                <span className="font-semibold text-gray-800 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-blue-700 shrink-0" />
                  {formData.street ? `${formData.street}, ${formData.barangay}, ${formData.municipality}, ${formData.province} ${formData.postalCode}` : (formData.permanentAddress || 'Not specified')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Family Background */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#e0e7ff] px-4 sm:px-6 py-3 border-b border-[#c7d2fe] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm sm:text-base">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a8a]" />
            <span>B. Family Background</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1, 'family-info')}
            className="text-xs font-bold text-[#1e3a8a] hover:text-[#152c6b] hover:bg-blue-100/70 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Father */}
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 space-y-1.5">
            <div className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-wider">Father Information</div>
            <div>
              <span className="text-gray-500 text-[10px] block">Name:</span>
              <span className="font-bold text-gray-800">{formData.fatherName || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Occupation:</span>
              <span className="text-gray-700">{formData.fatherOccupation || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Contact No:</span>
              <span className="text-gray-700">{formData.fatherContact || 'N/A'}</span>
            </div>
          </div>

          {/* Mother */}
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 space-y-1.5">
            <div className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-wider">Mother Information</div>
            <div>
              <span className="text-gray-500 text-[10px] block">Name (maiden name):</span>
              <span className="font-bold text-gray-800">{formData.motherName || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Occupation:</span>
              <span className="text-gray-700">{formData.motherOccupation || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Contact No:</span>
              <span className="text-gray-700">{formData.motherContact || 'N/A'}</span>
            </div>
          </div>

          {/* Guardian */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-1.5">
            <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Guardian Information</div>
            <div>
              <span className="text-gray-500 text-[10px] block">Name:</span>
              <span className="font-bold text-gray-800">{formData.guardianName || 'None'}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Occupation:</span>
              <span className="text-gray-700">{formData.guardianOccupation || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Contact No:</span>
              <span className="text-gray-700">{formData.guardianContact || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Socio-Economic Status & Living Condition */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#e0e7ff] px-4 sm:px-6 py-3 border-b border-[#c7d2fe] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm sm:text-base">
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a8a]" />
            <span>C. Socio-Economic Status & Living Condition</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1, 'socio-economic')}
            className="text-xs font-bold text-[#1e3a8a] hover:text-[#152c6b] hover:bg-blue-100/70 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 text-[10px] font-bold uppercase block">Parents' Educational Attainment</span>
              <span className="font-bold text-[#0c2340] mt-0.5 block">{formData.parentEduAttainment || 'Not selected'}</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 text-[10px] font-bold uppercase block">Family Monthly Income</span>
              <span className="font-bold text-emerald-700 mt-0.5 block">{formData.monthlyIncome || 'Not selected'}</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 text-[10px] font-bold uppercase block">First in Family in College?</span>
              <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold mt-1 ${
                formData.firstInFamily === 'Yes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
              }`}>
                {formData.firstInFamily || 'Not indicated'}
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 text-[10px] font-bold uppercase block">Living Arrangement</span>
              <span className="font-semibold text-gray-800 mt-0.5 block">
                {formData.livingWith || 'Not selected'} {formData.livingWithOthers ? `(${formData.livingWithOthers})` : ''}
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 text-[10px] font-bold uppercase block">Housing Type</span>
              <span className="font-semibold text-gray-800 mt-0.5 block">
                {formData.housingType || 'Not selected'} {formData.housingTypeOthers ? `(${formData.housingTypeOthers})` : ''}
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 text-[10px] font-bold uppercase block">Working Student Status</span>
              <span className="font-semibold text-gray-800 mt-0.5 block">
                {formData.workingStudent || 'No'} {formData.workTypeIncome ? `(${formData.workTypeIncome})` : ''}
              </span>
            </div>
          </div>

          {/* Access to Resources tags */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-gray-600 text-[11px] font-bold block mb-2">Access to Resources at Home:</span>
            {formData.accessToResources && formData.accessToResources.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.accessToResources.map((item: string) => (
                  <span key={item} className="bg-blue-50 text-[#1e3a8a] border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-blue-600" />
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 italic">None selected</span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: Student Classification */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#e0e7ff] px-4 sm:px-6 py-3 border-b border-[#c7d2fe] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm sm:text-base">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a8a]" />
            <span>D. Student Classification & Circumstances</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1, 'classification')}
            className="text-xs font-bold text-[#1e3a8a] hover:text-[#152c6b] hover:bg-blue-100/70 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 text-xs">
          {formData.studentClassification && formData.studentClassification.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.studentClassification.map((cls: string) => (
                <span key={cls} className="bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-lg text-xs font-medium">
                  {cls}
                </span>
              ))}
              {formData.studentClassificationOthers && (
                <span className="bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-lg text-xs font-medium">
                  Others: {formData.studentClassificationOthers}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500 italic">Regular Student / No special classification specified</span>
          )}

          {formData.specialNeedsCondition && (
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 mt-2">
              <strong>PWD / Special Needs Condition:</strong> {formData.specialNeedsCondition}
            </div>
          )}

          {formData.pdlReason && (
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 mt-2">
              <strong>Interrupted Schooling Reason:</strong> {formData.pdlReason}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: Scholarship Category */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#e0e7ff] px-4 sm:px-6 py-3 border-b border-[#c7d2fe] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm sm:text-base">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a8a]" />
            <span>E. Scholarship Program Applied</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1, 'scholarship-category')}
            className="text-xs font-bold text-[#1e3a8a] hover:text-[#152c6b] hover:bg-blue-100/70 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="p-4 sm:p-6 text-xs">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
            <Award className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-blue-800 uppercase">Selected Scholarship:</div>
              <div className="text-sm sm:text-base font-bold text-[#0c2340] mt-0.5">
                {getScholarshipProgramLabel()}
              </div>
              <p className="text-gray-600 mt-1 text-xs">
                Fund Classification: <strong>{formData.scholarshipFundType || 'External'}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Uploaded Documents */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#e0e7ff] px-4 sm:px-6 py-3 border-b border-[#c7d2fe] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm sm:text-base">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a8a]" />
            <span>F. Attached Student Documents</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs font-bold text-[#1e3a8a] hover:text-[#152c6b] hover:bg-blue-100/70 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Manage Files
          </button>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* RF */}
          <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-green-800 uppercase tracking-wide">Registration Form</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="font-bold text-xs text-[#0c2340] truncate" title={rfFile?.name || 'RF Document'}>
                {rfFile?.name || 'Registration Form.pdf'}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{rfFile?.size || 'Attached'}</p>
            </div>
            {rfFile && (
              <button
                type="button"
                onClick={() => onPreviewFile(rfFile)}
                className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-white border border-green-300 hover:bg-green-100 text-green-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Preview File
              </button>
            )}
          </div>

          {/* GWA */}
          <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-green-800 uppercase tracking-wide">GWA Certificate</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="font-bold text-xs text-[#0c2340] truncate" title={gwaFile?.name || 'GWA Document'}>
                {gwaFile?.name || 'GWA Slip.pdf'}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{gwaFile?.size || 'Attached'}</p>
            </div>
            {gwaFile && (
              <button
                type="button"
                onClick={() => onPreviewFile(gwaFile)}
                className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-white border border-green-300 hover:bg-green-100 text-green-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Preview File
              </button>
            )}
          </div>

          {/* Student ID */}
          <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-green-800 uppercase tracking-wide">Student ID</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="font-bold text-xs text-[#0c2340] truncate" title={idFile?.name || 'Student ID'}>
                {idFile?.name || 'Student_ID.png'}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{idFile?.size || 'Attached'}</p>
            </div>
            {idFile && (
              <button
                type="button"
                onClick={() => onPreviewFile(idFile)}
                className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-white border border-green-300 hover:bg-green-100 text-green-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Preview File
              </button>
            )}
          </div>

        </div>
      </div>

      {/* SECTION 7: Digital Signature & Certification */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 text-center">
        <p className="text-xs sm:text-[13px] text-gray-700 italic max-w-xl mx-auto mb-4">
          "I hereby certify that the information I have provided is true and correct to the best of my knowledge."
        </p>

        <div className="mx-auto w-56 sm:w-64 h-24 border-2 border-green-400 bg-green-50/10 rounded-xl mb-2 flex items-center justify-center overflow-hidden p-2 shadow-inner">
          {formData.signature ? (
            <img src={formData.signature} alt="Applicant Signature" className="w-full h-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">Signature on file</span>
          )}
        </div>

        <div className="inline-block border-t-2 border-black w-56 sm:w-64 pt-1.5 text-xs sm:text-sm font-bold text-[#0f2e60]">
          Applicant's Signature
        </div>
      </div>

      {/* Confirmation & Final Submission Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Uploads
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 sm:px-12 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer text-sm sm:text-base"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isEditingExisting ? 'Updating Application...' : 'Submitting Application...'}</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>{isEditingExisting ? 'Confirm & Update Application' : 'Confirm & Submit Application'}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
