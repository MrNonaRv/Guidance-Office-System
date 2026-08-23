const fs = require('fs');

let s = fs.readFileSync('src/components/StudentRecordModal.tsx', 'utf8');

// 1. Change default viewMode to 'requirements'
s = s.replace(
    `const [viewMode, setViewMode] = useState<'overview' | 'requirements' | 'id_signature' | 'semester_record'>('overview');`,
    `const [viewMode, setViewMode] = useState<'overview' | 'requirements' | 'id_signature' | 'semester_record' | 'form'>('requirements');`
);

// 2. Add 'form' viewMode button in requirements
const printButton = `<button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    title="Print official form"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Form
                  </button>`;
const newButtons = `<button
                    onClick={() => setViewMode('form')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Form Details
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    title="Print official form"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>`;
s = s.replace(printButton, newButtons);

// 3. Add 'form' view mode rendering
const formView = `{/* ------------------------------------------------------------- */}
          {/* VIEW 5: FORM DETAILS (On-Screen Print Layout) */}
          {/* ------------------------------------------------------------- */}
          {viewMode === 'form' && (
            <div className="p-6 bg-gray-100 relative">
              <button
                  onClick={() => setViewMode('requirements')}
                  className="mb-4 text-xs font-bold text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer"
                >
                  ← Back to Requirements
                </button>
              <div className="bg-white p-8 shadow-sm rounded-xl overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* We reuse the print layout content here by simply rendering it inside this viewMode. 
                      However, since the print layout uses print:block, we'll just extract the inner content or we can use another trick. */}
                  {/* Actually, it's easier to just unhide the print block if viewMode is form */}
                </div>
              </div>
            </div>
          )}`;
// Let's not do it this way. Let's just make the print layout visible when viewMode === 'form'.
// The print layout is currently:
// <div className="hidden print:block text-black bg-white font-sans w-full">
// We can change it to:
// <div className={cn("text-black bg-white font-sans w-full", viewMode === 'form' ? "block p-8" : "hidden print:block")}>
// And add a Back button.
s = s.replace(
    `      {/* ----------------- EXACT PRINT LAYOUT FOR BROWSER PRINT ----------------- */}
      <div className="hidden print:block text-black bg-white font-sans w-full">
        
        {/* PAGE 1: SCHOLARSHIP RECORD FORM */}`,
    `      {/* ----------------- EXACT PRINT LAYOUT FOR BROWSER PRINT ----------------- */}
      <div className={cn("text-black bg-white font-sans w-full", viewMode === 'form' ? "block p-8 max-h-full overflow-y-auto" : "hidden print:block")}>
        {viewMode === 'form' && (
            <button
              onClick={() => setViewMode('requirements')}
              className="mb-6 text-sm font-bold text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer print:hidden"
            >
              ← Back to Requirements
            </button>
        )}
        {/* PAGE 1: SCHOLARSHIP RECORD FORM */}`
);

fs.writeFileSync('src/components/StudentRecordModal.tsx', s);
