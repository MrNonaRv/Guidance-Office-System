import React, { useState, useEffect } from 'react';
import { 
  X, ArrowLeft, ChevronDown, CheckCircle2, AlertCircle, FileText, Download, 
  Printer, Eye, Check, Archive
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, Submission, SubmissionFile } from '../lib/db';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface StudentRecordModalProps {
  submission: Submission | any;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: string) => void;
  academicYearsList?: any[];
}

export function StudentRecordModal({
  submission,
  onClose,
  onStatusChange,
  academicYearsList = []
}: StudentRecordModalProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(submission.status || 'Incomplete');
  const [viewMode, setViewMode] = useState<'overview' | 'requirements' | 'id_signature' | 'semester_record' | 'form'>('overview');
  const [selectedSemester, setSelectedSemester] = useState<'1st Semester' | '2nd Semester'>('1st Semester');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2025-2026');
  const [previewFile, setPreviewFile] = useState<SubmissionFile | null>(null);

  const [firstSemAY, setFirstSemAY] = useState<string>('');
  const [secondSemAY, setSecondSemAY] = useState<string>('');

  const [localSubmission, setLocalSubmission] = useState<Submission>(submission);

  const [semesterFiles, setSemesterFiles] = useState<SubmissionFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  useEffect(() => {
    if (viewMode === 'semester_record') {
      const fetchSemesterFiles = async () => {
        setIsLoadingFiles(true);
        try {
          // Find all submissions by this student
          const studentSubmissions = await db.submissions.listByStudent(submission.studentId);
          let allFiles: SubmissionFile[] = [];
          
          studentSubmissions.forEach(sub => {
            const ayField = sub.data?.academicYear || sub.answers?.academicYear || '';
            // If the submission is explicitly for this academic year & semester
            if (ayField.includes(selectedAcademicYear) && ayField.includes(selectedSemester)) {
              allFiles = [...allFiles, ...(sub.files || [])];
            } else {
              // Also check if any files inside are categorized for this semester
              const matchingFiles = (sub.files || []).filter((f: SubmissionFile) => 
                f.name.includes(selectedSemester) || (f.category && f.category.includes(selectedSemester.charAt(0)))
              );
              allFiles = [...allFiles, ...matchingFiles];
            }
          });
          
          // Deduplicate based on file name or id
          const uniqueFiles = Array.from(new Map(allFiles.map(f => [f.name, f])).values());
          setSemesterFiles(uniqueFiles);
        } catch (err) {
          console.error("Failed to fetch semester files", err);
        } finally {
          setIsLoadingFiles(false);
        }
      };
      fetchSemesterFiles();
    }
  }, [viewMode, selectedSemester, selectedAcademicYear, submission.studentId]);

  const formData = localSubmission.data || {};
  const studentName = localSubmission.studentName || `${formData.firstName || 'Anna Marie'} ${formData.middleName || 'A.'} ${formData.familyName || 'Santos'}`.trim();
  const studentIdNumber = localSubmission.studentId || formData.studentId || '2024-CAPSU-0182';
  const courseCode = formData.course || localSubmission.answers?.course || (localSubmission.scholarshipType?.includes('BS') || localSubmission.scholarshipType?.includes('BA') ? localSubmission.scholarshipType.split(' ')[0] : 'BAEL');
  const scholarshipType = localSubmission.scholarshipType || formData.scholarshipCategory || 'Externally-Funded (Pag-ulikid)';
  
  // Available Academic Years for dropdowns
  const academicYearsOptions = academicYearsList && academicYearsList.length > 0
    ? academicYearsList.map(ay => (typeof ay === 'string' ? ay : ay.label || ay.year || '2025-2026'))
    : ['2026-2027', '2025-2026', '2024-2025', '2023-2024'];

  const handleStatusSelect = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    const updated = { ...localSubmission, status: newStatus as any };
    setLocalSubmission(updated);
    if (onStatusChange) {
      onStatusChange(localSubmission.id, newStatus);
    }
    await db.submissions.update(localSubmission.id, { status: newStatus as any });
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (!localSubmission.files || localSubmission.files.length === 0) {
      alert("No files attached to this submission.");
      return;
    }
    
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      // Generate Form Summary text file
      let summaryText = `STUDENT APPLICATION SUMMARY\n==========================\n\n`;
      summaryText += `PERSONAL INFORMATION\n--------------------\n`;
      summaryText += `Name: ${studentName}\n`;
      summaryText += `Student ID: ${studentIdNumber}\n`;
      summaryText += `Course: ${courseCode}\n`;
      summaryText += `Year Level: ${formData.yearLevel || localSubmission.answers?.yearLevel || 'Not specified'}\n`;
      summaryText += `Email: ${formData.email || 'Not specified'}\n`;
      summaryText += `Phone: ${formData.phone || 'Not specified'}\n`;
      summaryText += `Address: ${formData.address || 'Not specified'}\n\n`;
      
      summaryText += `SCHOLARSHIP INFORMATION\n-----------------------\n`;
      summaryText += `Scholarship Type: ${scholarshipType}\n`;
      summaryText += `Status: ${currentStatus}\n`;
      summaryText += `Submitted On: ${new Date(localSubmission.submittedAt).toLocaleString()}\n\n`;
      
      summaryText += `ADDITIONAL FORM DATA\n--------------------\n`;
      // Safely append any other plain text/number fields from formData
      Object.keys(formData).forEach(key => {
        if (!['firstName', 'middleName', 'familyName', 'studentId', 'course', 'yearLevel', 'email', 'phone', 'address', 'scholarshipCategory'].includes(key)) {
          if (typeof formData[key] === 'string' || typeof formData[key] === 'number' || typeof formData[key] === 'boolean') {
             summaryText += `${key}: ${formData[key]}\n`;
          }
        }
      });
      
      zip.file(`${studentName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Application_Summary.txt`, summaryText);
      
      // Add attachments
      for (let index = 0; index < localSubmission.files.length; index++) {
        const file = localSubmission.files[index];
        const fileName = file.name || `document_${index}`;
        if (!file.data) continue;

        if (file.data.startsWith('data:')) {
          const parts = file.data.split(';base64,');
          if (parts.length === 2) {
            zip.file(fileName, parts[1], { base64: true });
          }
        } else if (file.data.startsWith('http')) {
          try {
            const resp = await fetch(file.data);
            const blob = await resp.blob();
            zip.file(fileName, blob);
          } catch (fetchErr) {
            console.warn(`Could not fetch remote file ${fileName} for zip:`, fetchErr);
          }
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const studentNameSafe = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const zipName = `${studentNameSafe}_Documents.zip`;
      saveAs(content, zipName);
    } catch (e) {
      console.error("Error zipping files:", e);
      alert("An error occurred while preparing the zip file.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleVerifyRequirement = async (reqName: string, newStatus: 'Verified' | 'Pending' | 'Missing' | 'Rejected') => {
    const updated = await db.submissions.verifyRequirement(localSubmission.id, reqName, newStatus);
    if (updated) {
      setLocalSubmission(updated);
      setCurrentStatus(updated.status);
      if (onStatusChange) {
        onStatusChange(localSubmission.id, updated.status);
      }
    }
  };

  const handleOpenSemester = (semester: '1st Semester' | '2nd Semester', ay: string) => {
    if (!ay) return;
    setSelectedSemester(semester);
    setSelectedAcademicYear(ay);
    setViewMode('semester_record');
  };

  const photo2x2 = localSubmission.photo2x2 || formData.photo2x2 || localSubmission.files?.find((f: any) => f.category?.includes('2x2') || f.category?.includes('Photo'))?.data;

  // Requirements list
  const requirementsList = [
    {
      id: 'req-rf-1',
      name: 'Registration Form (RF)',
      group: '1st Semester',
      category: 'RF',
      fileName: localSubmission.files?.find((f: any) => f.category === 'RF' || f.category === 'Certificate of Registration (COR)')?.name || `${studentName.replace(/\s+/g, '_')}_1st_Sem_RF.pdf`,
      status: (localSubmission.files?.find((f: any) => f.category === 'RF' || f.category === 'Certificate of Registration (COR)')?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'RF' || f.category === 'Certificate of Registration (COR)') || {
        name: `${studentName.replace(/\s+/g, '_')}_1st_Sem_RF.pdf`,
        type: 'application/pdf',
        category: 'RF',
        data: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osS84tKUvPSi1QK0lPykxWLkjOA3KLUxDwlAwjN1wAAg5wP3gplbmRzdHJlYW0KZW5kb2JqCgozIDAgb2JqCjY1CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMCAxIDAgUj4+Pj4vQ29udGVudHMgMiAwIFIvUGFyZW50IDUgMCBSPj4KZW5kb2JqCgo1IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iagoKMSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA1IDAgUj4+CmVuZG9iagoKNyAwIG9iago8PC9DcmVhdG9yKExvY2FsIE1vY2sgRmlsZSkvUHJvZHVjZXIoTG9jYWwgTW9jayBGaWxlKS9DcmVhdGlvbkRhdGUoRDoyMDI2MDMwOTAwMDAwMFopPj4KZW5kb2JqCgp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyNjAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTMzIDAwMDAwIG4gCjAwMDAwMDAxNTEgMDAwMDAgbiAKMDAwMDAwMDIwNSAwMDAwMCBuIAowMDAwMDAwMzQ4IDAwMDAwIG4gCjAwMDAwMDAzOTcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDgvUm9vdCA2IDAgUi9JbmZvIDcgMCBSPj4Kc3RhcnR4cmVmCjUwMAolJUVPRgo='
      }
    },
    {
      id: 'req-gwa-1',
      name: 'General Weighted Average (GWA)',
      group: '1st Semester',
      category: 'GWA',
      fileName: localSubmission.files?.find((f: any) => f.category === 'GWA' || f.category === 'Certificate of Grades (COG)')?.name || `${studentName.replace(/\s+/g, '_')}_1st_Sem_GWA.pdf`,
      status: (localSubmission.files?.find((f: any) => f.category === 'GWA' || f.category === 'Certificate of Grades (COG)')?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'GWA' || f.category === 'Certificate of Grades (COG)') || {
        name: `${studentName.replace(/\s+/g, '_')}_1st_Sem_GWA.pdf`,
        type: 'application/pdf',
        category: 'GWA',
        data: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osS84tKUvPSi1QK0lPykxWLkjOA3KLUxDwlAwjN1wAAg5wP3gplbmRzdHJlYW0KZW5kb2JqCgozIDAgb2JqCjY1CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMCAxIDAgUj4+Pj4vQ29udGVudHMgMiAwIFIvUGFyZW50IDUgMCBSPj4KZW5kb2JqCgo1IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iagoKMSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA1IDAgUj4+CmVuZG9iagoKNyAwIG9iago8PC9DcmVhdG9yKExvY2FsIE1vY2sgRmlsZSkvUHJvZHVjZXIoTG9jYWwgTW9jayBGaWxlKS9DcmVhdGlvbkRhdGUoRDoyMDI2MDMwOTAwMDAwMFopPj4KZW5kb2JqCgp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyNjAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTMzIDAwMDAwIG4gCjAwMDAwMDAxNTEgMDAwMDAgbiAKMDAwMDAwMDIwNSAwMDAwMCBuIAowMDAwMDAwMzQ4IDAwMDAwIG4gCjAwMDAwMDAzOTcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDgvUm9vdCA2IDAgUi9JbmZvIDcgMCBSPj4Kc3RhcnR4cmVmCjUwMAolJUVPRgo='
      }
    },
    {
      id: 'req-rf-2',
      name: 'Registration Form (RF)',
      group: '2nd Semester',
      category: 'RF_2',
      fileName: localSubmission.files?.find((f: any) => f.category === 'RF_2' || (f.category === 'Certificate of Registration (COR)' && f.name.includes('2nd')))?.name || `${studentName.replace(/\s+/g, '_')}_2nd_Sem_RF.pdf`,
      status: (localSubmission.files?.find((f: any) => f.category === 'RF_2' || (f.category === 'Certificate of Registration (COR)' && f.name.includes('2nd')))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'RF_2' || (f.category === 'Certificate of Registration (COR)' && f.name.includes('2nd'))) || {
        name: `${studentName.replace(/\s+/g, '_')}_2nd_Sem_RF.pdf`,
        type: 'application/pdf',
        category: 'RF_2',
        data: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osS84tKUvPSi1QK0lPykxWLkjOA3KLUxDwlAwjN1wAAg5wP3gplbmRzdHJlYW0KZW5kb2JqCgozIDAgb2JqCjY1CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMCAxIDAgUj4+Pj4vQ29udGVudHMgMiAwIFIvUGFyZW50IDUgMCBSPj4KZW5kb2JqCgo1IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iagoKMSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA1IDAgUj4+CmVuZG9iagoKNyAwIG9iago8PC9DcmVhdG9yKExvY2FsIE1vY2sgRmlsZSkvUHJvZHVjZXIoTG9jYWwgTW9jayBGaWxlKS9DcmVhdGlvbkRhdGUoRDoyMDI2MDMwOTAwMDAwMFopPj4KZW5kb2JqCgp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyNjAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTMzIDAwMDAwIG4gCjAwMDAwMDAxNTEgMDAwMDAgbiAKMDAwMDAwMDIwNSAwMDAwMCBuIAowMDAwMDAwMzQ4IDAwMDAwIG4gCjAwMDAwMDAzOTcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDgvUm9vdCA2IDAgUi9JbmZvIDcgMCBSPj4Kc3RhcnR4cmVmCjUwMAolJUVPRgo='
      }
    },
    {
      id: 'req-gwa-2',
      name: 'General Weighted Average (GWA)',
      group: '2nd Semester',
      category: 'GWA_2',
      fileName: localSubmission.files?.find((f: any) => f.category === 'GWA_2' || (f.category === 'Certificate of Grades (COG)' && f.name.includes('2nd')))?.name || `${studentName.replace(/\s+/g, '_')}_2nd_Sem_GWA.pdf`,
      status: (localSubmission.files?.find((f: any) => f.category === 'GWA_2' || (f.category === 'Certificate of Grades (COG)' && f.name.includes('2nd')))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'GWA_2' || (f.category === 'Certificate of Grades (COG)' && f.name.includes('2nd'))) || {
        name: `${studentName.replace(/\s+/g, '_')}_2nd_Sem_GWA.pdf`,
        type: 'application/pdf',
        category: 'GWA_2',
        data: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osS84tKUvPSi1QK0lPykxWLkjOA3KLUxDwlAwjN1wAAg5wP3gplbmRzdHJlYW0KZW5kb2JqCgozIDAgb2JqCjY1CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMCAxIDAgUj4+Pj4vQ29udGVudHMgMiAwIFIvUGFyZW50IDUgMCBSPj4KZW5kb2JqCgo1IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iagoKMSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA1IDAgUj4+CmVuZG9iagoKNyAwIG9iago8PC9DcmVhdG9yKExvY2FsIE1vY2sgRmlsZSkvUHJvZHVjZXIoTG9jYWwgTW9jayBGaWxlKS9DcmVhdGlvbkRhdGUoRDoyMDI2MDMwOTAwMDAwMFopPj4KZW5kb2JqCgp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyNjAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTMzIDAwMDAwIG4gCjAwMDAwMDAxNTEgMDAwMDAgbiAKMDAwMDAwMDIwNSAwMDAwMCBuIAowMDAwMDAwMzQ4IDAwMDAwIG4gCjAwMDAwMDAzOTcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDgvUm9vdCA2IDAgUi9JbmZvIDcgMCBSPj4Kc3RhcnR4cmVmCjUwMAolJUVPRgo='
      }
    },
    {
      id: 'req-id',
      name: 'Student ID',
      group: 'Other Documents',
      category: 'ID',
      fileName: localSubmission.files?.find((f: any) => f.category === 'ID' || f.category === 'Student ID' || f.category === 'Valid Student ID' || f.category === '2x2 Recent Formal ID Photo')?.name || `${studentName.replace(/\s+/g, '_')}_ID.png`,
      status: (localSubmission.files?.find((f: any) => f.category === 'ID' || f.category === 'Student ID' || f.category === 'Valid Student ID' || f.category === '2x2 Recent Formal ID Photo')?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'ID' || f.category === 'Student ID' || f.category === 'Valid Student ID' || f.category === '2x2 Recent Formal ID Photo') || {
        name: `${studentName.replace(/\s+/g, '_')}_ID.png`,
        type: 'image/png',
        category: 'ID',
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 print:p-0 print:bg-white print:block print:relative print:z-0">
      
      {/* Main Dialog Container */}
      <div className={cn("relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 print:hidden max-h-[92vh] flex flex-col", viewMode === 'form' && "hidden")}>
        
        {/* Top Navy Blue Header Banner */}
        <div className="bg-[#003884] text-white px-6 py-4 flex items-center justify-center relative shadow-md shrink-0">
          {viewMode !== 'overview' ? (
            <button
              onClick={() => setViewMode('overview')}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-[6px] border-2 border-white text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          )}
          
          <h2 className="text-xl font-bold text-center tracking-tight text-white">
            Student Records
          </h2>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: OVERVIEW */}
          {/* ------------------------------------------------------------- */}
          {viewMode === 'overview' && (
            <div className="p-6 md:p-7 space-y-4 bg-white">
              
              {/* Student Info & Status Header */}
              <div className="flex items-start justify-between gap-4 mb-2 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3.5">
                  <div>
                    <h3 className="text-lg md:text-[20px] font-extrabold text-gray-900 leading-tight">
                      {studentName}
                    </h3>
                    <p className="text-sm font-bold text-gray-900 tracking-wide mt-0.5">
                      {courseCode}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-xs font-bold text-[#003884] mb-1">Status</span>
                  <div className="relative inline-block">
                    <select
                      value={currentStatus === 'Pending' ? 'Incomplete' : currentStatus}
                      onChange={(e) => handleStatusSelect(e.target.value)}
                      className="appearance-none bg-[#dce7f9] hover:bg-[#d0e0f8] text-gray-900 font-semibold text-sm pl-3.5 pr-8 py-1.5 rounded-xl border border-[#b4cef8] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs transition-colors"
                    >
                      <option value="Incomplete">Incomplete</option>
                      <option value="Complete">Complete</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Folder 1: Scholarship Requirements */}
              <div className="bg-[#edf4fe] border border-[#d2e2fc] rounded-2xl p-4 md:p-4.5 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                      <path d="M2.5 7C2.5 5.61929 3.61929 4.5 5 4.5H9.5C10.163 4.5 10.7989 4.76339 11.2678 5.23223L12.5355 6.5H19C20.3807 6.5 21.5 7.61929 21.5 9V17.5C21.5 18.8807 20.3807 20 19 20H5C3.61929 20 2.5 18.8807 2.5 17.5V7Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2"/>
                      <path d="M2.5 9.5C2.5 8.11929 3.61929 7 5 7H19C20.3807 7 21.5 8.11929 21.5 9.5V17.5C21.5 18.8807 20.3807 20 19 20H5C3.61929 20 2.5 18.8807 2.5 17.5V9.5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-base md:text-[17px] font-bold text-gray-900 block">
                      Scholarship Requirements
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('requirements')}
                  className="bg-[#0052cc] hover:bg-[#0041a8] text-white text-sm md:text-base font-bold px-8 py-2 md:py-2.5 rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  View
                </button>
              </div>

              {/* Folder 3: 1st Semester */}
              <div className="bg-[#edf4fe] border border-[#d2e2fc] rounded-2xl p-4 md:p-4.5 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                      <path d="M1.5 5.5C1.5 4.39543 2.39543 3.5 3.5 3.5H7.5C8.03043 3.5 8.53914 3.71071 8.91421 4.08579L9.91421 5.08579H16.5C17.6046 5.08579 18.5 5.98122 18.5 7.08579V14.5C18.5 15.6046 17.6046 16.5 16.5 16.5H3.5C2.39543 16.5 1.5 15.6046 1.5 14.5V5.5Z" fill="#D97706" stroke="#B45309" strokeWidth="1"/>
                      <path d="M4.5 7.5C4.5 6.39543 5.39543 5.5 6.5 5.5H10.5C11.0304 5.5 11.5391 5.71071 11.9142 6.08579L13.1 7.27C13.475 7.645 13.984 7.856 14.514 7.856H20.5C21.6046 7.856 22.5 8.751 22.5 9.856V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V7.5Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2"/>
                      <path d="M4.5 10C4.5 8.89543 5.39543 8 6.5 8H20.5C21.6046 8 22.5 8.89543 22.5 10V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V10Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1"/>
                    </svg>
                  </div>
                  <span className="text-base md:text-[17px] font-bold text-gray-900">
                    1st Semester
                  </span>
                </div>

                <div className="relative shrink-0">
                  <select
                    value={firstSemAY}
                    onChange={(e) => {
                      setFirstSemAY(e.target.value);
                      handleOpenSemester('1st Semester', e.target.value);
                    }}
                    className="appearance-none bg-[#dce7f9] hover:bg-[#d0e0f8] text-gray-900 font-semibold text-sm pl-3.5 pr-8 py-2 rounded-xl border border-[#b4cef8] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs transition-colors"
                  >
                    <option value="">Academic Year</option>
                    {academicYearsOptions.map(ay => (
                      <option key={ay} value={ay}>{ay}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Folder 4: 2nd Semester */}
              <div className="bg-[#edf4fe] border border-[#d2e2fc] rounded-2xl p-4 md:p-4.5 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                      <path d="M1.5 5.5C1.5 4.39543 2.39543 3.5 3.5 3.5H7.5C8.03043 3.5 8.53914 3.71071 8.91421 4.08579L9.91421 5.08579H16.5C17.6046 5.08579 18.5 5.98122 18.5 7.08579V14.5C18.5 15.6046 17.6046 16.5 16.5 16.5H3.5C2.39543 16.5 1.5 15.6046 1.5 14.5V5.5Z" fill="#D97706" stroke="#B45309" strokeWidth="1"/>
                      <path d="M4.5 7.5C4.5 6.39543 5.39543 5.5 6.5 5.5H10.5C11.0304 5.5 11.5391 5.71071 11.9142 6.08579L13.1 7.27C13.475 7.645 13.984 7.856 14.514 7.856H20.5C21.6046 7.856 22.5 8.751 22.5 9.856V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V7.5Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2"/>
                      <path d="M4.5 10C4.5 8.89543 5.39543 8 6.5 8H20.5C21.6046 8 22.5 8.89543 22.5 10V18.5C22.5 19.6046 21.6046 20.5 20.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V10Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1"/>
                    </svg>
                  </div>
                  <span className="text-base md:text-[17px] font-bold text-gray-900">
                    2nd Semester
                  </span>
                </div>

                <div className="relative shrink-0">
                  <select
                    value={secondSemAY}
                    onChange={(e) => {
                      setSecondSemAY(e.target.value);
                      handleOpenSemester('2nd Semester', e.target.value);
                    }}
                    className="appearance-none bg-[#dce7f9] hover:bg-[#d0e0f8] text-gray-900 font-semibold text-sm pl-3.5 pr-8 py-2 rounded-xl border border-[#b4cef8] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs transition-colors"
                  >
                    <option value="">Academic Year</option>
                    {academicYearsOptions.map(ay => (
                      <option key={ay} value={ay}>{ay}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 2: SCHOLARSHIP REQUIREMENTS DETAIL & VERIFICATION */}
          {/* ------------------------------------------------------------- */}
          {viewMode === 'requirements' && (
            <div className="p-6 space-y-5 bg-gray-50/60">
              
              {/* Context bar */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Scholarship Program</span>
                  <h4 className="text-base font-bold text-gray-900">{scholarshipType}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Submitted on {new Date(localSubmission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('form')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Filled Form
                  </button>
                  <button
                    onClick={handleDownloadAll}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download all attached documents as a ZIP file"
                  >
                    <Archive className="w-3.5 h-3.5" /> {isDownloading ? 'Zipping...' : 'Download All'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    title="Print official form"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </div>

              {/* Checklist of required documents */}
              <div className="space-y-6">
                
                {['1st Semester', '2nd Semester', 'Other Documents'].map(groupName => {
                  const groupReqs = requirementsList.filter(req => req.group === groupName);
                  if (groupReqs.length === 0) return null;
                  
                  return (
                    <div key={groupName} className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-gray-600 px-1 border-b border-gray-200 pb-2">
                        {groupName} {groupName.includes('Semester') ? `(${selectedAcademicYear || '2026-2027'})` : ''}
                      </h5>
                      
                      <div className="space-y-3">
                        {groupReqs.map((req) => (
                          <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold",
                                req.status === 'Verified' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              )}>
                                {req.status === 'Verified' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{req.name}</p>
                                <p className="text-xs text-gray-500 truncate">{req.fileName}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={cn(
                                "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase",
                                req.status === 'Verified' ? "bg-green-100 text-green-700 border border-green-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                              )}>
                                {req.status}
                              </span>

                              {req.file && (
                                <button
                                  onClick={() => setPreviewFile(req.file as SubmissionFile)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Preview File"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleVerifyRequirement(req.file?.category || req.category, req.status === 'Verified' ? 'Pending' : 'Verified')}
                                className={cn(
                                  "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                                  req.status === 'Verified' 
                                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                                )}
                              >
                                {req.status === 'Verified' ? 'Mark Pending' : 'Verify'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 4: SEMESTER RECORD (1st Sem or 2nd Sem) */}
          {/* ------------------------------------------------------------- */}
          {viewMode === 'semester_record' && (
            <div className="p-6 space-y-5 bg-gray-50/60">
              
              {/* Header info */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{selectedSemester} Academic Term</span>
                    <h4 className="text-lg font-bold text-gray-900">Academic Year {selectedAcademicYear}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{studentName} &bull; {courseCode}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                    Enrolled & Active
                  </span>
                </div>
              </div>

              {/* Semester Academic Summary */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">Academic Standing</h5>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                    <span className="text-xs text-gray-500 font-medium">GWA</span>
                    <p className="text-lg font-extrabold text-blue-900">1.45</p>
                  </div>
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                    <span className="text-xs text-gray-500 font-medium">Units Passed</span>
                    <p className="text-lg font-extrabold text-blue-900">21</p>
                  </div>
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                    <span className="text-xs text-gray-500 font-medium">Evaluation</span>
                    <p className="text-lg font-extrabold text-green-600">Retained</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents for this Semester */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">Semester Uploads</h5>
                
                {isLoadingFiles ? (
                  <div className="py-6 text-center text-gray-500 text-sm font-medium animate-pulse">
                    Loading files...
                  </div>
                ) : semesterFiles.length > 0 ? (
                  <div className="space-y-2">
                    {semesterFiles.map((file, idx) => (
                      <div key={file.id || idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-bold text-gray-800">{file.category || file.name || `Document ${idx+1}`}</p>
                            <p className="text-[11px] text-gray-500">{file.name} &bull; {file.size || 'Unknown Size'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                            file.status === 'Verified' ? "text-green-700 bg-green-50 border-green-200" :
                            file.status === 'Rejected' ? "text-red-700 bg-red-50 border-red-200" :
                            "text-amber-700 bg-amber-50 border-amber-200"
                          )}>
                            {file.status || 'Pending'}
                          </span>
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                            title="Preview File"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500 text-sm font-medium">
                    No files found for this academic term.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* ----------------- EXACT PRINT LAYOUT FOR BROWSER PRINT ----------------- */}
      <div className={cn("text-black bg-white font-sans", viewMode === 'form' ? "block absolute inset-2 sm:inset-4 md:inset-12 bg-white rounded-2xl overflow-y-auto overflow-x-auto shadow-2xl p-4 sm:p-8" : "hidden print:block print:w-full")}>
        {viewMode === 'form' && (
            <button
              onClick={() => setViewMode('requirements')}
              className="mb-6 text-sm font-bold text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer print:hidden"
            >
              ← Back to Requirements
            </button>
        )}
        {/* PAGE 1: SCHOLARSHIP RECORD FORM */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-8 break-after-page">
          {/* Header Box */}
          <div className="border border-black w-full mb-6 text-black">
            <div className="flex border-b border-black">
              <div className="w-1/5 p-2 border-r border-black flex flex-col items-center justify-center">
                <img src="/capsu-logo.png" className="w-12 h-12 object-contain mb-1" alt="Logo" />
              </div>
              <div className="w-3/5 p-2 border-r border-black flex flex-col items-center justify-center text-center">
                <div className="text-[10px]">Document Type:</div>
                <strong className="text-xl tracking-widest mt-1 font-serif">FORM</strong>
                <div className="text-[8px] mt-1 font-serif">ISO 9001:2015</div>
              </div>
              <div className="w-1/5 font-serif">
                <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Document Code</span><strong>GCO-F05</strong></div>
                <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Revision No.</span><strong>00</strong></div>
                <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Effective Date</span><strong>June 25, 2018</strong></div>
                <div className="p-1 text-[10px] flex justify-between"><span>Page</span><strong>1 of 1</strong></div>
              </div>
            </div>
            <div className="flex font-serif">
              <div className="w-1/4 p-2 border-r border-black text-xs flex items-center">Document Type:</div>
              <div className="w-3/4 p-2 text-center font-bold text-lg tracking-wider flex items-center justify-center">SCHOLARSHIP RECORD FORM</div>
            </div>
          </div>

          <div className="text-center font-serif mt-4 italic text-sm mb-6 text-black">
            (Data and Personal Information will be kept with utmost confidentiality and will be protected<br/>through RA 10173 also known as Data Privacy Act of 2012)
          </div>

          <div className="font-serif text-center font-bold text-lg mb-6 text-black">STUDENT DEMOGRAPHICS</div>

          <div className="font-serif text-black pl-8 pr-4">
            <div className="font-bold mb-4">A. Personal Information</div>
            
            <div className="flex justify-between">
              <div className="w-[80%] pr-4 space-y-6">
                <div>
                  <div className="flex items-end text-sm">
                    <span className="mr-2">Name:</span>
                    <span className="flex-1 border-b border-black inline-block text-center">{formData.familyName || ''}</span>
                    <span className="flex-1 border-b border-black inline-block text-center ml-2">{formData.firstName || ''}</span>
                    <span className="flex-1 border-b border-black inline-block text-center ml-2">{formData.middleName || ''}</span>
                  </div>
                  <div className="flex text-[10px] italic mt-1">
                    <span className="mr-2 opacity-0">Name:</span>
                    <span className="flex-1 text-center">Last Name</span>
                    <span className="flex-1 text-center ml-2">First Name</span>
                    <span className="flex-1 text-center ml-2">Middle Name</span>
                  </div>
                </div>

                <div className="flex items-end text-sm">
                  <span className="mr-2">Birthdate:</span>
                  <span className="w-32 border-b border-black inline-block text-center">{formData.birthdate || ''}</span>
                  <span className="ml-4 mr-2">Age:</span>
                  <span className="w-24 border-b border-black inline-block text-center">{formData.age || ''}</span>
                  <span className="ml-4 mr-2">Sex:</span>
                  <span className="w-24 border-b border-black inline-block text-center">{formData.sex || ''}</span>
                </div>

                <div className="flex items-end text-sm">
                  <span className="mr-2">Year Level:</span>
                  <span className="w-32 border-b border-black inline-block text-center">{formData.yearLevel || ''}</span>
                  <span className="ml-4 mr-2">Course:</span>
                  <span className="w-32 border-b border-black inline-block text-center">{formData.course || ''}</span>
                  <span className="ml-4 mr-2">Section:</span>
                  <span className="w-24 border-b border-black inline-block text-center">{formData.section || ''}</span>
                </div>

                <div className="flex items-end text-sm">
                  <span className="mr-2">Contact No.:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.contactNo || ''}</span>
                  <span className="ml-4 mr-2">Gmail:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.email || ''}</span>
                </div>

                <div className="flex items-end text-sm">
                  <span className="mr-2">Permanent Address:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.street ? `${formData.street}, ${formData.barangay}, ${formData.municipality}, ${formData.province} ${formData.postalCode}` : (formData.permanentAddress || '')}</span>
                </div>
              </div>
              
              <div className="w-[140px] shrink-0">
                <div className="w-[120px] h-[120px] border border-black flex items-center justify-center p-1">
                  {photo2x2 ? (
                    <img src={photo2x2} alt="2x2" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">2x2 Picture</span>
                  )}
                </div>
              </div>
            </div>

            <div className="font-bold mt-10 mb-4">B. Family Background</div>
            
            <div className="space-y-6">
              <div>
                <div className="italic font-bold mb-3 text-sm">Father Information</div>
                <div className="flex items-end text-sm">
                  <span className="mr-2">Name:</span>
                  <span className="w-64 border-b border-black inline-block text-center">{formData.fatherName || ''}</span>
                  <span className="ml-4 mr-2">Occupation:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.fatherOccupation || ''}</span>
                  <span className="ml-4 mr-2">Contact No.:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.fatherContact || ''}</span>
                </div>
              </div>

              <div>
                <div className="italic font-bold mb-3 text-sm">Mother Information</div>
                <div className="flex items-end text-sm">
                  <span className="mr-2">Name (maiden name):</span>
                  <span className="w-64 border-b border-black inline-block text-center">{formData.motherName || ''}</span>
                  <span className="ml-4 mr-2">Occupation:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.motherOccupation || ''}</span>
                  <span className="ml-4 mr-2">Contact No.:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.motherContact || ''}</span>
                </div>
              </div>

              <div>
                <div className="italic font-bold mb-3 text-sm">Guardian Information</div>
                <div className="flex items-end text-sm">
                  <span className="mr-2">Name:</span>
                  <span className="w-64 border-b border-black inline-block text-center">{formData.guardianName || ''}</span>
                  <span className="ml-4 mr-2">Occupation:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.guardianOccupation || ''}</span>
                  <span className="ml-4 mr-2">Contact No.:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.guardianContact || ''}</span>
                </div>
                <div className="flex items-end text-sm mt-6">
                  <span className="mr-2">Address:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.guardianAddress || ''}</span>
                  <span className="ml-4 mr-2">Relationship:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.guardianRelationship || ''}</span>
                </div>
              </div>
            </div>

            <div className="font-bold mt-10 mb-4">C. Scholarship Details</div>
            
            <div className="space-y-6">
              <div className="flex items-end gap-4 font-bold">
                <span>Scholarship Classification:</span>
                <div className="flex-1 border-b border-black flex items-center justify-center font-normal">
                  {formData.scholarshipCategory || formData.externalCategory || formData.internalCategory || ''}
                </div>
              </div>

              <div className="space-y-4 pl-12">
                <div className="flex items-end gap-2">
                  <span>Municipality:</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.scholarshipCategory === 'DSWD' ? formData.dswdMunicipality : ''}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span>Contact person:</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.scholarshipCategory === 'DSWD' ? formData.dswdContactPerson : ''}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span>Designation:</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.scholarshipCategory === 'DSWD' ? formData.dswdDesignation : ''}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span>Others (specify):</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.scholarshipCategory === 'DSWD' ? formData.dswdOthers : ''}</span>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center text-sm">
              I hereby certify that the information I have provided is true and correct to the best of my knowledge.
            </div>
          </div>
        </div>
{/* PAGE 2: STUDENT DOCUMENTS */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-8 break-after-page">
          {/* Header Box */}
          <div className="border border-black w-full mb-6">
            <div className="flex border-b border-black">
              <div className="w-1/5 p-2 border-r border-black flex flex-col items-center justify-center">
                <img src="/capsu-logo.png" className="w-12 h-12 object-contain mb-1" />
              </div>
              <div className="w-3/5 p-2 border-r border-black flex flex-col items-center justify-center text-center">
                <div className="text-[10px]">Document Type:</div>
                <strong className="text-xl tracking-widest mt-1 font-serif">APPENDIX</strong>
                <div className="text-[8px] mt-1 font-serif">ATTACHED STUDENT REQUIREMENTS</div>
              </div>
              <div className="w-1/5 font-serif">
                <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Page</span><strong>1 of 1</strong></div>
              </div>
            </div>
            <div className="flex font-serif bg-gray-100">
              <div className="w-full p-2 text-center font-bold text-lg tracking-wider">OFFICIAL SUBMISSION DOCUMENTS</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 px-4">
            {requirementsList.map((req, i) => req.file?.data ? (
              <div key={i} className="border border-black p-4 flex flex-col items-center justify-center h-[400px]">
                <h4 className="font-bold font-serif mb-4 text-center border-b border-black w-full pb-2">{req.name}</h4>
                {req.file.type.includes('image') ? (
                  <img src={req.file.data} className="max-h-[300px] object-contain" />
                ) : (
                  <div className="text-gray-500 italic font-serif flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12" />
                    [PDF Document Attached in Digital File]
                  </div>
                )}
              </div>
            ) : null)}
          </div>
        </div>

      </div>

      {previewFile && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 print:hidden">
          <button 
            onClick={() => setPreviewFile(null)}
            className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-4xl h-full max-h-[85vh] bg-white rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {previewFile.name}
              </h3>
              <a 
                href={previewFile.data} 
                download={previewFile.name}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-6">
              {previewFile.type?.includes('image') ? (
                <img src={previewFile.data} alt={previewFile.name} className="max-w-full max-h-full object-contain shadow-sm" />
              ) : previewFile.type?.includes('pdf') ? (
                <iframe src={previewFile.data} className="w-full h-full border-none bg-white shadow-sm" title={previewFile.name} />
              ) : (
                <div className="text-center text-gray-500 font-medium">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                  Cannot preview this file type. <br/> Please download to view.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
