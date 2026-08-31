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
        <div className="bg-[#003884] text-white px-4 py-3 flex items-center justify-between relative shadow-md shrink-0">
          <button
            onClick={viewMode === 'overview' ? onClose : () => setViewMode('overview')}
            className="flex items-center justify-center bg-white/10 hover:bg-white/20 border border-transparent px-4 py-1.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
          >
            Back
          </button>
          
          <h2 className="text-lg font-bold text-center tracking-wide text-white absolute left-1/2 -translate-x-1/2">
            Student Records
          </h2>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md border-2 border-white text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: OVERVIEW (Matches screenshot) */}
          {/* ------------------------------------------------------------- */}
          {viewMode === 'overview' && (
            <div className="p-6 bg-white min-h-full">
              <div className="mb-6">
                <div className="text-[#2563eb] font-bold text-[15px] mb-1">Scholarship Program</div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {formData.externalCategory ? `Externally-Funded: ${formData.externalCategory}` : formData.internalCategory ? `Internally-Funded: ${formData.internalCategory}` : scholarshipType}
                </h3>
                <p className="text-[13px] font-semibold text-gray-400 mt-1">
                  Submitted on {new Date(localSubmission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <button
                onClick={() => setViewMode('form')}
                className="w-full bg-[#e0e7ff] hover:bg-[#dbeafe] text-[#2563eb] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer mb-8"
              >
                <Eye className="w-[22px] h-[22px] stroke-[2.5]" />
                <span className="text-[15px]">View Filled Form</span>
              </button>

              <div>
                <h4 className="text-gray-500 font-extrabold tracking-wider text-[13px] mb-4 uppercase">Scholarship Requirements</h4>
                
                <div className="space-y-4">
                  {/* 1st Sem Section */}
                  <div className="bg-[#f8fafc] border border-[#cbd5e1] p-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Archive className="w-5 h-5 text-blue-600" />
                        <h5 className="font-bold text-gray-800 text-[15px]">1st Semester Records</h5>
                      </div>
                      <select 
                        value={firstSemAY || academicYearsOptions[0]} 
                        onChange={(e) => setFirstSemAY(e.target.value)}
                        className="text-xs font-medium border border-gray-300 rounded-md bg-white p-1.5 text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {academicYearsOptions.map((ay: string) => (
                          <option key={ay} value={ay}>{ay}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleOpenSemester('1st Semester', firstSemAY || academicYearsOptions[0])}
                      className="w-full py-2.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-[18px] h-[18px] stroke-[2.5]" />
                      View 1st Sem Documents
                    </button>
                  </div>

                  {/* 2nd Sem Section */}
                  <div className="bg-[#f8fafc] border border-[#cbd5e1] p-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Archive className="w-5 h-5 text-blue-600" />
                        <h5 className="font-bold text-gray-800 text-[15px]">2nd Semester Records</h5>
                      </div>
                      <select 
                        value={secondSemAY || academicYearsOptions[0]} 
                        onChange={(e) => setSecondSemAY(e.target.value)}
                        className="text-xs font-medium border border-gray-300 rounded-md bg-white p-1.5 text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {academicYearsOptions.map((ay: string) => (
                          <option key={ay} value={ay}>{ay}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleOpenSemester('2nd Semester', secondSemAY || academicYearsOptions[0])}
                      className="w-full py-2.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-[18px] h-[18px] stroke-[2.5]" />
                      View 2nd Sem Documents
                    </button>
                  </div>

                  {/* Other requirements */}
                  {requirementsList.filter(req => req.group === 'Other Documents' && req.file).length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h5 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Other Documents</h5>
                      <div className="space-y-3">
                        {requirementsList.filter(req => req.group === 'Other Documents' && req.file).map((req) => (
                          <div key={req.id} className="bg-white border border-[#cbd5e1] p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                              <FileText className="w-6 h-6 text-[#64748b] stroke-[1.5]" />
                              <div>
                                <p className="font-bold text-[#1e293b] text-[15px] leading-tight">{req.name}</p>
                                <p className="text-[13px] font-medium text-gray-400 mt-0.5">{req.fileName}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setPreviewFile(req.file as SubmissionFile)}
                              className="text-[#2563eb] hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Preview File"
                            >
                              <Eye className="w-[22px] h-[22px] stroke-[2.5]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              onClick={() => setViewMode('overview')}
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

        </div>

        {/* PAGE 2 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page font-serif text-black pl-8 pr-4">
          <div className="font-bold mb-4">Highest Educational Attainment of your Parent/Guardian?</div>
          <div className="space-y-2 pl-12 mb-8 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.parentEduAttainment === 'Elementary Level' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Elementary Level</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.parentEduAttainment === 'Elementary Graduate' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Elementary Graduate</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.parentEduAttainment === 'High School Level' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>High School Level</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.parentEduAttainment === 'High school Graduate' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>High school Graduate</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.parentEduAttainment === 'College Level' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>College Level</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.parentEduAttainment === 'College Graduate' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>College Graduate</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.parentEduAttainment === 'post Graduate level/degree' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>post Graduate level/degree</span></div>
          </div>

          <div className="font-bold mb-4">What is your family's approximate monthly income?</div>
          <div className="space-y-2 pl-12 mb-12 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.monthlyIncome === 'below ₱ 10,000' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>below ₱ 10,000</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.monthlyIncome === '₱ 10,001 - ₱ 20,000' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>₱ 10,001 - ₱ 20,000</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.monthlyIncome === '₱ 20,001 - ₱ 30,000' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>₱ 20,001 - ₱ 30,000</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.monthlyIncome === 'Above ₱ 30,000' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Above ₱ 30,000</span></div>
          </div>

          <div className="flex items-center gap-12 font-bold mb-12">
            <div>Are you the first in the family to attend College?</div>
            <div className="flex gap-8 font-normal text-[15px]">
              <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.firstInFamily === 'Yes' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Yes</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.firstInFamily === 'No' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>No</span></div>
            </div>
          </div>

          <div className="font-bold mb-8">C. Living Condition</div>
          
          <div className="font-bold mb-4">With whom do you currently live?</div>
          <div className="space-y-2 pl-12 mb-12 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.livingWith === 'Parents/Guardians' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Parents/Guardians</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.livingWith === 'Relatives' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Relatives</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.livingWith === 'Alone' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Alone</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.livingWith === 'Boarding house' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Boarding house</span></div>
            <div className="flex items-end gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.livingWith === 'others' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>others (please specify)</span><span className="w-48 border-b border-black inline-block text-center">{formData.livingWith === 'others' ? formData.livingWithOthers : ''}</span></div>
          </div>

          <div className="font-bold mb-4">Type of Housing</div>
          <div className="space-y-2 pl-12 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.housingType === 'Own house' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Own house</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.housingType === 'Rented house or apartment' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Rented house or apartment</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.housingType === 'Boarding house' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Boarding house</span></div>
            <div className="flex items-end gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.housingType === 'others' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>others (please specify)</span><span className="w-48 border-b border-black inline-block text-center">{formData.housingType === 'others' ? formData.housingTypeOthers : ''}</span></div>
          </div>
        </div>

        {/* PAGE 3 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page font-serif text-black pl-8 pr-4">
          <div className="font-bold mb-8">D. Access to Resources</div>
          
          <div className="font-bold mb-4">Do you have access of the following at home?</div>
          <div className="space-y-2 pl-12 mb-12 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{(formData.accessToResources || []).includes('Personal Computer/Laptop') && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Personal Computer/Laptop</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{(formData.accessToResources || []).includes('Internet Connection') && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Internet Connection</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{(formData.accessToResources || []).includes('Study space') && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Study space</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{(formData.accessToResources || []).includes('Textbooks and learning materials') && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Textbooks and learning materials</span></div>
          </div>

          <div className="flex items-center gap-8 font-bold mb-16">
            <div>Do you work while studying?</div>
            <div className="flex gap-6 font-normal text-[15px]">
              <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.workingStudent === 'Yes, full-time' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Yes, full-time</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.workingStudent === 'Yes, part-time' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Yes, part-time</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.workingStudent === 'No' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>No</span></div>
            </div>
          </div>

          <div className="font-bold mb-8">E. Student Classification</div>
          
          <div className="font-bold mb-4">Which of the following classification best describe your current status? (Multiple responses)</div>
          <div className="space-y-1.5 pl-4 text-[13px] leading-tight">
            {[
              'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
              'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school', 'Rebel returnees', 'Child of a rebel returnees',
              'Dependent or child of OFW', 'Member of 4Ps', 'Member of Calamity or Disaster Affected Family', 'Orphan/Child in need of special protection',
              'Working Student', 'From geographically isolated &amp; disadvantaged area (GIDA)', 'Muslim Student', 'Low income family/ Economically disadvantaged student',
              'Senior Citizen student'
            ].map(item => (
              <div key={item} className="flex items-center gap-2"><div className="w-4 h-4 border border-black flex items-center justify-center shrink-0">{(formData.studentClassification || []).includes(item) && <Check className="w-3 h-3" strokeWidth={3} />}</div><span>{item}</span></div>
            ))}
            
            <div className="flex gap-2 items-start mt-1.5"><div className="w-4 h-4 border border-black flex items-center justify-center shrink-0 mt-0.5">{(formData.studentClassification || []).includes('First Generation student (Parents did not complete a college degree, first in the immediate family to seek college admission)') && <Check className="w-3 h-3" strokeWidth={3} />}</div><span className="leading-tight">First Generation student (Parents did not complete a college degree, first in the immediate family to seek<br/>college admission)</span></div>
            <div className="flex items-center gap-2 mt-1.5"><div className="w-4 h-4 border border-black flex items-center justify-center shrink-0">{(formData.studentClassification || []).includes('LGBTQ+ Community') && <Check className="w-3 h-3" strokeWidth={3} />}</div><span>LGBTQ+ Community</span></div>
            <div className="flex items-center gap-2 mt-1.5"><div className="w-4 h-4 border border-black flex items-center justify-center shrink-0">{(formData.studentClassification || []).includes('Regular student (I do not belong to any of this group classification)') && <Check className="w-3 h-3" strokeWidth={3} />}</div><span>Regular student (I do not belong to any of this group classification)</span></div>
            
            <div className="flex items-end gap-2 mt-6">
              <div className="w-4 h-4 border border-black flex items-center justify-center shrink-0 mb-1">{(formData.studentClassification || []).includes('others') && <Check className="w-3 h-3" strokeWidth={3} />}</div>
              <span className="mb-1">others (Please specify)</span>
              <span className="flex-1 border-b border-black inline-block text-center pb-1">{(formData.studentClassification || []).includes('others') ? formData.studentClassificationOthers : ''}</span>
            </div>
          </div>
        </div>

        {/* PAGE 4 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page font-serif text-black pl-8 pr-4">
          <div className="font-bold mb-2">If you are working student, please indicate your type of work or source of income</div>
          <div className="w-full border-b border-black mb-12 h-6 text-center">{formData.workTypeIncome || ''}</div>
          
          <div className="font-bold mb-2">If you are a student with special needs/Person with disability (PWD), please specify your condition or disability</div>
          <div className="w-full border-b border-black mb-12 h-6 text-center">{formData.specialNeedsCondition || ''}</div>

          <div className="font-bold mb-2">If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted.</div>
          <div className="w-full border-b border-black mb-16 h-6 text-center">{formData.pdlReason || ''}</div>

          <div className="text-center font-bold text-lg mb-10 tracking-wider">SCHOLARSHIP CATEGORY</div>

          <div className="font-bold mb-8">A. Internally-Funded</div>
          
          <div className="font-bold mb-4 pl-4">Entrance</div>
          <div className="flex gap-16 pl-12 mb-8 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Valedictorian' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Valedictorian</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Salutatorian' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Salutatorian</span></div>
          </div>

          <div className="font-bold mb-4 pl-4">Academic</div>
          <div className="flex gap-12 pl-12 mb-8 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Full' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Full</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Partial' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Partial</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Regional (Academic)' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Regional</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'National (Academic)' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>National</span></div>
          </div>

          <div className="font-bold mb-4 pl-4">Socio-cultural</div>
          <div className="flex gap-12 pl-12 mb-8 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Regional (Socio-cultural)' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Regional</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'National (Socio-cultural)' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>National</span></div>
          </div>

          <div className="font-bold mb-4 pl-4">Institutional</div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 pl-12 mb-12 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Dependent of Faculty or Staff' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Dependent of Faculty or Staff</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'President – SSC' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>President – SSC</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'President – FLP' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>President – FLP</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'Editor-in-Chief (Campus Publication)' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Editor-in-Chief (Campus Publication)</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.internalCategory === 'CapSU Band / Chorale' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>CapSU Band / Chorale</span></div>
          </div>
          
          <div className="flex items-end gap-2 pl-12 text-[15px]">
            <div className="w-5 h-5 border border-black flex items-center justify-center mb-1 shrink-0">{formData.internalCategory === 'Others' && <Check className="w-4 h-4" strokeWidth={3} />}</div>
            <span className="mb-1 shrink-0">Others (specify)</span>
            <span className="flex-1 border-b border-black inline-block text-center pb-1">{formData.internalCategory === 'Others' ? formData.internalCategoryOthers : ''}</span>
          </div>
        </div>

        {/* PAGE 5 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page font-serif text-black pl-8 pr-4">
          <div className="font-bold mb-8">B. Externally-Funded</div>
          
          <div className="font-bold mb-4">CHED</div>
          <div className="space-y-2 pl-4 mb-8 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'ANAC – IP' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>ANAC – IP</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'Pag – ulikid' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Pag – ulikid</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'Barangay' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Barangay (Legal dependents of Brgy. Officials)</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'ESGP – PA' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>ESGP – PA</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'UniFast' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>UniFast</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'Tertiary Education Subsidy (TES)' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Tertiary Education Subsidy (TES)</span></div>
            <div className="flex items-end gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center mb-1 shrink-0">{formData.externalCategory === 'Congressional District' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span className="mb-1">Congressional District (specify)</span><span className="flex-1 border-b border-black inline-block text-center pb-1">{formData.externalCategory === 'Congressional District' ? formData.chedCongressionalDistrict : ''}</span></div>
            <div className="flex items-end gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center mb-1 shrink-0">{formData.externalCategory === 'One Town One Scholar' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span className="mb-1">One Town One Scholar (specify)</span><span className="flex-1 border-b border-black inline-block text-center pb-1">{formData.externalCategory === 'One Town One Scholar' ? formData.chedOneTown : ''}</span></div>
            <div className="flex items-end gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center mb-1 shrink-0">{formData.externalCategory === 'Tulong Dunong' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span className="mb-1">Tulong Dunong (specify)</span><span className="flex-1 border-b border-black inline-block text-center pb-1">{formData.externalCategory === 'Tulong Dunong' ? formData.chedTulongDunong : ''}</span></div>
            <div className="flex items-end gap-2 mt-4"><div className="w-5 h-5 border border-black flex items-center justify-center mb-1 shrink-0">{formData.externalCategory === 'CHED Others' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span className="mb-1">Others (specify)</span><span className="flex-1 border-b border-black inline-block text-center pb-1">{formData.externalCategory === 'CHED Others' ? formData.chedOthers : ''}</span></div>
          </div>

          <div className="font-bold mb-4">Merit</div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pl-12 mb-10 text-[15px]">
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'VIC' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>VIC</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'Capizeño Circle' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>Capizeño Circle</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'DOST' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>DOST</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'GRF' && <Check className="w-4 h-4" strokeWidth={3} />}</div><span>GRF</span></div>
          </div>

          <div className="flex gap-2 mb-10 text-[15px]">
            <div className="w-5 h-5 border border-black flex items-center justify-center shrink-0 mt-1">{formData.externalCategory === 'LGU' && <Check className="w-4 h-4" strokeWidth={3} />}</div>
            <div className="flex-1">
              <span className="leading-tight">LGU: Barangay, Municipality, Province (Landline) Contact person or issuing office:</span>
              <div className="w-[80%] border-b border-black h-8 mt-2 text-center">{formData.externalCategory === 'LGU' ? formData.lguContact : ''}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[15px]">
            <div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">{formData.externalCategory === 'DSWD' && <Check className="w-4 h-4" strokeWidth={3} />}</div>
            <div className="flex-1">
              <span className="font-bold">DSWD:</span>
              <div className="flex items-end gap-2 mt-6">
                <span>Municipality:</span><span className="flex-1 border-b border-black inline-block text-center">{formData.externalCategory === 'DSWD' ? formData.dswdMunicipality : ''}</span>
              </div>
              <div className="flex items-end gap-2 mt-6">
                <span>Contact person:</span><span className="flex-1 border-b border-black inline-block text-center">{formData.externalCategory === 'DSWD' ? formData.dswdContact : ''}</span>
              </div>
              <div className="flex items-end gap-2 mt-6">
                <span>Designation:</span><span className="flex-1 border-b border-black inline-block text-center">{formData.externalCategory === 'DSWD' ? formData.dswdDesignation : ''}</span>
              </div>
              <div className="flex items-end gap-2 mt-6">
                <span>Others (specify)</span><span className="flex-1 border-b border-black inline-block text-center">{formData.externalCategory === 'DSWD' ? formData.dswdOthers : ''}</span>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center text-[15px]">
            I hereby certify that the information I have provided is true and correct to the best of my knowledge.
            
            <div className="mt-12 flex justify-center">
              <div className="w-64 border-b border-black relative h-12 flex items-center justify-center">
                {formData.signature && (
                  <img src={formData.signature} alt="Signature" className="absolute bottom-1 max-h-20 object-contain" />
                )}
              </div>
            </div>
            <div className="mt-2 text-center">Signature</div>
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
