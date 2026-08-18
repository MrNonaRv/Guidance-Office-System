const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// Insert Sections and Files state
const stateInsertPoint = content.indexOf('// --- FORM SECTIONS STATE ---');
const additionalState = `
  // --- SECTIONS STATE ---
  const [sections, setSections] = useState([
    { id: 1, name: '1A', course: 'BSCS', status: 'Active' },
    { id: 2, name: '1B', course: 'BSCS', status: 'Active' },
    { id: 3, name: '2A', course: 'BSIT', status: 'Active' },
  ]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionForm, setSectionForm] = useState({ name: '', course: 'BAEL', status: 'Active' });

  const handleAddSection = () => {
    setEditingSection(null);
    setSectionForm({ name: '', course: courses[0]?.name || 'BAEL', status: 'Active' });
    setShowSectionModal(true);
  };

  const handleEditSection = (section: any) => {
    setEditingSection(section);
    setSectionForm({ ...section });
    setShowSectionModal(true);
  };

  const handleDeleteSection = (id: number) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const saveSection = () => {
    if (!sectionForm.name) return alert("Please enter a section name");
    if (editingSection) {
      setSections(sections.map(s => s.id === editingSection.id ? { ...sectionForm, id: s.id } : s));
    } else {
      setSections([...sections, { ...sectionForm, id: Date.now() }]);
    }
    setShowSectionModal(false);
  };

  // --- FILES STATE ---
  const [files, setFiles] = useState([
    { id: 1, name: 'ETG Survey Form.pdf', size: '2.4 MB', date: 'Aug 18, 2026' },
    { id: 2, name: 'Scholarship Guidelines.pdf', size: '1.1 MB', date: 'Aug 17, 2026' }
  ]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileForm, setFileForm] = useState({ name: '' });

  const handleAddFile = () => {
    setFileForm({ name: '' });
    setShowFileModal(true);
  };

  const saveFile = () => {
    if (!fileForm.name) return;
    setFiles([{ id: Date.now(), name: fileForm.name + '.pdf', size: '1.5 MB', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...files]);
    setShowFileModal(false);
  };

  const handleDeleteFile = (id: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setFiles(files.filter(f => f.id !== id));
    }
  };
`;

content = content.slice(0, stateInsertPoint) + additionalState + content.slice(stateInsertPoint);

// Insert Sections UI and Files UI just before Forms UI
const uiInsertPoint = content.indexOf("{activeTab === 'Form' && (");
const additionalUi = `
        {activeTab === 'Sections' && (
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0f2e60]">Sections</h2>
              <button onClick={handleAddSection} className="bg-[#0f2e60] hover:bg-[#0a2044] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Plus className="w-4 h-4 font-bold" /> Add
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eef2f6] border-b border-gray-300">
                  <tr>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Course</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Section Name</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">Status</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sections.map((section) => (
                    <tr key={section.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-[#0f2e60] whitespace-nowrap">{section.course}</td>
                      <td className="py-4 px-6 text-sm font-bold text-[#0f2e60] whitespace-nowrap">{section.name}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          section.status === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {section.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button onClick={() => handleEditSection(section)} className="hover:text-blue-600 transition-colors">
                            <Pen className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteSection(section.id)} className="hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sections.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                        No sections configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="h-6 bg-white"></div>
          </div>
        )}

        {activeTab === 'Files' && (
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0f2e60]">Files & Templates</h2>
              <button onClick={handleAddFile} className="bg-[#0f2e60] hover:bg-[#0a2044] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Upload className="w-4 h-4 font-bold" /> Upload File
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eef2f6] border-b border-gray-300">
                  <tr>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">File Name</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Date Added</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Size</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-6 text-sm font-semibold text-[#0f2e60] flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        {file.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">{file.date}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">{file.size}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="hover:text-blue-600 transition-colors">
                            <View className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteFile(file.id)} className="hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {files.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                        No files uploaded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="h-6 bg-white"></div>
          </div>
        )}

`;

content = content.slice(0, uiInsertPoint) + additionalUi + content.slice(uiInsertPoint);

// Insert Modals for Sections and Files
const modalInsertPoint = content.indexOf('{showFormModal && (');
const additionalModals = `
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{editingSection ? 'Edit Section' : 'Add Section'}</h3>
              <button onClick={() => setShowSectionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Course</label>
                <select value={sectionForm.course} onChange={e => setSectionForm({...sectionForm, course: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {courses.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Section Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1A"
                  value={sectionForm.name} 
                  onChange={e => setSectionForm({...sectionForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
                <select value={sectionForm.status} onChange={e => setSectionForm({...sectionForm, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowSectionModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveSection} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {showFileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Upload File</h3>
              <button onClick={() => setShowFileModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">File Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Scholarship Manual"
                  value={fileForm.name} 
                  onChange={e => setFileForm({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Click to browse or drag file here</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 10MB</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowFileModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveFile} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Upload</button>
            </div>
          </div>
        </div>
      )}
`;

content = content.slice(0, modalInsertPoint) + additionalModals + content.slice(modalInsertPoint);

// Ensure Upload icon is imported from lucide-react
if (!content.includes('Upload,')) {
  content = content.replace("import { LayoutDashboard", "import { Upload, LayoutDashboard");
}

fs.writeFileSync('src/pages/guidance/index.tsx', content);
