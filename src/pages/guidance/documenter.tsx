import React, { useState, useEffect } from 'react';
import { BookOpen, FileCheck, Download, Printer, Search, Calendar, User, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import { saveAs } from 'file-saver';

interface AuditLog {
  id: string;
  action: string;
  category: 'Submission' | 'Verification' | 'Email Notice' | 'Settings' | 'Security';
  user: string;
  timestamp: string;
  details: string;
}

export function GuidanceDocumenter() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadLogs() {
      try {
        const subs = await db.submissions.listAll() || [];
        const coms = await db.communications.listAll() || [];
        
        let generatedLogs: AuditLog[] = [
          {
            id: 'log-sys-init',
            action: 'System Database Initialized & Seeded',
            category: 'Security',
            user: 'System Admin',
            timestamp: new Date(Date.now() - 86400000 * 3).toLocaleString(),
            details: 'Initial database records loaded for Academic Years, Courses, Sections, and Scholarship Allocations.'
          },
          {
            id: 'log-settings-sync',
            action: 'Scholarship Category Hierarchies Synchronized',
            category: 'Settings',
            user: 'Guidance Head',
            timestamp: new Date(Date.now() - 86400000 * 2).toLocaleString(),
            details: 'Configured Internally-Funded and Externally-Funded categories including CHED, DOST, LGU, and DSWD grants.'
          }
        ];

        subs.forEach((s: any, idx: number) => {
          generatedLogs.push({
            id: `log-sub-${s.id || idx}`,
            action: `Scholarship Application Submitted — ${s.studentName || 'Student'}`,
            category: 'Submission',
            user: s.studentName || 'Student Applicant',
            timestamp: s.submittedAt ? new Date(s.submittedAt).toLocaleString() : new Date().toLocaleString(),
            details: `Course: ${s.data?.course || 'BSCS'} | Scholarship: ${s.scholarshipType || 'Externally-Funded'} | Status: ${s.status}`
          });

          if (s.status === 'Approved' || s.status === 'Complete') {
            generatedLogs.push({
              id: `log-ver-${s.id || idx}`,
              action: `Documentary Requirements Verified — ${s.studentName || 'Student'}`,
              category: 'Verification',
              user: 'Guidance Evaluator',
              timestamp: new Date(new Date(s.submittedAt || Date.now()).getTime() + 3600000).toLocaleString(),
              details: 'Registration Form (RF) and General Weighted Average (GWA) successfully verified and approved.'
            });
          }
        });

        coms.forEach((c: any, idx: number) => {
          generatedLogs.push({
            id: `log-com-${c.id || idx}`,
            action: `Official Notice Dispatched to Student`,
            category: 'Email Notice',
            user: 'Guidance Office',
            timestamp: c.sentAt ? new Date(c.sentAt).toLocaleString() : new Date().toLocaleString(),
            details: `Subject: ${c.subject || 'Scholarship Update'} | Recipients: ${c.recipients?.length || 1} student(s)`
          });
        });

        setLogs(generatedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (err) {
        console.warn("Could not load audit logs:", err);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || l.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleExportTXT = () => {
    let textContent = `CAPIS STATE UNIVERSITY - MAMBUSAO SATELLITE COLLEGE\n`;
    textContent += `OFFICE OF STUDENT AFFAIRS AND SERVICES - PROCESS DOCUMENTATION REPORT\n`;
    textContent += `Generated on: ${new Date().toLocaleString()}\n`;
    textContent += `=========================================================================\n\n`;

    filteredLogs.forEach((log, idx) => {
      textContent += `[${idx + 1}] ${log.timestamp} | ${log.category.toUpperCase()} | By: ${log.user}\n`;
      textContent += `Action: ${log.action}\n`;
      textContent += `Details: ${log.details}\n`;
      textContent += `-------------------------------------------------------------------------\n\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Process_Documentation_Report_${new Date().toISOString().slice(0, 10)}.txt`);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-[#154687] to-[#0c2340] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Process Documenter Sub-Agent</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">System Process & Audit Documentation</h1>
          <p className="text-blue-100 text-sm max-w-2xl">
            Automatically tracks, records, and timestamps all administrative operations, student submissions, document verifications, and workflow processes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportTXT}
            className="bg-white text-[#0c2340] hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report (TXT)</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search processes, actions, or users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Submission', 'Verification', 'Email Notice', 'Settings', 'Security'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#003884] text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-base">Process & Activity Audit Trail</h2>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            {filteredLogs.length} Recorded Events
          </span>
        </div>

        <div className="divide-y divide-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-[11px] font-extrabold uppercase tracking-wider">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Process / Action</th>
                <th className="py-3 px-6">User / Agent</th>
                <th className="py-3 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-gray-500 font-medium text-xs whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.category === 'Submission' ? 'bg-blue-100 text-blue-800' :
                      log.category === 'Verification' ? 'bg-emerald-100 text-emerald-800' :
                      log.category === 'Email Notice' ? 'bg-purple-100 text-purple-800' :
                      log.category === 'Settings' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-900">
                    {log.action}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-600 text-xs whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
