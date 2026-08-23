const fs = require('fs');

let s = fs.readFileSync('src/components/StudentRecordModal.tsx', 'utf8');

// The main dialog is this line:
// <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 print:hidden max-h-[92vh] flex flex-col">
s = s.replace(
    `<div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 print:hidden max-h-[92vh] flex flex-col">`,
    `<div className={cn("relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 print:hidden max-h-[92vh] flex flex-col", viewMode === 'form' && "hidden")}>`
);

// We should also make sure the print layout has absolute positioning or something so it takes up the full screen when viewing form, or just let it scroll.
// Right now it's:
// <div className={cn("text-black bg-white font-sans w-full", viewMode === 'form' ? "block p-8 max-h-full overflow-y-auto" : "hidden print:block")}>
// The parent is:
// <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 print:p-0 print:bg-white print:block print:relative print:z-0">
// We can just add absolute inset-4 or similar to the form view mode.
s = s.replace(
    `<div className={cn("text-black bg-white font-sans w-full", viewMode === 'form' ? "block p-8 max-h-full overflow-y-auto" : "hidden print:block")}>`,
    `<div className={cn("text-black bg-white font-sans", viewMode === 'form' ? "block absolute inset-4 md:inset-12 bg-white rounded-2xl overflow-y-auto shadow-2xl p-8" : "hidden print:block print:w-full")}>`
);

fs.writeFileSync('src/components/StudentRecordModal.tsx', s);
