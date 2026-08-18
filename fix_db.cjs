const fs = require('fs');

let content = fs.readFileSync('src/lib/db.ts', 'utf-8');

const interfaceImport = `
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
`;

content = content.replace("export interface User", interfaceImport + "\nexport interface User");

const dbImplementation = `
  scholarships: {
    async get(id: string): Promise<Scholarship | null> {
      return await scholarshipsDb.getItem(id);
    },
    async set(id: string, s: Scholarship): Promise<void> {
      await scholarshipsDb.setItem(id, s);
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
`;

content = content.replace("  users: {", dbImplementation);

fs.writeFileSync('src/lib/db.ts', content);
