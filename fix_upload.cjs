const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// 1. Update imports
if (!content.includes('useRef')) {
  content = content.replace("useState, useEffect", "useState, useEffect, useRef");
}

// 2. Add fileInputRef to the component
const compStart = 'export function GuidanceSettings() {';
const refInsert = `
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileForm({ name: e.target.files[0].name.replace(/\\.[^/.]+$/, "") });
    }
  };
`;
content = content.replace(compStart, compStart + refInsert);

// 3. Update the modal UI
const oldModalStr = `              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Click to browse or drag file here</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 10MB</p>
              </div>`;

const newModalStr = `              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                />
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Click to browse or drag file here</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 10MB</p>
              </div>`;

content = content.replace(oldModalStr, newModalStr);

fs.writeFileSync('src/pages/guidance/index.tsx', content);
