export interface Student {
  id: string;
  name: string;
  course: string;
  date: string;
  status: 'Complete' | 'Incomplete';
  email: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department?: string;
  status: 'Active' | 'Inactive';
}

export interface AcademicYear {
  id: string;
  year: string;
  semester: '1st Semester' | '2nd Semester' | 'Summer';
  label: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  isDefault: boolean;
  startDate?: string;
  endDate?: string;
}

export interface ScholarshipItem {
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

export const defaultScholarships: ScholarshipItem[] = [
  {
    id: 'scholarship-academic-excellence',
    name: 'Academic Excellence Scholarship',
    type: 'Internally-Funded',
    category: 'Institutional',
    status: 'Active',
    description: 'For students with GWA of 1.75 or higher and no failing grade in any academic subject.',
    requirements: ['Certificate of Grades / Transcript of Records', 'Certificate of Good Moral Character', 'Valid Student ID'],
    slots: 50,
    deadline: '2026-09-30'
  },
  {
    id: 'scholarship-deans-list',
    name: "Dean's Lister Grant",
    type: 'Internally-Funded',
    category: 'Institutional',
    status: 'Active',
    description: 'Grant awarded to top academic achievers in each program and year level.',
    requirements: ['Certificate of Matriculation', 'Latest Official Semester Grade Slip', 'Certificate of Good Moral Character'],
    slots: 100,
    deadline: '2026-09-30'
  },
  {
    id: 'scholarship-ched-tdp',
    name: 'CHED Tulong Dunong Program (TDP-TES)',
    type: 'Externally-Funded',
    category: 'Government / CHED',
    status: 'Active',
    description: 'Government subsidy supporting qualified tertiary education students.',
    requirements: ['Certificate of Registration / Enrollment', 'Certificate of Indigency / ITR of Parents', 'Valid Government / Student ID'],
    slots: 200,
    deadline: '2026-10-15'
  },
  {
    id: 'scholarship-tes',
    name: 'Tertiary Education Subsidy (TES)',
    type: 'Externally-Funded',
    category: 'Government / UNIFAST',
    status: 'Active',
    description: 'Financial assistance for Filipino students enrolled in undergraduate programs under RA 10931.',
    requirements: ['UNIFAST Application Form', 'Certificate of Registration', 'Barangay Certificate of Indigency'],
    slots: 300,
    deadline: '2026-10-31'
  }
];

export const defaultCourses: Course[] = [
  { id: 'course-bscs', code: 'BSCS', name: 'Bachelor of Science in Computer Science', department: 'College of Information and Communications Technology', status: 'Active' },
  { id: 'course-bael', code: 'BAEL', name: 'Bachelor of Arts in English Language', department: 'College of Arts and Letters', status: 'Active' },
  { id: 'course-bsft', code: 'BSFT', name: 'Bachelor of Science in Food Technology', department: 'College of Science', status: 'Active' },
  { id: 'course-bsoa', code: 'BSOA', name: 'Bachelor of Science in Office Administration', department: 'College of Business and Accountancy', status: 'Active' }
];

export const defaultAcademicYears: AcademicYear[] = [
  { id: 'ay-2025-2026-1', year: '2025-2026', semester: '1st Semester', label: 'A.Y. 2025-2026 - 1st Semester', status: 'Active', isDefault: true, startDate: '2025-08-15', endDate: '2025-12-20' },
  { id: 'ay-2025-2026-2', year: '2025-2026', semester: '2nd Semester', label: 'A.Y. 2025-2026 - 2nd Semester', status: 'Upcoming', isDefault: false, startDate: '2026-01-15', endDate: '2026-05-30' },
  { id: 'ay-2024-2025-2', year: '2024-2025', semester: '2nd Semester', label: 'A.Y. 2024-2025 - 2nd Semester', status: 'Closed', isDefault: false, startDate: '2025-01-15', endDate: '2025-05-30' },
  { id: 'ay-2024-2025-1', year: '2024-2025', semester: '1st Semester', label: 'A.Y. 2024-2025 - 1st Semester', status: 'Closed', isDefault: false, startDate: '2024-08-15', endDate: '2024-12-20' }
];

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
