export function GuidanceCommunications() {
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
                  <tr key={s.id} className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${selectedStudents.includes(s.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleSelect(s.id)}>
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
              defaultValue={templateFilter === 'Incomplete' ? `Dear Student,\n\nWe are reviewing your scholarship application and noticed that some requirements are still missing or incomplete. Please log in to your portal and submit the necessary documents as soon as possible.\n\nThank you,\nGuidance Office` : ''}
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
  );}

export function GuidanceReports() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [view, setView] = useState<'analytics' | 'breakdown'>('analytics');
  
  useEffect(() => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  }, []);

  const totalStudents = submissions.length || 213;
  const completeCount = submissions.filter(s => s.status === 'Complete' || s.status === 'Approved').length || 128;
  const incompleteCount = totalStudents - completeCount;

  // Mocking gender distribution since it's not in the DB, matching proportions from the mockup
  const maleCount = Math.round(totalStudents * (117 / 213));
  const femaleCount = totalStudents - maleCount;

  const mockBreakdownData = [
    { name: 'Anna Marie A. Santos', year: '2nd year', course: 'BAEL', category: 'Externally-Funded', subType: 'CHED', allocation: 'Pag-Ulikid' },
    { name: 'Patricia Jane K. Manalo', year: '2nd year', course: 'BAEL', category: 'Externally-Funded', subType: 'CHED', allocation: 'Tulong Dunong' },
    { name: 'Damian James O. Emilio', year: '4th year', course: 'BSFT', category: 'Externally-Funded', subType: 'CHED', allocation: 'ANAC-IP' },
    { name: 'Paul John N. Dela Cruz', year: '4th year', course: 'BSOA', category: 'Internally-Funded', subType: 'Institutional', allocation: 'President-FLP' },
    { name: 'Charlotte Alexis N. Tuvera', year: '3rd year', course: 'BSCS', category: 'Internally-Funded', subType: 'Institutional', allocation: 'Dependent of Faculty or Staff' },
    { name: 'Michael G. Burata', year: '3rd year', course: 'BSCS', category: 'Internally-Funded', subType: 'Socio-cultural', allocation: 'Regional' },
    { name: 'Chery Joy M. Marcelino', year: '3rd year', course: 'BSCS', category: 'Internally-Funded', subType: 'Academic', allocation: 'Partial' },
    { name: 'Jessica Mae E. Dela Cruz', year: '3rd year', course: 'BSCS', category: 'Externally-Funded', subType: 'CHED', allocation: 'UniFast' },
    { name: 'Mark Josh P. Lorenzo', year: '1st year', course: 'BSOA', category: 'Externally-Funded', subType: 'CHED', allocation: 'TES' },
    { name: 'William George I. Diaz', year: '1st year', course: 'BSFT', category: 'Externally-Funded', subType: 'Merit', allocation: 'DOST' },
    { name: 'Febe Ronile Alejandro', year: '2nd year', course: 'BSCS', category: 'Externally-Funded', subType: 'Merit', allocation: 'LGU' },
    { name: 'Elijah A. Andalecio', year: '3rd year', course: 'BSCS', category: 'Externally-Funded', subType: 'CHED', allocation: 'Tulong Dunong' },
    { name: 'Michelle Diane C. Flores', year: '4th year', course: 'BSOA', category: 'Externally-Funded', subType: 'CHED', allocation: 'Barangay (Legal dependents of Brgy. Officials)' },
    { name: 'Christian Jason J. Valdez', year: '1st year', course: 'BSFT', category: 'Internally-Funded', subType: 'CHED', allocation: 'ESGP - PA' },
  ];

  const getRowDetails = (s: any, index: number) => {
    if (index < mockBreakdownData.length) {
      return mockBreakdownData[index];
    }
    // Generic fallback for remaining rows
    return {
      name: s.studentName,
      year: ['1st year', '2nd year', '3rd year', '4th year'][index % 4],
      course: s.answers?.course || 'BSCS',
      category: index % 3 === 0 ? 'Internally-Funded' : 'Externally-Funded',
      subType: index % 2 === 0 ? 'CHED' : 'Institutional',
      allocation: index % 4 === 0 ? 'Tulong Dunong' : (index % 3 === 0 ? 'President-FLP' : 'UniFast')
    };
  };

  if (view === 'breakdown') {
    return (
      <div className="space-y-6 h-full flex flex-col max-w-[1200px]">
        <div className="flex justify-between items-center">
          <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Scholarship Breakdown</h1>
          <button className="px-6 py-2 bg-[#e0e7ff] text-[#1e40af] font-semibold text-sm rounded-full hover:bg-[#dbeafe] transition-colors shadow-sm">
            Export as PDF
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row gap-6 shadow-sm items-end">
          <div className="flex-1 max-w-[200px]">
            <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">CATEGORY</label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>Category</option>
                <option>Internally-Funded</option>
                <option>Externally-Funded</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 max-w-[200px]">
            <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">SUB TYPE</label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>Sub Type</option>
                <option>CHED</option>
                <option>Institutional</option>
                <option>Socio-cultural</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 max-w-[250px]">
            <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">SCHOLARSHIP ALLOCATION</label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>Scholarship Allocation</option>
                <option>Pag-Ulikid</option>
                <option>Tulong Dunong</option>
                <option>UniFast</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="flex items-center gap-2 px-6 py-2 bg-[#e2e8f0] text-[#334155] border border-gray-300 rounded-lg text-sm font-bold shadow-sm hover:bg-[#cbd5e1] transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <span className="text-blue-600 font-medium underline cursor-pointer hover:text-blue-800">
              ({totalStudents}) students
            </span>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">STUDENT</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">YEAR LEVEL</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">COURSE</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">CATEGORY</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">SUB TYPE</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">SCHOLARSHIP ALLOCATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((s, idx) => {
                  const details = getRowDetails(s, idx);
                  return (
                    <tr key={s.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6 text-xs font-bold text-gray-900 whitespace-nowrap">{details.name}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.year}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.course}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.category}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.subType}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center">{details.allocation}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-start pt-2">
          <button 
            onClick={() => setView('analytics')}
            className="px-8 py-2.5 bg-[#4070f4] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#2c5ae0] transition-colors hover:scale-[1.02]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Reports & Analytics</h1>
        <button className="px-6 py-2 bg-[#e0e7ff] text-[#1e40af] font-semibold text-sm rounded-full hover:bg-[#dbeafe] transition-colors shadow-sm">
          Export as PDF
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-6 shadow-sm">
        <div className="flex-1 max-w-sm">
          <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">COURSE</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>All courses</option>
              <option>BAEL</option>
              <option>BSCS</option>
              <option>BSFT</option>
              <option>BSOA</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 max-w-sm">
          <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">YEAR LEVEL</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>All year level</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Submissions Status Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-6">Submissions Status Distribution</h2>
        
        <div className="space-y-6">
          {/* Complete */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Complete</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-r-lg transition-all duration-1000 ease-out flex items-center justify-end px-3"
                style={{ width: `${Math.max(5, (completeCount / totalStudents) * 100)}%` }}
              >
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{completeCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
          
          {/* Incomplete */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Incomplete</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#eab308] to-[#facc15] rounded-r-lg transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(5, (incompleteCount / totalStudents) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{incompleteCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gender Status Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-6">Gender Status Distribution</h2>
        
        <div className="space-y-6">
          {/* Male */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Male</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-r-lg transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(5, (maleCount / totalStudents) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{maleCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
          
          {/* Female */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Female</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] rounded-r-lg transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(5, (femaleCount / totalStudents) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{femaleCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button 
          onClick={() => setView('breakdown')}
          className="px-8 py-2.5 bg-[#4070f4] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#2c5ae0] transition-colors hover:scale-[1.02]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
