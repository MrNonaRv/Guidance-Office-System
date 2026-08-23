const fs = require('fs');

let s = fs.readFileSync('src/pages/guidance/index.tsx', 'utf8');

const oldCards = `{/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blue Card */}
        <div className="bg-gradient-to-b from-[#1c64db] to-[#12429f] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{totalCount}</div>
            <div className="text-base font-semibold text-white mt-1">Total Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-blue-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 4 this week
            </div>
          </div>
        </div>
        
        {/* Green Card */}
        <div className="bg-gradient-to-b from-[#3fa52a] to-[#287b1a] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{completeCount}</div>
            <div className="text-base font-semibold text-white mt-1">Complete Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-green-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 3 new today
            </div>
          </div>
        </div>
        
        {/* Yellow/Gold Card */}
        <div className="bg-gradient-to-b from-[#c88d00] to-[#e69f00] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{incompleteCount}</div>
            <div className="text-base font-semibold text-white mt-1">Incomplete Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-amber-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 4 this month
            </div>
          </div>
        </div>
      </div>`;

const newCards = `{/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blue Card */}
        <div 
          onClick={() => navigate('/admin/submissions', { state: { filterStatus: 'All status' } })}
          className="bg-gradient-to-b from-[#1c64db] to-[#12429f] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{totalCount}</div>
            <div className="text-base font-semibold text-white mt-1">Total Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-blue-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 4 this week
            </div>
          </div>
        </div>
        
        {/* Green Card */}
        <div 
          onClick={() => navigate('/admin/submissions', { state: { filterStatus: 'Complete' } })}
          className="bg-gradient-to-b from-[#3fa52a] to-[#287b1a] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{completeCount}</div>
            <div className="text-base font-semibold text-white mt-1">Complete Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-green-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 3 new today
            </div>
          </div>
        </div>
        
        {/* Yellow/Gold Card */}
        <div 
          onClick={() => navigate('/admin/submissions', { state: { filterStatus: 'Incomplete' } })}
          className="bg-gradient-to-b from-[#c88d00] to-[#e69f00] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{incompleteCount}</div>
            <div className="text-base font-semibold text-white mt-1">Incomplete Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-amber-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 4 this month
            </div>
          </div>
        </div>
      </div>`;

s = s.replace(oldCards, newCards);

if (s.includes('export function GuidanceDashboard() {\nconst [, setSubmissions]')) {
    s = s.replace('export function GuidanceDashboard() {\nconst [, setSubmissions]', 'export function GuidanceDashboard() {\n  const navigate = useNavigate();\nconst [, setSubmissions]');
} else if (s.includes('export function GuidanceDashboard() {\n  const [, setSubmissions]')) {
    s = s.replace('export function GuidanceDashboard() {\n  const [, setSubmissions]', 'export function GuidanceDashboard() {\n  const navigate = useNavigate();\n  const [, setSubmissions]');
}

fs.writeFileSync('src/pages/guidance/index.tsx', s);
