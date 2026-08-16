import { db } from './src/lib/db';

export async function seedDatabase() {
  const existing = await db.submissions.listAll();
  
  // If we already have more than 200 records, assume it's seeded
  if (existing.length >= 200) return; 

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

  // Insert the exact 10 records for the top of the list
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

  // Calculate how many more we need to reach the mockup numbers
  let completeToAdd = 150 - 5;
  let incompleteToAdd = 63 - 5;

  // Date for older records
  const oldDate = '2026-02-01T10:00:00Z';

  for (let i = 0; i < completeToAdd; i++) {
    await db.submissions.set(`seed-comp-${i}`, {
      id: `seed-comp-${i}`,
      studentId: `student-comp-${i}`,
      studentName: `Mock Student ${i}`,
      scholarshipType: 'BSCS Scholarship',
      status: 'Complete',
      submittedAt: oldDate,
      answers: { course: 'BSCS' },
      files: []
    });
  }

  for (let i = 0; i < incompleteToAdd; i++) {
    await db.submissions.set(`seed-incomp-${i}`, {
      id: `seed-incomp-${i}`,
      studentId: `student-incomp-${i}`,
      studentName: `Mock Student Incomplete ${i}`,
      scholarshipType: 'BSCS Scholarship',
      status: 'Incomplete',
      submittedAt: oldDate,
      answers: { course: 'BSCS' },
      files: []
    });
  }
}
