import localforage from 'localforage';
import { Course, AcademicYear, defaultCourses, defaultAcademicYears } from '../types';

export interface Scholarship {
  id: string;
  name: string;
  type: string;
  category: string;
  status: 'Active' | 'Inactive';
  description?: string;
  requirements?: string[];
  slots?: number;
  deadline?: string;
}

const scholarshipsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'scholarships' });
const coursesDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'courses' });
const academicYearsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'academicYears' });

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

const usersDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'users' });
const submissionsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'submissions' });
const formsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'forms' });

export const db = {
  scholarships: {
    async get(id: string): Promise<Scholarship | null> {
      return await scholarshipsDb.getItem(id);
    },
    async set(id: string, s: Scholarship): Promise<void> {
      await scholarshipsDb.setItem(id, s);
    },
    async create(s: Omit<Scholarship, 'id'> & { id?: string }): Promise<Scholarship> {
      const id = s.id || `scholarship-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const scholarship: Scholarship = { ...s, id };
      await scholarshipsDb.setItem(id, scholarship);
      return scholarship;
    },
    async update(id: string, s: Partial<Scholarship>): Promise<Scholarship | null> {
      const existing = await scholarshipsDb.getItem<Scholarship>(id);
      if (!existing) {
        const created: Scholarship = { id, name: '', type: 'Internally-Funded', category: '', status: 'Active', ...s } as Scholarship;
        await scholarshipsDb.setItem(id, created);
        return created;
      }
      const updated: Scholarship = { ...existing, ...s, id };
      await scholarshipsDb.setItem(id, updated);
      return updated;
    },
    async listAll(): Promise<Scholarship[]> {
      const keys = await scholarshipsDb.keys();
      const items: Scholarship[] = [];
      for (const key of keys) {
        const item = await scholarshipsDb.getItem<Scholarship>(key);
        if (item) items.push(item);
      }
      return items;
    },
    async delete(id: string): Promise<void> {
      await scholarshipsDb.removeItem(id);
    }
  },
  users: {
    async get(id: string): Promise<User | null> {
      return await usersDb.getItem(id);
    },
    async set(id: string, user: User): Promise<void> {
      await usersDb.setItem(id, user);
    },
    async create(user: User): Promise<User> {
      await usersDb.setItem(user.id, user);
      return user;
    },
    async update(id: string, user: Partial<User>): Promise<User | null> {
      const existing = await usersDb.getItem<User>(id);
      if (!existing) return null;
      const updated = { ...existing, ...user, id };
      await usersDb.setItem(id, updated);
      return updated;
    },
    async findByEmail(email: string): Promise<User | null> {
      const keys = await usersDb.keys();
      for (const key of keys) {
        const user = await usersDb.getItem<User>(key);
        if (user && user.email === email) return user;
      }
      return null;
    }
  },
  forms: {
    async get(id: string): Promise<ScholarshipForm | null> {
      return await formsDb.getItem(id);
    },
    async set(id: string, form: ScholarshipForm): Promise<void> {
      await formsDb.setItem(id, form);
    },
    async create(form: Omit<ScholarshipForm, 'id'> & { id?: string }): Promise<ScholarshipForm> {
      const id = form.id || `form-${Date.now()}`;
      const newForm: ScholarshipForm = { ...form, id };
      await formsDb.setItem(id, newForm);
      return newForm;
    },
    async update(id: string, form: Partial<ScholarshipForm>): Promise<ScholarshipForm | null> {
      const existing = await formsDb.getItem<ScholarshipForm>(id);
      if (!existing) return null;
      const updated = { ...existing, ...form, id };
      await formsDb.setItem(id, updated);
      return updated;
    },
    async listAll(): Promise<ScholarshipForm[]> {
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
    }
  },
  submissions: {
    async get(id: string): Promise<Submission | null> {
      return await submissionsDb.getItem(id);
    },
    async set(id: string, sub: Submission): Promise<void> {
      await submissionsDb.setItem(id, sub);
    },
    async create(sub: Submission): Promise<Submission> {
      await submissionsDb.setItem(sub.id, sub);
      return sub;
    },
    async update(id: string, sub: Partial<Submission>): Promise<Submission | null> {
      const existing = await submissionsDb.getItem<Submission>(id);
      if (!existing) return null;
      const updated = { ...existing, ...sub, id };
      await submissionsDb.setItem(id, updated);
      return updated;
    },
    async listByStudent(studentId: string): Promise<Submission[]> {
      const keys = await submissionsDb.keys();
      const subs: Submission[] = [];
      for (const key of keys) {
        const sub = await submissionsDb.getItem<Submission>(key);
        if (sub && sub.studentId === studentId) subs.push(sub);
      }
      return subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    },
    async listAll(): Promise<Submission[]> {
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
    }
  },
  courses: {
    async get(id: string): Promise<Course | null> {
      return await coursesDb.getItem(id);
    },
    async set(id: string, course: Course): Promise<void> {
      await coursesDb.setItem(id, course);
    },
    async create(course: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
      const id = course.id || `course-${course.code.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const newCourse: Course = { ...course, id };
      await coursesDb.setItem(id, newCourse);
      return newCourse;
    },
    async update(id: string, course: Partial<Course>): Promise<Course | null> {
      const existing = await coursesDb.getItem<Course>(id);
      if (!existing) return null;
      const updated = { ...existing, ...course, id };
      await coursesDb.setItem(id, updated);
      return updated;
    },
    async listAll(): Promise<Course[]> {
      const keys = await coursesDb.keys();
      if (keys.length === 0) {
        // Seed default 4 courses: BSCS, BAEL, BSFT, BSOA
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
    }
  },
  academicYears: {
    async get(id: string): Promise<AcademicYear | null> {
      return await academicYearsDb.getItem(id);
    },
    async set(id: string, ay: AcademicYear): Promise<void> {
      await academicYearsDb.setItem(id, ay);
    },
    async create(ay: Omit<AcademicYear, 'id'> & { id?: string }): Promise<AcademicYear> {
      const id = ay.id || `ay-${Date.now()}`;
      const newAy: AcademicYear = { ...ay, id };
      // If marked default, unset default on others
      if (newAy.isDefault) {
        const all = await this.listAll();
        for (const item of all) {
          if (item.isDefault) {
            await academicYearsDb.setItem(item.id, { ...item, isDefault: false });
          }
        }
      }
      await academicYearsDb.setItem(id, newAy);
      return newAy;
    },
    async update(id: string, ay: Partial<AcademicYear>): Promise<AcademicYear | null> {
      const existing = await academicYearsDb.getItem<AcademicYear>(id);
      if (!existing) return null;
      if (ay.isDefault) {
        const all = await this.listAll();
        for (const item of all) {
          if (item.id !== id && item.isDefault) {
            await academicYearsDb.setItem(item.id, { ...item, isDefault: false });
          }
        }
      }
      const updated = { ...existing, ...ay, id };
      await academicYearsDb.setItem(id, updated);
      return updated;
    },
    async setDefault(id: string): Promise<void> {
      const all = await this.listAll();
      for (const item of all) {
        await academicYearsDb.setItem(item.id, { ...item, isDefault: item.id === id });
      }
    },
    async listAll(): Promise<AcademicYear[]> {
      const keys = await academicYearsDb.keys();
      if (keys.length === 0) {
        // Seed default academic years
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
    }
  }
};
