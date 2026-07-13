export interface Student {
  id: string;
  name: string;
  course: string;
  date: string;
  status: 'Complete' | 'Incomplete';
  email: string;
}

export const mockStudents: Student[] = [
  { id: '1', name: 'Anna Marie A. Santos', course: 'BAEL', date: 'March 11, 2026', status: 'Incomplete', email: 'anna@example.com' },
  { id: '2', name: 'Patricia Jane K. Manalo', course: 'BAEL', date: 'March 11, 2026', status: 'Incomplete', email: 'patricia@example.com' },
  { id: '3', name: 'Damian James O. Emilio', course: 'BSFT', date: 'March 11, 2026', status: 'Incomplete', email: 'damian@example.com' },
  { id: '4', name: 'Paul John N. Dela Cruz', course: 'BSOA', date: 'March 11, 2026', status: 'Incomplete', email: 'paul@example.com' },
  { id: '5', name: 'Charlotte Alexis N. Tuvera', course: 'BSCS', date: 'March 10, 2026', status: 'Incomplete', email: 'charlotte@example.com' },
  { id: '6', name: 'Michael O. Burata', course: 'BSCS', date: 'March 10, 2026', status: 'Complete', email: 'michael@example.com' },
  { id: '7', name: 'Chery Joy M. Marcelino', course: 'BSCS', date: 'March 10, 2026', status: 'Complete', email: 'chery@example.com' },
  { id: '8', name: 'Jessica Mae E. Dela Cruz', course: 'BSCS', date: 'March 09, 2026', status: 'Complete', email: 'jessica@example.com' },
];
