const fs = require('fs');

let content = fs.readFileSync('src/pages/student/index.tsx', 'utf-8');

const oldDashboard = content.substring(
  content.indexOf('export function StudentDashboard() {'),
  content.indexOf('export function StudentSubmissionForm() {')
);

const newDashboard = `export function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{id: string, firstName: string, lastName: string} | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);

  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (sessionStr) {
      const parsedUser = JSON.parse(sessionStr);
      setUser(parsedUser);
      db.submissions.listByStudent(parsedUser.id).then(subs => setSubmissions(subs));
    }
    
    // @ts-ignore
    db.scholarships.listAll().then(items => {
      setScholarships(items.filter((s: any) => s.status === 'Active'));
    });
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1864db] to-[#0f2e60] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
        <h2 className="text-3xl font-bold relative z-10">Hello, {user ? \`\${user.firstName}\` : 'Student'}!</h2>
        <p className="text-blue-100 mt-2 relative z-10 max-w-lg">Welcome to the Student Scholarship Portal. Here you can browse available scholarships, submit your applications, and track your progress.</p>
      </div>

      {submissions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#0f2e60] mb-4">Your Recent Applications</h3>
          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-800">{sub.scholarshipType}</h4>
                  <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(sub.submittedAt).toLocaleDateString()}</p>
                </div>
                <span className={cn(
                  "px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full",
                  sub.status === 'Approved' ? "bg-green-100 text-green-700"
                  : sub.status === 'Rejected' ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
                )}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold text-[#0f2e60]">Available Scholarships</h3>
        {scholarships.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm flex flex-col items-center justify-center">
            <View className="w-12 h-12 text-gray-300 mb-3" />
            <p className="font-medium text-gray-600">No active scholarships available right now.</p>
            <p className="text-sm mt-1 text-gray-400">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarships.map(s => (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-md transition-all hover:border-[#1864db]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{s.type}</span>
                    {s.deadline && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">Due {new Date(s.deadline).toLocaleDateString()}</span>}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 font-medium">{s.category} Category</p>
                  {s.description && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{s.description}</p>}
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                  <span className="text-xs font-semibold text-gray-500">{s.slots ? \`\${s.slots} Slots Available\` : 'Open Slots'}</span>
                  <button 
                    onClick={() => navigate(\`/student/submission?scholarshipId=\${s.id}\`)}
                    className="px-6 py-2.5 bg-[#1864db] text-white rounded-full font-bold text-sm hover:bg-[#124b9f] transition-colors shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

`;

content = content.replace(oldDashboard, newDashboard);
fs.writeFileSync('src/pages/student/index.tsx', content);
