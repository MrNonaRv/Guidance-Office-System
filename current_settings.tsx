export function GuidanceSettings() {
  const [activeTab, setActiveTab] = useState('Academic Year');

  const tabs = [
    { name: 'Academic Year', icon: Calendar },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Sections', icon: Users },
    { name: 'Form', icon: FileText },
    { name: 'Files', icon: Image },
  ];

  const academicYears = [
    { year: '2026-2027', overall: 'Active', sem1: 'Active', sem2: 'Inactive' },
    { year: '2026-2025', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
    { year: '2025-2024', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
    { year: '2024-2023', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Settings</h1>
      
      {/* Tabs */}
      <div className="border-b-2 border-gray-300">
        <div className="flex gap-8 max-w-4xl px-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 pb-3 font-bold text-[15px] relative ${isActive ? 'text-[#1a44f2]' : 'text-[#0f2e60] hover:text-[#1a44f2]'}`}
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

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#0f2e60]">Academic Year</h2>
            <button className="bg-[#0f2e60] hover:bg-[#0a2044] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
              <Plus className="w-4 h-4 font-bold" /> Add
            </button>
          </div>
          
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
              {academicYears.map((ay, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-[#0f2e60] whitespace-nowrap">{ay.year}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={cn(
                      "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide",
                      ay.overall === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                    )}>
                      {ay.overall}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={cn(
                      "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide",
                      ay.sem1 === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                    )}>
                      {ay.sem1}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={cn(
                      "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide",
                      ay.sem2 === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                    )}>
                      {ay.sem2}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-gray-600 transition-colors">
                        <Pen className="w-4 h-4" />
                      </button>
                      <button className="hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-6 bg-white"></div>
        </div>
      </div>
    </div>
  );
}
