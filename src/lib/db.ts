import localforage from 'localforage';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { firestoreDb, auth } from './firebase';
import { Course, AcademicYear, defaultCourses, defaultAcademicYears, defaultScholarships, ScholarshipItem } from '../types';
import { INITIAL_SCHOLARSHIP_CATEGORIES } from './scholarshipCategories';
import { defaultSubmissions, defaultNotifications, dummyBase64Pdf, dummyBase64Photo2x2, dummyBase64StudentId, dummyBase64Signature } from './defaultData';
import { parseNotificationDate } from './utils';
import { getSupabase, subscribeToSyncChannel, broadcastSyncEvent, safeSupabase, getClientId } from './supabase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export let isFirestoreQuotaExceeded = false;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (errorMessage.includes('Quota limit exceeded') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota') || errorMessage.includes('429')) {
    isFirestoreQuotaExceeded = true;
  }
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  if (errorMessage.includes('offline') || isFirestoreQuotaExceeded) {
    console.warn('Firestore Warning (Offline/Quota): ', path);
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }
  return errInfo;
}

export type Scholarship = ScholarshipItem;

export interface User {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  password?: string;
  role: 'student' | 'admin';
}

export interface ScholarshipForm {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Active' | 'Draft' | 'Closed';
  fields: { id: string; label: string; type: string; required: boolean }[];
  documents: { id: string; label: string; description: string; required: boolean }[];
  createdAt: string;
}

export interface SubmissionFile {
  id?: string;
  name: string;
  type: string;
  size?: string;
  category?: string; // e.g. "Certificate of Grades (COG)", "Certificate of Registration (COR)", etc.
  data: string; // base64 or data url
  uploadedAt?: string;
  verified?: boolean;
  status?: 'Verified' | 'Pending' | 'Missing' | 'Rejected';
  remarks?: string;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  scholarshipType: string;
  formId?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Complete' | 'Incomplete';
  submittedAt: string;
  answers?: Record<string, any>;
  data?: any;
  files: SubmissionFile[];
  studentAuthId?: string;
}

export interface Section {
  id: string;
  name: string;
  course?: string;
  yearLevel?: string;
  status?: 'Active' | 'Inactive';
}

export interface FormRequirement {
  id: string;
  title: string;
  description?: string;
  mandatory: 'Required' | 'Optional';
  status: 'Active' | 'Inactive';
}

export interface SystemFile {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  data?: string;
  type?: string;
}

export interface NotificationItem {
  id: string;
  type: 'submission' | 'deadline' | 'system' | 'inquiry';
  title: string;
  description: string;
  studentName?: string;
  studentId?: string;
  scholarship?: string;
  timestamp: string;
  createdAt?: string;
  read: boolean;
  priority: 'high' | 'normal' | 'low';
  submissionId?: string;
}

export interface CommunicationItem {
  id: string;
  recipients: string[];
  subject: string;
  message: string;
  sender?: string;
  sentAt: string;
  attachments?: { name: string; size?: string; type?: string; data?: string }[];
}

// Helper to prevent "Database is closing/hidden" errors during HMR
const getDb = (name: string) => {
  const global = globalThis as any;
  if (!global[name]) {
    global[name] = localforage.createInstance({ name });
  }
  return global[name];
};

// Local storage stores for instant retrieval & offline support
const scholarshipsDb = getDb('scholarship-app-scholarships');
const coursesDb = getDb('scholarship-app-courses');
const academicYearsDb = getDb('scholarship-app-academicYears');
const sectionsDb = getDb('scholarship-app-sections');
const formReqsDb = getDb('scholarship-app-formRequirements');
const systemFilesDb = getDb('scholarship-app-files');
const usersDb = getDb('scholarship-app-users');
const submissionsDb = getDb('scholarship-app-submissions');
const formsDb = getDb('scholarship-app-forms');
const notificationsDb = getDb('scholarship-app-notifications');
const communicationsDb = getDb('scholarship-app-communications');

// Default records
export const defaultSections: Section[] = [
  { id: 'sec-1', name: 'A' },
  { id: 'sec-2', name: 'B' },
  { id: 'sec-3', name: 'C' },
  { id: 'sec-4', name: 'D' },
];

export const defaultFormRequirements: FormRequirement[] = [
  { id: 'req-1', title: 'Certificate of Grades (COG)', description: 'Signed official registrar grade copy with GWA', mandatory: 'Required', status: 'Active' },
  { id: 'req-2', title: 'Certificate of Registration (COR)', description: 'Current semester enrollment document & assessment form', mandatory: 'Required', status: 'Active' },
  { id: 'req-3', title: 'Proof of Income / Certificate of Indigency', description: 'Parental ITR or Barangay Certificate of Low Income', mandatory: 'Required', status: 'Active' },
  { id: 'req-4', title: 'Certificate of Good Moral Character', description: 'Issued by Student Affairs Services / Guidance Office', mandatory: 'Optional', status: 'Active' },
  { id: 'req-5', title: '2x2 Recent Formal ID Photo', description: 'White background with applicant name tag', mandatory: 'Required', status: 'Active' },
];

export const defaultSystemFiles: SystemFile[] = [
  { id: 'file-1', name: 'CHED_TDP_Application_Form_2026.jpg', category: 'Scholarship Application', size: '1.4 MB', uploadDate: 'March 01, 2026' },
  { id: 'file-2', name: 'CAPSU_Scholarship_Guidelines_v2.jpg', category: 'Guidelines & Policies', size: '2.8 MB', uploadDate: 'February 15, 2026' },
  { id: 'file-3', name: 'Certificate_of_Indigency_Template.png', category: 'Document Template', size: '450 KB', uploadDate: 'January 20, 2026' },
];

// Helper to sanitize undefined values for Firestore and guard against 1MB document limit
function cleanForFirestore(obj: any, currentDepth = 0): any {
  if (currentDepth > 10) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => cleanForFirestore(item, currentDepth + 1));
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      // If a file data string is excessively huge (> 750KB), safeguard so Firestore 1MB document limit is not exceeded
      if (key === 'data' && typeof obj[key] === 'string' && obj[key].length > 750000) {
        result[key] = ''; // Safe fallback for Firestore while retaining complete file in local database
      } else {
        result[key] = cleanForFirestore(obj[key], currentDepth + 1);
      }
    }
  }
  return result;
}

// -------------------------------------------------------------
// High-Performance In-Memory Cache & Event Notification Layer
// -------------------------------------------------------------
export function normalizeYearLevel(yl: string | undefined | null): string {
  if (!yl) return '1st Year';
  const s = String(yl).trim().toLowerCase();
  if (s.includes('1') || s.includes('first')) return '1st Year';
  if (s.includes('2') || s.includes('second')) return '2nd Year';
  if (s.includes('3') || s.includes('third')) return '3rd Year';
  if (s.includes('4') || s.includes('fourth')) return '4th Year';
  return String(yl);
}

let memorySubmissions: Submission[] = defaultSubmissions.map(s => ({
  ...s,
  data: {
    ...(s.data || {}),
    yearLevel: normalizeYearLevel(s.data?.yearLevel)
  }
}));
let memoryScholarships: Scholarship[] = [...defaultScholarships];
let memoryCourses: Course[] = [...defaultCourses];
let memoryAcademicYears: AcademicYear[] = [...defaultAcademicYears];
let memorySections: Section[] = [...defaultSections];
let memoryFormRequirements: FormRequirement[] = [...defaultFormRequirements];
let memoryFiles: SystemFile[] = [...defaultSystemFiles];
let memoryNotifications: NotificationItem[] = [...defaultNotifications];
let memoryCommunications: CommunicationItem[] = [];
function getInitialCategories(): any[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('capsu_scholarship_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return [...INITIAL_SCHOLARSHIP_CATEGORIES];
}

let memoryCategories: any[] = getInitialCategories();

export function deduplicateAcademicYears(ays: AcademicYear[]): AcademicYear[] {
  if (!Array.isArray(ays)) return [];
  const map = new Map<string, AcademicYear>();
  for (const ay of ays) {
    if (!ay || !ay.year) continue;
    const yearKey = (ay.year || '').trim();
    if (!yearKey) continue;
    const canonicalId = `ay-${yearKey.replace(/\s+/g, '-')}`;
    const normalized: AcademicYear = {
      ...ay,
      id: canonicalId,
      year: yearKey,
      label: ay.label || `A.Y. ${yearKey}`,
      overallStatus: ay.overallStatus || 'Inactive',
      firstSemester: ay.firstSemester || 'Active',
      secondSemester: ay.secondSemester || 'Inactive',
      updatedAt: ay.updatedAt || new Date().toISOString()
    };
    if (!map.has(yearKey)) {
      map.set(yearKey, normalized);
    } else {
      const existing = map.get(yearKey)!;
      const t1 = normalized.updatedAt ? new Date(normalized.updatedAt).getTime() : 0;
      const t2 = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
      if (normalized.overallStatus === 'Active' || t1 >= t2) {
        map.set(yearKey, normalized);
      }
    }
  }
  const result = Array.from(map.values()).sort((a, b) => b.year.localeCompare(a.year));
  let activeSeen = false;
  return result.map(item => {
    if (item.overallStatus === 'Active') {
      if (!activeSeen) {
        activeSeen = true;
        return item;
      }
      return { ...item, overallStatus: 'Inactive' as const };
    }
    return item;
  });
}

export function deduplicateCourses(courses: Course[]): Course[] {
  if (!Array.isArray(courses)) return [];
  const map = new Map<string, Course>();
  for (const c of courses) {
    if (!c || !c.code) continue;
    const codeKey = (c.code || '').trim().toUpperCase();
    if (!codeKey) continue;
    const canonicalId = `course-${codeKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const normalized: Course = {
      ...c,
      id: canonicalId,
      code: codeKey,
      name: (c.name || '').trim(),
      department: (c.department || '').trim(),
      status: c.status || 'Active'
    };
    if (!map.has(codeKey)) {
      map.set(codeKey, normalized);
    } else {
      const existing = map.get(codeKey)!;
      if (normalized.name.length > existing.name.length) {
        map.set(codeKey, normalized);
      }
    }
  }
  return Array.from(map.values());
}

export function deduplicateSections(sections: Section[]): Section[] {
  if (!Array.isArray(sections)) return [];
  const map = new Map<string, Section>();
  for (const s of sections) {
    if (!s || !s.name) continue;
    const nameKey = (s.name || '').trim().toUpperCase();
    if (!nameKey || !/^[A-Z]+$/.test(nameKey)) continue;
    const canonicalId = `sec-${nameKey.toLowerCase()}`;
    const normalized: Section = {
      ...s,
      id: canonicalId,
      name: nameKey
    };
    if (!map.has(nameKey)) {
      map.set(nameKey, normalized);
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Listeners
const submissionListeners = new Set<(subs: Submission[]) => void>();
const notificationListeners = new Set<(notifs: NotificationItem[]) => void>();
const scholarshipListeners = new Set<(items: Scholarship[]) => void>();
const academicYearListeners = new Set<(ays: AcademicYear[]) => void>();
const courseListeners = new Set<(courses: Course[]) => void>();
const sectionListeners = new Set<(sections: Section[]) => void>();
const categoryListeners = new Set<(categories: any[]) => void>();

// Local notification helpers (notifies UI listeners without bouncing back to channels)
function notifyLocalAcademicYearListeners() {
  memoryAcademicYears = deduplicateAcademicYears(memoryAcademicYears);
  academicYearListeners.forEach(cb => {
    try { cb([...memoryAcademicYears]); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('academic_years_updated'));
  }
}

function notifyLocalCourseListeners() {
  memoryCourses = deduplicateCourses(memoryCourses);
  courseListeners.forEach(cb => {
    try { cb([...memoryCourses]); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('courses_updated'));
  }
}

function notifyLocalSectionListeners() {
  memorySections = deduplicateSections(memorySections);
  sectionListeners.forEach(cb => {
    try { cb([...memorySections]); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sections_updated'));
  }
}

function notifyLocalCategoryListeners(cats?: any[]) {
  const list = cats || memoryCategories;
  categoryListeners.forEach(cb => {
    try { cb(list); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('capsu_scholarship_categories', JSON.stringify(list));
    } catch (e) {}
    window.dispatchEvent(new Event('scholarship_categories_updated'));
  }
}

function notifyLocalSubmissionListeners() {
  submissionListeners.forEach(cb => {
    try { cb([...memorySubmissions]); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('submissions_updated'));
  }
}

function notifyLocalScholarshipListeners() {
  scholarshipListeners.forEach(cb => {
    try { cb([...memoryScholarships]); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    (window as any).__db_scholarships_cache__ = memoryScholarships;
    try {
      localStorage.setItem('capsu_db_scholarships_cache', JSON.stringify(memoryScholarships));
    } catch (e) {}
    window.dispatchEvent(new Event('scholarships_updated'));
    window.dispatchEvent(new Event('scholarship_categories_updated'));
  }
}

function sortNotifications(notifs: NotificationItem[]): NotificationItem[] {
  if (!Array.isArray(notifs)) return [];
  return [...notifs].filter(Boolean).sort((a, b) => {
    if (!a || !b) return 0;
    const dateA = parseNotificationDate(a.timestamp, a.createdAt || a.id);
    const dateB = parseNotificationDate(b.timestamp, b.createdAt || b.id);
    const timeA = dateA ? dateA.getTime() : 0;
    const timeB = dateB ? dateB.getTime() : 0;
    return timeB - timeA;
  });
}

function notifyLocalNotificationListeners() {
  notificationListeners.forEach(cb => {
    try { cb([...memoryNotifications]); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('notifications_updated'));
  }
}

// Browser cross-tab synchronization channel
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('capsu_scholarship_sync_bus')
  : null;

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    try {
      const { type, data, senderId } = event.data || {};
      if (senderId && senderId === getClientId()) return;

      if (type === 'SUBMISSIONS_SYNC' && Array.isArray(data)) {
        const subMap = new Map<string, Submission>();
        memorySubmissions.forEach(s => subMap.set(s.id, s));
        data.forEach((s: Submission) => subMap.set(s.id, s));
        memorySubmissions = Array.from(subMap.values()).sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        data.forEach((s: Submission) => submissionsDb.setItem(s.id, s).catch(() => {}));
        notifyLocalSubmissionListeners();
      } else if (type === 'NOTIFICATIONS_SYNC' && Array.isArray(data)) {
        memoryNotifications = sortNotifications(data);
        data.forEach((n: NotificationItem) => notificationsDb.setItem(n.id, n).catch(() => {}));
        notifyLocalNotificationListeners();
      } else if (type === 'SCHOLARSHIPS_SYNC' && Array.isArray(data)) {
        memoryScholarships = data;
        data.forEach((s: Scholarship) => scholarshipsDb.setItem(s.id, s).catch(() => {}));
        notifyLocalScholarshipListeners();
      } else if (type === 'ACADEMIC_YEARS_SYNC' && Array.isArray(data)) {
        memoryAcademicYears = deduplicateAcademicYears(data);
        memoryAcademicYears.forEach((ay: AcademicYear) => academicYearsDb.setItem(ay.id, ay).catch(() => {}));
        notifyLocalAcademicYearListeners();
      } else if (type === 'COURSES_SYNC' && Array.isArray(data)) {
        memoryCourses = deduplicateCourses(data);
        memoryCourses.forEach((c: Course) => coursesDb.setItem(c.id, c).catch(() => {}));
        notifyLocalCourseListeners();
      } else if (type === 'SECTIONS_SYNC' && Array.isArray(data)) {
        memorySections = deduplicateSections(data);
        memorySections.forEach((s: Section) => sectionsDb.setItem(s.id, s).catch(() => {}));
        notifyLocalSectionListeners();
      } else if (type === 'CATEGORIES_SYNC' && Array.isArray(data)) {
        memoryCategories = data;
        notifyLocalCategoryListeners(data);
      }
    } catch (err) {
      console.warn("Cross-tab sync handling error:", err);
    }
  };
}

// Multi-Device Supabase Realtime synchronization channel (Cross-device WebSocket)
if (typeof window !== 'undefined') {
  try {
    subscribeToSyncChannel((type: string, data: any) => {
      try {
        if (type === 'ACADEMIC_YEARS_SYNC' && Array.isArray(data)) {
          const deduped = deduplicateAcademicYears(data);
          memoryAcademicYears = deduped;
          deduped.forEach((ay: AcademicYear) => academicYearsDb.setItem(ay.id, ay).catch(() => {}));
          notifyLocalAcademicYearListeners();
        } else if (type === 'COURSES_SYNC' && Array.isArray(data)) {
          const deduped = deduplicateCourses(data);
          memoryCourses = deduped;
          deduped.forEach((c: Course) => coursesDb.setItem(c.id, c).catch(() => {}));
          notifyLocalCourseListeners();
        } else if (type === 'SECTIONS_SYNC' && Array.isArray(data)) {
          const deduped = deduplicateSections(data);
          memorySections = deduped;
          deduped.forEach((s: Section) => sectionsDb.setItem(s.id, s).catch(() => {}));
          notifyLocalSectionListeners();
        } else if (type === 'SCHOLARSHIPS_SYNC' && Array.isArray(data)) {
          memoryScholarships = data;
          data.forEach((s: Scholarship) => scholarshipsDb.setItem(s.id, s).catch(() => {}));
          notifyLocalScholarshipListeners();
        } else if (type === 'CATEGORIES_SYNC' && Array.isArray(data)) {
          memoryCategories = data;
          notifyLocalCategoryListeners(data);
        } else if (type === 'SUBMISSIONS_SYNC' && Array.isArray(data)) {
          const subMap = new Map<string, Submission>();
          memorySubmissions.forEach(s => subMap.set(s.id, s));
          data.forEach((s: Submission) => subMap.set(s.id, s));
          memorySubmissions = Array.from(subMap.values()).sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          data.forEach((s: Submission) => submissionsDb.setItem(s.id, s).catch(() => {}));
          notifyLocalSubmissionListeners();
        }
      } catch (err) {
        console.warn("Supabase Realtime event processing error:", err);
      }
    });
  } catch (err) {
    console.warn("Supabase Realtime sync init error:", err);
  }
}

// Multi-Device Server-Sent Events (SSE) synchronization channel
if (typeof window !== 'undefined' && 'EventSource' in window) {
  let sseSource: EventSource | null = null;
  const initSSE = () => {
    try {
      if (sseSource) sseSource.close();
      sseSource = new EventSource('/api/sync/events');
      sseSource.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          if (type === 'INIT') {
            if (Array.isArray(data?.academicYears) && data.academicYears.length > 0) {
              const deduped = deduplicateAcademicYears(data.academicYears);
              memoryAcademicYears = deduped;
              deduped.forEach((ay: AcademicYear) => academicYearsDb.setItem(ay.id, ay).catch(() => {}));
              notifyLocalAcademicYearListeners();
            }
            if (Array.isArray(data?.courses) && data.courses.length > 0) {
              const deduped = deduplicateCourses(data.courses);
              memoryCourses = deduped;
              deduped.forEach((c: Course) => coursesDb.setItem(c.id, c).catch(() => {}));
              notifyLocalCourseListeners();
            }
            if (Array.isArray(data?.sections) && data.sections.length > 0) {
              const deduped = deduplicateSections(data.sections);
              memorySections = deduped;
              deduped.forEach((s: Section) => sectionsDb.setItem(s.id, s).catch(() => {}));
              notifyLocalSectionListeners();
            }
            if (Array.isArray(data?.scholarships) && data.scholarships.length > 0) {
              memoryScholarships = data.scholarships;
              data.scholarships.forEach((s: Scholarship) => scholarshipsDb.setItem(s.id, s).catch(() => {}));
              notifyLocalScholarshipListeners();
            }
            if (Array.isArray(data?.categories) && data.categories.length > 0) {
              memoryCategories = data.categories;
              notifyLocalCategoryListeners(data.categories);
            }
          } else if (type === 'ACADEMIC_YEARS_SYNC' && Array.isArray(data)) {
            const deduped = deduplicateAcademicYears(data);
            memoryAcademicYears = deduped;
            deduped.forEach((ay: AcademicYear) => academicYearsDb.setItem(ay.id, ay).catch(() => {}));
            notifyLocalAcademicYearListeners();
          } else if (type === 'COURSES_SYNC' && Array.isArray(data)) {
            const deduped = deduplicateCourses(data);
            memoryCourses = deduped;
            deduped.forEach((c: Course) => coursesDb.setItem(c.id, c).catch(() => {}));
            notifyLocalCourseListeners();
          } else if (type === 'SECTIONS_SYNC' && Array.isArray(data)) {
            const deduped = deduplicateSections(data);
            memorySections = deduped;
            deduped.forEach((s: Section) => sectionsDb.setItem(s.id, s).catch(() => {}));
            notifyLocalSectionListeners();
          } else if (type === 'SCHOLARSHIPS_SYNC' && Array.isArray(data)) {
            memoryScholarships = data;
            data.forEach((s: Scholarship) => scholarshipsDb.setItem(s.id, s).catch(() => {}));
            notifyLocalScholarshipListeners();
          } else if (type === 'CATEGORIES_SYNC' && Array.isArray(data)) {
            memoryCategories = data;
            notifyLocalCategoryListeners(data);
          } else if (type === 'SUBMISSIONS_SYNC' && Array.isArray(data)) {
            const subMap = new Map<string, Submission>();
            memorySubmissions.forEach(s => subMap.set(s.id, s));
            data.forEach((s: Submission) => subMap.set(s.id, s));
            memorySubmissions = Array.from(subMap.values()).sort(
              (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
            data.forEach((s: Submission) => submissionsDb.setItem(s.id, s).catch(() => {}));
            notifyLocalSubmissionListeners();
          }
        } catch (err) {
          console.warn("SSE parse error:", err);
        }
      };
      sseSource.onerror = () => {
        if (sseSource?.readyState === EventSource.CLOSED) {
          setTimeout(initSSE, 5000);
        }
      };
    } catch (e) {
      console.warn("SSE init notice:", e);
    }
  };
  initSSE();
}

function notifyAcademicYearListeners() {
  notifyLocalAcademicYearListeners();
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'ACADEMIC_YEARS_SYNC', data: memoryAcademicYears, senderId: getClientId() });
    } catch (e) {}
  }
}

function notifyCourseListeners() {
  notifyLocalCourseListeners();
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'COURSES_SYNC', data: memoryCourses, senderId: getClientId() });
    } catch (e) {}
  }
}

function notifySectionListeners() {
  notifyLocalSectionListeners();
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SECTIONS_SYNC', data: memorySections, senderId: getClientId() });
    } catch (e) {}
  }
}

function notifyCategoryListeners(cats?: any[]) {
  const list = cats || memoryCategories;
  notifyLocalCategoryListeners(list);
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'CATEGORIES_SYNC', data: list, senderId: getClientId() });
    } catch (e) {}
  }
}

function notifySubmissionListeners() {
  notifyLocalSubmissionListeners();
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SUBMISSIONS_SYNC', data: memorySubmissions, senderId: getClientId() });
    } catch (e) {
      console.warn("Broadcast post error:", e);
    }
  }
}

function notifyNotificationListeners() {
  notifyLocalNotificationListeners();
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'NOTIFICATIONS_SYNC', data: memoryNotifications, senderId: getClientId() });
    } catch (e) {
      console.warn("Broadcast post error:", e);
    }
  }
}

function notifyScholarshipListeners() {
  notifyLocalScholarshipListeners();
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SCHOLARSHIPS_SYNC', data: memoryScholarships, senderId: getClientId() });
    } catch (e) {
      console.warn("Broadcast post error:", e);
    }
  }
}

// Hydrate from LocalForage in background on startup
(async () => {
  try {
    const subKeys = await submissionsDb.keys();
    if (subKeys.length > 0) {
      const loadedSubs: Submission[] = [];
      for (const k of subKeys) {
        const item = await submissionsDb.getItem(k);
        if (item) loadedSubs.push(item);
      }
      if (loadedSubs.length > 0) {
        memorySubmissions = loadedSubs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        notifySubmissionListeners();
      }
    } else {
      // populate localforage with defaults non-blockingly
      Promise.all(defaultSubmissions.map(s => submissionsDb.setItem(s.id, s))).catch(() => {});
    }

    const notifKeys = await notificationsDb.keys();
    if (notifKeys.length > 0) {
      const loadedNotifs: NotificationItem[] = [];
      for (const k of notifKeys) {
        const item = await notificationsDb.getItem(k);
        if (item) loadedNotifs.push(item);
      }
      if (loadedNotifs.length > 0) {
        // Upgrade any legacy static timestamps and sort newest first
        memoryNotifications = sortNotifications(loadedNotifs.map(item => {
          if (!item.createdAt) {
            const date = parseNotificationDate(item.timestamp, item.id);
            if (date) {
              return { ...item, createdAt: date.toISOString() };
            }
          }
          return item;
        }));
        notifyNotificationListeners();
      }
    }
  } catch (e) {
    console.warn("Local storage cache hydration notice:", e);
  }
})();

// Real-Time Firestore Synchronization using onSnapshot
let unsubscribeSubmissions: (() => void) | null = null;
let unsubscribeNotifications: (() => void) | null = null;

function setupRealtimeListeners() {
  if (!firestoreDb || isFirestoreQuotaExceeded) return;

  // Clean up any existing listeners
  if (unsubscribeSubmissions) { try { unsubscribeSubmissions(); } catch (e) { /* ignore */ } unsubscribeSubmissions = null; }
  if (unsubscribeNotifications) { try { unsubscribeNotifications(); } catch (e) { /* ignore */ } unsubscribeNotifications = null; }

  try {
    unsubscribeSubmissions = onSnapshot(collection(firestoreDb, 'submissions'), (snap) => {
      if (!snap.empty) {
        const remoteSubs: Submission[] = [];
        snap.forEach(docSnap => {
          remoteSubs.push(docSnap.data() as Submission);
        });
        if (remoteSubs.length > 0) {
          const subMap = new Map<string, Submission>();
          // Preserve local or default memory submissions
          memorySubmissions.forEach(s => subMap.set(s.id, s));
          // Update with remote submissions, protecting complete image data
          remoteSubs.forEach(s => {
            const local = subMap.get(s.id);
            if (local && local.files && s.files) {
              const mergedFiles = s.files.map(rf => {
                const lf = local.files?.find(f => f.id === rf.id || f.category === rf.category || f.name === rf.name);
                if (lf && lf.data && (!rf.data || rf.data.length < lf.data.length)) {
                  return { ...rf, data: lf.data };
                }
                return rf;
              });
              const remoteFileKeys = new Set(s.files.map(f => f.id || `${f.category}-${f.name}`));
              const extraLocalFiles = (local.files || []).filter(f => !remoteFileKeys.has(f.id || `${f.category}-${f.name}`));
              subMap.set(s.id, { ...s, files: [...mergedFiles, ...extraLocalFiles] });
            } else {
              subMap.set(s.id, s);
            }
          });
          memorySubmissions = Array.from(subMap.values()).sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          Promise.all(Array.from(subMap.values()).map(s => submissionsDb.setItem(s.id, s))).catch(() => {});
          notifySubmissionListeners();
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'submissions');
    });

    unsubscribeNotifications = onSnapshot(collection(firestoreDb, 'notifications'), (snap) => {
      if (!snap.empty) {
        const remoteNotifs: NotificationItem[] = [];
        snap.forEach(docSnap => {
          remoteNotifs.push(docSnap.data() as NotificationItem);
        });
        
        const notifMap = new Map<string, NotificationItem>();
        memoryNotifications.forEach(n => notifMap.set(n.id, n));
        remoteNotifs.forEach(n => notifMap.set(n.id, n));
        
        memoryNotifications = sortNotifications(Array.from(notifMap.values()));
        Promise.all(memoryNotifications.map(n => notificationsDb.setItem(n.id, n))).catch(() => {});
        notifyNotificationListeners();
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'notifications');
    });
  } catch (err) {
    console.warn("Realtime Firestore setup notice:", err);
  }
}

// Immediately initialize real-time synchronization on startup
setupRealtimeListeners();

// Re-verify listeners if auth state changes without disconnecting public Firestore listeners
onAuthStateChanged(auth, () => {
  if (!unsubscribeSubmissions || !unsubscribeNotifications) {
    setupRealtimeListeners();
  }
});

export function mergeScholarshipsIntoCategories(scholarships: Scholarship[], currentCats: any[]): any[] {
  if (!Array.isArray(currentCats) || currentCats.length === 0) return currentCats;
  let changed = false;
  const updated = currentCats.map(cat => ({
    ...cat,
    subtypes: (cat.subtypes || []).map((sub: any) => ({
      ...sub,
      allocations: [...(sub.allocations || [])]
    }))
  }));

  for (const s of scholarships) {
    if (!s || !s.name || s.id === '__categories_config__') continue;
    const sName = s.name.trim();
    const isInternal = (s.type || '').toLowerCase().includes('internal');
    const targetCat = updated.find(c => isInternal ? c.name.toLowerCase().includes('internal') : c.name.toLowerCase().includes('external')) || updated[0];
    if (!targetCat) continue;

    // Check if already in any subtype in this category
    const exists = (targetCat.subtypes || []).some((sub: any) =>
      (sub.allocations || []).some((a: any) => (a.name || '').trim().toLowerCase() === sName.toLowerCase())
    );
    if (!exists) {
      const subName = (s.category || '').trim().toLowerCase();
      let targetSub = (targetCat.subtypes || []).find((sub: any) =>
        sub.name.toLowerCase() === subName || subName.includes(sub.name.toLowerCase()) || sub.name.toLowerCase().includes(subName)
      );
      if (!targetSub && targetCat.subtypes && targetCat.subtypes.length > 0) {
        targetSub = targetCat.subtypes.find((sub: any) =>
          isInternal ? sub.name.toLowerCase().includes('institutional') : sub.name.toLowerCase().includes('ched')
        ) || targetCat.subtypes[0];
      }
      if (targetSub) {
        targetSub.allocations.push({
          id: s.id || `alloc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: sName
        });
        changed = true;
      }
    }
  }

  return changed ? updated : currentCats;
}

export const db = {
  scholarships: {
    getCached(): Scholarship[] {
      return [...memoryScholarships];
    },
    subscribe(callback: (items: Scholarship[]) => void): () => void {
      scholarshipListeners.add(callback);
      callback([...memoryScholarships]);
      return () => { scholarshipListeners.delete(callback); };
    },
    async get(id: string): Promise<Scholarship | null> {
      const mem = memoryScholarships.find(s => s.id === id);
      if (mem) return mem;
      const local = await scholarshipsDb.getItem(id) as Scholarship | null;
      if (local) return local;
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'scholarships', id));
          if (snap.exists()) {
            const data = snap.data() as Scholarship;
            scholarshipsDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `scholarships/${id}`);
        }
      }
      return null;
    },
    async set(id: string, s: Scholarship): Promise<void> {
      const trimmedName = (s.name || '').trim();
      const duplicate = memoryScholarships.find(item => item.id !== id && (item.name || '').trim().toLowerCase() === trimmedName.toLowerCase());
      if (duplicate) {
        id = duplicate.id;
      }
      s.name = trimmedName;
      const idx = memoryScholarships.findIndex(item => item.id === id);
      const targetRecord = idx >= 0 ? { ...memoryScholarships[idx], ...s, id } : { ...s, id };
      if (idx >= 0) {
        memoryScholarships[idx] = targetRecord;
      } else {
        memoryScholarships.push(targetRecord);
      }
      notifyScholarshipListeners();
      if (typeof window !== 'undefined') {
        (window as any).__db_scholarships_cache__ = memoryScholarships;
        try {
          localStorage.setItem('capsu_db_scholarships_cache', JSON.stringify(memoryScholarships));
        } catch (e) {}
        window.dispatchEvent(new Event('scholarship_categories_updated'));
      }
      await scholarshipsDb.setItem(id, targetRecord);

      // Direct Supabase upsert
      await safeSupabase(async supabase => {
        return await supabase.from('scholarships').upsert({
          id: targetRecord.id,
          name: targetRecord.name,
          type: targetRecord.type,
          category: targetRecord.category,
          status: targetRecord.status || 'Active',
          description: targetRecord.description || '',
          requirements: targetRecord.requirements || [],
          slots: targetRecord.slots || 0,
          deadline: targetRecord.deadline || ''
        }, { onConflict: 'id' });
      });

      broadcastSyncEvent('SCHOLARSHIPS_SYNC', memoryScholarships).catch(() => {});

      // Multi-device backend sync (persists to Supabase & broadcasts to other clients)
      fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetRecord)
      }).catch(e => console.warn("Backend sync notice:", e));

      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'scholarships', id), cleanForFirestore(targetRecord), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `scholarships/${id}`));
      }
    },
    async create(s: Omit<Scholarship, 'id'> & { id?: string }): Promise<Scholarship> {
      const id = s.id || `scholarship-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const scholarship: Scholarship = { ...s, id };
      await this.set(id, scholarship);
      return scholarship;
    },
    async update(id: string, s: Partial<Scholarship>): Promise<Scholarship | null> {
      const existing = await this.get(id);
      const updated = existing 
        ? { ...existing, ...s, id }
        : { id, name: '', type: 'Internally-Funded', category: '', status: 'Active', ...s } as Scholarship;
      await this.set(id, updated);
      return updated;
    },
    async listAll(): Promise<Scholarship[]> {
      try {
        // 1. Direct Supabase Query
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase.from('scholarships').select('*');
          if (!error && Array.isArray(data) && data.length > 0) {
            const configRow = data.find((s: any) => s.id === '__categories_config__');
            if (configRow && Array.isArray(configRow.requirements) && configRow.requirements.length > 0) {
              memoryCategories = configRow.requirements;
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem('capsu_scholarship_categories', JSON.stringify(memoryCategories));
                } catch (e) {}
              }
              notifyLocalCategoryListeners(memoryCategories);
            }

            const actualRows = data.filter((s: any) => s.id !== '__categories_config__');
            const mapped: Scholarship[] = actualRows.map((s: any) => ({
              id: s.id,
              name: s.name,
              type: s.type,
              category: s.category,
              status: s.status || 'Active',
              description: s.description || '',
              requirements: Array.isArray(s.requirements) ? s.requirements : [],
              slots: s.slots || 0,
              deadline: s.deadline || ''
            }));
            memoryScholarships = mapped;
            for (const item of mapped) {
              await scholarshipsDb.setItem(item.id, item).catch(() => {});
            }

            // Merge any supplementary scholarships into categories
            memoryCategories = mergeScholarshipsIntoCategories(mapped, memoryCategories);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('capsu_scholarship_categories', JSON.stringify(memoryCategories));
              } catch (e) {}
            }
            notifyLocalCategoryListeners(memoryCategories);

            notifyLocalScholarshipListeners();
            return [...memoryScholarships];
          }
        }

        // 2. Fallback to backend server API
        try {
          const res = await fetch('/api/scholarships');
          if (res.ok) {
            const serverList = await res.json();
            if (Array.isArray(serverList) && serverList.length > 0) {
              const actualRows = serverList.filter((s: any) => s.id !== '__categories_config__');
              memoryScholarships = actualRows;
              for (const item of actualRows) {
                await scholarshipsDb.setItem(item.id, item).catch(() => {});
              }
              memoryCategories = mergeScholarshipsIntoCategories(actualRows, memoryCategories);
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem('capsu_scholarship_categories', JSON.stringify(memoryCategories));
                } catch (e) {}
              }
              notifyLocalCategoryListeners(memoryCategories);
              notifyLocalScholarshipListeners();
              return [...memoryScholarships];
            }
          }
        } catch {}

        let allItems: Scholarship[] = [];
        if (firestoreDb) {
          try {
            const snap = await getDocs(collection(firestoreDb, 'scholarships'));
            if (!snap.empty) {
              snap.forEach(d => allItems.push(d.data() as Scholarship));
            }
          } catch (e) {}
        }
        const keys = await scholarshipsDb.keys();
        for (const key of keys) {
          const item = await scholarshipsDb.getItem(key);
          if (item) allItems.push(item);
        }
        if (allItems.length === 0) {
          allItems = [...defaultScholarships];
        }

        const map = new Map<string, Scholarship>();
        for (const s of allItems) {
          const nameKey = (s.name || '').trim().toLowerCase();
          if (!nameKey) continue;
          if (!map.has(nameKey)) {
            map.set(nameKey, s);
          } else {
            const existing = map.get(nameKey)!;
            if (s.id !== existing.id) {
              scholarshipsDb.removeItem(s.id).catch(() => {});
              if (firestoreDb) {
                deleteDoc(doc(firestoreDb, 'scholarships', s.id)).catch(() => {});
              }
            }
          }
        }
        memoryScholarships = Array.from(map.values());
        for (const s of memoryScholarships) {
          await scholarshipsDb.setItem(s.id, s);
        }
        notifyLocalScholarshipListeners();
        return [...memoryScholarships];
      } catch (e) {
        console.warn("Scholarships list fetch notice:", e);
      }
      return [...memoryScholarships];
    },
    async delete(id: string): Promise<void> {
      memoryScholarships = memoryScholarships.filter(s => s.id !== id);
      notifyScholarshipListeners();
      if (typeof window !== 'undefined') {
        (window as any).__db_scholarships_cache__ = memoryScholarships;
        try {
          localStorage.setItem('capsu_db_scholarships_cache', JSON.stringify(memoryScholarships));
        } catch (e) {}
        window.dispatchEvent(new Event('scholarship_categories_updated'));
      }
      scholarshipsDb.removeItem(id).catch(() => {});

      // Direct Supabase delete
      await safeSupabase(async supabase => {
        return await supabase.from('scholarships').delete().eq('id', id);
      });
      broadcastSyncEvent('SCHOLARSHIPS_SYNC', memoryScholarships).catch(() => {});

      // Multi-device backend sync
      fetch(`/api/scholarships/${id}`, { method: 'DELETE' })
        .catch(e => console.warn("Backend delete notice:", e));

      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'scholarships', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `scholarships/${id}`));
      }
    }
  },

  submissions: {
    getCached(): Submission[] {
      return [...memorySubmissions];
    },
    subscribe(callback: (subs: Submission[]) => void): () => void {
      submissionListeners.add(callback);
      callback([...memorySubmissions]);
      return () => { submissionListeners.delete(callback); };
    },
    async get(id: string): Promise<Submission | null> {
      const mem = memorySubmissions.find(s => s.id === id);
      if (mem) return mem;
      const local = await submissionsDb.getItem(id);
      if (local) return local;
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'submissions', id));
          if (snap.exists()) {
            const data = snap.data() as Submission;
            submissionsDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `submissions/${id}`);
        }
      }
      return null;
    },
    async set(id: string, sub: Submission): Promise<void> {
      const idx = memorySubmissions.findIndex(s => s.id === id);
      if (idx >= 0) {
        memorySubmissions[idx] = sub;
      } else {
        memorySubmissions.unshift(sub);
      }
      notifySubmissionListeners();
      submissionsDb.setItem(id, sub).catch(() => {});

      // Direct Supabase upsert
      await safeSupabase(async supabase => {
        return await supabase.from('submissions').upsert({
          id: sub.id,
          student_id: sub.studentId,
          student_name: sub.studentName,
          student_auth_id: sub.studentAuthId || null,
          scholarship_type: sub.scholarshipType,
          status: sub.status,
          submitted_at: sub.submittedAt,
          data: sub.data || {},
          files: sub.files || []
        }, { onConflict: 'id' });
      });

      broadcastSyncEvent('SUBMISSIONS_SYNC', memorySubmissions).catch(() => {});

      // Multi-device backend sync (persists to Supabase & broadcasts to other clients)
      fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      }).catch(e => console.warn("Backend sync notice:", e));

      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'submissions', id), cleanForFirestore(sub), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `submissions/${id}`));
      }
    },
    async create(sub: Submission): Promise<Submission> {
      await this.set(sub.id, sub);
      try {
        const now = sub.submittedAt || new Date().toISOString();
        db.notifications.create({
          type: 'submission',
          title: 'New Scholarship Submission Uploaded',
          description: `${sub.studentName} uploaded application files for ${sub.scholarshipType}.`,
          studentName: sub.studentName,
          studentId: sub.studentId,
          scholarship: sub.scholarshipType,
          timestamp: now,
          createdAt: now,
          read: false,
          priority: 'high',
          submissionId: sub.id
        }).catch(() => {});
      } catch (err) {
        console.warn("Notice creation skipped:", err);
      }
      return sub;
    },
    async update(id: string, sub: Partial<Submission>): Promise<Submission | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated: Submission = { ...existing, ...sub, id };
      await this.set(id, updated);
      return updated;
    },
    async listByStudent(studentId: string): Promise<Submission[]> {
      const norm = (studentId || '').trim().toLowerCase();
      if (!norm) return [];
      
      // If memory cache is somehow unhydrated, trigger hydration
      if (memorySubmissions.length === 0) {
        await this.listAll();
      }

      return memorySubmissions.filter(s => {
        const sId = (s.studentId || '').trim().toLowerCase();
        const sAuth = (s.studentAuthId || '').trim().toLowerCase();
        const sEmail = (s.data?.email || '').trim().toLowerCase();
        const sDataId = (s.data?.studentId || '').trim().toLowerCase();
        const sName = (s.studentName || '').trim().toLowerCase();
        return sId === norm || sAuth === norm || sEmail === norm || sDataId === norm || sName === norm;
      });
    },
    async saveStudentFiles(
      studentIdentifier: string,
      filesToSave: SubmissionFile[],
      meta?: { studentName?: string; scholarshipType?: string; academicYear?: string; email?: string }
    ): Promise<Submission> {
      const all = await this.listAll();
      const norm = (studentIdentifier || '').trim().toLowerCase();
      const metaName = (meta?.studentName || '').trim().toLowerCase();
      const metaEmail = (meta?.email || '').trim().toLowerCase();
      
      let target = all.find(s => {
        const sId = (s.studentId || '').trim().toLowerCase();
        const sAuth = (s.studentAuthId || '').trim().toLowerCase();
        const sEmail = (s.data?.email || '').trim().toLowerCase();
        const sDataId = (s.data?.studentId || '').trim().toLowerCase();
        const sName = (s.studentName || '').trim().toLowerCase();
        
        return s.id === studentIdentifier || 
               sId === norm || 
               sAuth === norm || 
               sEmail === norm || 
               sDataId === norm || 
               sName === norm ||
               (metaName && sName === metaName) ||
               (metaEmail && (sEmail === metaEmail || sId === metaEmail));
      });

      const now = new Date().toISOString();

      if (target) {
        const existingFiles = target.files || [];
        const updatedFiles = [...existingFiles];

        filesToSave.forEach(newF => {
          const matchIdx = updatedFiles.findIndex(f => 
            (newF.id && f.id === newF.id) ||
            (newF.category && f.category === newF.category)
          );
          if (matchIdx >= 0) {
            updatedFiles[matchIdx] = { ...updatedFiles[matchIdx], ...newF, uploadedAt: now };
          } else {
            updatedFiles.push({ ...newF, uploadedAt: now });
          }
        });

        const updated: Submission = {
          ...target,
          files: updatedFiles,
          submittedAt: target.submittedAt || now
        };

        await this.set(target.id, updated);

        try {
          db.notifications.create({
            type: 'submission',
            title: 'Scholarship Documents Uploaded',
            description: `${target.studentName} updated academic document uploads (${filesToSave.map(f => f.category || f.name).join(', ')}).`,
            studentName: target.studentName,
            studentId: target.studentId,
            scholarship: target.scholarshipType,
            timestamp: now,
            createdAt: now,
            read: false,
            priority: 'high',
            submissionId: target.id
          }).catch(() => {});
        } catch (e) {
          console.warn("Notification skipped:", e);
        }

        return updated;
      } else {
        const newId = `sub-${Date.now()}`;
        const nameParts = (meta?.studentName || 'Student Applicant').split(' ');
        const firstName = nameParts[0] || 'Student';
        const familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

        const newSub: Submission = {
          id: newId,
          studentId: studentIdentifier,
          studentName: meta?.studentName || 'Student Applicant',
          scholarshipType: meta?.scholarshipType || 'CAPSU Scholarship Program',
          status: 'Pending',
          submittedAt: now,
          data: {
            studentId: studentIdentifier,
            firstName,
            familyName,
            course: 'BSCS',
            yearLevel: '1st Year',
            academicYear: meta?.academicYear || 'A.Y. 2025-2026',
            submittedAt: now
          },
          files: filesToSave.map(f => ({ ...f, uploadedAt: now }))
        };

        await this.create(newSub);
        return newSub;
      }
    },
    async listAll(): Promise<Submission[]> {
      try {
        // 1. Direct Supabase Query
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase.from('submissions').select('*').order('submitted_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Submission[] = data.map((s: any) => {
              const subData = s.data || {};
              if (subData.yearLevel) {
                subData.yearLevel = normalizeYearLevel(subData.yearLevel);
              }
              return {
                id: s.id,
                studentId: s.student_id,
                studentName: s.student_name,
                studentAuthId: s.student_auth_id || undefined,
                scholarshipType: s.scholarship_type,
                status: s.status,
                submittedAt: s.submitted_at,
                data: subData,
                files: Array.isArray(s.files) ? s.files : []
              };
            });
            const subMap = new Map<string, Submission>();
            memorySubmissions.forEach(s => subMap.set(s.id, s));
            mapped.forEach(s => subMap.set(s.id, s));
            memorySubmissions = Array.from(subMap.values()).sort(
              (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
            for (const item of mapped) {
              await submissionsDb.setItem(item.id, item).catch(() => {});
            }
            notifySubmissionListeners();
            return [...memorySubmissions];
          }
        }

        // 2. Fallback to backend server API
        try {
          const res = await fetch('/api/submissions');
          if (res.ok) {
            const serverList = await res.json();
            if (Array.isArray(serverList) && serverList.length > 0) {
              const subMap = new Map<string, Submission>();
              memorySubmissions.forEach(s => subMap.set(s.id, s));
              serverList.forEach((s: Submission) => {
                if (s.data?.yearLevel) {
                  s.data.yearLevel = normalizeYearLevel(s.data.yearLevel);
                }
                subMap.set(s.id, s);
              });
              memorySubmissions = Array.from(subMap.values()).sort(
                (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
              );
              for (const item of serverList) {
                await submissionsDb.setItem(item.id, item).catch(() => {});
              }
              notifySubmissionListeners();
              return [...memorySubmissions];
            }
          }
        } catch {}

        const keys = await submissionsDb.keys();
        if (keys.length > 0) {
          const subs: Submission[] = [];
          for (const key of keys) {
            const sub = await submissionsDb.getItem(key);
            if (sub) subs.push(sub);
          }
          if (subs.length > 0) {
            const subMap = new Map<string, Submission>();
            memorySubmissions.forEach(s => subMap.set(s.id, s));
            subs.forEach(s => subMap.set(s.id, s));
            memorySubmissions = Array.from(subMap.values()).sort(
              (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
          }
        }
      } catch (e) {
        console.warn("Storage list fetch notice:", e);
      }
      return [...memorySubmissions];
    },
    async verifyRequirement(submissionId: string, requirementNameOrKey: string, status: 'Verified' | 'Pending' | 'Missing' | 'Rejected', remarks?: string): Promise<Submission | null> {
      const existing = await this.get(submissionId);
      if (!existing) return null;

      const updatedFiles = (existing.files || []).map(f => {
        if (f.name === requirementNameOrKey || f.category === requirementNameOrKey || f.id === requirementNameOrKey) {
          return { ...f, status, verified: status === 'Verified', remarks: remarks || f.remarks };
        }
        return f;
      });

      const updatedData = { ...existing.data };
      if (updatedData.requirements) {
        updatedData.requirements = updatedData.requirements.map((r: any) => 
          r.name === requirementNameOrKey ? { ...r, status } : r
        );
      }

      const allFilesVerified = updatedFiles.length > 0 && updatedFiles.every(f => f.status === 'Verified' || f.verified);
      const newStatus = allFilesVerified ? 'Complete' : 'Incomplete';

      const updated: Submission = {
        ...existing,
        files: updatedFiles,
        data: updatedData,
        status: newStatus
      };

      await this.set(submissionId, updated);
      return updated;
    },
    async addFile(submissionId: string, file: SubmissionFile): Promise<Submission | null> {
      const existing = await this.get(submissionId);
      if (!existing) return null;
      const fileWithId = {
        ...file,
        id: file.id || `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        uploadedAt: file.uploadedAt || new Date().toISOString()
      };
      const files = [...(existing.files || []), fileWithId];
      const updated = { ...existing, files };
      await this.set(submissionId, updated);
      return updated;
    },
    async delete(id: string): Promise<void> {
      memorySubmissions = memorySubmissions.filter(s => s.id !== id);
      notifySubmissionListeners();
      submissionsDb.removeItem(id).catch(() => {});

      // Direct Supabase delete
      await safeSupabase(async supabase => {
        return await supabase.from('submissions').delete().eq('id', id);
      });
      broadcastSyncEvent('SUBMISSIONS_SYNC', memorySubmissions).catch(() => {});

      // Multi-device backend sync
      fetch(`/api/submissions/${id}`, { method: 'DELETE' })
        .catch(e => console.warn("Backend delete notice:", e));

      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'submissions', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `submissions/${id}`));
      }
    }
  },

  courses: {
    getCached(): Course[] {
      return deduplicateCourses(memoryCourses);
    },
    subscribe(callback: (courses: Course[]) => void): () => void {
      courseListeners.add(callback);
      callback(deduplicateCourses(memoryCourses));
      return () => { courseListeners.delete(callback); };
    },
    async get(id: string): Promise<Course | null> {
      const list = deduplicateCourses(memoryCourses);
      const mem = list.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase());
      if (mem) return mem;
      return await coursesDb.getItem(id);
    },
    async set(id: string, course: Course): Promise<void> {
      const trimmedCode = (course.code || '').trim().toUpperCase();
      const canonicalId = `course-${trimmedCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      course.id = canonicalId;
      course.code = trimmedCode;
      course.name = (course.name || '').trim();
      course.status = course.status || 'Active';

      const nextList = memoryCourses.filter(c => (c.code || '').trim().toUpperCase() !== trimmedCode);
      nextList.push(course);

      memoryCourses = deduplicateCourses(nextList);
      notifyCourseListeners();
      await coursesDb.setItem(canonicalId, course);
      if (id && id !== canonicalId) {
        await coursesDb.removeItem(id).catch(() => {});
      }

      // Direct Supabase upsert
      await safeSupabase(supabase => {
        return supabase.from('courses').upsert({
          id: course.id,
          code: course.code,
          name: course.name,
          department: course.department || '',
          status: course.status || 'Active'
        }, { onConflict: 'id' });
      });

      broadcastSyncEvent('COURSES_SYNC', memoryCourses).catch(() => {});

      // Multi-device backend sync (persists to Supabase & broadcasts)
      fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      }).catch(e => console.warn("Backend sync notice:", e));
    },
    async create(course: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
      const trimmedCode = (course.code || '').trim().toUpperCase();
      const canonicalId = `course-${trimmedCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const newCourse: Course = { ...course, id: canonicalId, code: trimmedCode };
      await this.set(canonicalId, newCourse);
      return newCourse;
    },
    async update(id: string, course: Partial<Course>): Promise<Course | null> {
      const existing = await this.get(id);
      const code = (course.code || existing?.code || '').trim().toUpperCase();
      const canonicalId = code ? `course-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : id;
      const updated: Course = {
        ...(existing || { code, name: '', status: 'Active' as const }),
        ...course,
        id: canonicalId,
        code
      };
      await this.set(canonicalId, updated);
      if (id && id !== canonicalId) {
        await coursesDb.removeItem(id).catch(() => {});
      }
      return updated;
    },
    async listAll(): Promise<Course[]> {
      try {
        // 1. Direct Supabase Query
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase.from('courses').select('*');
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped = data.map((c: any) => ({
              id: c.id,
              code: c.code,
              name: c.name,
              department: c.department || '',
              status: c.status || 'Active'
            }));
            const deduped = deduplicateCourses(mapped);
            memoryCourses = deduped;
            const existingKeys = await coursesDb.keys();
            const validIds = new Set(deduped.map(c => c.id));
            for (const k of existingKeys) {
              if (!validIds.has(k)) {
                await coursesDb.removeItem(k).catch(() => {});
              }
            }
            for (const item of deduped) {
              await coursesDb.setItem(item.id, item).catch(() => {});
            }
            notifyLocalCourseListeners();
            return [...memoryCourses];
          }
        }

        // 2. Fallback to backend server API
        try {
          const res = await fetch('/api/courses');
          if (res.ok) {
            const serverList = await res.json();
            if (Array.isArray(serverList) && serverList.length > 0) {
              const deduped = deduplicateCourses(serverList);
              memoryCourses = deduped;
              const existingKeys = await coursesDb.keys();
              const validIds = new Set(deduped.map(c => c.id));
              for (const k of existingKeys) {
                if (!validIds.has(k)) {
                  await coursesDb.removeItem(k).catch(() => {});
                }
              }
              for (const item of deduped) {
                await coursesDb.setItem(item.id, item).catch(() => {});
              }
              notifyLocalCourseListeners();
              return [...memoryCourses];
            }
          }
        } catch {}

        const keys = await coursesDb.keys();
        let allItems: Course[] = [];
        for (const key of keys) {
          const item = await coursesDb.getItem(key);
          if (item) allItems.push(item);
        }
        if (allItems.length === 0) {
          allItems = [...defaultCourses];
        }
        memoryCourses = deduplicateCourses(allItems);
        notifyLocalCourseListeners();
        return [...memoryCourses];
      } catch (e) {
        console.warn("Courses list fetch notice:", e);
      }
      return deduplicateCourses(memoryCourses);
    },
    async delete(id: string): Promise<void> {
      const targetCode = id.replace(/^course-/, '').toUpperCase();
      memoryCourses = deduplicateCourses(memoryCourses.filter(c => c.id !== id && (c.code || '').toUpperCase() !== targetCode));
      notifyCourseListeners();
      await coursesDb.removeItem(id).catch(() => {});

      await safeSupabase(supabase => {
        return supabase.from('courses').delete().or(`id.eq.${id},code.eq.${targetCode}`);
      });
      broadcastSyncEvent('COURSES_SYNC', memoryCourses).catch(() => {});

      fetch(`/api/courses/${id}`, { method: 'DELETE' })
        .catch(e => console.warn("Backend delete notice:", e));
    }
  },

  academicYears: {
    getCached(): AcademicYear[] {
      return deduplicateAcademicYears(memoryAcademicYears);
    },
    subscribe(callback: (ays: AcademicYear[]) => void): () => void {
      academicYearListeners.add(callback);
      callback(deduplicateAcademicYears(memoryAcademicYears));
      return () => { academicYearListeners.delete(callback); };
    },
    async get(id: string): Promise<AcademicYear | null> {
      const list = deduplicateAcademicYears(memoryAcademicYears);
      const match = list.find(a => a.id === id || (a.year || '').trim() === id.replace(/^ay-/, '').trim());
      if (match) return match;
      return await academicYearsDb.getItem(id);
    },
    async set(id: string, ay: AcademicYear): Promise<void> {
      const trimmedYear = (ay.year || '').trim();
      const canonicalId = `ay-${trimmedYear.replace(/\s+/g, '-')}`;
      const now = ay.updatedAt || new Date().toISOString();
      const isCurrentActive = ay.overallStatus === 'Active';

      const record: AcademicYear = {
        ...ay,
        id: canonicalId,
        year: trimmedYear,
        updatedAt: now,
        label: ay.label || `A.Y. ${trimmedYear}`
      };

      let nextList = memoryAcademicYears.filter(a => (a.year || '').trim() !== trimmedYear);
      if (isCurrentActive) {
        nextList = nextList.map(item => ({ ...item, overallStatus: 'Inactive' as const }));
      }
      nextList.unshift(record);

      memoryAcademicYears = deduplicateAcademicYears(nextList);
      notifyAcademicYearListeners();

      await academicYearsDb.setItem(canonicalId, record).catch(() => {});
      if (id && id !== canonicalId) {
        await academicYearsDb.removeItem(id).catch(() => {});
      }

      if (isCurrentActive) {
        for (const item of nextList) {
          if (item.id !== canonicalId) {
            await academicYearsDb.setItem(item.id, item).catch(() => {});
          }
        }
      }

      // Direct Supabase Write (Central Realtime Database)
      if (isCurrentActive) {
        await safeSupabase(supabase => {
          return supabase.from('academic_years').update({ overall_status: 'Inactive' }).neq('id', canonicalId);
        });
      }
      await safeSupabase(supabase => {
        return supabase.from('academic_years').upsert({
          id: record.id,
          year: record.year,
          overall_status: record.overallStatus,
          first_semester: record.firstSemester,
          second_semester: record.secondSemester,
          label: record.label,
          updated_at: record.updatedAt
        }, { onConflict: 'id' });
      });

      // Multi-device realtime broadcast over Supabase
      broadcastSyncEvent('ACADEMIC_YEARS_SYNC', memoryAcademicYears).catch(() => {});

      // Backend sync
      fetch('/api/academic-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      }).catch(e => console.warn("Backend sync notice:", e));
    },
    async create(ay: Omit<AcademicYear, 'id'> & { id?: string }): Promise<AcademicYear> {
      const trimmedYear = (ay.year || '').trim();
      const canonicalId = `ay-${trimmedYear.replace(/\s+/g, '-')}`;
      const newAy: AcademicYear = {
        ...ay,
        id: canonicalId,
        year: trimmedYear,
        updatedAt: new Date().toISOString()
      };
      await this.set(canonicalId, newAy);
      return newAy;
    },
    async update(id: string, ay: Partial<AcademicYear>): Promise<AcademicYear | null> {
      const existing = await this.get(id);
      const targetYear = (ay.year || existing?.year || '').trim();
      const canonicalId = targetYear ? `ay-${targetYear.replace(/\s+/g, '-')}` : id;
      const merged: AcademicYear = {
        ...(existing || { year: targetYear, overallStatus: 'Inactive', firstSemester: 'Active', secondSemester: 'Inactive', label: `A.Y. ${targetYear}` }),
        ...ay,
        id: canonicalId,
        year: targetYear,
        updatedAt: new Date().toISOString()
      };
      await this.set(canonicalId, merged);
      if (id && id !== canonicalId) {
        await academicYearsDb.removeItem(id).catch(() => {});
      }
      return merged;
    },
    async setDefault(id: string): Promise<void> {
      for (const item of memoryAcademicYears) {
        await this.set(item.id, { ...item, isDefault: item.id === id });
      }
    },
    async listAll(): Promise<AcademicYear[]> {
      try {
        // 1. Direct Supabase Query (Real-time single source of truth across all devices)
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase.from('academic_years').select('*').order('year', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: AcademicYear[] = data.map((row: any) => ({
              id: row.id,
              year: row.year,
              overallStatus: (row.overall_status === 'Active' || row.overall_status === 'active') ? 'Active' : 'Inactive',
              firstSemester: (row.first_semester === 'Active' || row.first_semester === 'active') ? 'Active' : 'Inactive',
              secondSemester: (row.second_semester === 'Active' || row.second_semester === 'active') ? 'Active' : 'Inactive',
              label: row.label || `A.Y. ${row.year}`,
              updatedAt: row.updated_at
            }));
            const deduped = deduplicateAcademicYears(mapped);
            memoryAcademicYears = deduped;
            const existingKeys = await academicYearsDb.keys();
            const validIds = new Set(deduped.map(item => item.id));
            for (const k of existingKeys) {
              if (!validIds.has(k)) {
                await academicYearsDb.removeItem(k).catch(() => {});
              }
            }
            for (const item of deduped) {
              await academicYearsDb.setItem(item.id, item).catch(() => {});
            }
            notifyLocalAcademicYearListeners();
            return [...memoryAcademicYears];
          }
        }

        // 2. Fallback to backend server API
        try {
          const res = await fetch('/api/academic-years');
          if (res.ok) {
            const serverList = await res.json();
            if (Array.isArray(serverList) && serverList.length > 0) {
              const deduped = deduplicateAcademicYears(serverList);
              memoryAcademicYears = deduped;
              const existingKeys = await academicYearsDb.keys();
              const validIds = new Set(deduped.map(item => item.id));
              for (const k of existingKeys) {
                if (!validIds.has(k)) {
                  await academicYearsDb.removeItem(k).catch(() => {});
                }
              }
              for (const item of deduped) {
                await academicYearsDb.setItem(item.id, item).catch(() => {});
              }
              notifyLocalAcademicYearListeners();
              return [...memoryAcademicYears];
            }
          }
        } catch {}

        // 3. Fallback to local storage
        const keys = await academicYearsDb.keys();
        let allItems: AcademicYear[] = [];
        for (const key of keys) {
          const item = await academicYearsDb.getItem(key) as AcademicYear | null;
          if (item) allItems.push(item);
        }
        if (allItems.length === 0) {
          allItems = [...defaultAcademicYears];
        }
        memoryAcademicYears = deduplicateAcademicYears(allItems);
        notifyLocalAcademicYearListeners();
        return [...memoryAcademicYears];
      } catch (e) {
        console.warn("AcademicYears list fetch notice:", e);
      }
      return deduplicateAcademicYears(memoryAcademicYears);
    },
    async getDefault(): Promise<AcademicYear | null> {
      const list = deduplicateAcademicYears(memoryAcademicYears);
      return list.find(a => a.isDefault) || list.find(a => a.overallStatus === 'Active') || list[0] || null;
    },
    async getActiveTerm(): Promise<{ year: string; label: string; firstActive: boolean; secondActive: boolean; hasActive: boolean }> {
      try {
        const cached = this.getCached();
        const list = cached.length > 0 ? cached : await this.listAll();
        let target = list.find(ay => ay.overallStatus === 'Active');
        if (!target) {
          target = list.find(ay => ay.firstSemester === 'Active' || ay.secondSemester === 'Active');
        }
        if (!target && list.length > 0) {
          target = list[0];
        }

        if (target) {
          const isOverallActive = target.overallStatus === 'Active';
          const firstActive = isOverallActive && target.firstSemester === 'Active';
          const secondActive = isOverallActive && target.secondSemester === 'Active';
          const hasActive = isOverallActive && (firstActive || secondActive);
          let label = `A.Y. ${target.year}`;
          if (isOverallActive) {
            if (firstActive && secondActive) {
              label = `A.Y. ${target.year} | 1st & 2nd Semester`;
            } else if (firstActive) {
              label = `A.Y. ${target.year} | 1st Semester`;
            } else if (secondActive) {
              label = `A.Y. ${target.year} | 2nd Semester`;
            }
          }
          return {
            year: target.year,
            label,
            firstActive,
            secondActive,
            hasActive
          };
        }
      } catch (e) {
        console.warn("Error getting active term:", e);
      }
      return {
        year: '2025-2026',
        label: 'No Active Term/Semester',
        firstActive: false,
        secondActive: false,
        hasActive: false
      };
    },
    async delete(id: string): Promise<void> {
      const targetYear = id.replace(/^ay-/, '').trim();
      memoryAcademicYears = deduplicateAcademicYears(memoryAcademicYears.filter(a => a.id !== id && (a.year || '').trim() !== targetYear));
      await academicYearsDb.removeItem(id).catch(() => {});
      if (id !== `ay-${targetYear}`) {
        await academicYearsDb.removeItem(`ay-${targetYear}`).catch(() => {});
      }
      notifyAcademicYearListeners();

      await safeSupabase(supabase => {
        return supabase.from('academic_years').delete().or(`id.eq.${id},year.eq.${targetYear}`);
      });
      broadcastSyncEvent('ACADEMIC_YEARS_SYNC', memoryAcademicYears).catch(() => {});

      fetch(`/api/academic-years/${id}`, { method: 'DELETE' })
        .catch(e => console.warn("Backend delete notice:", e));
    }
  },

  sections: {
    getCached(): Section[] {
      return deduplicateSections(memorySections);
    },
    subscribe(callback: (sections: Section[]) => void): () => void {
      sectionListeners.add(callback);
      callback(deduplicateSections(memorySections));
      return () => { sectionListeners.delete(callback); };
    },
    async get(id: string): Promise<Section | null> {
      const list = deduplicateSections(memorySections);
      const mem = list.find(s => s.id === id || s.name.toUpperCase() === id.toUpperCase());
      if (mem) return mem;
      return await sectionsDb.getItem(id);
    },
    async set(id: string, section: Section): Promise<void> {
      const trimmedName = (section.name || '').trim().toUpperCase();
      const canonicalId = `sec-${trimmedName.toLowerCase()}`;
      section.id = canonicalId;
      section.name = trimmedName;

      const nextList = memorySections.filter(s => (s.name || '').trim().toUpperCase() !== trimmedName);
      nextList.push(section);

      memorySections = deduplicateSections(nextList);
      notifySectionListeners();
      await sectionsDb.setItem(canonicalId, section);
      if (id && id !== canonicalId) {
        await sectionsDb.removeItem(id).catch(() => {});
      }

      // Direct Supabase upsert
      await safeSupabase(supabase => {
        return supabase.from('sections').upsert({
          id: section.id,
          name: section.name,
          course: section.course || null,
          status: section.status || 'Active'
        }, { onConflict: 'id' });
      });

      broadcastSyncEvent('SECTIONS_SYNC', memorySections).catch(() => {});

      fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section)
      }).catch(e => console.warn("Backend sync notice:", e));
    },
    async create(section: Omit<Section, 'id'> & { id?: string }): Promise<Section> {
      const trimmedName = (section.name || '').trim().toUpperCase();
      const canonicalId = `sec-${trimmedName.toLowerCase()}`;
      const newSec: Section = { ...section, id: canonicalId, name: trimmedName };
      await this.set(canonicalId, newSec);
      return newSec;
    },
    async update(id: string, section: Partial<Section>): Promise<Section | null> {
      const existing = await this.get(id);
      const cleanName = (section.name || existing?.name || '').trim().toUpperCase();
      const canonicalId = cleanName ? `sec-${cleanName.toLowerCase()}` : id;
      const updated = { ...existing, ...section, id: canonicalId, name: cleanName };
      await this.set(canonicalId, updated);
      if (id && id !== canonicalId) {
        await sectionsDb.removeItem(id).catch(() => {});
      }
      return updated;
    },
    async listAll(): Promise<Section[]> {
      try {
        // 1. Direct Supabase Query
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase.from('sections').select('*');
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Section[] = data.map((s: any) => ({
              id: s.id,
              name: s.name,
              course: s.course || '',
              status: s.status || 'Active'
            }));
            const deduped = deduplicateSections(mapped);
            memorySections = deduped;
            const existingKeys = await sectionsDb.keys();
            const validIds = new Set(deduped.map(s => s.id));
            for (const k of existingKeys) {
              if (!validIds.has(k)) {
                await sectionsDb.removeItem(k).catch(() => {});
              }
            }
            for (const item of deduped) {
              await sectionsDb.setItem(item.id, item).catch(() => {});
            }
            notifyLocalSectionListeners();
            return [...memorySections];
          }
        }

        // 2. Fallback to backend server API
        try {
          const res = await fetch('/api/sections');
          if (res.ok) {
            const serverList = await res.json();
            if (Array.isArray(serverList) && serverList.length > 0) {
              const deduped = deduplicateSections(serverList);
              memorySections = deduped;
              const existingKeys = await sectionsDb.keys();
              const validIds = new Set(deduped.map(s => s.id));
              for (const k of existingKeys) {
                if (!validIds.has(k)) {
                  await sectionsDb.removeItem(k).catch(() => {});
                }
              }
              for (const item of deduped) {
                await sectionsDb.setItem(item.id, item).catch(() => {});
              }
              notifyLocalSectionListeners();
              return [...memorySections];
            }
          }
        } catch {}

        const keys = await sectionsDb.keys();
        let allItems: Section[] = [];
        for (const key of keys) {
          const item = await sectionsDb.getItem(key);
          if (item) allItems.push(item);
        }
        if (allItems.length === 0) {
          allItems = [...defaultSections];
        }
        memorySections = deduplicateSections(allItems);
        notifyLocalSectionListeners();
        return [...memorySections];
      } catch (e) {
        console.warn("Sections list fetch notice:", e);
      }
      return deduplicateSections(memorySections);
    },
    async delete(id: string): Promise<void> {
      const targetName = id.replace(/^sec-/, '').toUpperCase();
      memorySections = deduplicateSections(memorySections.filter(s => s.id !== id && (s.name || '').toUpperCase() !== targetName));
      notifySectionListeners();
      await sectionsDb.removeItem(id).catch(() => {});

      // Direct Supabase delete
      await safeSupabase(supabase => {
        return supabase.from('sections').delete().or(`id.eq.${id},name.eq.${targetName}`);
      });
      broadcastSyncEvent('SECTIONS_SYNC', memorySections).catch(() => {});

      fetch(`/api/sections/${id}`, { method: 'DELETE' })
        .catch(e => console.warn("Backend delete notice:", e));
    }
  },

  categories: {
    getCached(): any[] {
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('capsu_scholarship_categories');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              memoryCategories = parsed;
              return parsed;
            }
          }
        }
      } catch (e) {}
      if (memoryCategories && memoryCategories.length > 0) return [...memoryCategories];
      return [...INITIAL_SCHOLARSHIP_CATEGORIES];
    },
    subscribe(callback: (cats: any[]) => void): () => void {
      categoryListeners.add(callback);
      const current = this.getCached();
      if (current.length > 0) callback(current);
      return () => { categoryListeners.delete(callback); };
    },
    async listAll(): Promise<any[]> {
      try {
        const supabase = getSupabase();
        if (supabase) {
          // Check config row in scholarships table
          const { data, error } = await supabase.from('scholarships').select('*').eq('id', '__categories_config__').maybeSingle();
          if (!error && data && Array.isArray(data.requirements) && data.requirements.length > 0) {
            memoryCategories = data.requirements;
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('capsu_scholarship_categories', JSON.stringify(memoryCategories));
              } catch (e) {}
            }
            notifyLocalCategoryListeners(memoryCategories);
            return memoryCategories;
          }

          // Fallback to scholarship_categories table if created
          const catRes = await supabase.from('scholarship_categories').select('*').limit(1);
          if (!catRes.error && catRes.data && catRes.data.length > 0 && catRes.data[0].categories) {
            memoryCategories = catRes.data[0].categories;
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('capsu_scholarship_categories', JSON.stringify(memoryCategories));
              } catch (e) {}
            }
            notifyLocalCategoryListeners(memoryCategories);
            return memoryCategories;
          }
        }
      } catch (e) {}

      try {
        const res = await fetch('/api/scholarship-categories');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            memoryCategories = list;
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('capsu_scholarship_categories', JSON.stringify(memoryCategories));
              } catch (e) {}
            }
            notifyLocalCategoryListeners(list);
            return list;
          }
        }
      } catch (e) {
        console.warn("Categories fetch notice:", e);
      }
      return this.getCached();
    },
    async save(categories: any[]): Promise<void> {
      memoryCategories = categories;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('capsu_scholarship_categories', JSON.stringify(categories));
        } catch (e) {}
      }
      notifyCategoryListeners(categories);
      broadcastSyncEvent('CATEGORIES_SYNC', categories).catch(() => {});

      // Persist to Supabase scholarships config row (central database)
      await safeSupabase(async supabase => {
        return await supabase.from('scholarships').upsert({
          id: '__categories_config__',
          name: 'SYSTEM_CATEGORIES_CONFIG',
          type: 'CONFIG',
          category: 'CONFIG',
          status: 'System',
          requirements: categories
        }, { onConflict: 'id' });
      });

      safeSupabase(supabase => {
        return supabase.from('scholarship_categories').upsert({
          id: 'main_categories',
          categories: categories,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      });

      fetch('/api/scholarship-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categories)
      }).catch(e => console.warn("Backend categories sync notice:", e));
    }
  },

  formRequirements: {
    getCached(): FormRequirement[] {
      return [...memoryFormRequirements];
    },
    async get(id: string): Promise<FormRequirement | null> {
      const mem = memoryFormRequirements.find(r => r.id === id);
      if (mem) return mem;
      return await formReqsDb.getItem(id);
    },
    async set(id: string, req: FormRequirement): Promise<void> {
      const idx = memoryFormRequirements.findIndex(r => r.id === id);
      if (idx >= 0) {
        memoryFormRequirements[idx] = req;
      } else {
        memoryFormRequirements.push(req);
      }
      await formReqsDb.setItem(id, req);
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'formRequirements', id), cleanForFirestore(req), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `formRequirements/${id}`));
      }
    },
    async create(req: Omit<FormRequirement, 'id'> & { id?: string }): Promise<FormRequirement> {
      const id = req.id || `req-${Date.now()}`;
      const newReq: FormRequirement = { ...req, id };
      await this.set(id, newReq);
      return newReq;
    },
    async update(id: string, req: Partial<FormRequirement>): Promise<FormRequirement | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...req, id };
      await this.set(id, updated);
      return updated;
    },
    async listAll(): Promise<FormRequirement[]> {
      try {
        const keys = await formReqsDb.keys();
        if (keys.length > 0) {
          const items: FormRequirement[] = [];
          for (const key of keys) {
            const item = await formReqsDb.getItem(key);
            if (item) items.push(item);
          }
          if (items.length > 0) {
            memoryFormRequirements = items;
            return [...items];
          }
        } else {
          for (const r of defaultFormRequirements) {
            await formReqsDb.setItem(r.id, r);
          }
          memoryFormRequirements = [...defaultFormRequirements];
          return [...defaultFormRequirements];
        }
      } catch (e) {
        console.warn("FormRequirements list fetch notice:", e);
      }
      return [...memoryFormRequirements];
    },
    async delete(id: string): Promise<void> {
      memoryFormRequirements = memoryFormRequirements.filter(r => r.id !== id);
      formReqsDb.removeItem(id).catch(() => {});
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'formRequirements', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `formRequirements/${id}`));
      }
    }
  },

  files: {
    getCached(): SystemFile[] {
      return [...memoryFiles];
    },
    async get(id: string): Promise<SystemFile | null> {
      const mem = memoryFiles.find(f => f.id === id);
      if (mem) return mem;
      return await systemFilesDb.getItem(id);
    },
    async set(id: string, file: SystemFile): Promise<void> {
      const idx = memoryFiles.findIndex(f => f.id === id);
      if (idx >= 0) {
        memoryFiles[idx] = file;
      } else {
        memoryFiles.push(file);
      }
      systemFilesDb.setItem(id, file).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'files', id), cleanForFirestore(file), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `files/${id}`));
      }
    },
    async create(file: Omit<SystemFile, 'id'> & { id?: string }): Promise<SystemFile> {
      const id = file.id || `file-${Date.now()}`;
      const newFile: SystemFile = { ...file, id };
      await this.set(id, newFile);
      return newFile;
    },
    async update(id: string, file: Partial<SystemFile>): Promise<SystemFile | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...file, id };
      await this.set(id, updated);
      return updated;
    },
    async listAll(): Promise<SystemFile[]> {
      return [...memoryFiles];
    },
    async delete(id: string): Promise<void> {
      memoryFiles = memoryFiles.filter(f => f.id !== id);
      systemFilesDb.removeItem(id).catch(() => {});
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'files', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `files/${id}`));
      }
    }
  },

  notifications: {
    getCached(): NotificationItem[] {
      return [...memoryNotifications];
    },
    subscribe(callback: (notifs: NotificationItem[]) => void): () => void {
      notificationListeners.add(callback);
      callback([...memoryNotifications]);
      return () => { notificationListeners.delete(callback); };
    },
    async get(id: string): Promise<NotificationItem | null> {
      const mem = memoryNotifications.find(n => n.id === id);
      if (mem) return mem;
      return await notificationsDb.getItem(id);
    },
    async set(id: string, notif: NotificationItem): Promise<void> {
      if (!notif.createdAt) {
        const parsed = parseNotificationDate(notif.timestamp, id);
        notif.createdAt = parsed ? parsed.toISOString() : new Date().toISOString();
      }
      const idx = memoryNotifications.findIndex(n => n.id === id);
      if (idx >= 0) {
        memoryNotifications[idx] = notif;
      } else {
        memoryNotifications.unshift(notif);
      }
      memoryNotifications = sortNotifications(memoryNotifications);
      notifyNotificationListeners();
      notificationsDb.setItem(id, notif).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'notifications', id), cleanForFirestore(notif), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `notifications/${id}`));
      }
    },
    async create(notif: Omit<NotificationItem, 'id'> & { id?: string }): Promise<NotificationItem> {
      const now = new Date().toISOString();
      const id = notif.id || `notif-${Date.now()}`;
      const createdAt = notif.createdAt || now;
      const timestamp = (notif.timestamp && notif.timestamp !== 'Just now') ? notif.timestamp : now;
      const newNotif: NotificationItem = { ...notif, id, timestamp, createdAt };
      await this.set(id, newNotif);
      return newNotif;
    },
    async markAsRead(id: string): Promise<void> {
      const existing = await this.get(id);
      if (existing) {
        await this.set(id, { ...existing, read: true });
      }
    },
    async markAllAsRead(): Promise<void> {
      const unread = memoryNotifications.filter(n => !n.read);
      for (const notif of unread) {
        await this.set(notif.id, { ...notif, read: true });
      }
    },
    async markAsUnread(id: string): Promise<void> {
      const existing = await this.get(id);
      if (existing) {
        await this.set(id, { ...existing, read: false });
      }
    },
    async markAllAsUnread(): Promise<void> {
      let changed = false;
      const updates: NotificationItem[] = [];

      memoryNotifications = (memoryNotifications || []).filter(Boolean).map(item => {
        if (item.read !== false) {
          changed = true;
          const updated = { ...item, read: false };
          updates.push(updated);
          return updated;
        }
        return item;
      });

      if (!changed) return;

      notifyNotificationListeners();

      for (const item of updates) {
        notificationsDb.setItem(item.id, item).catch(() => {});
      }

      if (firestoreDb) {
        await Promise.all(updates.map(item => 
          setDoc(doc(firestoreDb, 'notifications', item.id), cleanForFirestore(item), { merge: true })
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `notifications/${item.id}`))
        ));
      }
    },
    async listAll(): Promise<NotificationItem[]> {
      return [...memoryNotifications];
    },
    async delete(id: string): Promise<void> {
      memoryNotifications = memoryNotifications.filter(n => n.id !== id);
      notifyNotificationListeners();
      notificationsDb.removeItem(id).catch(() => {});
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'notifications', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `notifications/${id}`));
      }
    }
  },

  communications: {
    async get(id: string): Promise<CommunicationItem | null> {
      const mem = memoryCommunications.find(c => c.id === id);
      if (mem) return mem;
      return await communicationsDb.getItem(id);
    },
    async set(id: string, comm: CommunicationItem): Promise<void> {
      const idx = memoryCommunications.findIndex(c => c.id === id);
      if (idx >= 0) {
        memoryCommunications[idx] = comm;
      } else {
        memoryCommunications.unshift(comm);
      }
      communicationsDb.setItem(id, comm).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'communications', id), cleanForFirestore(comm), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `communications/${id}`));
      }
    },
    async create(comm: Omit<CommunicationItem, 'id'> & { id?: string }): Promise<CommunicationItem> {
      const id = comm.id || `comm-${Date.now()}`;
      const newComm: CommunicationItem = { ...comm, id };
      await this.set(id, newComm);
      return newComm;
    },
    async listAll(): Promise<CommunicationItem[]> {
      if (memoryCommunications.length > 0) {
        return [...memoryCommunications];
      }
      const keys = await communicationsDb.keys();
      if (keys.length > 0) {
        const items: CommunicationItem[] = [];
        for (const key of keys) {
          const item = await communicationsDb.getItem(key);
          if (item) items.push(item);
        }
        memoryCommunications = items.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        return [...memoryCommunications];
      }
      return [];
    },
    async delete(id: string): Promise<void> {
      memoryCommunications = memoryCommunications.filter(c => c.id !== id);
      communicationsDb.removeItem(id).catch(() => {});
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'communications', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `communications/${id}`));
      }
    }
  },

  users: {
    async get(id: string): Promise<User | null> {
      const local = await usersDb.getItem(id);
      if (local) return local;
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'users', id));
          if (snap.exists()) {
            const data = snap.data() as User;
            usersDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `users/${id}`);
        }
      }
      return null;
    },
    async set(id: string, user: User): Promise<void> {
      await usersDb.setItem(id, user);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'users', id), cleanForFirestore(user), { merge: true });
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `users/${id}`);
        }
      }
    },
    async create(user: User): Promise<User> {
      await this.set(user.id, user);
      return user;
    },
    async update(id: string, user: Partial<User>): Promise<User | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...user, id };
      await this.set(id, updated);
      return updated;
    },
    async findByEmail(email: string): Promise<User | null> {
      const keys = await usersDb.keys();
      for (const key of keys) {
        const user = await usersDb.getItem(key);
        if (user && user.email?.toLowerCase() === email.toLowerCase()) return user;
      }
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'users'));
          for (const docSnap of snap.docs) {
            const u = docSnap.data() as User;
            if (u.email?.toLowerCase() === email.toLowerCase()) {
              await usersDb.setItem(u.id, u);
              return u;
            }
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.LIST, 'users');
        }
      }
      return null;
    }
  },

  forms: {
    async get(id: string): Promise<ScholarshipForm | null> {
      const local = await formsDb.getItem(id);
      if (local) return local;
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'forms', id));
          if (snap.exists()) {
            const data = snap.data() as ScholarshipForm;
            formsDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `forms/${id}`);
        }
      }
      return null;
    },
    async set(id: string, form: ScholarshipForm): Promise<void> {
      await formsDb.setItem(id, form);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'forms', id), cleanForFirestore(form), { merge: true });
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `forms/${id}`);
        }
      }
    },
    async create(form: Omit<ScholarshipForm, 'id'> & { id?: string }): Promise<ScholarshipForm> {
      const id = form.id || `form-${Date.now()}`;
      const newForm: ScholarshipForm = { ...form, id };
      await this.set(id, newForm);
      return newForm;
    },
    async update(id: string, form: Partial<ScholarshipForm>): Promise<ScholarshipForm | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...form, id };
      await this.set(id, updated);
      return updated;
    },
    async listAll(): Promise<ScholarshipForm[]> {
      const keys = await formsDb.keys();
      const forms: ScholarshipForm[] = [];
      for (const key of keys) {
        const form = await formsDb.getItem(key);
        if (form) forms.push(form);
      }
      if (forms.length > 0) {
        return forms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'forms'));
          snap.forEach(docSnap => {
            forms.push(docSnap.data() as ScholarshipForm);
          });
          if (forms.length > 0) {
            Promise.all(forms.map(f => formsDb.setItem(f.id, f))).catch(() => {});
            return forms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.LIST, 'forms');
        }
      }
      return [];
    },
    async delete(id: string): Promise<void> {
      await formsDb.removeItem(id);
      if (firestoreDb) {
        try {
          await deleteDoc(doc(firestoreDb, 'forms', id));
        } catch (e) {
          handleFirestoreError(e, OperationType.DELETE, `forms/${id}`);
        }
      }
    }
  },

  system: {
    async syncAll(): Promise<{
      success: boolean;
      totalRecords: number;
      totalFiles: number;
      collections: string[];
      lastSyncedAt: string;
      cloudConnected: boolean;
    }> {
      const cloudConnected = Boolean(firestoreDb);
      const totalRecords = memorySubmissions.length + memoryScholarships.length + memoryCourses.length + memoryAcademicYears.length;
      let totalFiles = memoryFiles.length;
      memorySubmissions.forEach(s => { totalFiles += (s.files || []).length; });

      const syncInfo = {
        success: true,
        totalRecords,
        totalFiles,
        collections: [
          `Submissions (${memorySubmissions.length} records)`,
          `Scholarships (${memoryScholarships.length} programs)`,
          `Courses (${memoryCourses.length} degree programs)`,
          `Academic Terms (${memoryAcademicYears.length} school years)`,
          `Sections (${memorySections.length} class sections)`,
          `Document Requirements (${memoryFormRequirements.length} items)`,
          `Institutional Files (${memoryFiles.length} files)`,
          `Notifications (${memoryNotifications.length} alerts)`
        ],
        lastSyncedAt: new Date().toISOString(),
        cloudConnected
      };

      try {
        localStorage.setItem('capsu_system_sync_info', JSON.stringify(syncInfo));
      } catch (e) { /* ignore */ }

      return syncInfo;
    },

    getSyncStatus(): {
      totalRecords: number;
      totalFiles: number;
      lastSyncedAt: string;
      cloudConnected: boolean;
    } {
      try {
        const stored = localStorage.getItem('capsu_system_sync_info');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) { /* ignore */ }

      return {
        totalRecords: memorySubmissions.length + memoryScholarships.length,
        totalFiles: 42,
        lastSyncedAt: new Date().toISOString(),
        cloudConnected: Boolean(firestoreDb)
      };
    }
  }
};

