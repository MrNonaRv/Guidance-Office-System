const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

const startStr = 'export function GuidanceSettings() {';
const startIdx = content.indexOf(startStr);
let braceCount = 0;
let endIdx = -1;
let inFunction = false;

if (startIdx !== -1) {
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      inFunction = true;
    } else if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0 && inFunction) {
        endIdx = i;
        break;
      }
    }
  }
}

const newSettings = `export function GuidanceSettings() {
  const [activeTab, setActiveTab] = useState('Form');

  const tabs = [
    { name: 'Academic Year', icon: Calendar },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Sections', icon: Users },
    { name: 'Form', icon: FileText },
    { name: 'Files', icon: Image },
  ];

  // --- ACADEMIC YEAR STATE ---
  const [academicYears, setAcademicYears] = useState([
    { id: 1, year: '2026-2027', overall: 'Active', sem1: 'Active', sem2: 'Inactive' },
    { id: 2, year: '2025-2026', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
    { id: 3, year: '2024-2025', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
    { id: 4, year: '2023-2024', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
  ]);
  const [showAyModal, setShowAyModal] = useState(false);
  const [editingAy, setEditingAy] = useState<any>(null);
  const [ayForm, setAyForm] = useState({ year: '', overall: 'Active', sem1: 'Active', sem2: 'Inactive' });

  const handleAddAy = () => {
    setEditingAy(null);
    setAyForm({ year: '', overall: 'Active', sem1: 'Active', sem2: 'Inactive' });
    setShowAyModal(true);
  };

  const handleEditAy = (ay: any) => {
    setEditingAy(ay);
    setAyForm({ ...ay });
    setShowAyModal(true);
  };

  const handleDeleteAy = (id: number) => {
    if (window.confirm("Are you sure you want to delete this academic year?")) {
      setAcademicYears(academicYears.filter(ay => ay.id !== id));
    }
  };

  const saveAy = () => {
    if (!ayForm.year) return alert("Please enter an academic year (e.g., 2027-2028)");
    if (editingAy) {
      setAcademicYears(academicYears.map(ay => ay.id === editingAy.id ? { ...ayForm, id: ay.id } : ay));
    } else {
      setAcademicYears([{ ...ayForm, id: Date.now() }, ...academicYears]);
    }
    setShowAyModal(false);
  };

  // --- FORM SECTIONS STATE ---
  const [formSections, setFormSections] = useState([
    { id: 1, title: 'STUDENT DEMOGRAPHICS' }
  ]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleAddFormSection = () => {
    setNewSectionTitle('');
    setShowFormModal(true);
  };

  const saveFormSection = () => {
    if (!newSectionTitle) return;
    setFormSections([...formSections, { id: Date.now(), title: newSectionTitle.toUpperCase() }]);
    setShowFormModal(false);
  };

  const handleDeleteFormSection = (id: number) => {
    if (window.confirm("Remove this section?")) {
      setFormSections(formSections.filter(fs => fs.id !== id));
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col relative pb-6">
      <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Settings</h1>
      
      {/* Tabs */}
      <div className="border-b-2 border-gray-300">
        <div className="flex gap-8 max-w-4xl px-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={\`flex items-center gap-2 pb-3 font-bold text-[15px] relative whitespace-nowrap \${isActive ? 'text-[#1a44f2]' : 'text-[#0f2e60] hover:text-[#1a44f2]'}\`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-[#1a44f2] rounded-t-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl flex-1 flex flex-col">
        {activeTab === 'Academic Year' && (
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0f2e60]">Academic Year</h2>
              <button onClick={handleAddAy} className="bg-[#0f2e60] hover:bg-[#0a2044] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Plus className="w-4 h-4 font-bold" /> Add
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eef2f6] border-b border-gray-300">
                  <tr>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Academic Year</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">Overall Status</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">1st Semester</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">2nd Semester</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {academicYears.map((ay) => (
                    <tr key={ay.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-[#0f2e60] whitespace-nowrap">{ay.year}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          ay.overall === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {ay.overall}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          ay.sem1 === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {ay.sem1}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          ay.sem2 === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {ay.sem2}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button onClick={() => handleEditAy(ay)} className="hover:text-blue-600 transition-colors">
                            <Pen className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteAy(ay.id)} className="hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {academicYears.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                        No academic years configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="h-6 bg-white"></div>
          </div>
        )}

        {activeTab === 'Form' && (
          <div className="flex flex-col flex-1 relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#0f2e60] px-2">Form</h2>
              <button onClick={handleAddFormSection} className="bg-[#12306b] hover:bg-[#0a2044] text-white px-8 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Plus className="w-5 h-5 font-bold" /> Add
              </button>
            </div>
            
            <div className="space-y-4">
              {formSections.map(fs => (
                <div key={fs.id} className="bg-white rounded-md border border-gray-400 p-8 flex justify-between items-center shadow-sm hover:border-blue-400 transition-colors group">
                  <h3 className="text-[#0f2e60] font-black text-[18px] tracking-wide uppercase">{fs.title}</h3>
                  <button onClick={() => handleDeleteFormSection(fs.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formSections.length === 0 && (
                <div className="text-center py-12 bg-white rounded-md border border-dashed border-gray-300 text-gray-500">
                  No form sections. Click Add to create one.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === 'Form' && (
        <div className="absolute bottom-6 right-6">
          <button 
            onClick={() => setActiveTab('Files')} 
            className="bg-[#244280] hover:bg-[#1c3566] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showAyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{editingAy ? 'Edit Academic Year' : 'Add Academic Year'}</h3>
              <button onClick={() => setShowAyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Year Label (e.g. 2026-2027)</label>
                <input 
                  type="text" 
                  value={ayForm.year} 
                  onChange={e => setAyForm({...ayForm, year: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Overall</label>
                  <select value={ayForm.overall} onChange={e => setAyForm({...ayForm, overall: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">1st Sem</label>
                  <select value={ayForm.sem1} onChange={e => setAyForm({...ayForm, sem1: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">2nd Sem</label>
                  <select value={ayForm.sem2} onChange={e => setAyForm({...ayForm, sem2: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowAyModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveAy} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Add Form Section</h3>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Section Title</label>
              <input 
                type="text" 
                placeholder="e.g. ACADEMIC BACKGROUND"
                value={newSectionTitle} 
                onChange={e => setNewSectionTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveFormSection()}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" 
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowFormModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveFormSection} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}`;

content = content.substring(0, startIdx) + newSettings + content.substring(endIdx + 1);

fs.writeFileSync('src/pages/guidance/index.tsx', content);
