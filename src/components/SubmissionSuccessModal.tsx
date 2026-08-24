import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Printer, 
  Calendar, 
  User, 
  FileCheck, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  isUpdate: boolean;
  referenceNo: string;
  studentName: string;
  studentId: string;
  scholarshipType: string;
  submittedAt: string;
  filesCount: number;
  course?: string;
  yearLevel?: string;
  onClose: () => void;
  onGoToDashboard: () => void;
  onPrintOrDownload?: () => void;
}

export function SubmissionSuccessModal({
  isOpen,
  isUpdate,
  referenceNo,
  studentName,
  studentId,
  scholarshipType,
  submittedAt,
  filesCount,
  course,
  yearLevel,
  onClose,
  onGoToDashboard,
  onPrintOrDownload
}: SubmissionSuccessModalProps) {
  if (!isOpen) return null;

  const formattedDate = new Date(submittedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-t-[6px] border-[#eab308] animate-in zoom-in-95 duration-200 relative my-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors z-10 cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Success Icon */}
        <div className="p-6 sm:p-7 text-center bg-gradient-to-b from-blue-50/80 to-white pb-3 sm:pb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 border-4 border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-inner">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-[#16a34a]" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-[#0c2340] mb-1 leading-snug">
            {isUpdate ? 'Application Updated Successfully!' : 'Application Submitted Successfully!'}
          </h2>
          <p className="text-xs sm:text-[13px] text-[#1e3a8a] font-semibold">
            Capiz State University — Guidance and Counseling Office
          </p>
          <p className="text-xs text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
            {isUpdate 
              ? 'Your scholarship record form and attached document updates have been recorded into the CAPSU Scholarship Submission Alert System.'
              : 'Your scholarship application form and documentary requirements have been successfully registered into the CAPSU Scholarship Submission Alert System.'}
          </p>
        </div>

        {/* Storyboard Submission Receipt Ticket */}
        <div className="px-5 sm:px-7 py-2">
          <div className="bg-[#f8fafc] border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            
            {/* Reference Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Reference Code
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#0f2e60] bg-blue-100/70 text-blue-950 px-2.5 py-0.5 rounded border border-blue-200">
                {referenceNo}
              </span>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-gray-500 text-[11px] block">Applicant Name:</span>
                <span className="font-bold text-[#0c2340] leading-tight block truncate">
                  {studentName}
                </span>
              </div>
              <div>
                <span className="text-gray-500 text-[11px] block">Student ID / Account:</span>
                <span className="font-bold text-[#0c2340] leading-tight block truncate">
                  {studentId}
                </span>
              </div>
              <div>
                <span className="text-gray-500 text-[11px] block">Course & Year Level:</span>
                <span className="font-semibold text-gray-800 leading-tight block">
                  {course || 'BSCS'} {yearLevel ? `• ${yearLevel}` : ''}
                </span>
              </div>
              <div>
                <span className="text-gray-500 text-[11px] block">Scholarship Program:</span>
                <span className="font-bold text-[#1e3a8a] leading-tight block truncate">
                  {scholarshipType}
                </span>
              </div>
            </div>

            {/* Submission Date & Status */}
            <div className="border-t border-dashed border-gray-200 pt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span className="text-[11px]">{formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Pending Evaluation
                </span>
              </div>
            </div>

            {/* Documents attached count */}
            <div className="flex items-center gap-2 text-[11px] text-gray-600 pt-1">
              <FileCheck className="w-3.5 h-3.5 text-green-600" />
              <span><strong>{filesCount} Required Document(s)</strong> attached and verified</span>
            </div>
          </div>
        </div>

        {/* Next Steps Guidance Callout */}
        <div className="px-5 sm:px-7 py-3">
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#1864db] shrink-0 mt-0.5" />
            <div className="text-[11px] sm:text-xs text-[#1e3a8a] leading-relaxed">
              <strong>Next Steps:</strong> The Guidance and Counseling Office will review your submitted credentials. You will receive notification alerts and remarks directly on your <strong>Student Dashboard</strong>.
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-5 sm:p-7 pt-2 flex flex-col sm:flex-row gap-2.5">
          {onPrintOrDownload && (
            <button
              type="button"
              onClick={onPrintOrDownload}
              className="flex-1 order-2 sm:order-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              Print / Save Summary
            </button>
          )}

          <button
            type="button"
            onClick={onGoToDashboard}
            className="flex-1 order-1 sm:order-2 bg-[#0f2e60] hover:bg-[#1a4484] text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
