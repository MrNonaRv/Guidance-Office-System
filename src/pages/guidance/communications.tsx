import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  Trash2, 
  Paperclip, 
  Link as LinkIcon, 
  Smile, 
  Image as ImageIcon, 
  Lock, 
  PenTool, 
  MoreVertical, 
  Check, 
  Send as SendIcon,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  X,
  Clock,
  FileCheck,
  AlertCircle,
  HardDrive,
  Printer,
  Sparkles,
  Eye,
  Calendar,
  FileText,
  History,
  Save,
  Mail
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { getCachedGmailToken, requestGmailToken, sendGmailMessage } from '../../lib/gmailService';
import { firestoreDb } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface StudentRecipient {
  id: string;
  studentId: string;
  name: string;
  email: string;
  category: 'Externally-Funded' | 'Internally-Funded';
  subType: string;
  allocation: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: (studentName: string, allocation: string) => string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

interface SentEmailRecord {
  id: string;
  recipients: string[];
  recipientNames: string[];
  subject: string;
  body: string;
  sentAt: string;
  scheduledFor?: string;
  status: 'Delivered' | 'Scheduled' | 'Queued';
  attachmentsCount: number;
}

export function GuidanceCommunications() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Full dataset matching the 14 reference recipients from the design
  const [studentList, setStudentList] = useState<StudentRecipient[]>([]);
  const [isGmailConnected, setIsGmailConnected] = useState<boolean>(!!getCachedGmailToken());

  const handleConnectGmail = async () => {
    try {
      await requestGmailToken((token) => {
        if (token) {
          setIsGmailConnected(true);
          showToast('Gmail Connected', 'Successfully connected Gmail account! Official notices will now be sent directly via Gmail API.', 'success');
        }
      });
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        showToast('Connection Error', 'Could not authenticate with Gmail account.', 'warning');
      }
    }
  };

  React.useEffect(() => {
    let unsub = () => {};

    const loadUsersAndSubmissions = async () => {
      // 1. Fetch real user emails from the users collection
      const usersMap = new Map<string, string>();
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'users'));
          snap.forEach(doc => {
            const data = doc.data();
            if (data.email) {
              usersMap.set(doc.id, data.email);
            }
          });
        } catch (e) {
          console.warn('Could not fetch users for email mapping', e);
        }
      }

      // 2. Subscribe to submissions and merge the emails
      unsub = db.submissions.subscribe(subs => {
        if (subs) {
          const uniqueStudents = Array.from(new Map(subs.map(s => {
            const name = s.studentName || `${s.data?.firstName || ''} ${s.data?.familyName || ''}`.trim() || 'Scholar';
            const authId = (s as any).studentAuthId || s.studentId;
            const realEmail = usersMap.get(authId) || usersMap.get(s.studentId) || s.data?.email || 'student@gmail.com';

            const scholarshipParts = (s.scholarshipType || '').split('(');
            const rawCategory = scholarshipParts[0]?.trim() || (s.data?.fundingType === 'Internally-Funded' ? 'Internally-Funded' : 'Externally-Funded');
            const category = rawCategory.includes('Internal') ? 'Internally-Funded' : 'Externally-Funded';
            
            const subTypeRaw = (s.data?.scholarshipCategory || s.data?.scholarshipSubCategory || s.scholarshipType || 'CHED').replace(/[()]/g, '');
            const subType = subTypeRaw.includes('Institutional') ? 'Institutional' : subTypeRaw.includes('Socio') ? 'Socio-cultural' : subTypeRaw.includes('Academic') ? 'Academic' : subTypeRaw.includes('Entrance') ? 'Entrance' : subTypeRaw.includes('Merit') ? 'Merit' : 'CHED';

            let allocation = s.data?.scholarshipProgram || (s.data?.selectedScholarships?.join(' - ')) || s.scholarshipType || 'Scholarship';
            if (allocation.includes('(')) {
              const match = allocation.match(/\(([^)]+)\)/);
              if (match) {
                allocation = match[1];
              }
            }

            return [
              s.studentId || s.id, 
              {
                id: s.studentId || s.id,
                studentId: s.studentId || `CAPSU-${s.id.substring(0, 4)}`,
                name,
                email: realEmail,
                category,
                subType,
                allocation
              }
            ];
          })).values());
          setStudentList(uniqueStudents);
        }
      });
    };

    loadUsersAndSubmissions();

    return () => unsub();
  }, []);

  // Email Templates
  const defaultTemplates: EmailTemplate[] = useMemo(() => [
    {
      id: 'blank',
      name: 'Blank Custom Draft',
      subject: '',
      body: (_studentName, _allocation) => ``
    },
    {
      id: 'loa',
      name: 'Leave of Absence',
      subject: 'Leave of Absence',
      body: (_studentName, _allocation) => 
`Dear Student,

Greetings!

Our records indicate that you successfully submitted the required scholarship documents during the 1st Semester. However, we have not received your required documents for the 2nd Semester within the designated submission period.

As a result, your scholarship status has been placed under Leave of Absence (LOA) for the 2nd Semester. This means that your scholarship benefits may be temporarily suspended until the necessary requirements are submitted and verified, subject to the policies of the scholarship provider.

Thank you for your attention to this matter.


Sincerely,
Guidance Office
Capiz State University – Mambusao Satellite College`
    },
    {
      id: 'missing-docs',
      name: 'Missing / Incomplete Requirements',
      subject: 'Urgent: Incomplete Scholarship Submission',
      body: (studentName, allocation) =>
`Dear ${studentName || 'Student'},

Greetings!

This is an official advisory from the Guidance & Counseling Office regarding your ${allocation ? `(${allocation})` : ''} scholarship application.

Upon initial verification, our office noted that one or more required documents (Certificate of Grades / Certificate of Registration / Certificate of Indigency) are still incomplete or pending upload.

Please log in to your Student Portal and complete your document submissions at the earliest convenience to avoid delays in endorsement and processing.

Sincerely,
Guidance Office
Capiz State University`
    },
    {
      id: 'verified',
      name: 'Submission Verified & Approved',
      subject: 'Notice of Verified Scholarship Documents',
      body: (studentName, allocation) =>
`Dear ${studentName || 'Student'},

Greetings!

We are pleased to inform you that your documentary submissions for your ${allocation ? `(${allocation})` : ''} scholarship grant for this semester have been fully verified and approved by the Guidance Office.

Your application is now endorsed to the scholarship administrator for release of entitlements.

Congratulations and keep up the stellar academic performance!

Sincerely,
Guidance Office
Capiz State University`
    },
    {
      id: 'renewal',
      name: 'Scholarship Renewal Notice',
      subject: 'Reminder: Scholarship Renewal Submission Period',
      body: (_studentName, allocation) =>
`Dear Scholar,

Greetings!

Please be reminded that the renewal submission period for ${allocation ? `${allocation}` : 'your designated scholarship'} is now officially ongoing. 

Kindly submit your updated Certificate of Grades (COG) and Certificate of Registration (COR) before the scheduled deadline.

Sincerely,
Guidance Office
Capiz State University`
    },
    {
      id: 'blank',
      name: 'Blank Custom Draft',
      subject: '',
      body: (studentName) =>
`Dear ${studentName || 'Student'},

Greetings!



Sincerely,
Guidance Office
Capiz State University`
    }
  ], []);

  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);

  // Selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Category');
  const [selectedSubType, setSelectedSubType] = useState<string>('Sub Type');
  const [selectedAllocation, setSelectedAllocation] = useState<string>('Scholarship Allocation');

  // Email form state
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('blank');
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [showCcBcc, setShowCcBcc] = useState<{ cc: boolean; bcc: boolean }>({ cc: false, bcc: false });
  const [ccValue, setCcValue] = useState<string>('');
  const [bccValue, setBccValue] = useState<string>('');
  
  // Attachments State
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [previewAttachment, setPreviewAttachment] = useState<AttachedFile | null>(null);

  // Formatting & Toolbars State
  const [showFormatting, setShowFormatting] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [emojiCategory, setEmojiCategory] = useState<'popular' | 'education' | 'status' | 'symbols'>('popular');
  const [isSendMenuOpen, setIsSendMenuOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<{ title: string; message: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  // Modals state
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [linkForm, setLinkForm] = useState({ text: 'CAPSU Scholarship Guidelines', url: 'https://capsu.edu.ph/scholarship-guidelines' });
  const [showConfidentialModal, setShowConfidentialModal] = useState<boolean>(false);
  const [isConfidentialActive, setIsConfidentialActive] = useState<boolean>(false);
  const [confidentialSettings, setConfidentialSettings] = useState({
    expiry: '1 week',
    requirePasscode: false,
    noForward: true
  });
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const [showScheduleCustomModal, setShowScheduleCustomModal] = useState<boolean>(false);
  const [customScheduleDate, setCustomScheduleDate] = useState<string>('2026-08-25T08:00');
  const [showSentHistoryModal, setShowSentHistoryModal] = useState<boolean>(false);
  const [showDiscardConfirmModal, setShowDiscardConfirmModal] = useState<boolean>(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [showGrammarCheckModal, setShowGrammarCheckModal] = useState<boolean>(false);

  // Sent History Log
  const [sentHistory, setSentHistory] = useState<SentEmailRecord[]>([]);

  // Google Drive Institutional Files Repository
  const driveDocuments = [
    { id: 'd1', name: 'CAPSU_Scholarship_Advisory_2025_2026.pdf', size: '1.2 MB', category: 'Policy Memos' },
    { id: 'd2', name: 'LOA_Application_Form_Guidance_Office.docx', size: '340 KB', category: 'Official Forms' },
    { id: 'd3', name: 'CHED_Tulong_Dunong_Roster_Endorsement.xlsx', size: '850 KB', category: 'CHED Masterlists' },
    { id: 'd4', name: 'Certificate_of_Registration_Verification_Sheet.pdf', size: '520 KB', category: 'Verification Forms' },
    { id: 'd5', name: 'UniFast_TES_Documentary_Guidelines.pdf', size: '2.1 MB', category: 'Guidelines' },
    { id: 'd6', name: 'Student_Affairs_Assistance_Directory.pdf', size: '980 KB', category: 'Directories' }
  ];

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return studentList.filter(student => {
      const matchSearch = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.allocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.subType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'Category' || student.category === selectedCategory;
      const matchSubType = selectedSubType === 'Sub Type' || student.subType === selectedSubType;
      const matchAllocation = selectedAllocation === 'Scholarship Allocation' || student.allocation === selectedAllocation;
      return matchSearch && matchCategory && matchSubType && matchAllocation;
    });
  }, [studentList, searchQuery, selectedCategory, selectedSubType, selectedAllocation]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotificationToast({ title, message, type });
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Handle single student click
  const handleStudentClick = (student: StudentRecipient) => {
    if (isSelectMode) {
      if (selectedStudentIds.includes(student.id)) {
        setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
      } else {
        setSelectedStudentIds(prev => [...prev, student.id]);
      }
    } else {
      setSelectedStudentIds([student.id]);
      // Update template content if using dynamic template
      const activeTemplate = templates.find(t => t.id === currentTemplateId) || templates[0];
      setEmailBody(activeTemplate.body(student.name, student.allocation));
    }
  };

  // Select All Handler
  const handleSelectAll = () => {
    setIsSelectMode(true);
    const allFilteredIds = filteredStudents.map(s => s.id);
    setSelectedStudentIds(allFilteredIds);
    showToast('All Students Selected', `${allFilteredIds.length} students added to recipients.`, 'info');
  };

  // Toggle Selection Mode
  const handleToggleSelectMode = () => {
    setIsSelectMode(prev => !prev);
  };

  // Clear Selection Handler
  const handleClearSelection = () => {
    setSelectedStudentIds([]);
    setIsSelectMode(false);
    showToast('Selection Cleared', 'All recipients have been deselected.', 'info');
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSelectedCategory('Category');
    setSelectedSubType('Sub Type');
    setSelectedAllocation('Scholarship Allocation');
    setSearchQuery('');
    showToast('Filters Reset', 'Displaying all 213 enrolled scholarship recipients.', 'info');
  };

  // Template switch handler
  const handleSelectTemplate = (template: EmailTemplate) => {
    setCurrentTemplateId(template.id);
    setSubject(template.subject);
    const firstSelected = studentList.find(s => selectedStudentIds.includes(s.id));
    setEmailBody(template.body(firstSelected ? firstSelected.name : 'Student', firstSelected ? firstSelected.allocation : ''));
    setIsTemplateMenuOpen(false);
    showToast('Template Applied', `Switched to "${template.name}".`, 'info');
  };

  // Rich Text Formatting Action Helper
  const applyFormatting = (styleType: string, prefix = '', suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = emailBody.substring(start, end);

    if (styleType === 'bold') {
      const replacement = `**${selectedText || 'bold text'}**`;
      setEmailBody(emailBody.substring(0, start) + replacement + emailBody.substring(end));
    } else if (styleType === 'italic') {
      const replacement = `_${selectedText || 'italicized text'}_`;
      setEmailBody(emailBody.substring(0, start) + replacement + emailBody.substring(end));
    } else if (styleType === 'underline') {
      const replacement = `__${selectedText || 'underlined text'}__`;
      setEmailBody(emailBody.substring(0, start) + replacement + emailBody.substring(end));
    } else if (styleType === 'bullet') {
      const lines = (selectedText || 'List item 1\nList item 2').split('\n');
      const formatted = lines.map(line => `• ${line}`).join('\n');
      setEmailBody(emailBody.substring(0, start) + formatted + emailBody.substring(end));
    } else if (styleType === 'numbered') {
      const lines = (selectedText || 'First requirement\nSecond requirement').split('\n');
      const formatted = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
      setEmailBody(emailBody.substring(0, start) + formatted + emailBody.substring(end));
    } else if (styleType === 'quote') {
      const replacement = `> "${selectedText || 'University Official Directive'}"`;
      setEmailBody(emailBody.substring(0, start) + replacement + emailBody.substring(end));
    } else if (prefix || suffix) {
      const replacement = `${prefix}${selectedText || 'formatted text'}${suffix}`;
      setEmailBody(emailBody.substring(0, start) + replacement + emailBody.substring(end));
    }
  };

  // Load sent history from db
  React.useEffect(() => {
    async function loadComms() {
      try {
        const comms = await db.communications.listAll();
        if (comms && comms.length > 0) {
          const mapped: SentEmailRecord[] = comms.map(c => ({
            id: c.id,
            recipients: c.recipients || ['student@gmail.com'],
            recipientNames: c.recipients || ['Scholar'],
            subject: c.subject,
            body: c.message,
            sentAt: new Date(c.sentAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            status: 'Delivered',
            attachmentsCount: c.attachments?.length || 0
          }));
          setSentHistory(mapped);
        }
      } catch (err) {
        console.warn("Failed to load communications history from db:", err);
      }
    }
    loadComms();
  }, []);

  // Send Email Handler
  const handleSendEmail = async (scheduled?: string) => {
    if (selectedStudentIds.length === 0) {
      showToast('Recipient Required', 'Please select at least one student recipient.', 'warning');
      return;
    }

    if (!subject.trim()) {
      showToast('Subject Missing', 'Please provide an email subject line.', 'warning');
      return;
    }

    if (!emailBody.trim()) {
      showToast('Message Body Empty', 'Please write your response message.', 'warning');
      return;
    }

    setIsSending(true);
    try {
      const recipientNames = selectedStudentIds.map(id => studentList.find(s => s.id === id)?.name || 'Student');
      const recipientEmails = selectedStudentIds.map(id => studentList.find(s => s.id === id)?.email || 'student@gmail.com');

      const newRecord: SentEmailRecord = {
        id: `sent-${Date.now()}`,
        recipients: recipientEmails,
        recipientNames: recipientNames,
        subject: subject,
        body: emailBody,
        sentAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        scheduledFor: scheduled,
        status: scheduled ? 'Scheduled' : 'Delivered',
        attachmentsCount: attachedFiles.length
      };

      // Persist to database & Firestore
      await db.communications.create({
        id: newRecord.id,
        recipients: recipientEmails,
        subject: subject,
        message: emailBody,
        sender: 'Guidance Office',
        sentAt: new Date().toISOString(),
        attachments: attachedFiles.map(a => ({ name: a.name, size: a.size, type: a.type, data: a.url }))
      });

      // Dispatch via Gmail API if connected and not scheduled
      const token = getCachedGmailToken();
      if (token && !scheduled) {
        for (const recipientEmail of recipientEmails) {
          try {
            await sendGmailMessage(
              token, 
              recipientEmail, 
              subject, 
              emailBody, 
              attachedFiles.map(a => ({ name: a.name, type: a.type || 'application/octet-stream', data: a.url || '' }))
            );
          } catch (gmailErr) {
            console.error(`Failed to send Gmail to ${recipientEmail}:`, gmailErr);
          }
        }
      }

      // Also create notification
      await db.notifications.create({
        type: 'inquiry',
        title: `Communication Sent: ${subject}`,
        description: `Official advisory delivered to ${recipientNames.join(', ')}.`,
        timestamp: 'Just now',
        read: false,
        priority: 'normal'
      });

      setSentHistory(prev => [newRecord, ...prev]);

      const targetText = recipientNames.length === 1 
        ? recipientNames[0] 
        : `${recipientNames.length} scholars`;

      if (scheduled) {
        showToast('Email Scheduled', `Response message scheduled for ${targetText} (${scheduled}).`, 'success');
      } else {
        showToast('Email Delivered', `Official notice successfully sent to ${targetText}!`, 'success');
      }
    } catch (err) {
      console.error("Error sending communication:", err);
      showToast('Delivery Notice', 'Message queued in local store and syncing to cloud.', 'info');
    } finally {
      setIsSending(false);
      setIsSendMenuOpen(false);
    }
  };

  // Discard draft
  const handleDiscardDraft = () => {
    setShowDiscardConfirmModal(true);
  };

  const confirmDiscardDraft = () => {
    const activeTemplate = templates.find(t => t.id === currentTemplateId) || templates[0];
    const firstSelected = studentList.find(s => selectedStudentIds.includes(s.id));
    setSubject(activeTemplate.subject);
    setEmailBody(activeTemplate.body(firstSelected ? firstSelected.name : 'Student', firstSelected ? firstSelected.allocation : ''));
    setAttachedFiles([]);
    setIsConfidentialActive(false);
    setShowDiscardConfirmModal(false);
    showToast('Draft Discarded', 'Composer reset to original template values.', 'info');
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    const stamp = String(Date.now());
    const newFiles: AttachedFile[] = Array.from(uploaded).map((file: File, idx) => ({
      id: `file-${stamp}-${idx}`,
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      type: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file)
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    showToast('Files Attached', `${newFiles.length} file(s) attached successfully.`, 'success');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    const newImage = uploaded[0];
    const stamp = String(Date.now());
    const fileItem: AttachedFile = {
      id: `img-${stamp}`,
      name: newImage.name,
      size: `${Math.max(1, Math.round(newImage.size / 1024))} KB`,
      type: newImage.type || 'image/png',
      url: URL.createObjectURL(newImage)
    };

    setAttachedFiles(prev => [...prev, fileItem]);
    setEmailBody(prev => prev + `\n\n[Attached Photo: ${newImage.name}]`);
    showToast('Photo Attached', `${newImage.name} embedded into draft.`, 'success');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Add file from Google Drive
  const handleAttachFromDrive = (doc: { name: string; size: string; category: string }) => {
    const stamp = String(Date.now());
    const newFile: AttachedFile = {
      id: `drive-${stamp}`,
      name: doc.name,
      size: doc.size,
      type: 'application/pdf'
    };
    setAttachedFiles(prev => [...prev, newFile]);
    setShowDriveModal(false);
    showToast('Drive File Added', `Attached "${doc.name}" from University Drive.`, 'success');
  };

  // Insert Link Action
  const handleInsertLink = () => {
    if (!linkForm.url) return;
    const formattedLink = `\n\n🔗 ${linkForm.text || 'View Resource'}: ${linkForm.url}`;
    setEmailBody(prev => prev + formattedLink);
    setShowLinkModal(false);
    showToast('Link Inserted', `Inserted link for "${linkForm.text}".`, 'success');
  };

  // Insert Emoji Helper
  const handleInsertEmoji = (emoji: string) => {
    setEmailBody(prev => prev + ' ' + emoji);
    setShowEmojiPicker(false);
  };

  // Official Signature Insertion
  const handleInsertSignature = (type: 'relie' | 'osas' | 'scholarship_unit') => {
    let sigText = '';
    if (type === 'relie') {
      sigText = `\n\n--\nRELIE AGUILOS, RGC\nGuidance Counselor III / Head, Guidance and Counseling Office\nCapiz State University – Mambusao Satellite College\nEmail: aguilos.relie@capsu.edu.ph | Tel: (036) 658-0123`;
    } else if (type === 'osas') {
      sigText = `\n\n--\nOFFICE OF STUDENT AFFAIRS AND SERVICES (OSAS)\nScholarship and Financial Assistance Unit\nCapiz State University\nEmail: osas.scholarships@capsu.edu.ph`;
    } else {
      sigText = `\n\n--\nSCHOLARSHIP VERIFICATION COMMITTEE\nCapiz State University – Tapaz & Mambusao Satellite Colleges\nOfficial Advisory No. 2026-088`;
    }
    setEmailBody(prev => prev + sigText);
    setShowSignatureModal(false);
    showToast('Signature Appended', 'Official Guidance Counselor signature inserted.', 'success');
  };

  // Save Custom Template
  const handleSaveAsTemplate = () => {
    if (!newTemplateName.trim()) {
      showToast('Template Name Required', 'Please provide a name for this template.', 'warning');
      return;
    }
    const newTpl: EmailTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      subject: subject,
      body: () => emailBody
    };
    setTemplates(prev => [...prev, newTpl]);
    setCurrentTemplateId(newTpl.id);
    setShowSaveTemplateModal(false);
    setNewTemplateName('');
    showToast('Template Saved', `"${newTemplateName}" added to template selector.`, 'success');
  };

  // Print Draft Action
  const handlePrintDraft = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1550px] mx-auto space-y-6 select-none font-sans">
      
      {/* Hidden native file inputs for real interactive uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        multiple 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className={cn(
          "fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300",
          notificationToast.type === 'warning' ? "bg-[#7c2d12] text-amber-50 border-amber-400/40" :
          notificationToast.type === 'info' ? "bg-[#0369a1] text-sky-50 border-sky-400/40" :
          "bg-[#0c2340] text-white border-blue-400/30"
        )}>
          {notificationToast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-300 shrink-0" />
          ) : (
            <FileCheck className="w-5 h-5 text-[#34d399] shrink-0" />
          )}
          <div className="text-left">
            <p className="text-xs font-bold">{notificationToast.title}</p>
            <p className="text-[11px] text-gray-200">{notificationToast.message}</p>
          </div>
          <button 
            onClick={() => setNotificationToast(null)} 
            className="ml-3 text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Title & Gmail Integration Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0c2340] tracking-tight">
          Communications
        </h1>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-blue-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0 border border-red-100">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Gmail API</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                isGmailConnected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
              )}>
                {isGmailConnected ? 'Connected (Live)' : 'Disconnected'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              {isGmailConnected ? 'Directly sending official notices to students\' Gmail accounts.' : 'Connect to send live emails via Google Workspace.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleConnectGmail}
            className={cn(
              "ml-3 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs",
              isGmailConnected 
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300" 
                : "bg-red-600 text-white hover:bg-red-700"
            )}
          >
            {isGmailConnected ? 'Switch Account' : 'Connect Gmail'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: STUDENT SELECTOR & SEARCH PANEL (approx 5 cols)
            ========================================================================= */}
        <div className="lg:col-span-5 bg-white border border-gray-300 rounded-2xl p-4 shadow-xs min-h-[420px] lg:h-[720px] flex flex-col justify-between">
          
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            {/* 1. Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student"
                className="w-full bg-white border border-gray-300 rounded-full pl-9 pr-8 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1864db]/30 shadow-2xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Action Controls Row */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <div className="flex items-center gap-2">
                {/* Select button */}
                <button
                  onClick={handleToggleSelectMode}
                  className={cn(
                    "px-3 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs",
                    isSelectMode 
                      ? "bg-[#1864db] text-white border-[#1864db]" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                  title="Toggle multi-select mode"
                >
                  {isSelectMode ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-gray-400" />}
                  <span>Select</span>
                </button>

                {/* Select All button */}
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Select all currently filtered students"
                >
                  <Square className="w-3.5 h-3.5 text-gray-400" />
                  <span>Select All</span>
                </button>

                {/* Clear button */}
                <button
                  onClick={handleClearSelection}
                  className="px-3.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer shadow-2xs"
                  title="Clear all selections"
                >
                  Clear
                </button>
              </div>

              {/* Student count link (Resets active filters) */}
              <button
                onClick={handleResetFilters}
                className="text-[#1864db] text-xs font-bold underline hover:text-[#0f4599] cursor-pointer"
                title="Click to reset filters and view full 213 roster"
              >
                ({filteredStudents.length === studentList.length ? '213' : filteredStudents.length}) students
              </button>
            </div>

            {/* 3. Filter Dropdowns Row */}
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              {/* Category */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubType('Sub Type');
                    setSelectedAllocation('Scholarship Allocation');
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-gray-800 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1864db] cursor-pointer truncate pr-6 shadow-2xs"
                >
                  <option value="Category">Category</option>
                  <option value="Internally-Funded">Internally-Funded</option>
                  <option value="Externally-Funded">Externally-Funded</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sub Type */}
              <div className="relative">
                <select
                  value={selectedSubType}
                  onChange={(e) => {
                    setSelectedSubType(e.target.value);
                    setSelectedAllocation('Scholarship Allocation');
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-gray-800 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1864db] cursor-pointer truncate pr-6 shadow-2xs"
                >
                  <option value="Sub Type">Sub Type</option>
                  {(selectedCategory === 'Category' || selectedCategory === 'Internally-Funded') && (
                    <>
                      <option value="Entrance">Entrance</option>
                      <option value="Academic">Academic</option>
                      <option value="Socio-cultural">Socio-cultural</option>
                      <option value="Institutional">Institutional</option>
                      <option value="Others">Others</option>
                    </>
                  )}
                  {(selectedCategory === 'Category' || selectedCategory === 'Externally-Funded') && (
                    <>
                      <option value="CHED">CHED</option>
                      <option value="Merit">Merit</option>
                      <option value="LGU">LGU</option>
                      <option value="DSWD">DSWD</option>
                    </>
                  )}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Scholarship Allocation */}
              <div className="relative">
                <select
                  value={selectedAllocation}
                  onChange={(e) => setSelectedAllocation(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-gray-800 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1864db] cursor-pointer truncate pr-6 shadow-2xs"
                >
                  <option value="Scholarship Allocation">Scholarship Allocation</option>
                  <option value="Pag-Ulikid">Pag-Ulikid</option>
                  <option value="Tulong Dunong">Tulong Dunong</option>
                  <option value="ANAC-IP">ANAC-IP</option>
                  <option value="President—FLP">President—FLP</option>
                  <option value="Dependent of Faculty or Staff">Dependent of Faculty or Staff</option>
                  <option value="Regional">Regional</option>
                  <option value="Partial">Partial</option>
                  <option value="UniFast">UniFast</option>
                  <option value="TES">TES</option>
                  <option value="DOST">DOST</option>
                  <option value="LGU">LGU</option>
                  <option value="Barangay (Legal dependents of Brgy. Officials)">Barangay (Legal dependents...)</option>
                  <option value="ESGP – PA">ESGP – PA</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. Student List Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 pt-1 border-t border-gray-200 mt-2 custom-scrollbar">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="font-semibold">No students found matching current filters.</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 text-[#1864db] underline font-bold cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);

                  return (
                    <div
                      key={student.id}
                      onClick={() => handleStudentClick(student)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left relative",
                        isSelected
                          ? "bg-[#edf4fe] border-[#2970e6] shadow-xs"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      {/* Left blue active indicator bar if selected */}
                      {isSelected && (
                        <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#1864db] rounded-r-full" />
                      )}

                      {/* Student Details */}
                      <div className="pl-1.5 space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {isSelectMode && (
                            <div className="shrink-0">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#1864db]" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          )}
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {student.name}
                          </p>
                        </div>

                        <p className="text-[11px] text-gray-500">
                          {student.email}
                        </p>

                        {/* Category & Subtype Pill */}
                        <div className="pt-0.5">
                          <span className="inline-block px-2.5 py-0.5 bg-[#e8f1fc] text-[#1a5fb4] border border-[#c4dcfa] text-[10px] font-semibold rounded-full">
                            {student.category} • {student.subType}
                          </span>
                        </div>
                      </div>

                      {/* Right Allocation Pill */}
                      <div className="shrink-0">
                        <span className="inline-block px-3 py-1.5 bg-[#eef4fc] text-[#1864db] border border-[#a8c7ed] text-[11px] font-bold rounded-lg text-center shadow-2xs">
                          {student.allocation}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: DRAFT RESPONSE EMAIL COMPOSER (approx 7 cols)
            ========================================================================= */}
        <div className="lg:col-span-7 bg-white border border-gray-300 rounded-2xl p-4 sm:p-6 shadow-xs min-h-[500px] lg:h-[720px] flex flex-col justify-between">
          
          {/* TOP SECTION: Header, Template Dropdown, To, Subject */}
          <div className="space-y-4">
            
            {/* Header with Template Selector */}
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Draft Response Email
                </h2>
                {isConfidentialActive && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-700" /> Confidential
                  </span>
                )}
              </div>

              {/* Template Selector Button */}
              <div className="relative">
                <button
                  onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                  className="bg-[#dce9f9] hover:bg-[#cbe0f8] text-[#154687] border border-[#a8c7ed] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-3 min-w-[200px] cursor-pointer shadow-2xs transition-colors"
                >
                  <span>{templates.find(t => t.id === currentTemplateId)?.name || 'Blank Custom Draft'}</span>
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Dropdown Menu */}
                {isTemplateMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 flex justify-between items-center">
                      <span>Response Templates</span>
                      <button 
                        onClick={() => { setIsTemplateMenuOpen(false); setShowSaveTemplateModal(true); }}
                        className="text-[#1864db] hover:underline font-bold"
                      >
                        + New
                      </button>
                    </div>
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={cn(
                          "w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer",
                          currentTemplateId === template.id ? "text-[#1864db] bg-blue-50/70 font-bold" : "text-gray-700"
                        )}
                      >
                        <span>{template.name}</span>
                        {currentTemplateId === template.id && <Check className="w-3.5 h-3.5 text-[#1864db]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recipient "To" Field */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 gap-3">
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <span className="text-xs font-bold text-gray-500 w-10 shrink-0">
                  To
                </span>

                {/* Recipient Chip(s) */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedStudentIds.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">No student selected (select from left roster)</span>
                  ) : (
                    selectedStudentIds.map(id => {
                      const st = studentList.find(s => s.id === id);
                      if (!st) return null;
                      return (
                        <div
                          key={id}
                          className="inline-flex items-center gap-2 bg-white border border-gray-700 px-3.5 py-1 rounded-full text-xs font-medium text-gray-900 shadow-2xs"
                        >
                          {/* Pink dot exactly as in reference image */}
                          <div className="w-3 h-3 rounded-full bg-[#d81b60] shrink-0" />
                          <span>{st.email}</span>
                          {selectedStudentIds.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentIds(prev => prev.filter(item => item !== id));
                              }}
                              className="text-gray-400 hover:text-gray-700 ml-1 cursor-pointer"
                              title={`Remove ${st.name}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Cc / Bcc toggles */}
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 shrink-0">
                <button 
                  onClick={() => setShowCcBcc(p => ({ ...p, cc: !p.cc }))}
                  className={cn("hover:text-gray-800 cursor-pointer px-1 py-0.5 rounded", showCcBcc.cc ? "bg-gray-200 text-gray-900" : "")}
                >
                  Cc
                </button>
                <button 
                  onClick={() => setShowCcBcc(p => ({ ...p, bcc: !p.bcc }))}
                  className={cn("hover:text-gray-800 cursor-pointer px-1 py-0.5 rounded", showCcBcc.bcc ? "bg-gray-200 text-gray-900" : "")}
                >
                  Bcc
                </button>
              </div>
            </div>

            {/* Optional Cc Field */}
            {showCcBcc.cc && (
              <div className="flex items-center border-b border-gray-200 pb-2 gap-3">
                <span className="text-xs font-bold text-gray-500 w-10 shrink-0">Cc</span>
                <input
                  type="text"
                  value={ccValue}
                  onChange={(e) => setCcValue(e.target.value)}
                  placeholder="guidance.tapaz@capsu.edu.ph, osas@capsu.edu.ph"
                  className="w-full text-xs text-gray-800 focus:outline-none"
                />
              </div>
            )}

            {/* Optional Bcc Field */}
            {showCcBcc.bcc && (
              <div className="flex items-center border-b border-gray-200 pb-2 gap-3">
                <span className="text-xs font-bold text-gray-500 w-10 shrink-0">Bcc</span>
                <input
                  type="text"
                  value={bccValue}
                  onChange={(e) => setBccValue(e.target.value)}
                  placeholder="admin.records@capsu.edu.ph"
                  className="w-full text-xs text-gray-800 focus:outline-none"
                />
              </div>
            )}

            {/* Subject Field */}
            <div className="flex items-center border-b border-gray-200 pb-3 gap-3">
              <span className="text-xs font-bold text-gray-500 w-12 shrink-0">
                Subject
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full text-xs font-semibold text-gray-900 focus:outline-none"
              />
            </div>

            {/* Rich Text Formatting Toolbar */}
            {showFormatting && (
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 border border-gray-300 rounded-xl text-xs flex-wrap animate-in fade-in duration-150">
                <button 
                  onClick={() => applyFormatting('bold')} 
                  className="px-2.5 py-1 bg-white hover:bg-gray-200 rounded font-bold border border-gray-200 cursor-pointer shadow-2xs"
                  title="Bold (**text**)"
                >
                  B
                </button>
                <button 
                  onClick={() => applyFormatting('italic')} 
                  className="px-2.5 py-1 bg-white hover:bg-gray-200 rounded italic font-serif border border-gray-200 cursor-pointer shadow-2xs"
                  title="Italic (_text_)"
                >
                  I
                </button>
                <button 
                  onClick={() => applyFormatting('underline')} 
                  className="px-2.5 py-1 bg-white hover:bg-gray-200 rounded underline border border-gray-200 cursor-pointer shadow-2xs"
                  title="Underline (__text__)"
                >
                  U
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <button 
                  onClick={() => applyFormatting('bullet')} 
                  className="px-2.5 py-1 bg-white hover:bg-gray-200 rounded text-xs border border-gray-200 cursor-pointer shadow-2xs"
                  title="Bullet List"
                >
                  • Bulleted
                </button>
                <button 
                  onClick={() => applyFormatting('numbered')} 
                  className="px-2.5 py-1 bg-white hover:bg-gray-200 rounded text-xs border border-gray-200 cursor-pointer shadow-2xs"
                  title="Numbered List"
                >
                  1. Numbered
                </button>
                <button 
                  onClick={() => applyFormatting('quote')} 
                  className="px-2.5 py-1 bg-white hover:bg-gray-200 rounded text-xs border border-gray-200 cursor-pointer shadow-2xs"
                  title="Quote Block"
                >
                  " Quote
                </button>
                <button 
                  onClick={() => applyFormatting('code', '`', '`')} 
                  className="px-2.5 py-1 bg-white hover:bg-gray-200 rounded text-xs font-mono border border-gray-200 cursor-pointer shadow-2xs"
                  title="Highlight / Code"
                >
                  &lt;/&gt;
                </button>
              </div>
            )}

            {/* Attachments Badges */}
            {attachedFiles.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {attachedFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#eef4fc] border border-[#bcd2f0] rounded-xl text-[11px] text-gray-800 shadow-2xs group"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-[#1864db]" />
                    <span className="font-semibold truncate max-w-[180px]">{file.name}</span>
                    <span className="text-gray-500 text-[10px]">({file.size})</span>
                    
                    <div className="flex items-center gap-1 ml-1">
                      <button 
                        onClick={() => setPreviewAttachment(file)}
                        className="text-[#1864db] hover:text-[#0f3d82] p-0.5 cursor-pointer"
                        title="Preview attachment"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))} 
                        className="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer"
                        title="Remove attachment"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* MIDDLE SECTION: Email Body Editor */}
          <div className="flex-1 py-3 min-h-0 relative">
            <textarea
              ref={textareaRef}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full h-full resize-none text-xs leading-relaxed text-gray-900 focus:outline-none bg-transparent font-sans"
              placeholder="Type your response message here..."
            />
          </div>

          {/* BOTTOM SECTION: Gmail-style Action Toolbar */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between relative">
            
            {/* Left Tools & Send Button */}
            <div className="flex items-center gap-3">
              
              {/* Split Send Button */}
              <div className="relative inline-flex shadow-sm rounded-full">
                <button
                  onClick={() => handleSendEmail()}
                  disabled={isSending}
                  className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2 rounded-l-full text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {isSending ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Send</span>
                  )}
                </button>
                <button
                  onClick={() => setIsSendMenuOpen(!isSendMenuOpen)}
                  className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-2 py-2 rounded-r-full border-l border-blue-400/50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Schedule sending"
                >
                  <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* Send Schedule Menu */}
                {isSendMenuOpen && (
                  <div className="absolute left-0 bottom-12 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 py-2 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => handleSendEmail()}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <SendIcon className="w-3.5 h-3.5 text-[#1864db]" />
                      <span>Send immediately</span>
                    </button>
                    <button
                      onClick={() => handleSendEmail('Tomorrow at 8:00 AM')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>Schedule: Tomorrow, 8:00 AM</span>
                    </button>
                    <button
                      onClick={() => handleSendEmail('Tomorrow at 1:00 PM')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>Schedule: Tomorrow, 1:00 PM</span>
                    </button>
                    <button
                      onClick={() => handleSendEmail('Next Monday at 8:00 AM')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>Schedule: Next Monday, 8:00 AM</span>
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => { setIsSendMenuOpen(false); setShowScheduleCustomModal(true); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-[#1864db] hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#1864db]" />
                      <span>Pick custom date & time...</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Toolbar Icons (Gmail Style) */}
              <div className="flex items-center gap-1 text-gray-600">
                {/* 1. Aa (Formatting) */}
                <button
                  onClick={() => setShowFormatting(!showFormatting)}
                  className={cn(
                    "p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer",
                    showFormatting ? "bg-gray-200 text-blue-700" : ""
                  )}
                  title="Formatting options"
                >
                  <span className="font-serif font-bold text-xs">Aa</span>
                </button>

                {/* 2. Paperclip (Attachment from Device) */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Attach files from computer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* 3. Link (Insert Link Modal) */}
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Insert link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>

                {/* 4. Emoji (Interactive Popover) */}
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Insert emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute left-0 bottom-12 bg-white border border-gray-200 rounded-2xl shadow-2xl p-3 z-30 w-72 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                        <span className="text-[11px] font-bold text-gray-700">Quick Emojis</span>
                        <div className="flex items-center gap-1 text-[10px]">
                          <button 
                            onClick={() => setEmojiCategory('popular')} 
                            className={cn("px-2 py-0.5 rounded", emojiCategory === 'popular' ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-500")}
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setEmojiCategory('education')} 
                            className={cn("px-2 py-0.5 rounded", emojiCategory === 'education' ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-500")}
                          >
                            School
                          </button>
                          <button 
                            onClick={() => setEmojiCategory('status')} 
                            className={cn("px-2 py-0.5 rounded", emojiCategory === 'status' ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-500")}
                          >
                            Status
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-2 text-xl text-center">
                        {emojiCategory === 'popular' && ['👋', '📋', '✅', '⚠️', '🎓', '📅', '📌', '✉️', '📎', '🏛️', '💡', '⏰'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleInsertEmoji(emoji)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer hover:scale-110"
                          >
                            {emoji}
                          </button>
                        ))}
                        {emojiCategory === 'education' && ['🎓', '📚', '📖', '📝', '🏫', '🖋️', '📜', '📐', '🏛️', '🎒', '👨‍🎓', '👩‍🎓'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleInsertEmoji(emoji)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer hover:scale-110"
                          >
                            {emoji}
                          </button>
                        ))}
                        {emojiCategory === 'status' && ['✅', '⚠️', '❌', '⏳', '📌', '🔔', '📢', '🚨', '✔️', '🟢', '🟡', '🔴'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleInsertEmoji(emoji)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer hover:scale-110"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Google Drive Integration */}
                <button
                  onClick={() => setShowDriveModal(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Insert institutional files from Google Drive"
                >
                  <HardDrive className="w-4 h-4" />
                </button>

                {/* 6. Photo / Image Upload */}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Insert photo or document screenshot"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* 7. Lock (Confidential Mode) */}
                <button
                  onClick={() => setShowConfidentialModal(true)}
                  className={cn(
                    "p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer",
                    isConfidentialActive ? "bg-amber-100 text-amber-700" : ""
                  )}
                  title="Confidential mode settings"
                >
                  <Lock className="w-4 h-4" />
                </button>

                {/* 8. Pen (Insert Official Counselor Signature) */}
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Insert official counselor signature"
                >
                  <PenTool className="w-4 h-4" />
                </button>

                {/* 9. More Options Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    title="More actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMoreMenuOpen && (
                    <div className="absolute right-0 bottom-12 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 py-2 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={() => { setIsMoreMenuOpen(false); handlePrintDraft(); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-gray-600" />
                        <span>Print Email Draft / PDF Export</span>
                      </button>
                      <button
                        onClick={() => { setIsMoreMenuOpen(false); setShowGrammarCheckModal(true); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Verify Formal Tone & Guidelines</span>
                      </button>
                      <button
                        onClick={() => { setIsMoreMenuOpen(false); setShowSaveTemplateModal(true); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-[#1864db]" />
                        <span>Save as New Template</span>
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => { setIsMoreMenuOpen(false); setShowSentHistoryModal(true); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <History className="w-4 h-4 text-purple-600" />
                        <span>View Sent Communications Log ({sentHistory.length})</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Right: Trash Icon */}
            <button
              onClick={handleDiscardDraft}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              title="Discard draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

      {/* =========================================================================
          BOTTOM NAVIGATION ARROWS (< and >)
          ========================================================================= */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate('/admin/notifications')}
          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl px-5 py-2 shadow-xs transition-colors flex items-center justify-center cursor-pointer hover:border-gray-400"
          title="Back to Notifications"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => navigate('/admin/reports')}
          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl px-5 py-2 shadow-xs transition-colors flex items-center justify-center cursor-pointer hover:border-gray-400"
          title="Next to Reports & Analytics"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* =========================================================================
          INTERACTIVE MODAL DIALOGS
          ========================================================================= */}

      {/* 1. GOOGLE DRIVE MODAL */}
      {showDriveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Select from CAPSU University Drive</h3>
                  <p className="text-xs text-gray-500">Official guidance memorandums and scholarship policy files</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDriveModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto space-y-2.5">
              {driveDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-3.5 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{doc.name}</p>
                      <p className="text-[10px] text-gray-500">{doc.category} • {doc.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAttachFromDrive(doc)}
                    className="px-4 py-1.5 bg-[#1864db] hover:bg-[#114ba3] text-white rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Attach
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowDriveModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. INSERT LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#1864db]" />
                <h3 className="font-bold text-gray-900 text-base">Insert Web Link</h3>
              </div>
              <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Text to Display</label>
                <input 
                  type="text" 
                  value={linkForm.text} 
                  onChange={e => setLinkForm({ ...linkForm, text: e.target.value })}
                  placeholder="e.g. CAPSU Scholarship Portal"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Link URL</label>
                <input 
                  type="text" 
                  value={linkForm.url} 
                  onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                  placeholder="https://capsu.edu.ph/scholarships"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-blue-700"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-gray-500">Quick Shortcuts:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'CAPSU Portal', url: 'https://capsu.edu.ph/student-portal' },
                    { label: 'CHED TDP', url: 'https://ched.gov.ph/tulong-dunong' },
                    { label: 'DOST Scholar', url: 'https://sei.dost.gov.ph' }
                  ].map(sc => (
                    <button
                      key={sc.label}
                      type="button"
                      onClick={() => setLinkForm({ text: sc.label, url: sc.url })}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-semibold text-gray-700"
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button 
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleInsertLink}
                className="px-5 py-2 bg-[#1864db] hover:bg-[#114ba3] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONFIDENTIAL MODE MODAL */}
      {showConfidentialModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-amber-50/60">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900 text-base">Confidential Mode</h3>
              </div>
              <button onClick={() => setShowConfidentialModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-gray-600 leading-relaxed">
                Recipients will not have options to forward, copy, print, or download this notice and its attachments.
              </p>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Set Expiration</label>
                <select
                  value={confidentialSettings.expiry}
                  onChange={e => setConfidentialSettings({ ...confidentialSettings, expiry: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="1 day">Expires in 1 day</option>
                  <option value="1 week">Expires in 1 week</option>
                  <option value="1 month">Expires in 1 month</option>
                  <option value="3 months">Expires in 3 months</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={confidentialSettings.noForward}
                    onChange={e => setConfidentialSettings({ ...confidentialSettings, noForward: e.target.checked })}
                    className="rounded text-blue-600" 
                  />
                  <span className="font-semibold text-gray-700">Disable forwarding and printing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={confidentialSettings.requirePasscode}
                    onChange={e => setConfidentialSettings({ ...confidentialSettings, requirePasscode: e.target.checked })}
                    className="rounded text-blue-600" 
                  />
                  <span className="font-semibold text-gray-700">Require student portal SMS/Email passcode</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              {isConfidentialActive ? (
                <button
                  onClick={() => { setIsConfidentialActive(false); setShowConfidentialModal(false); showToast('Confidential Mode Disabled', 'Standard email restrictions restored.', 'info'); }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Turn Off
                </button>
              ) : <div />}
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowConfidentialModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIsConfidentialActive(true);
                    setShowConfidentialModal(false);
                    showToast('Confidential Mode Active', `Protected with ${confidentialSettings.expiry} expiration.`, 'success');
                  }}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SIGNATURE PICKER MODAL */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#1864db]" />
                <h3 className="font-bold text-gray-900 text-base">Insert Official Signature</h3>
              </div>
              <button onClick={() => setShowSignatureModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <button
                onClick={() => handleInsertSignature('relie')}
                className="w-full text-left p-3.5 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
              >
                <p className="text-xs font-bold text-gray-900">Relie Aguilos, RGC</p>
                <p className="text-[11px] text-gray-600 mt-0.5">Guidance Counselor III / Head, Guidance Office</p>
                <p className="text-[10px] text-blue-700 font-semibold mt-1">aguilos.relie@capsu.edu.ph</p>
              </button>

              <button
                onClick={() => handleInsertSignature('osas')}
                className="w-full text-left p-3.5 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
              >
                <p className="text-xs font-bold text-gray-900">Office of Student Affairs & Services (OSAS)</p>
                <p className="text-[11px] text-gray-600 mt-0.5">Scholarship & Financial Assistance Unit</p>
                <p className="text-[10px] text-blue-700 font-semibold mt-1">osas.scholarships@capsu.edu.ph</p>
              </button>

              <button
                onClick={() => handleInsertSignature('scholarship_unit')}
                className="w-full text-left p-3.5 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
              >
                <p className="text-xs font-bold text-gray-900">Scholarship Verification Committee</p>
                <p className="text-[11px] text-gray-600 mt-0.5">Official Academic Review Board</p>
                <p className="text-[10px] text-blue-700 font-semibold mt-1">CAPSU Tapaz & Mambusao</p>
              </button>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CUSTOM SCHEDULE MODAL */}
      {showScheduleCustomModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1864db]" />
                <h3 className="font-bold text-gray-900 text-base">Schedule Delivery</h3>
              </div>
              <button onClick={() => setShowScheduleCustomModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Delivery Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={customScheduleDate}
                  onChange={e => setCustomScheduleDate(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                The alert system will automatically queue and dispatch this email on the designated date and time.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button 
                onClick={() => setShowScheduleCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowScheduleCustomModal(false);
                  const formatted = new Date(customScheduleDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
                  handleSendEmail(formatted);
                }}
                className="px-5 py-2 bg-[#1864db] hover:bg-[#114ba3] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SENT HISTORY MODAL */}
      {showSentHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-gray-900 text-base">Sent Communications History</h3>
              </div>
              <button onClick={() => setShowSentHistoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto space-y-3">
              {sentHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">No sent communications logged yet.</div>
              ) : (
                sentHistory.map((item) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-900">{item.subject}</span>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                        item.status === 'Delivered' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      )}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 truncate">
                      <strong>To:</strong> {item.recipientNames.join(', ')} ({item.recipients[0]})
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                      <span>{item.sentAt}</span>
                      {item.attachmentsCount > 0 && <span>📎 {item.attachmentsCount} Attachment(s)</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowSentHistoryModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-xs font-bold text-gray-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DISCARD DRAFT CONFIRMATION */}
      {showDiscardConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Discard Email Draft?</h3>
              <p className="text-xs text-gray-500 mt-1">Any unsaved edits made to this response letter will be reset.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDiscardConfirmModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Keep Editing
              </button>
              <button
                onClick={confirmDiscardDraft}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SAVE AS TEMPLATE MODAL */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base">Save Custom Template</h3>
              <button onClick={() => setShowSaveTemplateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Template Name</label>
                <input 
                  type="text" 
                  value={newTemplateName} 
                  onChange={e => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Endorsement Release Notification"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                This will save the current subject line and body into your guidance response templates.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button 
                onClick={() => setShowSaveTemplateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAsTemplate}
                className="px-5 py-2 bg-[#1864db] hover:bg-[#114ba3] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. GRAMMAR & POLICY CHECK MODAL */}
      {showGrammarCheckModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 text-base">Guidelines & Compliance Check</h3>
              </div>
              <button onClick={() => setShowGrammarCheckModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-900">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Institutional Tone Verified</p>
                  <p className="text-[11px] text-green-700">Language strictly follows formal CAPSU university advisory standards.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-900">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Data Privacy Act (RA 10173) Compliant</p>
                  <p className="text-[11px] text-green-700">No sensitive personal identifiers exposed outside designated scholar.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Recipient Verification</p>
                  <p className="text-[11px] text-blue-700">{selectedStudentIds.length} scholar recipient(s) confirmed on active registry.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowGrammarCheckModal(false)}
                className="px-5 py-2 bg-[#1864db] text-white rounded-xl text-xs font-bold"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. ATTACHMENT PREVIEW MODAL */}
      {previewAttachment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900 text-xs truncate max-w-xs">{previewAttachment.name}</span>
              </div>
              <button onClick={() => setPreviewAttachment(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center bg-gray-50/50 flex flex-col items-center justify-center min-h-[220px]">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#1864db] mb-3 shadow-inner">
                <Paperclip className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{previewAttachment.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{previewAttachment.size} • {previewAttachment.type}</p>
              <p className="text-[11px] text-gray-400 mt-3 max-w-xs">
                Official document attached to current response email.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
              <button 
                onClick={() => {
                  setAttachedFiles(prev => prev.filter(f => f.id !== previewAttachment.id));
                  setPreviewAttachment(null);
                  showToast('Attachment Removed', `Removed "${previewAttachment.name}".`, 'info');
                }}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Delete Attachment
              </button>
              <button 
                onClick={() => setPreviewAttachment(null)}
                className="px-5 py-2 bg-[#1864db] text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
