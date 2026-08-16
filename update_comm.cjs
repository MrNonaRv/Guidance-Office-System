const fs = require('fs');
const content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

const importsToEnsure = [
  'Search', 'Type', 'Paperclip', 'Link2', 'Smile', 'Triangle', 'ImageIcon', 'Lock', 'Pen', 'MoreVertical', 'Trash2', 'ChevronDown', 'ChevronRight'
];

let newContent = content;

// add imports if missing
const importMatch = newContent.match(/import {([^}]+)} from 'lucide-react';/);
if (importMatch) {
  let existingImports = importMatch[1].split(',').map(s => s.trim());
  let added = false;
  for (const i of importsToEnsure) {
    if (!existingImports.includes(i) && !existingImports.includes(i + ' as ImageIcon')) {
      if (i === 'ImageIcon') {
        existingImports.push('Image as ImageIcon');
      } else {
        existingImports.push(i);
      }
      added = true;
    }
  }
  if (added) {
    newContent = newContent.replace(importMatch[0], `import { ${existingImports.join(', ')} } from 'lucide-react';`);
  }
}

const functionStart = newContent.indexOf('export function GuidanceCommunications() {');
if (functionStart !== -1) {
  let braceCount = 0;
  let functionEnd = -1;
  let inFunction = false;
  
  for (let i = functionStart; i < newContent.length; i++) {
    if (newContent[i] === '{') {
      braceCount++;
      inFunction = true;
    } else if (newContent[i] === '}') {
      braceCount--;
      if (braceCount === 0 && inFunction) {
        functionEnd = i;
        break;
      }
    }
  }
  
  if (functionEnd !== -1) {
    const newComponent = `export function GuidanceCommunications() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [templateFilter, setTemplateFilter] = useState('Incomplete');
  
  useEffect(() => {
    // We fetch submissions instead to map students
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  }, []);

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  
  const toggleSelect = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };
  
  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredSubmissions.length && filteredSubmissions.length > 0) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredSubmissions.map(s => s.id));
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Communications</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Left Panel: Students List */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#f9fafb]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by student"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
              <button className="flex items-center gap-1 hover:text-gray-900 border border-gray-300 bg-white px-2 py-1 rounded shadow-sm hover:scale-[1.02] transition-all"><Filter className="w-3 h-3" /> Filter</button>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" 
                  checked={selectedStudents.length > 0 && selectedStudents.length < filteredSubmissions.length}
                  onChange={() => {}}
                /> 
                Select
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" 
                  checked={selectedStudents.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                  onChange={toggleSelectAll}
                /> 
                Select All
              </label>
              <button onClick={() => setSelectedStudents([])} className="hover:text-gray-900 font-bold ml-1">Clear</button>
              <span className="text-blue-600 ml-auto underline cursor-pointer">({filteredSubmissions.length}) students</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f0f2f5] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-2/3">Student</th>
                  <th className="py-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center w-1/3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map(s => (
                  <tr key={s.id} className={\`hover:bg-gray-50/80 transition-colors cursor-pointer \${selectedStudents.includes(s.id) ? 'bg-blue-50/30' : ''}\`} onClick={() => toggleSelect(s.id)}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-sm text-gray-900">{s.studentName}</div>
                      <div className="text-[11px] text-gray-500">{s.studentName.split(' ')[0].toLowerCase()}@gmail.com</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        s.status === 'Complete' || s.status === 'Approved'
                          ? "bg-green-100 text-green-700" 
                          : "bg-[#fff3cd] text-[#856404]"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.status === 'Complete' || s.status === 'Approved' ? "bg-green-500" : "bg-yellow-500")}></span>
                        {s.status === 'Pending' ? 'Incomplete' : s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Compose Editor */}
        <div className="flex-1 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-200 flex flex-col overflow-hidden relative">
          <div className="p-4 flex justify-between items-center bg-white z-10 relative">
            <h2 className="text-lg font-bold text-gray-900">Draft Response Email</h2>
            <div className="relative">
              <select 
                value={templateFilter}
                onChange={(e) => setTemplateFilter(e.target.value)}
                className="appearance-none bg-[#e8f0fe] text-[#1a73e8] font-semibold text-sm py-1.5 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>Incomplete</option>
                <option>Complete</option>
                <option>Custom</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a73e8] pointer-events-none" />
            </div>
          </div>
          
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-gray-500 text-sm">To</span>
              <div className="flex-1 text-sm text-gray-800">
                {selectedStudents.length > 0 ? (
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">{selectedStudents.length} recipient{selectedStudents.length > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-gray-400">Select students from the list...</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <button className="hover:text-gray-800 hover:underline">Cc</button>
              <button className="hover:text-gray-800 hover:underline">Bcc</button>
            </div>
          </div>
          
          <div className="px-6 py-3 border-b border-gray-100">
            <input 
              type="text" 
              placeholder="Subject" 
              className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              defaultValue={templateFilter === 'Incomplete' ? 'Action Required: Incomplete Scholarship Application' : ''}
            />
          </div>
          
          <div className="flex-1 p-6 relative">
            <textarea 
              className="w-full h-full text-sm text-gray-800 focus:outline-none resize-none"
              placeholder="Write your email here..."
              defaultValue={templateFilter === 'Incomplete' ? "Dear Student,\n\nWe are reviewing your scholarship application and noticed that some requirements are still missing or incomplete. Please log in to your portal and submit the necessary documents as soon as possible.\n\nThank you,\nGuidance Office" : ""}
            ></textarea>
          </div>
          
          {/* Bottom Toolbar */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex rounded-full overflow-hidden shadow-sm">
                <button className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2 text-sm font-medium transition-colors">
                  Send
                </button>
                <button className="bg-[#1a73e8] hover:bg-[#1557b0] border-l border-white/20 text-white px-2 py-2 transition-colors flex items-center justify-center">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-1 text-gray-500">
                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"><Type className="w-5 h-5" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Link2 className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Smile className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Triangle className="w-4 h-4" fill="currentColor" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Lock className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Pen className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors ml-2"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Floating Next Button at the bottom right outside composer, similar to mockup */}
          <div className="absolute -bottom-14 right-0">
             {/* Note: In mockup, there's a chevron right button floating outside the main box at the bottom right. We'll place it right aligned under the editor box. */}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-[1.05] text-[#0f2e60]">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );}`;
    
    newContent = newContent.substring(0, functionStart) + newComponent + newContent.substring(functionEnd + 1);
    fs.writeFileSync('src/pages/guidance/index.tsx', newContent);
    console.log("Updated GuidanceCommunications");
  } else {
    console.log("Could not find end of function");
  }
} else {
  console.log("Could not find start of function");
}
