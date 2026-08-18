const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// 1. Add Award to imports
if (!content.includes('Award,')) {
  content = content.replace("import { Upload", "import { Award, Upload");
}

// 2. Add Scholarships to tabs
const tabsStr = `  const tabs = [
    { name: 'Academic Year', icon: Calendar },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Sections', icon: Users },
    { name: 'Scholarships', icon: Award },
    { name: 'Form', icon: FileText },
    { name: 'Files', icon: Image },
  ];`;
content = content.replace(/const tabs = \[[\s\S]*?\];/, tabsStr);

// 3. Add Scholarships state
const stateInsertPoint = content.indexOf('// --- FORM SECTIONS STATE ---');
const scholarshipState = `
  // --- SCHOLARSHIPS STATE ---
  const [scholarships, setScholarships] = useState([
    { id: 1, name: 'Valedictorian/Salutatorian', type: 'Internally-Funded', category: 'Entrance', status: 'Active' },
    { id: 2, name: 'Tulong Dunong', type: 'Externally-Funded', category: 'CHED', status: 'Active' },
    { id: 3, name: 'DOST', type: 'Externally-Funded', category: 'Merit', status: 'Active' },
    { id: 4, name: 'Dependent of Faculty or Staff', type: 'Internally-Funded', category: 'Institutional', status: 'Active' },
  ]);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [scholarshipForm, setScholarshipForm] = useState({ name: '', type: 'Internally-Funded', category: '', status: 'Active' });

  const handleAddScholarship = () => {
    setEditingScholarship(null);
    setScholarshipForm({ name: '', type: 'Internally-Funded', category: '', status: 'Active' });
    setShowScholarshipModal(true);
  };

  const handleEditScholarship = (scholarship: any) => {
    setEditingScholarship(scholarship);
    setScholarshipForm({ ...scholarship });
    setShowScholarshipModal(true);
  };

  const handleDeleteScholarship = (id: number) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      setScholarships(scholarships.filter(s => s.id !== id));
    }
  };

  const saveScholarship = () => {
    if (!scholarshipForm.name) return alert("Please enter a scholarship name");
    if (editingScholarship) {
      setScholarships(scholarships.map(s => s.id === editingScholarship.id ? { ...scholarshipForm, id: s.id } : s));
    } else {
      setScholarships([{ ...scholarshipForm, id: Date.now() }, ...scholarships]);
    }
    setShowScholarshipModal(false);
  };
`;
content = content.slice(0, stateInsertPoint) + scholarshipState + content.slice(stateInsertPoint);

// 4. Add Scholarships UI
const uiInsertPoint = content.indexOf("{activeTab === 'Form' && (");
const scholarshipUi = `
        {activeTab === 'Scholarships' && (
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0f2e60]">Scholarships</h2>
              <button onClick={handleAddScholarship} className="bg-[#0f2e60] hover:bg-[#0a2044] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Plus className="w-4 h-4 font-bold" /> Add
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eef2f6] border-b border-gray-300">
                  <tr>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Scholarship Name</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Type</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Category</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">Status</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scholarships.map((scholarship) => (
                    <tr key={scholarship.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-[#0f2e60] whitespace-nowrap">{scholarship.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                        <span className={cn("px-2 py-1 rounded text-xs font-medium", scholarship.type === 'Internally-Funded' ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800")}>
                          {scholarship.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">{scholarship.category || '-'}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          scholarship.status === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {scholarship.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button onClick={() => handleEditScholarship(scholarship)} className="hover:text-blue-600 transition-colors">
                            <Pen className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteScholarship(scholarship.id)} className="hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {scholarships.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                        No scholarships configured.
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
content = content.slice(0, uiInsertPoint) + scholarshipUi + content.slice(uiInsertPoint);

// 5. Add Scholarships Modal
const modalInsertPoint = content.indexOf('{showFormModal && (');
const scholarshipModal = `
      {showScholarshipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{editingScholarship ? 'Edit Scholarship' : 'Add Scholarship'}</h3>
              <button onClick={() => setShowScholarshipModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Scholarship Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tulong Dunong"
                  value={scholarshipForm.name} 
                  onChange={e => setScholarshipForm({...scholarshipForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Funding Type</label>
                  <select value={scholarshipForm.type} onChange={e => setScholarshipForm({...scholarshipForm, type: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Internally-Funded</option>
                    <option>Externally-Funded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CHED, Merit, Entrance"
                    value={scholarshipForm.category} 
                    onChange={e => setScholarshipForm({...scholarshipForm, category: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
                <select value={scholarshipForm.status} onChange={e => setScholarshipForm({...scholarshipForm, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowScholarshipModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveScholarship} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
`;
content = content.slice(0, modalInsertPoint) + scholarshipModal + content.slice(modalInsertPoint);

fs.writeFileSync('src/pages/guidance/index.tsx', content);
