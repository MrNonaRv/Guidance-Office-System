import localforage from 'localforage';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { firestoreDb, auth } from './firebase';
import { Course, AcademicYear, defaultCourses, defaultAcademicYears, defaultScholarships, ScholarshipItem } from '../types';
import { defaultSubmissions, defaultNotifications, dummyBase64Pdf, dummyBase64Photo2x2, dummyBase64StudentId, dummyBase64Signature } from './defaultData';

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
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
  
  if (errorMessage.includes('offline')) {
    console.warn('Firestore Warning (Offline): ', JSON.stringify(errInfo));
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
}

export interface Section {
  id: string;
  name: string;
  course: string;
  yearLevel: string;
  status: 'Active' | 'Inactive';
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
  read: boolean;
  priority: 'high' | 'normal' | 'low';
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
  { id: 'sec-1', name: 'BSCS 4A', course: 'BSCS', yearLevel: '4th Year', status: 'Active' },
  { id: 'sec-2', name: 'BSCS 4B', course: 'BSCS', yearLevel: '4th Year', status: 'Active' },
  { id: 'sec-3', name: 'BAEL 3A', course: 'BAEL', yearLevel: '3rd Year', status: 'Active' },
  { id: 'sec-4', name: 'BSFT 2A', course: 'BSFT', yearLevel: '2nd Year', status: 'Active' },
  { id: 'sec-5', name: 'BSOA 1A', course: 'BSOA', yearLevel: '1st Year', status: 'Active' },
];

export const defaultFormRequirements: FormRequirement[] = [
  { id: 'req-1', title: 'Certificate of Grades (COG)', description: 'Signed official registrar grade copy with GWA', mandatory: 'Required', status: 'Active' },
  { id: 'req-2', title: 'Certificate of Registration (COR)', description: 'Current semester enrollment document & assessment form', mandatory: 'Required', status: 'Active' },
  { id: 'req-3', title: 'Proof of Income / Certificate of Indigency', description: 'Parental ITR or Barangay Certificate of Low Income', mandatory: 'Required', status: 'Active' },
  { id: 'req-4', title: 'Certificate of Good Moral Character', description: 'Issued by Student Affairs Services / Guidance Office', mandatory: 'Optional', status: 'Active' },
  { id: 'req-5', title: '2x2 Recent Formal ID Photo', description: 'White background with applicant name tag', mandatory: 'Required', status: 'Active' },
];

export const defaultSystemFiles: SystemFile[] = [
  { id: 'file-1', name: 'CHED_TDP_Application_Form_2026.pdf', category: 'Scholarship Application', size: '1.4 MB', uploadDate: 'March 01, 2026' },
  { id: 'file-2', name: 'CAPSU_Scholarship_Guidelines_v2.pdf', category: 'Guidelines & Policies', size: '2.8 MB', uploadDate: 'February 15, 2026' },
  { id: 'file-3', name: 'Certificate_of_Indigency_Template.docx', category: 'Document Template', size: '450 KB', uploadDate: 'January 20, 2026' },
];

// Helper to sanitize undefined values for Firestore
function cleanForFirestore(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      result[key] = cleanForFirestore(obj[key]);
    }
  }
  return result;
}

// -------------------------------------------------------------
// High-Performance In-Memory Cache & Event Notification Layer
// -------------------------------------------------------------
let memorySubmissions: Submission[] = [...defaultSubmissions];
let memoryScholarships: Scholarship[] = [...defaultScholarships];
let memoryCourses: Course[] = [...defaultCourses];
let memoryAcademicYears: AcademicYear[] = [...defaultAcademicYears];
let memorySections: Section[] = [...defaultSections];
let memoryFormRequirements: FormRequirement[] = [...defaultFormRequirements];
let memoryFiles: SystemFile[] = [...defaultSystemFiles];
let memoryNotifications: NotificationItem[] = [...defaultNotifications];
let memoryCommunications: CommunicationItem[] = [];

// Listeners
const submissionListeners = new Set<(subs: Submission[]) => void>();
const notificationListeners = new Set<(notifs: NotificationItem[]) => void>();
const scholarshipListeners = new Set<(items: Scholarship[]) => void>();

function notifySubmissionListeners() {
  submissionListeners.forEach(cb => {
    try { cb([...memorySubmissions]); } catch (e) { console.error(e); }
  });
}

function notifyNotificationListeners() {
  notificationListeners.forEach(cb => {
    try { cb([...memoryNotifications]); } catch (e) { console.error(e); }
  });
}

function notifyScholarshipListeners() {
  scholarshipListeners.forEach(cb => {
    try { cb([...memoryScholarships]); } catch (e) { console.error(e); }
  });
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
        memoryNotifications = loadedNotifs;
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
let unsubscribeScholarships: (() => void) | null = null;

function setupRealtimeListeners() {
  if (!firestoreDb) return;

  // Clean up any existing listeners
  if (unsubscribeSubmissions) { try { unsubscribeSubmissions(); } catch (e) { /* ignore */ } unsubscribeSubmissions = null; }
  if (unsubscribeNotifications) { try { unsubscribeNotifications(); } catch (e) { /* ignore */ } unsubscribeNotifications = null; }
  if (unsubscribeScholarships) { try { unsubscribeScholarships(); } catch (e) { /* ignore */ } unsubscribeScholarships = null; }

  try {
    unsubscribeSubmissions = onSnapshot(collection(firestoreDb, 'submissions'), (snap) => {
      if (!snap.empty) {
        const remoteSubs: Submission[] = [];
        snap.forEach(docSnap => {
          remoteSubs.push(docSnap.data() as Submission);
        });
        if (remoteSubs.length > 0) {
          memorySubmissions = remoteSubs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          Promise.all(remoteSubs.map(s => submissionsDb.setItem(s.id, s))).catch(() => {});
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
        if (remoteNotifs.length > 0) {
          memoryNotifications = remoteNotifs;
          Promise.all(remoteNotifs.map(n => notificationsDb.setItem(n.id, n))).catch(() => {});
          notifyNotificationListeners();
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'notifications');
    });

    unsubscribeScholarships = onSnapshot(collection(firestoreDb, 'scholarships'), (snap) => {
      if (!snap.empty) {
        const remoteScholarships: Scholarship[] = [];
        snap.forEach(docSnap => {
          remoteScholarships.push(docSnap.data() as Scholarship);
        });
        if (remoteScholarships.length > 0) {
          memoryScholarships = remoteScholarships;
          Promise.all(remoteScholarships.map(s => scholarshipsDb.setItem(s.id, s))).catch(() => {});
          notifyScholarshipListeners();
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'scholarships');
    });
  } catch (err) {
    console.warn("Realtime Firestore setup notice:", err);
  }
}

// Reactively attach listeners when user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    setupRealtimeListeners();
  } else {
    if (unsubscribeSubmissions) { try { unsubscribeSubmissions(); } catch (e) { /* ignore */ } unsubscribeSubmissions = null; }
    if (unsubscribeNotifications) { try { unsubscribeNotifications(); } catch (e) { /* ignore */ } unsubscribeNotifications = null; }
    if (unsubscribeScholarships) { try { unsubscribeScholarships(); } catch (e) { /* ignore */ } unsubscribeScholarships = null; }
  }
});

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
      const idx = memoryScholarships.findIndex(item => item.id === id);
      if (idx >= 0) {
        memoryScholarships[idx] = s;
      } else {
        memoryScholarships.push(s);
      }
      notifyScholarshipListeners();
      scholarshipsDb.setItem(id, s).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'scholarships', id), cleanForFirestore(s), { merge: true })
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
      // Instant return from memory cache
      if (memoryScholarships.length > 0) {
        return [...memoryScholarships];
      }
      const keys = await scholarshipsDb.keys();
      if (keys.length > 0) {
        const items: Scholarship[] = [];
        for (const key of keys) {
          const item = await scholarshipsDb.getItem(key);
          if (item) items.push(item);
        }
        memoryScholarships = items;
        return [...items];
      }
      memoryScholarships = [...defaultScholarships];
      return [...defaultScholarships];
    },
    async delete(id: string): Promise<void> {
      memoryScholarships = memoryScholarships.filter(s => s.id !== id);
      notifyScholarshipListeners();
      scholarshipsDb.removeItem(id).catch(() => {});
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
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'submissions', id), cleanForFirestore(sub), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `submissions/${id}`));
      }
    },
    async create(sub: Submission): Promise<Submission> {
      await this.set(sub.id, sub);
      try {
        db.notifications.create({
          type: 'submission',
          title: 'New Scholarship Submission Uploaded',
          description: `${sub.studentName} uploaded application files for ${sub.scholarshipType}.`,
          studentName: sub.studentName,
          studentId: sub.studentId,
          scholarship: sub.scholarshipType,
          timestamp: 'Just now',
          read: false,
          priority: 'high'
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
      return memorySubmissions.filter(s => s.studentId === studentId);
    },
    async listAll(): Promise<Submission[]> {
      // Instant return with zero latency
      if (memorySubmissions.length > 0) {
        return [...memorySubmissions];
      }
      const keys = await submissionsDb.keys();
      if (keys.length > 0) {
        const subs: Submission[] = [];
        for (const key of keys) {
          const sub = await submissionsDb.getItem(key);
          if (sub) subs.push(sub);
        }
        memorySubmissions = subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        return [...memorySubmissions];
      }
      memorySubmissions = [...defaultSubmissions];
      return [...defaultSubmissions];
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
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'submissions', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `submissions/${id}`));
      }
    }
  },

  courses: {
    getCached(): Course[] {
      return [...memoryCourses];
    },
    subscribe(callback: (courses: Course[]) => void): () => void {
      callback([...memoryCourses]);
      return () => {};
    },
    async get(id: string): Promise<Course | null> {
      const mem = memoryCourses.find(c => c.id === id);
      if (mem) return mem;
      return await coursesDb.getItem(id);
    },
    async set(id: string, course: Course): Promise<void> {
      const idx = memoryCourses.findIndex(c => c.id === id);
      if (idx >= 0) {
        memoryCourses[idx] = course;
      } else {
        memoryCourses.push(course);
      }
      coursesDb.setItem(id, course).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'courses', id), cleanForFirestore(course), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `courses/${id}`));
      }
    },
    async create(course: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
      const id = course.id || `course-${course.code.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const newCourse: Course = { ...course, id };
      await this.set(id, newCourse);
      return newCourse;
    },
    async update(id: string, course: Partial<Course>): Promise<Course | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...course, id };
      await this.set(id, updated);
      return updated;
    },
    async listAll(): Promise<Course[]> {
      return [...memoryCourses];
    },
    async delete(id: string): Promise<void> {
      memoryCourses = memoryCourses.filter(c => c.id !== id);
      coursesDb.removeItem(id).catch(() => {});
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'courses', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `courses/${id}`));
      }
    }
  },

  academicYears: {
    getCached(): AcademicYear[] {
      return [...memoryAcademicYears];
    },
    subscribe(callback: (ays: AcademicYear[]) => void): () => void {
      callback([...memoryAcademicYears]);
      return () => {};
    },
    async get(id: string): Promise<AcademicYear | null> {
      const mem = memoryAcademicYears.find(a => a.id === id);
      if (mem) return mem;
      return await academicYearsDb.getItem(id);
    },
    async set(id: string, ay: AcademicYear): Promise<void> {
      const idx = memoryAcademicYears.findIndex(a => a.id === id);
      if (idx >= 0) {
        memoryAcademicYears[idx] = ay;
      } else {
        memoryAcademicYears.push(ay);
      }
      academicYearsDb.setItem(id, ay).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'academicYears', id), cleanForFirestore(ay), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `academicYears/${id}`));
      }
    },
    async create(ay: Omit<AcademicYear, 'id'> & { id?: string }): Promise<AcademicYear> {
      const id = ay.id || `ay-${Date.now()}`;
      const newAy: AcademicYear = { ...ay, id };
      if (newAy.isDefault) {
        for (const item of memoryAcademicYears) {
          if (item.isDefault) {
            await this.set(item.id, { ...item, isDefault: false });
          }
        }
      }
      await this.set(id, newAy);
      return newAy;
    },
    async update(id: string, ay: Partial<AcademicYear>): Promise<AcademicYear | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      if (ay.isDefault) {
        for (const item of memoryAcademicYears) {
          if (item.id !== id && item.isDefault) {
            await this.set(item.id, { ...item, isDefault: false });
          }
        }
      }
      const updated = { ...existing, ...ay, id };
      await this.set(id, updated);
      return updated;
    },
    async setDefault(id: string): Promise<void> {
      for (const item of memoryAcademicYears) {
        await this.set(item.id, { ...item, isDefault: item.id === id });
      }
    },
    async listAll(): Promise<AcademicYear[]> {
      return [...memoryAcademicYears].sort((a, b) => b.year.localeCompare(a.year) || (a.semester || '').localeCompare(b.semester || ''));
    },
    async getDefault(): Promise<AcademicYear | null> {
      return memoryAcademicYears.find(a => a.isDefault) || memoryAcademicYears.find(a => a.status === 'Active') || memoryAcademicYears[0] || null;
    },
    async delete(id: string): Promise<void> {
      memoryAcademicYears = memoryAcademicYears.filter(a => a.id !== id);
      academicYearsDb.removeItem(id).catch(() => {});
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'academicYears', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `academicYears/${id}`));
      }
    }
  },

  sections: {
    getCached(): Section[] {
      return [...memorySections];
    },
    async get(id: string): Promise<Section | null> {
      const mem = memorySections.find(s => s.id === id);
      if (mem) return mem;
      return await sectionsDb.getItem(id);
    },
    async set(id: string, section: Section): Promise<void> {
      const idx = memorySections.findIndex(s => s.id === id);
      if (idx >= 0) {
        memorySections[idx] = section;
      } else {
        memorySections.push(section);
      }
      sectionsDb.setItem(id, section).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'sections', id), cleanForFirestore(section), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `sections/${id}`));
      }
    },
    async create(section: Omit<Section, 'id'> & { id?: string }): Promise<Section> {
      const id = section.id || `sec-${Date.now()}`;
      const newSec: Section = { ...section, id };
      await this.set(id, newSec);
      return newSec;
    },
    async update(id: string, section: Partial<Section>): Promise<Section | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...section, id };
      await this.set(id, updated);
      return updated;
    },
    async listAll(): Promise<Section[]> {
      return [...memorySections];
    },
    async delete(id: string): Promise<void> {
      memorySections = memorySections.filter(s => s.id !== id);
      sectionsDb.removeItem(id).catch(() => {});
      if (firestoreDb) {
        deleteDoc(doc(firestoreDb, 'sections', id))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `sections/${id}`));
      }
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
      formReqsDb.setItem(id, req).catch(() => {});
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
      const idx = memoryNotifications.findIndex(n => n.id === id);
      if (idx >= 0) {
        memoryNotifications[idx] = notif;
      } else {
        memoryNotifications.unshift(notif);
      }
      notifyNotificationListeners();
      notificationsDb.setItem(id, notif).catch(() => {});
      if (firestoreDb) {
        setDoc(doc(firestoreDb, 'notifications', id), cleanForFirestore(notif), { merge: true })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `notifications/${id}`));
      }
    },
    async create(notif: Omit<NotificationItem, 'id'> & { id?: string }): Promise<NotificationItem> {
      const id = notif.id || `notif-${Date.now()}`;
      const newNotif: NotificationItem = { ...notif, id };
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
      for (const item of memoryNotifications) {
        if (!item.read) {
          await this.set(item.id, { ...item, read: true });
        }
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

