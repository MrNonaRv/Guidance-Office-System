import localforage from 'localforage';


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
  }
};
