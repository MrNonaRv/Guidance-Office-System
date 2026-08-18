import localforage from 'localforage';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { firestoreDb } from './firebase';
import { Course, AcademicYear, defaultCourses, defaultAcademicYears, defaultScholarships, ScholarshipItem } from '../types';

export interface Scholarship extends ScholarshipItem {}

const scholarshipsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'scholarships' });
const coursesDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'courses' });
const academicYearsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'academicYears' });
const usersDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'users' });
const submissionsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'submissions' });
const formsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'forms' });

export interface User {
  id: string;
  email: string;
  firstName: string;
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

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  scholarshipType: string; // Could also map to formId
  formId?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Complete' | 'Incomplete';
  submittedAt: string;
  answers?: Record<string, string>;
  data?: any;
  files: {
    id?: string;
    name: string;
    type: string;
    data: string; // base64
  }[];
}

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

export const db = {
  scholarships: {
    async get(id: string): Promise<Scholarship | null> {
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'scholarships', id));
          if (snap.exists()) {
            const data = snap.data() as Scholarship;
            await scholarshipsDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          console.warn("Firestore scholarships.get fallback to local cache", e);
        }
      }
      return await scholarshipsDb.getItem(id);
    },
    async set(id: string, s: Scholarship): Promise<void> {
      await scholarshipsDb.setItem(id, s);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'scholarships', id), cleanForFirestore(s), { merge: true });
        } catch (e) {
          console.warn("Firestore scholarships.set error", e);
        }
      }
    },
    async create(s: Omit<Scholarship, 'id'> & { id?: string }): Promise<Scholarship> {
      const id = s.id || `scholarship-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'scholarships'));
          if (!snap.empty) {
            const items: Scholarship[] = [];
            snap.forEach(docSnap => {
              items.push(docSnap.data() as Scholarship);
            });
            // Update local cache
            for (const item of items) {
              await scholarshipsDb.setItem(item.id, item);
            }
            return items;
          } else {
            // Seed defaults to Firestore
            for (const item of defaultScholarships) {
              await setDoc(doc(firestoreDb, 'scholarships', item.id), cleanForFirestore(item), { merge: true });
              await scholarshipsDb.setItem(item.id, item);
            }
            return [...defaultScholarships];
          }
        } catch (e) {
          console.warn("Firestore scholarships.listAll fallback to local cache", e);
        }
      }
      // Fallback to local cache
      const keys = await scholarshipsDb.keys();
      if (keys.length === 0) {
        for (const item of defaultScholarships) {
          await scholarshipsDb.setItem(item.id, item);
        }
        return [...defaultScholarships];
      }
      const items: Scholarship[] = [];
      for (const key of keys) {
        const item = await scholarshipsDb.getItem<Scholarship>(key);
        if (item) items.push(item);
      }
      return items;
    },
    async delete(id: string): Promise<void> {
      await scholarshipsDb.removeItem(id);
      if (firestoreDb) {
        try {
          await deleteDoc(doc(firestoreDb, 'scholarships', id));
        } catch (e) {
          console.warn("Firestore scholarships.delete error", e);
        }
      }
    }
  },

  users: {
    async get(id: string): Promise<User | null> {
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'users', id));
          if (snap.exists()) {
            const data = snap.data() as User;
            await usersDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          console.warn("Firestore users.get fallback", e);
        }
      }
      return await usersDb.getItem(id);
    },
    async set(id: string, user: User): Promise<void> {
      await usersDb.setItem(id, user);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'users', id), cleanForFirestore(user), { merge: true });
        } catch (e) {
          console.warn("Firestore users.set error", e);
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
          console.warn("Firestore findByEmail fallback", e);
        }
      }
      const keys = await usersDb.keys();
      for (const key of keys) {
        const user = await usersDb.getItem<User>(key);
        if (user && user.email?.toLowerCase() === email.toLowerCase()) return user;
      }
      return null;
    }
  },

  forms: {
    async get(id: string): Promise<ScholarshipForm | null> {
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'forms', id));
          if (snap.exists()) {
            const data = snap.data() as ScholarshipForm;
            await formsDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          console.warn("Firestore forms.get fallback", e);
        }
      }
      return await formsDb.getItem(id);
    },
    async set(id: string, form: ScholarshipForm): Promise<void> {
      await formsDb.setItem(id, form);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'forms', id), cleanForFirestore(form), { merge: true });
        } catch (e) {
          console.warn("Firestore forms.set error", e);
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
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'forms'));
          const forms: ScholarshipForm[] = [];
          snap.forEach(docSnap => {
            forms.push(docSnap.data() as ScholarshipForm);
          });
          if (forms.length > 0) {
            for (const f of forms) {
              await formsDb.setItem(f.id, f);
            }
            return forms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }
        } catch (e) {
          console.warn("Firestore forms.listAll fallback", e);
        }
      }
      const keys = await formsDb.keys();
      const forms: ScholarshipForm[] = [];
      for (const key of keys) {
        const form = await formsDb.getItem<ScholarshipForm>(key);
        if (form) forms.push(form);
      }
      return forms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async delete(id: string): Promise<void> {
      await formsDb.removeItem(id);
      if (firestoreDb) {
        try {
          await deleteDoc(doc(firestoreDb, 'forms', id));
        } catch (e) {
          console.warn("Firestore forms.delete error", e);
        }
      }
    }
  },

  submissions: {
    async get(id: string): Promise<Submission | null> {
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'submissions', id));
          if (snap.exists()) {
            const data = snap.data() as Submission;
            await submissionsDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          console.warn("Firestore submissions.get fallback", e);
        }
      }
      return await submissionsDb.getItem(id);
    },
    async set(id: string, sub: Submission): Promise<void> {
      await submissionsDb.setItem(id, sub);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'submissions', id), cleanForFirestore(sub), { merge: true });
        } catch (e) {
          console.warn("Firestore submissions.set error", e);
        }
      }
    },
    async create(sub: Submission): Promise<Submission> {
      await this.set(sub.id, sub);
      return sub;
    },
    async update(id: string, sub: Partial<Submission>): Promise<Submission | null> {
      const existing = await this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...sub, id };
      await this.set(id, updated);
      return updated;
    },
    async listByStudent(studentId: string): Promise<Submission[]> {
      const all = await this.listAll();
      return all.filter(s => s.studentId === studentId);
    },
    async listAll(): Promise<Submission[]> {
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'submissions'));
          const subs: Submission[] = [];
          snap.forEach(docSnap => {
            subs.push(docSnap.data() as Submission);
          });
          if (subs.length > 0) {
            for (const s of subs) {
              await submissionsDb.setItem(s.id, s);
            }
            return subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          }
        } catch (e) {
          console.warn("Firestore submissions.listAll fallback", e);
        }
      }
      const keys = await submissionsDb.keys();
      const subs: Submission[] = [];
      for (const key of keys) {
        const sub = await submissionsDb.getItem<Submission>(key);
        if (sub) subs.push(sub);
      }
      return subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    },
    async delete(id: string): Promise<void> {
      await submissionsDb.removeItem(id);
      if (firestoreDb) {
        try {
          await deleteDoc(doc(firestoreDb, 'submissions', id));
        } catch (e) {
          console.warn("Firestore submissions.delete error", e);
        }
      }
    }
  },

  courses: {
    async get(id: string): Promise<Course | null> {
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'courses', id));
          if (snap.exists()) {
            const data = snap.data() as Course;
            await coursesDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          console.warn("Firestore courses.get fallback", e);
        }
      }
      return await coursesDb.getItem(id);
    },
    async set(id: string, course: Course): Promise<void> {
      await coursesDb.setItem(id, course);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'courses', id), cleanForFirestore(course), { merge: true });
        } catch (e) {
          console.warn("Firestore courses.set error", e);
        }
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
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'courses'));
          if (!snap.empty) {
            const items: Course[] = [];
            snap.forEach(docSnap => {
              items.push(docSnap.data() as Course);
            });
            for (const item of items) {
              await coursesDb.setItem(item.id, item);
            }
            return items;
          } else {
            // Seed 4 courses to Firestore
            for (const c of defaultCourses) {
              await setDoc(doc(firestoreDb, 'courses', c.id), cleanForFirestore(c), { merge: true });
              await coursesDb.setItem(c.id, c);
            }
            return [...defaultCourses];
          }
        } catch (e) {
          console.warn("Firestore courses.listAll fallback", e);
        }
      }
      const keys = await coursesDb.keys();
      if (keys.length === 0) {
        for (const c of defaultCourses) {
          await coursesDb.setItem(c.id, c);
        }
        return [...defaultCourses];
      }
      const items: Course[] = [];
      for (const key of keys) {
        const item = await coursesDb.getItem<Course>(key);
        if (item) items.push(item);
      }
      return items;
    },
    async delete(id: string): Promise<void> {
      await coursesDb.removeItem(id);
      if (firestoreDb) {
        try {
          await deleteDoc(doc(firestoreDb, 'courses', id));
        } catch (e) {
          console.warn("Firestore courses.delete error", e);
        }
      }
    }
  },

  academicYears: {
    async get(id: string): Promise<AcademicYear | null> {
      if (firestoreDb) {
        try {
          const snap = await getDoc(doc(firestoreDb, 'academicYears', id));
          if (snap.exists()) {
            const data = snap.data() as AcademicYear;
            await academicYearsDb.setItem(id, data);
            return data;
          }
        } catch (e) {
          console.warn("Firestore academicYears.get fallback", e);
        }
      }
      return await academicYearsDb.getItem(id);
    },
    async set(id: string, ay: AcademicYear): Promise<void> {
      await academicYearsDb.setItem(id, ay);
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'academicYears', id), cleanForFirestore(ay), { merge: true });
        } catch (e) {
          console.warn("Firestore academicYears.set error", e);
        }
      }
    },
    async create(ay: Omit<AcademicYear, 'id'> & { id?: string }): Promise<AcademicYear> {
      const id = ay.id || `ay-${Date.now()}`;
      const newAy: AcademicYear = { ...ay, id };
      if (newAy.isDefault) {
        const all = await this.listAll();
        for (const item of all) {
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
        const all = await this.listAll();
        for (const item of all) {
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
      const all = await this.listAll();
      for (const item of all) {
        await this.set(item.id, { ...item, isDefault: item.id === id });
      }
    },
    async listAll(): Promise<AcademicYear[]> {
      if (firestoreDb) {
        try {
          const snap = await getDocs(collection(firestoreDb, 'academicYears'));
          if (!snap.empty) {
            const items: AcademicYear[] = [];
            snap.forEach(docSnap => {
              items.push(docSnap.data() as AcademicYear);
            });
            for (const item of items) {
              await academicYearsDb.setItem(item.id, item);
            }
            return items.sort((a, b) => b.year.localeCompare(a.year) || a.semester.localeCompare(b.semester));
          } else {
            for (const ay of defaultAcademicYears) {
              await setDoc(doc(firestoreDb, 'academicYears', ay.id), cleanForFirestore(ay), { merge: true });
              await academicYearsDb.setItem(ay.id, ay);
            }
            return [...defaultAcademicYears];
          }
        } catch (e) {
          console.warn("Firestore academicYears.listAll fallback", e);
        }
      }
      const keys = await academicYearsDb.keys();
      if (keys.length === 0) {
        for (const ay of defaultAcademicYears) {
          await academicYearsDb.setItem(ay.id, ay);
        }
        return [...defaultAcademicYears];
      }
      const items: AcademicYear[] = [];
      for (const key of keys) {
        const item = await academicYearsDb.getItem<AcademicYear>(key);
        if (item) items.push(item);
      }
      return items.sort((a, b) => b.year.localeCompare(a.year) || a.semester.localeCompare(b.semester));
    },
    async getDefault(): Promise<AcademicYear | null> {
      const all = await this.listAll();
      return all.find(a => a.isDefault) || all.find(a => a.status === 'Active') || all[0] || null;
    },
    async delete(id: string): Promise<void> {
      await academicYearsDb.removeItem(id);
      if (firestoreDb) {
        try {
          await deleteDoc(doc(firestoreDb, 'academicYears', id));
        } catch (e) {
          console.warn("Firestore academicYears.delete error", e);
        }
      }
    }
  }
};
