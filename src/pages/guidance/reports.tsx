import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Filter, GraduationCap } from 'lucide-react';

export function GuidanceReports() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedAY, setSelectedAY] = useState<string>('All Academic Years');

  useEffect(() => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
    db.academicYears.listAll().then(ays => {
      setAcademicYears(ays);
    });
    db.courses.listAll().then(cs => {
      setCourses(cs);
    });
  }, []);

  const filteredSubmissions = submissions.filter(sub => {
    if (selectedAY === 'All Academic Years') return true;
    const subAY = sub.data?.academicYear || sub.answers?.academicYear || 'A.Y. 2025-2026 - 1st Semester';
    return subAY === selectedAY || subAY.includes(selectedAY);
  });

  const statusData = [
    { name: 'Pending', value: filteredSubmissions.filter(s => s.status === 'Pending').length },
    { name: 'Approved', value: filteredSubmissions.filter(s => s.status === 'Approved').length },
    { name: 'Rejected', value: filteredSubmissions.filter(s => s.status === 'Rejected').length },
  ];

  const COLORS = ['#F59E0B', '#10B981', '#EF4444'];

  // Ensure all 4 courses BSCS, BAEL, BSFT, BSOA are accounted for
  const baseCourses = courses.length > 0 ? courses.map(c => c.code) : ['BSCS', 'BAEL', 'BSFT', 'BSOA'];
  const courseCounts: Record<string, number> = {};
  baseCourses.forEach(c => { courseCounts[c] = 0; });

  filteredSubmissions.forEach(sub => {
    const course = sub.data?.course || sub.answers?.course || (sub.scholarshipType?.includes('BS') || sub.scholarshipType?.includes('BA') ? sub.scholarshipType.split(' ')[0] : 'Others');
    if (courseCounts[course] !== undefined) {
      courseCounts[course] += 1;
    } else {
      courseCounts[course] = (courseCounts[course] || 0) + 1;
    }
  });

  const courseData = Object.entries(courseCounts).map(([name, count]) => ({
    name,
    count
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f2e60]">Reports & Analytics</h2>
          <p className="text-xs text-gray-500">Applicant distribution by status, course (BSCS, BAEL, BSFT, BSOA), and academic year.</p>
        </div>

        {/* Academic Year Filter */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm">
          <Calendar className="w-4 h-4 text-[#1864db]" />
          <span className="text-xs font-bold text-gray-600 uppercase">Term:</span>
          <select 
            value={selectedAY} 
            onChange={(e) => setSelectedAY(e.target.value)}
            className="text-sm font-semibold text-[#0f2e60] bg-transparent outline-none cursor-pointer"
          >
            <option>All Academic Years</option>
            {academicYears.map(ay => (
              <option key={ay.id} value={ay.label}>
                {ay.label} {ay.isDefault ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Submissions by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => typeof percent === 'number' && !isNaN(percent) && percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Submissions by Course (BSCS, BAEL, BSFT, BSOA)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={courseData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1864db" name="Applicants" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
