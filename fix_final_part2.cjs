const fs = require('fs');
let code = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

const anchor = 'I hereby certify that the information I have provided is true and correct';

const searchIndex = code.indexOf(anchor);

if (searchIndex === -1) {
  console.log("Could not find anchor");
  process.exit(1);
}

// Find the exact place where `{/* Modal */}` starts.
const modalIndex = code.indexOf('{/* Modal */}');

if (modalIndex === -1) {
  console.log("Could not find modal");
  process.exit(1);
}

// Cut between anchor and modal. We'll reconstruct the whole thing from anchor to EOF.
const everythingBefore = code.substring(0, searchIndex);

const correctEnd = `I hereby certify that the information I have provided is true and correct to the best of my knowledge. I understand that this information will be used solely for student profiling.</p>
                    <div className="w-80">
                      <div className="border-b border-black text-center h-6 font-bold uppercase">{selectedSubmission.studentName}</div>
                      <div className="text-center">Signature over Printed Name</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GuidanceSettings() {
  const [activeTab, setActiveTab] = useState('scholarships');
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [scholarshipForm, setScholarshipForm] = useState({
    name: '', type: 'Internally-Funded', category: '',
    status: 'Active', slots: 0, deadline: '', description: ''
  });

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    const list = await db.scholarships.listAll();
    setScholarships(list);
  };

  const handleSaveScholarship = async () => {
    if (editingScholarship) {
      await db.scholarships.update(editingScholarship.id, scholarshipForm);
    } else {
      await db.scholarships.create(scholarshipForm);
    }
    setShowScholarshipModal(false);
    loadScholarships();
  };

  const handleEdit = (s: any) => {
    setEditingScholarship(s);
    setScholarshipForm(s);
    setShowScholarshipModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await db.scholarships.delete(id);
      loadScholarships();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#0f2e60]">System Settings</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 flex gap-4 px-6 pt-4">
          <button className={\`pb-4 text-sm font-bold border-b-2 transition-colors \${activeTab === 'scholarships' ? 'border-[#1864db] text-[#1864db]' : 'border-transparent text-gray-500 hover:text-gray-900'}\`} onClick={() => setActiveTab('scholarships')}>Scholarships Management</button>
          <button className={\`pb-4 text-sm font-bold border-b-2 transition-colors \${activeTab === 'courses' ? 'border-[#1864db] text-[#1864db]' : 'border-transparent text-gray-500 hover:text-gray-900'}\`} onClick={() => setActiveTab('courses')}>Courses</button>
          <button className={\`pb-4 text-sm font-bold border-b-2 transition-colors \${activeTab === 'academic-years' ? 'border-[#1864db] text-[#1864db]' : 'border-transparent text-gray-500 hover:text-gray-900'}\`} onClick={() => setActiveTab('academic-years')}>Academic Years</button>
        </div>

        <div className="p-6">
          {activeTab === 'scholarships' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Scholarship Registry</h3>
                <button 
                  onClick={() => {
                    setEditingScholarship(null);
                    setScholarshipForm({ name: '', type: 'Internally-Funded', category: '', status: 'Active', slots: 0, deadline: '', description: '' });
                    setShowScholarshipModal(true);
                  }}
                  className="bg-[#1864db] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#124b9f]"
                >
                  + Add Scholarship
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 font-bold">Name</th>
                      <th className="px-6 py-3 font-bold">Type</th>
                      <th className="px-6 py-3 font-bold">Category</th>
                      <th className="px-6 py-3 font-bold">Slots</th>
                      <th className="px-6 py-3 font-bold">Deadline</th>
                      <th className="px-6 py-3 font-bold">Status</th>
                      <th className="px-6 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scholarships.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-gray-900">{s.name}</td>
                        <td className="px-6 py-4">{s.type}</td>
                        <td className="px-6 py-4">{s.category}</td>
                        <td className="px-6 py-4">{s.slots}</td>
                        <td className="px-6 py-4">{s.deadline}</td>
                        <td className="px-6 py-4">
                          <span className={\`px-3 py-1 rounded-full text-xs font-bold \${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}\`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'courses' && (
            <div className="text-gray-500 text-sm">Course management coming soon...</div>
          )}
          {activeTab === 'academic-years' && (
            <div className="text-gray-500 text-sm">Academic year management coming soon...</div>
          )}
        </div>
      </div>
      
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
  );
}
`;

fs.writeFileSync('src/pages/guidance/index.tsx', everythingBefore + correctEnd);
