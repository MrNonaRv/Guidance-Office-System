const fs = require('fs');

let index = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

const missingIcons = ['Calendar', 'GraduationCap', 'Users', 'Award', 'Image', 'Pen', 'Plus', 'Trash2'];
missingIcons.forEach(icon => {
  if (!index.includes(icon + ',')) {
    index = index.replace('import { Upload,', 'import { ' + icon + ', Upload,');
  }
});

const settingsCode = `
export function GuidanceSettings() {
  const [activeTab, setActiveTab] = useState('Scholarships');
  
  const tabs = [
    { name: 'Scholarships', icon: Award },
    { name: 'Academic Year', icon: Calendar },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Sections', icon: Users },
  ];

  // --- SCHOLARSHIPS STATE ---
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [scholarshipForm, setScholarshipForm] = useState({ name: '', type: 'Internally-Funded', category: '', status: 'Active', description: '', slots: 0, deadline: '' });

  useEffect(() => {
    // @ts-ignore
    db.scholarships.listAll().then(setScholarships);
  }, []);

  const handleAddScholarship = () => {
    setEditingScholarship(null);
    setScholarshipForm({ name: '', type: 'Internally-Funded', category: '', status: 'Active', description: '', slots: 0, deadline: '' });
    setShowScholarshipModal(true);
  };

  const handleEditScholarship = (scholarship: any) => {
    setEditingScholarship(scholarship);
    setScholarshipForm({ ...scholarship });
    setShowScholarshipModal(true);
  };

  const handleSaveScholarship = async () => {
    const s = {
      id: editingScholarship ? editingScholarship.id : Date.now().toString(),
      ...scholarshipForm
    };
    // @ts-ignore
    await db.scholarships.set(s.id, s);
    // @ts-ignore
    db.scholarships.listAll().then(setScholarships);
    setShowScholarshipModal(false);
  };

  const handleDeleteScholarship = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      // @ts-ignore
      await db.scholarships.delete(id);
      // @ts-ignore
      db.scholarships.listAll().then(setScholarships);
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">System Settings</h1>
          <p className="text-gray-500 mt-1">Manage system configurations, forms, and templates.</p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all",
              activeTab === tab.name 
                ? "bg-[#1864db] text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        {activeTab === 'Scholarships' && (
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Scholarship Registry</h3>
                <p className="text-sm text-gray-500 mt-1">Manage the list of available scholarships and funding types.</p>
              </div>
              <button onClick={handleAddScholarship} className="flex items-center gap-2 px-4 py-2 bg-[#1864db] text-white rounded-lg text-sm font-bold hover:bg-[#124b9f] transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Add Scholarship
              </button>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {scholarships.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#1864db] hover:shadow-md transition-all relative group bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{s.type}</span>
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      s.status === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    )}>{s.status}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{s.name}</h4>
                  <p className="text-sm text-gray-600 font-medium">{s.category} Category</p>
                  
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => handleEditScholarship(s)} className="flex-1 py-2 text-sm font-bold text-gray-600 hover:text-[#1864db] bg-white border border-gray-200 hover:border-[#1864db] rounded-lg transition-colors">Edit</button>
                    <button onClick={() => handleDeleteScholarship(s.id)} className="px-3 py-2 text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            
            {scholarships.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No scholarships configured. Click "Add Scholarship" to get started.
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showScholarshipModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-900">{editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}</h3>
                <button onClick={() => setShowScholarshipModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Scholarship Name</label>
                  <input type="text" value={scholarshipForm.name} onChange={e => setScholarshipForm({...scholarshipForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" placeholder="e.g. Tulong Dunong" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                  <textarea value={scholarshipForm.description} onChange={e => setScholarshipForm({...scholarshipForm, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" placeholder="Short description..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Funding Type</label>
                    <select value={scholarshipForm.type} onChange={e => setScholarshipForm({...scholarshipForm, type: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]">
                      <option>Internally-Funded</option>
                      <option>Externally-Funded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Category / Tag</label>
                    <input type="text" value={scholarshipForm.category} onChange={e => setScholarshipForm({...scholarshipForm, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" placeholder="e.g. Entrance, CHED" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                    <select value={scholarshipForm.status} onChange={e => setScholarshipForm({...scholarshipForm, status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Slots</label>
                    <input type="number" value={scholarshipForm.slots} onChange={e => setScholarshipForm({...scholarshipForm, slots: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Deadline</label>
                  <input type="date" value={scholarshipForm.deadline} onChange={e => setScholarshipForm({...scholarshipForm, deadline: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowScholarshipModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleSaveScholarship} className="px-6 py-2 bg-[#1864db] text-white rounded-lg font-bold text-sm hover:bg-[#124b9f]">Save Scholarship</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;

index = index + "\n" + settingsCode;

fs.writeFileSync('src/pages/guidance/index.tsx', index);
