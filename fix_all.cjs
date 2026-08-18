const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

const splitIndex = content.indexOf('{/* Modal */}');

let part1 = content.substring(0, splitIndex);
let part2 = content.substring(splitIndex);

// Let's fix the end of part1 to correctly close GuidanceSubmissions.
// The print mode was added inside part1.
// We need to ensure part1 ends with:
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// Let's strip the broken end of part1 and add the correct one.
const endOfPrintPage = '                </div>\n              </div>\n            </div>\n          </div>\n          {/* -------------------------------------------------------- */}';

const endPrintIdx = part1.indexOf(endOfPrintPage);
if (endPrintIdx !== -1) {
  part1 = part1.substring(0, endPrintIdx + endOfPrintPage.length) + `
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

`;
} else {
  console.log("Could not find end of print page!");
}

let finalContent = part1 + part2;
fs.writeFileSync('src/pages/guidance/index.tsx', finalContent);
