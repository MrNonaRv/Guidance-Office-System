const fs = require('fs');

let content = fs.readFileSync('seed.ts', 'utf-8');

const seedData = `
    const existingScholarships = await db.scholarships.listAll();
    if (existingScholarships.length === 0) {
      console.log('Seeding Scholarships...');
      const defaultScholarships = [
        { id: '1', name: 'Valedictorian/Salutatorian', type: 'Internally-Funded', category: 'Entrance', status: 'Active', description: 'For incoming freshmen who graduated top of their batch.', deadline: '2026-09-30', slots: 50 },
        { id: '2', name: 'Tulong Dunong', type: 'Externally-Funded', category: 'CHED', status: 'Active', description: 'Financial assistance program by the Commission on Higher Education.', deadline: '2026-08-30', slots: 100 },
        { id: '3', name: 'DOST Scholarship', type: 'Externally-Funded', category: 'Merit', status: 'Active', description: 'For outstanding students pursuing science and technology courses.', deadline: '2026-10-15', slots: 20 },
        { id: '4', name: 'Dependent of Faculty or Staff', type: 'Internally-Funded', category: 'Institutional', status: 'Active', description: 'Discount given to dependents of regular university employees.', deadline: '2026-09-15', slots: 30 },
      ];
      for (const s of defaultScholarships) {
        // @ts-ignore
        await db.scholarships.set(s.id, s);
      }
    }
`;

content = content.replace("console.log('Database seeding complete');", seedData + "\n    console.log('Database seeding complete');");

fs.writeFileSync('seed.ts', content);
