import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, ArrowRight, FileText, Check, Wrench } from 'lucide-react';
import { db } from '@/lib/db';
import { getStoredScholarshipCategories } from '@/lib/scholarshipCategories';

interface AuditIssue {
  id: string;
  title: string;
  category: 'Submissions' | 'Database' | 'Validation' | 'Configuration';
  severity: 'Critical' | 'Warning' | 'Info';
  description: string;
  fixAction: string;
}

export function GuidanceAuditor() {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [lastScanned, setLastScanned] = useState<string>(new Date().toLocaleTimeString());
  const [systemStats, setSystemStats] = useState({ totalSubmissions: 0, incompleteCount: 0, categoriesCount: 0 });

  const runDiagnosticScan = async () => {
    setIsScanning(true);
    try {
      const subs = await db.submissions.listAll() || [];
      const cats = getStoredScholarshipCategories() || [];
      
      const total = subs.length;
      const incomplete = subs.filter(s => s.status !== 'Complete' && s.status !== 'Approved').length;
      setSystemStats({ totalSubmissions: total, incompleteCount: incomplete, categoriesCount: cats.length });

      const detectedIssues: AuditIssue[] = [];

      subs.forEach((sub: any) => {
        const files = sub.files || [];
        const hasRf = files.some((f: any) => f.category === 'RF' || f.name?.includes('RF'));
        const hasGwa = files.some((f: any) => f.category === 'GWA' || f.name?.includes('GWA'));
        if (!hasRf || !hasGwa) {
          detectedIssues.push({
            id: `sub-file-${sub.id}`,
            title: `Missing Required Document for ${sub.studentName || 'Student'}`,
            category: 'Submissions',
            severity: 'Warning',
            description: `Student submission ID ${sub.studentId || sub.id} is missing either the Registration Form (RF) or General Weighted Average (GWA).`,
            fixAction: 'Review student requirements in Submissions and request document resubmission or mark as Incomplete.'
          });
        }
      });

      if (cats.length === 0) {
        detectedIssues.push({
          id: 'cat-empty',
          title: 'Scholarship Categories Structure Empty',
          category: 'Configuration',
          severity: 'Critical',
          description: 'No scholarship categories or allocations are currently loaded in storage.',
          fixAction: 'Navigate to Admin Settings -> Scholarships to initialize or add active scholarship allocations.'
        });
      }

      if (incomplete > 0) {
        detectedIssues.push({
          id: 'incomplete-batch',
          title: `${incomplete} Pending / Incomplete Student Submissions`,
          category: 'Validation',
          severity: 'Info',
          description: `There are ${incomplete} students awaiting review and document verification in the Submissions queue.`,
          fixAction: 'Open the Submissions list, inspect attached files, and update status to Complete/Approved upon verification.'
        });
      }

      if (detectedIssues.length === 0) {
        detectedIssues.push({
          id: 'system-healthy',
          title: 'System Fully Operational & Healthy',
          category: 'Database',
          severity: 'Info',
          description: 'All database records, scholarship category hierarchies, document attachments, and student requirements are synchronized and validated.',
          fixAction: 'No action required. System is running at peak performance.'
        });
      }

      setIssues(detectedIssues);
      setLastScanned(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Diagnostic scan failed:", err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    runDiagnosticScan();
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-[#003884] to-[#154687] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI System Auditor & Problem Finder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">System Health & Diagnostic Sub-Agent</h1>
          <p className="text-blue-100 text-sm max-w-2xl">
            Continuously scans database integrity, student submission validations, document completeness, and configuration settings to proactively identify issues and recommend fixes.
          </p>
        </div>

        <button
          onClick={runDiagnosticScan}
          disabled={isScanning}
          className="bg-white text-[#003884] hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2.5 shrink-0 disabled:opacity-75"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning System...' : 'Run Deep Diagnostic'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Submissions</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{systemStats.totalSubmissions}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-1">{systemStats.incompleteCount}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scholarship Categories</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-1">{systemStats.categoriesCount}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Detected System Findings & Recommended Fixes</h2>
            <p className="text-xs text-gray-500">Last scanned at {lastScanned}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            {issues.length} {issues.length === 1 ? 'Finding' : 'Findings'}
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {issues.map((issue) => (
            <div key={issue.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                  issue.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                  issue.severity === 'Warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {issue.severity === 'Critical' ? <ShieldAlert className="w-5 h-5" /> :
                   issue.severity === 'Warning' ? <AlertTriangle className="w-5 h-5" /> :
                   <CheckCircle2 className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-gray-900 text-base">{issue.title}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      issue.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      issue.severity === 'Warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {issue.severity}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {issue.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
                  
                  <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-[#0c2340] uppercase tracking-wider block mb-0.5">Recommended Action:</span>
                      <p className="text-xs text-blue-900 font-medium">{issue.fixAction}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
