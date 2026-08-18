import { db } from './db';

export async function seedDatabase() {
  try {
    const existing = await db.submissions.listAll();
    
    // If we already have records, assume it's seeded
    if (existing && existing.length >= 10) return; 

    const seedData = [
      { studentName: 'Anna Marie A. Santos', course: 'BAEL', date: '2026-03-11T10:00:00Z', status: 'Incomplete' },
      { studentName: 'Patricia Jane K. Manalo', course: 'BAEL', date: '2026-03-11T10:00:00Z', status: 'Incomplete' },
      { studentName: 'Damian James O. Emilio', course: 'BSFT', date: '2026-03-11T10:00:00Z', status: 'Incomplete' },
      { studentName: 'Paul John N. Dela Cruz', course: 'BSOA', date: '2026-03-11T10:00:00Z', status: 'Incomplete' },
      { studentName: 'Charlotte Alexis N. Tuvera', course: 'BSCS', date: '2026-03-10T10:00:00Z', status: 'Incomplete' },
      { studentName: 'Michael G. Burata', course: 'BSCS', date: '2026-03-10T10:00:00Z', status: 'Complete' },
      { studentName: 'Chery Joy M. Marcelino', course: 'BSCS', date: '2026-03-10T10:00:00Z', status: 'Complete' },
      { studentName: 'Jessica Mae E. Dela Cruz', course: 'BSCS', date: '2026-03-09T10:00:00Z', status: 'Complete' },
      { studentName: 'Mark Josh P. Lorenzo', course: 'BSOA', date: '2026-03-09T10:00:00Z', status: 'Complete' },
      { studentName: 'William George I. Diaz', course: 'BSFT', date: '2026-03-08T10:00:00Z', status: 'Complete' }
    ];

    for (let i = 0; i < seedData.length; i++) {
      const item = seedData[i];
      await db.submissions.set(`seed-top-${i}`, {
        id: `seed-top-${i}`,
        studentId: `student-${i}`,
        studentName: item.studentName,
        scholarshipType: item.course + ' Scholarship',
        status: item.status as any,
        submittedAt: item.date,
        answers: { course: item.course },
        files: []
      });
    }
  } catch (err) {
    console.warn("Seeding initial submissions notice:", err);
  }
}
