const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// Find where to insert Courses state
const stateInsertPoint = content.indexOf('// --- FORM SECTIONS STATE ---');
const coursesState = `
  // --- COURSES STATE ---
  const [courses, setCourses] = useState([
    { id: 1, name: 'BAEL', status: 'Active' },
    { id: 2, name: 'BSCS', status: 'Active' },
    { id: 3, name: 'BSFT', status: 'Active' },
    { id: 4, name: 'BSOA', status: 'Active' },
  ]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({ name: '', status: 'Active' });

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({ name: '', status: 'Active' });
    setShowCourseModal(true);
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setCourseForm({ ...course });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const saveCourse = () => {
    if (!courseForm.name) return alert("Please enter a course name");
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...courseForm, id: c.id } : c));
    } else {
      setCourses([...courses, { ...courseForm, id: Date.now() }]);
    }
    setShowCourseModal(false);
  };

`;

content = content.slice(0, stateInsertPoint) + coursesState + content.slice(stateInsertPoint);

// Find where to insert Courses UI
const uiInsertPoint = content.indexOf("{activeTab === 'Form' && (");
const coursesUi = `
        {activeTab === 'Courses' && (
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0f2e60]">Courses</h2>
              <button onClick={handleAddCourse} className="bg-[#0f2e60] hover:bg-[#0a2044] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Plus className="w-4 h-4 font-bold" /> Add
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eef2f6] border-b border-gray-300">
                  <tr>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Course Name</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">Status</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-[#0f2e60] whitespace-nowrap">{course.name}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          course.status === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button onClick={() => handleEditCourse(course)} className="hover:text-blue-600 transition-colors">
                            <Pen className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">
                        No courses configured.
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

content = content.slice(0, uiInsertPoint) + coursesUi + content.slice(uiInsertPoint);

// Find where to insert Courses modal
const modalInsertPoint = content.indexOf('{showFormModal && (');
const coursesModal = `
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Course Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. BSCS"
                  value={courseForm.name} 
                  onChange={e => setCourseForm({...courseForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
                <select value={courseForm.status} onChange={e => setCourseForm({...courseForm, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveCourse} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

`;

content = content.slice(0, modalInsertPoint) + coursesModal + content.slice(modalInsertPoint);

fs.writeFileSync('src/pages/guidance/index.tsx', content);
