import React from 'react';
import { Check } from 'lucide-react';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onGoToDashboard: () => void;
}

export function SubmissionSuccessModal({
  isOpen,
  onGoToDashboard
}: SubmissionSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md relative animate-in zoom-in-95 duration-200 my-auto">
        <div className="bg-gradient-to-b from-[#0b63f6] to-[#0147eb] rounded-[24px] pt-8 pb-6 px-2 shadow-2xl w-full flex flex-col items-center">
          
          <div className="w-16 h-16 bg-[#007aff] rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-blue-400/30">
            <Check className="w-8 h-8 text-white stroke-[3.5]" />
          </div>
          
          <div className="bg-white rounded-[20px] w-full p-8 text-center shadow-xl">
            <h2 className="text-[20px] sm:text-[22px] font-bold text-black mb-5">
              Requirements Submitted!
            </h2>
            
            <p className="text-[14px] text-[#4b5563] leading-relaxed mb-4 font-medium">
              Your scholarship requirements has been successfully submitted. Please wait for the approval of the Guidance Office. A notification will be sent to your registered Gmail account.
            </p>
            
            <p className="text-[14px] text-[#4b5563] leading-relaxed mb-1 font-medium">
              If you do not see the email in your inbox, please check your Spam inbox.
            </p>
            <p className="text-[14px] text-[#4b5563] leading-relaxed mb-8 font-medium">
              Thank you.
            </p>
            
            <button
              type="button"
              onClick={onGoToDashboard}
              className="w-full bg-gradient-to-r from-[#013580] to-[#0466e3] hover:from-[#012860] hover:to-[#0355c3] text-white py-3.5 rounded-2xl text-[15px] font-bold transition-all shadow-md cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
