import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function GuidanceReports() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  }, []);

  const statusData = [
    { name: 'Pending', value: submissions.filter(s => s.status === 'Pending').length },
    { name: 'Approved', value: submissions.filter(s => s.status === 'Approved').length },
    { name: 'Rejected', value: submissions.filter(s => s.status === 'Rejected').length },
  ];

  const COLORS = ['#F59E0B', '#10B981', '#EF4444'];

  const courseData = submissions.reduce((acc: any, sub) => {
    const course = sub.data?.course || 'Unknown';
    const existing = acc.find((item: any) => item.name === course);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: course, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#0f2e60]">Reports & Analytics</h2>
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
          <h3 className="font-bold text-gray-900 mb-4">Submissions by Course</h3>
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1864db" name="Applicants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
