import localforage from 'localforage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: 'student' | 'admin';
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  scholarshipType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  files: {
    name: string;
    type: string;
    data: string; // base64
  }[];
}

const usersDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'users' });
const submissionsDb = localforage.createInstance({ name: 'scholarship-app', storeName: 'submissions' });

export const db = {
  users: {
    async get(id: string): Promise<User | null> {
      return await usersDb.getItem(id);
    },
    async set(id: string, user: User): Promise<void> {
      await usersDb.setItem(id, user);
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
  submissions: {
    async get(id: string): Promise<Submission | null> {
      return await submissionsDb.getItem(id);
    },
    async set(id: string, sub: Submission): Promise<void> {
      await submissionsDb.setItem(id, sub);
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
    }
  }
};
