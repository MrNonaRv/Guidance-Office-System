import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

interface DocumentPreviewModalProps {
  file: {
    name: string;
    type?: string;
    size?: string;
    data: string;
    category?: string;
  } | null;
  onClose: () => void;
}

export function DocumentPreviewModal({ file, onClose }: DocumentPreviewModalProps) {
  if (!file) return null;

  const fileSource = file.data || '';
  const isImage = 
    file.type?.startsWith('image/') || 
    fileSource.startsWith('data:image/') ||
    /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(fileSource) ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);

  const isPdf = 
    file.type?.includes('pdf') || 
    fileSource.startsWith('data:application/pdf') ||
    /\.pdf(\?.*)?$/i.test(fileSource) ||
    /\.pdf$/i.test(file.name);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileSource;
    link.download = file.name || 'document';
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Modal Header */}
        <div className="bg-[#0f2e60] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-blue-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate leading-tight">
                {file.name}
              </h3>
              <p className="text-[11px] text-blue-200 font-medium">
                {file.category || 'Uploaded Document'} {file.size ? `• ${file.size}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={handleDownload}
              title="Download file"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-4 flex items-center justify-center min-h-[300px] sm:min-h-[450px]">
          {isImage ? (
            <div className="max-w-full max-h-full flex items-center justify-center p-2">
              <img
                src={file.data}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm bg-white"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={file.data}
              title={file.name}
              className="w-full h-[65vh] sm:h-[70vh] rounded-lg bg-white shadow-sm border border-gray-300"
            />
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md border border-gray-200">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 text-base mb-1">{file.name}</h4>
              <p className="text-gray-500 text-xs mb-4">
                Preview not directly available for this format. You can download the file to inspect its contents.
              </p>
              <button
                onClick={handleDownload}
                className="bg-[#1e3a8a] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#152c6b] transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Document
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-4 py-2.5 flex justify-between items-center text-xs text-gray-500 shrink-0">
          <span>Capiz State University — Scholarship Document Viewer</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
