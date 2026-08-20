import React, { useState } from 'react';
import { X, ArrowLeft, ChevronDown, CheckCircle2, AlertCircle, FileText, Download, Printer, Eye, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, Submission, SubmissionFile } from '../lib/db';

interface StudentRecordModalProps {
  submission: Submission | any;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: string) => void;
  academicYearsList?: any[];
}

export function StudentRecordModal({
  submission,
  onClose,
  onStatusChange,
  academicYearsList = []
}: StudentRecordModalProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(submission.status || 'Incomplete');
  const [viewMode, setViewMode] = useState<'overview' | 'requirements' | 'semester_record'>('overview');
  const [selectedSemester, setSelectedSemester] = useState<'1st Semester' | '2nd Semester'>('1st Semester');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2025-2026');
  const [previewFile, setPreviewFile] = useState<SubmissionFile | null>(null);

  const [firstSemAY, setFirstSemAY] = useState<string>('');
  const [secondSemAY, setSecondSemAY] = useState<string>('');

  const [localSubmission, setLocalSubmission] = useState<Submission>(submission);

  const formData = localSubmission.data || {};
  const studentName = localSubmission.studentName || `${formData.firstName || 'Anna Marie'} ${formData.middleName || 'A.'} ${formData.familyName || 'Santos'}`.trim();
  const courseCode = formData.course || localSubmission.answers?.course || (localSubmission.scholarshipType?.includes('BS') || localSubmission.scholarshipType?.includes('BA') ? localSubmission.scholarshipType.split(' ')[0] : 'BAEL');
  const scholarshipType = localSubmission.scholarshipType || formData.scholarshipCategory || 'Externally-Funded (Pag-ulikid)';
  
  // Available Academic Years for dropdowns
  const academicYearsOptions = academicYearsList && academicYearsList.length > 0
    ? academicYearsList.map(ay => (typeof ay === 'string' ? ay : ay.label || ay.year || '2025-2026'))
    : ['2026-2027', '2025-2026', '2024-2025', '2023-2024'];

  const handleStatusSelect = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    const updated = { ...localSubmission, status: newStatus as any };
    setLocalSubmission(updated);
    if (onStatusChange) {
      onStatusChange(localSubmission.id, newStatus);
    }
    await db.submissions.update(localSubmission.id, { status: newStatus as any });
  };

  const handleVerifyRequirement = async (reqName: string, newStatus: 'Verified' | 'Pending' | 'Missing' | 'Rejected') => {
    const updated = await db.submissions.verifyRequirement(localSubmission.id, reqName, newStatus);
    if (updated) {
      setLocalSubmission(updated);
      setCurrentStatus(updated.status);
      if (onStatusChange) {
        onStatusChange(localSubmission.id, updated.status);
      }
    }
  };

  const handleOpenSemester = (semester: '1st Semester' | '2nd Semester', ay: string) => {
    if (!ay) return;
    setSelectedSemester(semester);
    setSelectedAcademicYear(ay);
    setViewMode('semester_record');
  };

  // Requirements list
  const requirementsList = [
    {
      id: 'req-1',
      name: 'Certificate of Grades (COG)',
      category: 'Certificate of Grades (COG)',
      fileName: `${studentName.replace(/\s+/g, '_')}_COG.pdf`,
      status: (localSubmission.files?.find(f => f.category?.includes('COG') || f.name?.includes('Grade'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find(f => f.category?.includes('COG') || f.name?.includes('Grade'))
    },
    {
      id: 'req-2',
      name: 'Certificate of Registration (COR)',
      category: 'Certificate of Registration (COR)',
      fileName: `${studentName.replace(/\s+/g, '_')}_COR.pdf`,
      status: (localSubmission.files?.find(f => f.category?.includes('COR') || f.name?.includes('Registration'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find(f => f.category?.includes('COR') || f.name?.includes('Registration'))
    },
    {
      id: 'req-3',
      name: 'Proof of Income / Indigency',
      category: 'Proof of Income / Certificate of Indigency',
      fileName: `${studentName.replace(/\s+/g, '_')}_Indigency.pdf`,
      status: (localSubmission.files?.find(f => f.category?.includes('Income') || f.category?.includes('Indigency'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find(f => f.category?.includes('Income') || f.category?.includes('Indigency'))
    },
    {
      id: 'req-4',
      name: 'Good Moral Character',
      category: 'Certificate of Good Moral Character',
      fileName: `${studentName.replace(/\s+/g, '_')}_GoodMoral.pdf`,
      status: (localSubmission.files?.find(f => f.category?.includes('Moral'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find(f => f.category?.includes('Moral'))
    },
    {
      id: 'req-5',
      name: '2x2 Recent Formal ID Photo',
      category: '2x2 Recent Formal ID Photo',
      fileName: `${studentName.replace(/\s+/g, '_')}_2x2_ID.png`,
      status: (localSubmission.files?.find(f => f.category?.includes('Photo') || f.category?.includes('2x2') || f.type?.includes('image'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find(f => f.category?.includes('Photo') || f.category?.includes('2x2') || f.type?.includes('image'))
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 print:p-0 print:bg-white print:block print:relative print:z-0">
      
      {/* Main Dialog Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 print:hidden">
        
        {/* Top Navy Blue Header Banner matching exact design */}
        <div className="bg-[#003884] text-white px-6 py-4 flex items-center justify-center relative shadow-md">
          {viewMode !== 'overview' && (
            <button
              onClick={() => setViewMode('overview')}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}
          
          <h2 className="text-xl font-bold text-center tracking-tight text-white">
            Student Records
          </h2>

          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: OVERVIEW (The 3 Folder Dashboard requested in image) */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'overview' && (
          <div className="p-6 md:p-7 space-y-4 bg-white">
            
            {/* Student Info & Status Header */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-xl md:text-[22px] font-extrabold text-gray-900 leading-tight">
                  {studentName}
                </h3>
                <p className="text-base font-bold text-gray-800 tracking-wide mt-0.5">
                  {courseCode}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="block text-xs font-bold text-[#003884] mb-1">Status</span>
                <div className="relative inline-block">
                  <select
                    value={currentStatus === 'Pending' ? 'Incomplete' : currentStatus}
                    onChange={(e) => handleStatusSelect(e.target.value)}
                    className="appearance-none bg-[#dce7f9] hover:bg-[#d0e0f8] text-gray-900 font-semibold text-sm pl-3.5 pr-8 py-1.5 rounded-xl border border-[#b4cef8] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs transition-colors"
                  >
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Folder 1: Scholarship Requirements */}
            <div className="bg-[#edf4fe] border border-[#d2e2fc] rounded-2xl p-4 md:p-4.5 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3.5">
                {/* Yellow/Amber Single Folder Icon */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                    <path d="M2.5 7C2.5 5.61929 3.61929 4.5 5 4.5H9.5C10.163 4.5 10.7989 4.76339 11.2678 5.23223L12.5355 6.5H19C20.3807 6.5 21.5 7.61929 21.5 9V17.5C21.5 18.8807 20.3807 20 19 20H5C3.61929 20 2.5 18.8807 2.5 17.5V7Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2"/>
                    <path d="M2.5 9.5C2.5 8.11929 3.61929 7 5 7H19C20.3807 7 21.5 8.11929 21.5 9.5V17.5C21.5 18.8807 20.3807 20 19 20H5C3.61929 20 2.5 18.8807 2.5 17.5V9.5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
                  </svg>
                </div>
                <span className="text-base md:text-[17px] font-bold text-gray-900">
                  Scholarship Requirements
                </span>
              </div>

              <button
                onClick={() => setViewMode('requirements')}
                className="bg-[#0052cc] hover:bg-[#0041a8] text-white text-sm md:text-base font-bold px-8 py-2 md:py-2.5 rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                View
              </button>
            </div>

            {/* Folder 2: 1st Semester */}
            <div className="bg-[#edf4fe] border border-[#d2e2fc] rounded-2xl p-4 md:p-4.5 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3.5">
                {/* Yellow/Amber Stacked Folder Icon */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                    <path d="M1.5 5.5C1.5 4.39543 2.39543 3.5 3.5 3.5H7.5C8.03043 3.5 8.53914 3.71071 8.91421 4.08579L9.91421 5.08579H16.5C17.6046 5.08579 18.5 5.98122 18.5 7.08579V14.5C18.5 15.6046 17.6046 16.5 16.5 16.5H3.5C2.39543 16.5 1.5 15.6046 1.5 14.5V5.5Z" fill="#D97706" stroke="#B45309" strokeWidth="1"/>
                    <path d="M4.5 7.5C4.5 6.39543 5.39543 5.5 6.5 5.5H10.5C11.0304 5.5 11.5391 5.71071 11.9142 6.08579L13.1 7.27C13.475 7.645 13.984 7.856 14.514 7.856H20.5C21.6046 7.856 22.5 8.751 22.5 9.856V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V7.5Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2"/>
                    <path d="M4.5 10C4.5 8.89543 5.39543 8 6.5 8H20.5C21.6046 8 22.5 8.89543 22.5 10V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V10Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1"/>
                  </svg>
                </div>
                <span className="text-base md:text-[17px] font-bold text-gray-900">
                  1st Semester
                </span>
              </div>

              <div className="relative shrink-0">
                <select
                  value={firstSemAY}
                  onChange={(e) => {
                    setFirstSemAY(e.target.value);
                    handleOpenSemester('1st Semester', e.target.value);
                  }}
                  className="appearance-none bg-[#dce7f9] hover:bg-[#d0e0f8] text-gray-900 font-semibold text-sm pl-3.5 pr-8 py-2 rounded-xl border border-[#b4cef8] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs transition-colors"
                >
                  <option value="">Academic Year</option>
                  {academicYearsOptions.map(ay => (
                    <option key={ay} value={ay}>{ay}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Folder 3: 2nd Semester */}
            <div className="bg-[#edf4fe] border border-[#d2e2fc] rounded-2xl p-4 md:p-4.5 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3.5">
                {/* Yellow/Amber Stacked Folder Icon */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                    <path d="M1.5 5.5C1.5 4.39543 2.39543 3.5 3.5 3.5H7.5C8.03043 3.5 8.53914 3.71071 8.91421 4.08579L9.91421 5.08579H16.5C17.6046 5.08579 18.5 5.98122 18.5 7.08579V14.5C18.5 15.6046 17.6046 16.5 16.5 16.5H3.5C2.39543 16.5 1.5 15.6046 1.5 14.5V5.5Z" fill="#D97706" stroke="#B45309" strokeWidth="1"/>
                    <path d="M4.5 7.5C4.5 6.39543 5.39543 5.5 6.5 5.5H10.5C11.0304 5.5 11.5391 5.71071 11.9142 6.08579L13.1 7.27C13.475 7.645 13.984 7.856 14.514 7.856H20.5C21.6046 7.856 22.5 8.751 22.5 9.856V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V7.5Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2"/>
                    <path d="M4.5 10C4.5 8.89543 5.39543 8 6.5 8H20.5C21.6046 8 22.5 8.89543 22.5 10V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V10Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1"/>
                  </svg>
                </div>
                <span className="text-base md:text-[17px] font-bold text-gray-900">
                  2nd Semester
                </span>
              </div>

              <div className="relative shrink-0">
                <select
                  value={secondSemAY}
                  onChange={(e) => {
                    setSecondSemAY(e.target.value);
                    handleOpenSemester('2nd Semester', e.target.value);
                  }}
                  className="appearance-none bg-[#dce7f9] hover:bg-[#d0e0f8] text-gray-900 font-semibold text-sm pl-3.5 pr-8 py-2 rounded-xl border border-[#b4cef8] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs transition-colors"
                >
                  <option value="">Academic Year</option>
                  {academicYearsOptions.map(ay => (
                    <option key={ay} value={ay}>{ay}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: SCHOLARSHIP REQUIREMENTS DETAIL & VERIFICATION */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'requirements' && (
          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5 bg-gray-50/60">
            
            {/* Context bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap justify-between items-center gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Scholarship Program</span>
                <h4 className="text-base font-bold text-gray-900">{scholarshipType}</h4>
                <p className="text-xs text-gray-500 mt-0.5">Submitted on {new Date(localSubmission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Print official form"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Form
                </button>
                <button
                  onClick={() => handleStatusSelect('Approved')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              </div>
            </div>

            {/* Checklist of required documents */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-600 px-1">
                Document Checklist & Verification
              </h5>

              {requirementsList.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold",
                      req.status === 'Verified' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {req.status === 'Verified' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{req.name}</p>
                      <p className="text-xs text-gray-500 truncate">{req.fileName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase",
                      req.status === 'Verified' ? "bg-green-100 text-green-700 border border-green-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                    )}>
                      {req.status}
                    </span>

                    {req.file && (
                      <button
                        onClick={() => setPreviewFile(req.file as SubmissionFile)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Preview File"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleVerifyRequirement(req.category, req.status === 'Verified' ? 'Pending' : 'Verified')}
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                        req.status === 'Verified' 
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                      )}
                    >
                      {req.status === 'Verified' ? 'Mark Pending' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setViewMode('overview')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer"
              >
                ← Return to Student Records Summary
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: SEMESTER RECORD (1st Sem or 2nd Sem) */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'semester_record' && (
          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5 bg-gray-50/60">
            
            {/* Header info */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{selectedSemester} Academic Term</span>
                  <h4 className="text-lg font-bold text-gray-900">Academic Year {selectedAcademicYear}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{studentName} &bull; {courseCode}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                  Enrolled & Active
                </span>
              </div>
            </div>

            {/* Semester Academic Summary */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">Academic Standing</h5>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <span className="text-xs text-gray-500 font-medium">GWA</span>
                  <p className="text-lg font-extrabold text-blue-900">1.45</p>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <span className="text-xs text-gray-500 font-medium">Units Passed</span>
                  <p className="text-lg font-extrabold text-blue-900">21</p>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <span className="text-xs text-gray-500 font-medium">Evaluation</span>
                  <p className="text-lg font-extrabold text-green-600">Retained</p>
                </div>
              </div>
            </div>

            {/* Uploaded Documents for this Semester */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">Semester Uploads</h5>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Certificate of Grades ({selectedSemester})</p>
                      <p className="text-[11px] text-gray-500">Official Registrar Copy &bull; 1.2 MB</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Verified</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Certificate of Registration ({selectedSemester})</p>
                      <p className="text-[11px] text-gray-500">Assessment Form &bull; 850 KB</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Verified</span>
                </div>
              </div>
            </div>

            {/* Back action */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setViewMode('overview')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer"
              >
                ← Return to Student Records Summary
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ----------------- EXACT PRINT LAYOUT FOR BROWSER PRINT ----------------- */}
      <div className="hidden print:block text-black bg-white font-sans w-full">
        {/* PAGE 1: SCHOLARSHIP RECORD FORM */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-8 break-after-page">
          {/* Header Box */}
          <div className="border border-black w-full mb-6">
            <div className="flex border-b border-black">
              <div className="w-1/5 p-2 border-r border-black flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-1"></div>
              </div>
              <div className="w-3/5 p-2 border-r border-black flex flex-col items-center justify-center text-center">
                <span className="text-[10px]">Document Type:</span>
                <strong className="text-xl tracking-widest mt-1 font-serif">FORM</strong>
                <span className="text-[8px] mt-1 font-serif">ISO 9001:2015</span>
              </div>
              <div className="w-1/5 font-serif">
                <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Document Code</span><strong>GCO-F05</strong></div>
                <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Revision No.</span><strong>00</strong></div>
                <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Effective Date</span><strong>June 25, 2018</strong></div>
                <div className="p-1 text-[10px] flex justify-between"><span>Page</span><strong>1 of 1</strong></div>
              </div>
            </div>
            <div className="flex font-serif">
              <div className="w-1/4 p-2 border-r border-black text-xs flex items-center">Document Title:</div>
              <div className="w-3/4 p-2 text-center font-bold text-lg tracking-wider flex items-center justify-center">SCHOLARSHIP RECORD FORM</div>
            </div>
          </div>

          {/* Profile Block */}
          <div className="flex gap-4 mb-6 text-sm font-serif">
            <div className="flex-1 space-y-3">
              <div className="flex items-end gap-2">
                <span className="w-12">Name:</span>
                <span className="flex-1 border-b border-black text-center">{formData.familyName || 'Santos'}</span>
                <span className="flex-1 border-b border-black text-center">{formData.firstName || 'Anna Marie'}</span>
                <span className="flex-1 border-b border-black text-center">{formData.middleName || 'A.'}</span>
                <span className="ml-2">Age:</span><span className="w-10 border-b border-black text-center">{formData.age || '20'}</span>
                <span className="ml-2">Sex: ( {formData.sex === 'Male' ? 'x' : ' '} ) Male ( {formData.sex === 'Female' ? 'x' : 'x'} ) Female</span>
              </div>
              <div className="flex text-xs text-center text-gray-600 mb-2 mt-0">
                <span className="w-12"></span>
                <span className="flex-1">Family Name</span>
                <span className="flex-1">First Name</span>
                <span className="flex-1">Middle Name</span>
                <span className="w-10"></span><span className="w-48"></span>
              </div>
              
              <div className="flex items-end gap-2">
                <span className="w-24">Course & Year:</span>
                <span className="flex-1 border-b border-black">{courseCode} - {formData.yearLevel || '2nd Year'}</span>
                <span className="w-16">Birthdate:</span>
                <span className="flex-1 border-b border-black">{formData.birthdate || '2004-05-12'}</span>
                <span className="w-20">Contact No.:</span>
                <span className="flex-1 border-b border-black">{formData.contactNo || '+63 912 345 6789'}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="w-36">Permanent Address:</span>
                <span className="flex-1 border-b border-black">{formData.permanentAddress || 'Tapaz, Capiz'}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="w-24">Father's Name:</span>
                <span className="flex-1 border-b border-black">{formData.fatherName || 'Roberto Santos'}</span>
                <span className="w-24 pl-4">Mother's Name:</span>
                <span className="flex-1 border-b border-black">{formData.motherName || 'Elena Santos'}</span>
              </div>
            </div>
            <div className="w-32 h-32 border border-black flex items-center justify-center text-center text-xs p-2 shrink-0 font-serif">
              Attach<br/>2x2 Picture
            </div>
          </div>

          {/* Category */}
          <div className="text-center font-bold text-sm mb-4 font-serif">SCHOLARSHIP CATEGORY</div>
          <div className="text-sm font-serif">
            <strong>A. Internally-Funded</strong>
            <div className="pl-6 mt-1">
              <em>Entrance</em>
              <div className="pl-6 grid grid-cols-2 mt-1 mb-2">
                <div>[ {formData.scholarshipCategory?.includes('Valedictorian') ? 'x' : ' '} ] Valedictorian</div>
                <div>[ {formData.scholarshipCategory?.includes('Salutatorian') ? 'x' : ' '} ] Salutatorian</div>
              </div>
            </div>
            <strong className="block mt-4 mb-2">B. Externally-Funded</strong>
            <div className="pl-6 mt-1">
              <em>CHED / Local Govt</em>
              <div className="pl-6 grid grid-cols-1 mt-1 mb-2 gap-y-1">
                <div>[ {formData.scholarshipCategory?.includes('Pag-ulikid') || scholarshipType.includes('Pag-ulikid') ? 'x' : ' '} ] Pag-ulikid Scholarship Program</div>
                <div>[ {formData.scholarshipCategory?.includes('Tulong Dunong') ? 'x' : ' '} ] Tulong Dunong</div>
                <div>[ {formData.scholarshipCategory?.includes('Barangay') ? 'x' : ' '} ] Barangay Dependents</div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-between text-sm font-serif">
            <div className="w-48 text-center">
              <div className="border-b border-black text-center">{new Date(localSubmission.submittedAt).toLocaleDateString()}</div>
              <div className="mt-1">Date Received</div>
            </div>
            <div className="w-64 text-center">
              <div className="border-b border-black h-5 text-center font-bold">{studentName}</div>
              <div className="mt-1">Signature of Applicant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
              <h4 className="text-sm font-bold truncate">{previewFile.name}</h4>
              <button onClick={() => setPreviewFile(null)} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-gray-100">
              {previewFile.data.startsWith('data:image/') ? (
                <img src={previewFile.data} alt={previewFile.name} className="max-h-[60vh] object-contain rounded-lg shadow" />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-xs">
                  <FileText className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                  <p className="font-bold text-gray-800 text-sm">{previewFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{previewFile.category || 'PDF Document'}</p>
                  <a
                    href={previewFile.data}
                    download={previewFile.name}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" /> Download Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
