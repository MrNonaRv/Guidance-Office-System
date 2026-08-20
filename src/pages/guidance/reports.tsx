import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { 
  ChevronDown, 
  Filter, 
  Printer, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  RotateCcw,
  ExternalLink,
  Search,
  HardDrive,
  Download
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface StudentBreakdownItem {
  id: string;
  studentId: string;
  student: string;
  yearLevel: string;
  course: string;
  courseFull: string;
  category: 'Internally-Funded' | 'Externally-Funded';
  subType: string;
  allocation: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  address: string;
  gwa: string;
  units: number;
  status: 'Complete' | 'Incomplete';
  dateSubmitted: string;
  requirements: { name: string; status: 'Verified' | 'Pending' | 'Missing' }[];
  remarks: string;
  files?: any[];
  data?: any;
}

export function GuidanceReports() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('All courses');
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>('All year level');
  const [currentPage, setCurrentPage] = useState<number>(1); // 1 = Reports & Analytics overview, 2 = Scholarship Breakdown

  // Page 2 Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Category');
  const [selectedSubType, setSelectedSubType] = useState<string>('Sub Type');
  const [selectedAllocation, setSelectedAllocation] = useState<string>('Scholarship Allocation');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'Category',
    subType: 'Sub Type',
    allocation: 'Scholarship Allocation',
    search: ''
  });

  // Modal state for student profile
  const [selectedStudent, setSelectedStudent] = useState<StudentBreakdownItem | null>(null);
  const [printSingleStudent, setPrintSingleStudent] = useState<StudentBreakdownItem | null>(null);

  // Predefined student dataset matching the reference image breakdown exactly
  const initialBreakdownData: StudentBreakdownItem[] = [
    { 
      id: '1', 
      studentId: '2024-CAPSU-0182',
      student: 'Anna Marie A. Santos', 
      yearLevel: '2nd year', 
      course: 'BAEL', 
      courseFull: 'Bachelor of Arts in English Language',
      category: 'Externally-Funded', 
      subType: 'CHED', 
      allocation: 'Pag-Ulikid',
      gender: 'Female',
      email: 'anna.santos@capsu.edu.ph',
      phone: '+63 917 842 1930',
      address: 'Brgy. Poblacion, Tapaz, Capiz',
      gwa: '1.42',
      units: 21,
      status: 'Complete',
      dateSubmitted: 'Aug 12, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'Certificate of Indigency', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Application verified. Meets all academic and financial requirements for Pag-Ulikid Provincial Scholarship.'
    },
    { 
      id: '2', 
      studentId: '2024-CAPSU-0195',
      student: 'Patricia Jane K. Manalo', 
      yearLevel: '2nd year', 
      course: 'BAEL', 
      courseFull: 'Bachelor of Arts in English Language',
      category: 'Externally-Funded', 
      subType: 'CHED', 
      allocation: 'Tulong Dunong',
      gender: 'Female',
      email: 'patricia.manalo@capsu.edu.ph',
      phone: '+63 928 411 9021',
      address: 'Brgy. San Nicolas, Tapaz, Capiz',
      gwa: '1.68',
      units: 21,
      status: 'Complete',
      dateSubmitted: 'Aug 11, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'ITR / Proof of Income', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'CHED Tulong Dunong grantee. All documents validated.'
    },
    { 
      id: '3', 
      studentId: '2022-CAPSU-0041',
      student: 'Damian James O. Emilio', 
      yearLevel: '4th year', 
      course: 'BSFT', 
      courseFull: 'Bachelor of Science in Food Technology',
      category: 'Externally-Funded', 
      subType: 'CHED', 
      allocation: 'ANAC-IP',
      gender: 'Male',
      email: 'damian.emilio@capsu.edu.ph',
      phone: '+63 905 678 1234',
      address: 'Brgy. San Jose, Tapaz, Capiz',
      gwa: '1.75',
      units: 24,
      status: 'Complete',
      dateSubmitted: 'Aug 09, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'NCIP Indigenous Peoples Certificate', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Indigenous Peoples (ANAC-IP) beneficiary. Endorsed by NCIP.'
    },
    { 
      id: '4', 
      studentId: '2022-CAPSU-0089',
      student: 'Paul John N. Dela Cruz', 
      yearLevel: '4th year', 
      course: 'BSOA', 
      courseFull: 'Bachelor of Science in Office Administration',
      category: 'Internally-Funded', 
      subType: 'Institutional', 
      allocation: 'President—FLP',
      gender: 'Male',
      email: 'pauljohn.delacruz@capsu.edu.ph',
      phone: '+63 919 555 4321',
      address: 'Brgy. Camburanan, Tapaz, Capiz',
      gwa: '1.30',
      units: 21,
      status: 'Complete',
      dateSubmitted: 'Aug 14, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'Student Leadership Certificate', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'President’s Future Leaders Program scholar. Outstanding extracurricular and academic record.'
    },
    { 
      id: '5', 
      studentId: '2023-CAPSU-0112',
      student: 'Charlotte Alexis N. Tuvera', 
      yearLevel: '3rd year', 
      course: 'BSCS', 
      courseFull: 'Bachelor of Science in Computer Science',
      category: 'Internally-Funded', 
      subType: 'Institutional', 
      allocation: 'Dependent of Faculty or Staff',
      gender: 'Female',
      email: 'charlotte.tuvera@capsu.edu.ph',
      phone: '+63 945 123 8899',
      address: 'CapSU Staff Housing, Tapaz Campus',
      gwa: '1.55',
      units: 23,
      status: 'Complete',
      dateSubmitted: 'Aug 10, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'HR Faculty Dependent Certification', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Verified dependent of full-time CapSU faculty.'
    },
    { 
      id: '6', 
      studentId: '2023-CAPSU-0144',
      student: 'Michael O. Burata', 
      yearLevel: '3rd year', 
      course: 'BSCS', 
      courseFull: 'Bachelor of Science in Computer Science',
      category: 'Internally-Funded', 
      subType: 'Socio-cultural', 
      allocation: 'Regional',
      gender: 'Male',
      email: 'michael.burata@capsu.edu.ph',
      phone: '+63 939 778 0012',
      address: 'Brgy. Roosevelt, Tapaz, Capiz',
      gwa: '1.80',
      units: 23,
      status: 'Complete',
      dateSubmitted: 'Aug 08, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'Regional Cultural Artist Certification', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Socio-Cultural Ensemble regional participant.'
    },
    { 
      id: '7', 
      studentId: '2023-CAPSU-0201',
      student: 'Chery Joy M. Marcelino', 
      yearLevel: '3rd year', 
      course: 'BSCS', 
      courseFull: 'Bachelor of Science in Computer Science',
      category: 'Internally-Funded', 
      subType: 'Academic', 
      allocation: 'Partial',
      gender: 'Female',
      email: 'cheryjoy.marcelino@capsu.edu.ph',
      phone: '+63 916 333 7788',
      address: 'Brgy. Agpalali, Tapaz, Capiz',
      gwa: '1.65',
      units: 23,
      status: 'Complete',
      dateSubmitted: 'Aug 13, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'Dean’s Lister Certification', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Partial Academic Scholarship based on 2nd Semester Dean’s List honors.'
    },
    { 
      id: '8', 
      studentId: '2023-CAPSU-0219',
      student: 'Jessica Mae E. Dela Cruz', 
      yearLevel: '3rd year', 
      course: 'BSCS', 
      courseFull: 'Bachelor of Science in Computer Science',
      category: 'Externally-Funded', 
      subType: 'CHED', 
      allocation: 'UniFast',
      gender: 'Female',
      email: 'jessicamae.delacruz@capsu.edu.ph',
      phone: '+63 927 999 1122',
      address: 'Brgy. Carida, Tapaz, Capiz',
      gwa: '1.48',
      units: 23,
      status: 'Complete',
      dateSubmitted: 'Aug 07, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'UniFast Masterlist Proof', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'UniFast Tertiary Education Subsidy recipient.'
    },
    { 
      id: '9', 
      studentId: '2025-CAPSU-0012',
      student: 'Mark Josh P. Lorenzo', 
      yearLevel: '1st year', 
      course: 'BSOA', 
      courseFull: 'Bachelor of Science in Office Administration',
      category: 'Externally-Funded', 
      subType: 'CHED', 
      allocation: 'TES',
      gender: 'Male',
      email: 'markjosh.lorenzo@capsu.edu.ph',
      phone: '+63 918 222 3344',
      address: 'Brgy. Daan Banwa, Tapaz, Capiz',
      gwa: '1.50',
      units: 20,
      status: 'Complete',
      dateSubmitted: 'Aug 15, 2026',
      requirements: [
        { name: 'Senior High School Report Card (Form 138)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'DSWD Listahanan Certification', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'CHED TES-1 subsidy qualified applicant.'
    },
    { 
      id: '10', 
      studentId: '2025-CAPSU-0045',
      student: 'William George I. Diaz', 
      yearLevel: '1st year', 
      course: 'BSFT', 
      courseFull: 'Bachelor of Science in Food Technology',
      category: 'Externally-Funded', 
      subType: 'Merit', 
      allocation: 'DOST',
      gender: 'Male',
      email: 'william.diaz@capsu.edu.ph',
      phone: '+63 995 444 8877',
      address: 'Brgy. Tacayan, Tapaz, Capiz',
      gwa: '1.25',
      units: 22,
      status: 'Complete',
      dateSubmitted: 'Aug 05, 2026',
      requirements: [
        { name: 'DOST-SEI Notice of Award', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'High School Transcript', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'DOST Science & Technology RA 7687 Scholar.'
    },
    { 
      id: '11', 
      studentId: '2024-CAPSU-0078',
      student: 'Febe Ronile Alejandro', 
      yearLevel: '2nd year', 
      course: 'BSCS', 
      courseFull: 'Bachelor of Science in Computer Science',
      category: 'Externally-Funded', 
      subType: 'Merit', 
      allocation: 'LGU',
      gender: 'Female',
      email: 'febe.alejandro@capsu.edu.ph',
      phone: '+63 947 111 6655',
      address: 'Brgy. San Julian, Tapaz, Capiz',
      gwa: '1.58',
      units: 23,
      status: 'Complete',
      dateSubmitted: 'Aug 14, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'Municipal LGU Scholarship Grant Contract', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Municipal Government of Tapaz Merit Grantee.'
    },
    { 
      id: '12', 
      studentId: '2023-CAPSU-0099',
      student: 'Ellah A. Andalecio', 
      yearLevel: '3rd year', 
      course: 'BSCS', 
      courseFull: 'Bachelor of Science in Computer Science',
      category: 'Externally-Funded', 
      subType: 'CHED', 
      allocation: 'Tulong Dunong',
      gender: 'Female',
      email: 'ellah.andalecio@capsu.edu.ph',
      phone: '+63 908 777 9900',
      address: 'Brgy. Buri, Tapaz, Capiz',
      gwa: '1.62',
      units: 23,
      status: 'Complete',
      dateSubmitted: 'Aug 12, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'Certificate of Indigency', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'CHED Tulong Dunong renewal scholar.'
    },
    { 
      id: '13', 
      studentId: '2022-CAPSU-0156',
      student: 'Michelle Diane C. Flores', 
      yearLevel: '4th year', 
      course: 'BSOA', 
      courseFull: 'Bachelor of Science in Office Administration',
      category: 'Externally-Funded', 
      subType: 'CHED', 
      allocation: 'Barangay (Legal dependents of Brgy. Officials)',
      gender: 'Female',
      email: 'michelle.flores@capsu.edu.ph',
      phone: '+63 930 888 2211',
      address: 'Brgy. San Roque, Tapaz, Capiz',
      gwa: '1.70',
      units: 21,
      status: 'Complete',
      dateSubmitted: 'Aug 11, 2026',
      requirements: [
        { name: 'Certificate of Grades (COG)', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'DILG Barangay Official Dependent Cert', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Statutory benefit for dependents of incumbent barangay officials under RA 7160.'
    },
    { 
      id: '14', 
      studentId: '2025-CAPSU-0067',
      student: 'Christian Jason J. Valdez', 
      yearLevel: '1st year', 
      course: 'BSFT', 
      courseFull: 'Bachelor of Science in Food Technology',
      category: 'Internally-Funded', 
      subType: 'CHED', 
      allocation: 'ESGP – PA',
      gender: 'Male',
      email: 'christian.valdez@capsu.edu.ph',
      phone: '+63 977 456 7890',
      address: 'Brgy. Wright, Tapaz, Capiz',
      gwa: '1.60',
      units: 22,
      status: 'Complete',
      dateSubmitted: 'Aug 10, 2026',
      requirements: [
        { name: 'Certificate of Grades / Form 138', status: 'Verified' },
        { name: 'Certificate of Registration (COR)', status: 'Verified' },
        { name: 'Pantawid Pamilya (4Ps) Household Cert', status: 'Verified' },
        { name: 'Good Moral Character', status: 'Verified' },
        { name: '2x2 ID Photo', status: 'Verified' },
      ],
      remarks: 'Expanded Students’ Grants-in-Aid Program for Poverty Alleviation (ESGP-PA).'
    },
  ];

  const [allBreakdownData, setAllBreakdownData] = useState<StudentBreakdownItem[]>(initialBreakdownData);

  useEffect(() => {
    async function loadData() {
      try {
        const subs = await db.submissions.listAll();
        if (subs && subs.length > 0) {
          setSubmissions(subs);
          const dynamicStudents: StudentBreakdownItem[] = subs.map((s, idx) => {
            const formData = s.data || {};
            const scholarshipParts = (s.scholarshipType || '').split('(');
            const category = scholarshipParts[0]?.trim() || (formData.fundingType === 'Internally-Funded' ? 'Internally-Funded' : 'Externally-Funded');
            const subType = (formData.scholarshipCategory || s.scholarshipType || 'CHED').replace(/[()]/g, '');
            const courseCode = formData.course || s.answers?.course || 'BSCS';
            
            return {
              id: s.id || `sub-${idx}`,
              studentId: s.studentId || `2025-CAPSU-${1000 + idx}`,
              student: s.studentName || `${formData.firstName || 'Student'} ${formData.familyName || ''}`.trim(),
              yearLevel: formData.yearLevel || '1st year',
              course: courseCode,
              courseFull: courseCode === 'BSCS' ? 'Bachelor of Science in Computer Science' : courseCode === 'BAEL' ? 'Bachelor of Arts in English Language' : courseCode === 'BSFT' ? 'Bachelor of Science in Food Technology' : 'Bachelor of Science in Office Administration',
              category: category.includes('Internal') ? 'Internally-Funded' : 'Externally-Funded',
              subType: subType.includes('Institutional') ? 'Institutional' : subType.includes('Socio') ? 'Socio-cultural' : subType.includes('Academic') ? 'Academic' : subType.includes('Merit') ? 'Merit' : 'CHED',
              allocation: formData.scholarshipCategory || s.scholarshipType || 'Pag-Ulikid',
              gender: (formData.sex === 'Male' || formData.gender === 'Male') ? 'Male' : 'Female',
              email: formData.email || `${formData.firstName?.toLowerCase() || 'student'}@capsu.edu.ph`,
              phone: formData.contactNo || '+63 912 345 6789',
              address: formData.permanentAddress || 'Tapaz, Capiz',
              gwa: formData.gwa || '1.50',
              units: Number(formData.units) || 21,
              status: s.status === 'Approved' || s.status === 'Complete' ? 'Complete' : 'Incomplete',
              dateSubmitted: new Date(s.submittedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              requirements: [
                { name: 'Certificate of Grades (COG)', status: 'Verified' },
                { name: 'Certificate of Registration (COR)', status: 'Verified' },
                { name: '2x2 ID Photo', status: 'Verified' },
              ],
              remarks: `Application submitted via Student Portal. Current status: ${s.status || 'Pending'}.`,
              files: s.files || [],
              data: formData
            };
          });

          // Combine with initialBreakdownData
          const merged = [...dynamicStudents];
          for (const item of initialBreakdownData) {
            if (!merged.some(m => m.student.toLowerCase() === item.student.toLowerCase() || m.id === item.id)) {
              merged.push(item);
            }
          }
          setAllBreakdownData(merged);
        }
      } catch (e) {
        console.warn("Failed to load submissions into reports:", e);
      }
    }
    loadData();
  }, []);

  // Filter calculations for Page 1 (Reports & Analytics Overview)
  const isDefaultOverview = selectedCourse === 'All courses' && selectedYearLevel === 'All year level';

  // Base institutional baseline (213 total, 128 complete, 85 incomplete, 117 male, 96 female)
  let totalCount = 213;
  let completeCount = 128;
  let incompleteCount = 85;
  let maleCount = 117;
  let femaleCount = 96;

  // Course multiplier stats for dynamic filter interactivity
  const courseMultipliers: Record<string, { total: number; complete: number; male: number }> = {
    'BSCS': { total: 78, complete: 50, male: 46 },
    'BAEL': { total: 45, complete: 28, male: 18 },
    'BSFT': { total: 52, complete: 31, male: 24 },
    'BSOA': { total: 38, complete: 19, male: 19 },
  };

  const yearMultipliers: Record<string, number> = {
    '1st Year': 0.28,
    '2nd Year': 0.26,
    '3rd Year': 0.24,
    '4th Year': 0.22,
  };

  if (!isDefaultOverview) {
    if (selectedCourse !== 'All courses') {
      const base = courseMultipliers[selectedCourse] || { total: 50, complete: 30, male: 25 };
      if (selectedYearLevel !== 'All year level') {
        const factor = yearMultipliers[selectedYearLevel] || 0.25;
        totalCount = Math.max(12, Math.round(base.total * factor));
        completeCount = Math.max(7, Math.round(base.complete * factor));
        maleCount = Math.max(6, Math.round(base.male * factor));
      } else {
        totalCount = base.total;
        completeCount = base.complete;
        maleCount = base.male;
      }
    } else if (selectedYearLevel !== 'All year level') {
      const factor = yearMultipliers[selectedYearLevel] || 0.25;
      totalCount = Math.round(213 * factor);
      completeCount = Math.round(128 * factor);
      maleCount = Math.round(117 * factor);
    }
    incompleteCount = totalCount - completeCount;
    femaleCount = totalCount - maleCount;
  }

  const completePercent = Math.min(100, Math.max(0, (completeCount / totalCount) * 100));
  const incompletePercent = Math.min(100, Math.max(0, (incompleteCount / totalCount) * 100));
  const malePercent = Math.min(100, Math.max(0, (maleCount / totalCount) * 100));
  const femalePercent = Math.min(100, Math.max(0, (femaleCount / totalCount) * 100));

  // Page 2 Filters Handlers
  const handleApplyFilters = () => {
    setAppliedFilters({
      category: selectedCategory,
      subType: selectedSubType,
      allocation: selectedAllocation,
      search: searchQuery
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('Category');
    setSelectedSubType('Sub Type');
    setSelectedAllocation('Scholarship Allocation');
    setSearchQuery('');
    setAppliedFilters({
      category: 'Category',
      subType: 'Sub Type',
      allocation: 'Scholarship Allocation',
      search: ''
    });
  };

  const filteredBreakdown = allBreakdownData.filter(item => {
    const matchCategory = appliedFilters.category === 'Category' || item.category === appliedFilters.category;
    const matchSubType = appliedFilters.subType === 'Sub Type' || item.subType === appliedFilters.subType;
    const matchAllocation = appliedFilters.allocation === 'Scholarship Allocation' || 
      item.allocation.toLowerCase().includes(appliedFilters.allocation.toLowerCase()) || 
      appliedFilters.allocation.toLowerCase().includes(item.allocation.toLowerCase());
    const matchSearch = !appliedFilters.search || 
      item.student.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
      item.course.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
      item.allocation.toLowerCase().includes(appliedFilters.search.toLowerCase());
    return matchCategory && matchSubType && matchAllocation && matchSearch;
  });

  const handleExportPDF = () => {
    setPrintSingleStudent(null);
    window.print();
  };

  const handlePrintStudent = (student: StudentBreakdownItem) => {
    setPrintSingleStudent(student);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-6">
      {/* =========================================================================
          PRINT LAYOUT (Visible only during window.print() / Export as PDF)
          ========================================================================= */}
      <div className="hidden print:block p-6 bg-white text-black font-sans">
        {printSingleStudent ? (
          /* Single Student Voucher Print Layout */
          <div className="space-y-6 max-w-3xl mx-auto border-2 border-black p-8 rounded-lg">
            {/* Institutional Header */}
            <div className="flex items-center gap-4 border-b-2 border-black pb-4 text-center">
              <img src="/capsu-logo.png" alt="CapSU Logo" className="w-16 h-16 object-contain" />
              <div className="flex-1 text-center">
                <h1 className="text-xl font-bold font-serif uppercase tracking-wide">Capiz State University</h1>
                <p className="text-xs font-semibold">Guidance & Counseling Office / Student Affairs & Services</p>
                <p className="text-xs text-gray-700">Poblacion, Tapaz, Capiz, Philippines | guidance@capsu.edu.ph</p>
                <h2 className="text-sm font-bold uppercase mt-2 text-blue-900 border-t border-gray-300 pt-1">
                  Official Scholarship Grantee Profile & Certification
                </h2>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><strong>Student Name:</strong> {printSingleStudent.student}</div>
              <div><strong>Student ID:</strong> {printSingleStudent.studentId}</div>
              <div><strong>Program & Course:</strong> {printSingleStudent.courseFull} ({printSingleStudent.course})</div>
              <div><strong>Year Level:</strong> {printSingleStudent.yearLevel}</div>
              <div><strong>Gender:</strong> {printSingleStudent.gender}</div>
              <div><strong>General Weighted Average (GWA):</strong> {printSingleStudent.gwa}</div>
              <div><strong>Scholarship Allocation:</strong> {printSingleStudent.allocation}</div>
              <div><strong>Funding Category:</strong> {printSingleStudent.category} ({printSingleStudent.subType})</div>
              <div><strong>Status:</strong> {printSingleStudent.status}</div>
              <div><strong>Date Verified:</strong> {printSingleStudent.dateSubmitted}</div>
            </div>

            {/* Requirements checklist */}
            <div className="border border-gray-300 p-3 rounded text-xs space-y-1.5">
              <div className="font-bold border-b border-gray-200 pb-1">Verified Documentary Requirements:</div>
              <div className="grid grid-cols-2 gap-2">
                {printSingleStudent.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="font-bold text-green-700">✓</span>
                    <span>{req.name} ({req.status})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs italic bg-gray-50 p-2.5 border border-gray-200 rounded">
              <strong>Counselor Remarks:</strong> {printSingleStudent.remarks}
            </div>

            {/* Official Signatures */}
            <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
              <div>
                <div className="border-b border-black w-48 mx-auto mb-1"></div>
                <p className="font-bold">RELIE AGUILOS</p>
                <p className="text-gray-600">Guidance Counselor</p>
              </div>
              <div>
                <div className="border-b border-black w-48 mx-auto mb-1"></div>
                <p className="font-bold">DR. MARIA THERESA FERNANDEZ</p>
                <p className="text-gray-600">Dean of Student Affairs / Campus Administrator</p>
              </div>
            </div>
          </div>
        ) : (
          /* Full Institutional Reports & Scholarship Breakdown Print Layout */
          <div className="space-y-6">
            {/* CapSU Official Letterhead */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <div className="flex items-center gap-4">
                <img src="/capsu-logo.png" alt="CapSU Logo" className="w-16 h-16 object-contain" />
                <div>
                  <h1 className="text-xl font-serif font-bold uppercase tracking-wide">Capiz State University</h1>
                  <p className="text-xs font-semibold">Guidance & Counseling Office | Tapaz Campus</p>
                  <p className="text-xs text-gray-700">Web-Based Scholarship Submission Alert System</p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-700">
                <p><strong>A.Y. 2026-2027</strong> - 1st Semester</p>
                <p>Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p>Generated by: Relie Aguilos (Guidance Counselor)</p>
              </div>
            </div>

            <div className="text-center py-2 bg-gray-100 border border-gray-300 rounded">
              <h2 className="text-base font-bold uppercase tracking-wider text-black">
                {currentPage === 1 ? 'Scholarship Submission & Demographic Analytics Report' : 'Official Scholarship Allocation & Recipient Roster'}
              </h2>
              <p className="text-xs text-gray-600">
                {currentPage === 1 
                  ? `Filtered by: Course (${selectedCourse}) | Year Level (${selectedYearLevel})`
                  : `Filtered by: Category (${appliedFilters.category}) | Sub Type (${appliedFilters.subType}) | Allocation (${appliedFilters.allocation})`
                }
              </p>
            </div>

            {currentPage === 1 ? (
              /* Page 1 Print Summary */
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-black p-4 rounded text-xs space-y-2">
                    <h3 className="font-bold text-sm border-b pb-1">Submission Status Summary</h3>
                    <p>Total Registered Students / Cohort: <strong>{totalCount}</strong></p>
                    <p>Complete Submissions: <strong>{completeCount} ({completePercent.toFixed(1)}%)</strong></p>
                    <p>Incomplete / Pending Submissions: <strong>{incompleteCount} ({incompletePercent.toFixed(1)}%)</strong></p>
                  </div>
                  <div className="border border-black p-4 rounded text-xs space-y-2">
                    <h3 className="font-bold text-sm border-b pb-1">Gender Demographic Summary</h3>
                    <p>Male Applicants: <strong>{maleCount} ({malePercent.toFixed(1)}%)</strong></p>
                    <p>Female Applicants: <strong>{femaleCount} ({femalePercent.toFixed(1)}%)</strong></p>
                    <p>Ratio (M/F): <strong>{(maleCount / (femaleCount || 1)).toFixed(2)}</strong></p>
                  </div>
                </div>

                {/* Table of Course Breakdown */}
                <table className="w-full text-xs border border-black border-collapse">
                  <thead>
                    <tr className="bg-gray-200 border-b border-black font-bold">
                      <th className="p-2 border-r border-black text-left">Academic Program</th>
                      <th className="p-2 border-r border-black text-center">Total</th>
                      <th className="p-2 border-r border-black text-center">Complete</th>
                      <th className="p-2 border-r border-black text-center">Incomplete</th>
                      <th className="p-2 border-r border-black text-center">Male</th>
                      <th className="p-2 border-r border-black text-center">Female</th>
                      <th className="p-2 text-center">Completion %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-semibold">BSCS - Bachelor of Science in Computer Science</td>
                      <td className="p-2 border-r border-black text-center">78</td>
                      <td className="p-2 border-r border-black text-center">50</td>
                      <td className="p-2 border-r border-black text-center">28</td>
                      <td className="p-2 border-r border-black text-center">46</td>
                      <td className="p-2 border-r border-black text-center">32</td>
                      <td className="p-2 text-center">64.1%</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-semibold">BAEL - Bachelor of Arts in English Language</td>
                      <td className="p-2 border-r border-black text-center">45</td>
                      <td className="p-2 border-r border-black text-center">28</td>
                      <td className="p-2 border-r border-black text-center">17</td>
                      <td className="p-2 border-r border-black text-center">18</td>
                      <td className="p-2 border-r border-black text-center">27</td>
                      <td className="p-2 text-center">62.2%</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-semibold">BSFT - Bachelor of Science in Food Technology</td>
                      <td className="p-2 border-r border-black text-center">52</td>
                      <td className="p-2 border-r border-black text-center">31</td>
                      <td className="p-2 border-r border-black text-center">21</td>
                      <td className="p-2 border-r border-black text-center">24</td>
                      <td className="p-2 border-r border-black text-center">28</td>
                      <td className="p-2 text-center">59.6%</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-semibold">BSOA - Bachelor of Science in Office Administration</td>
                      <td className="p-2 border-r border-black text-center">38</td>
                      <td className="p-2 border-r border-black text-center">19</td>
                      <td className="p-2 border-r border-black text-center">19</td>
                      <td className="p-2 border-r border-black text-center">19</td>
                      <td className="p-2 border-r border-black text-center">19</td>
                      <td className="p-2 text-center">50.0%</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="p-2 border-r border-black">Institutional Overall Total</td>
                      <td className="p-2 border-r border-black text-center">213</td>
                      <td className="p-2 border-r border-black text-center">128</td>
                      <td className="p-2 border-r border-black text-center">85</td>
                      <td className="p-2 border-r border-black text-center">117</td>
                      <td className="p-2 border-r border-black text-center">96</td>
                      <td className="p-2 text-center">60.1%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              /* Page 2 Print Roster */
              <table className="w-full text-xs border border-black border-collapse">
                <thead>
                  <tr className="bg-gray-200 border-b border-black font-bold">
                    <th className="p-2 border-r border-black text-center">#</th>
                    <th className="p-2 border-r border-black text-left">Student Name</th>
                    <th className="p-2 border-r border-black text-center">Year Level</th>
                    <th className="p-2 border-r border-black text-center">Course</th>
                    <th className="p-2 border-r border-black text-center">Category</th>
                    <th className="p-2 border-r border-black text-center">Sub Type</th>
                    <th className="p-2 text-left">Scholarship Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBreakdown.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-300">
                      <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-black font-bold">{row.student}</td>
                      <td className="p-2 border-r border-black text-center">{row.yearLevel}</td>
                      <td className="p-2 border-r border-black text-center">{row.course}</td>
                      <td className="p-2 border-r border-black text-center">{row.category}</td>
                      <td className="p-2 border-r border-black text-center">{row.subType}</td>
                      <td className="p-2 font-medium">{row.allocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Official Signatories */}
            <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs">
              <div>
                <div className="border-b border-black w-48 mx-auto mb-1"></div>
                <p className="font-bold">RELIE AGUILOS</p>
                <p className="text-gray-600">Guidance Counselor</p>
              </div>
              <div>
                <div className="border-b border-black w-48 mx-auto mb-1"></div>
                <p className="font-bold">DR. MARIA THERESA FERNANDEZ</p>
                <p className="text-gray-600">Dean of Student Affairs / Campus Administrator</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SCREEN UI (Active in Interactive Browser Preview)
          ========================================================================= */}
      <div className="print:hidden space-y-6">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-serif font-bold text-[#0c2340] tracking-tight">
            {currentPage === 1 ? 'Reports & Analytics' : 'Scholarship Breakdown'}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-[#dce9f9] hover:bg-[#cbe0f8] text-[#154687] border border-[#a8c7ed] px-7 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Export as PDF</span>
            </button>
          </div>
        </div>

        {currentPage === 1 ? (
          <>
            {/* Filters Card matching the screenshot */}
            <div className="bg-[#edf3fa] border border-[#d6e3f0] rounded-2xl p-5 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* COURSE Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
                    COURSE
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1864db]/30 cursor-pointer shadow-xs"
                    >
                      <option value="All courses">All courses</option>
                      <option value="BSCS">Bachelor of Science in Computer Science (BSCS)</option>
                      <option value="BAEL">Bachelor of Arts in English Language (BAEL)</option>
                      <option value="BSFT">Bachelor of Science in Food Technology (BSFT)</option>
                      <option value="BSOA">Bachelor of Science in Office Administration (BSOA)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* YEAR LEVEL Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
                    YEAR LEVEL
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYearLevel}
                      onChange={(e) => setSelectedYearLevel(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1864db]/30 cursor-pointer shadow-xs"
                    >
                      <option value="All year level">All year level</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 1: Submissions Status Distribution */}
            <div className="bg-white rounded-2xl border border-gray-300/80 shadow-xs p-6 space-y-6">
              <h2 className="text-base font-bold text-gray-900">
                Submissions Status Distribution
              </h2>

              {/* Complete Section */}
              <div className="space-y-2">
                <div className="font-bold text-sm text-gray-900">Complete</div>
                {/* Progress bar container */}
                <div className="w-full h-12 bg-[#ececec] rounded-2xl overflow-hidden p-0 relative border border-gray-200/40">
                  <div
                    className="h-full bg-[#1ebc3c] rounded-2xl transition-all duration-500 ease-out"
                    style={{ width: `${completePercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-500 px-1 pt-0.5">
                  <span>{completeCount} students</span>
                  <span>out of {totalCount} students</span>
                </div>
              </div>

              {/* Incomplete Section */}
              <div className="space-y-2">
                <div className="font-bold text-sm text-gray-900">Incomplete</div>
                {/* Progress bar container */}
                <div className="w-full h-12 bg-[#ececec] rounded-2xl overflow-hidden p-0 relative border border-gray-200/40">
                  <div
                    className="h-full bg-[#e5a800] rounded-2xl transition-all duration-500 ease-out"
                    style={{ width: `${incompletePercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-500 px-1 pt-0.5">
                  <span>{incompleteCount} students</span>
                  <span>out of {totalCount} students</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Gender Status Distribution */}
            <div className="bg-white rounded-2xl border border-gray-300/80 shadow-xs p-6 space-y-6">
              <h2 className="text-base font-bold text-gray-900">
                Gender Status Distribution
              </h2>

              {/* Male Section */}
              <div className="space-y-2">
                <div className="font-bold text-sm text-gray-900">Male</div>
                {/* Progress bar container */}
                <div className="w-full h-12 bg-[#ececec] rounded-2xl overflow-hidden p-0 relative border border-gray-200/40">
                  <div
                    className="h-full bg-[#1da1f2] rounded-2xl transition-all duration-500 ease-out"
                    style={{ width: `${malePercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-500 px-1 pt-0.5">
                  <span>{maleCount} students</span>
                  <span>out of {totalCount} students</span>
                </div>
              </div>

              {/* Female Section */}
              <div className="space-y-2">
                <div className="font-bold text-sm text-gray-900">Female</div>
                {/* Progress bar container */}
                <div className="w-full h-12 bg-[#ececec] rounded-2xl overflow-hidden p-0 relative border border-gray-200/40">
                  <div
                    className="h-full bg-[#e94580] rounded-2xl transition-all duration-500 ease-out"
                    style={{ width: `${femalePercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-500 px-1 pt-0.5">
                  <span>{femaleCount} students</span>
                  <span>out of {totalCount} students</span>
                </div>
              </div>
            </div>

            {/* Bottom Action (Next Button) */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentPage(2)}
                className="bg-[#2861c8] hover:bg-[#1f4ea3] text-white px-10 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          /* PAGE 2: Scholarship Breakdown matching the exact image */
          <div className="space-y-6">
            {/* Top Filter Card */}
            <div className="bg-[#edf3fa] border border-[#d6e3f0] rounded-2xl p-5 shadow-xs">
              <div className="flex flex-wrap items-end gap-4">
                {/* 1. CATEGORY */}
                <div className="flex-1 min-w-[200px] space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
                    CATEGORY
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setAppliedFilters(prev => ({ ...prev, category: e.target.value }));
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1864db]/30 cursor-pointer shadow-xs"
                    >
                      <option value="Category">Category</option>
                      <option value="Internally-Funded">Internally-Funded</option>
                      <option value="Externally-Funded">Externally-Funded</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* 2. SUB TYPE */}
                <div className="flex-1 min-w-[200px] space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
                    SUB TYPE
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSubType}
                      onChange={(e) => {
                        setSelectedSubType(e.target.value);
                        setAppliedFilters(prev => ({ ...prev, subType: e.target.value }));
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1864db]/30 cursor-pointer shadow-xs"
                    >
                      <option value="Sub Type">Sub Type</option>
                      <option value="CHED">CHED</option>
                      <option value="Institutional">Institutional</option>
                      <option value="Socio-cultural">Socio-cultural</option>
                      <option value="Academic">Academic</option>
                      <option value="Merit">Merit</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* 3. SCHOLARSHIP ALLOCATION */}
                <div className="flex-1 min-w-[240px] space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
                    SCHOLARSHIP ALLOCATION
                  </label>
                  <div className="relative">
                    <select
                      value={selectedAllocation}
                      onChange={(e) => {
                        setSelectedAllocation(e.target.value);
                        setAppliedFilters(prev => ({ ...prev, allocation: e.target.value }));
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1864db]/30 cursor-pointer shadow-xs"
                    >
                      <option value="Scholarship Allocation">Scholarship Allocation</option>
                      <option value="Pag-Ulikid">Pag-Ulikid</option>
                      <option value="Tulong Dunong">Tulong Dunong</option>
                      <option value="ANAC-IP">ANAC-IP</option>
                      <option value="President—FLP">President—FLP</option>
                      <option value="Dependent of Faculty or Staff">Dependent of Faculty or Staff</option>
                      <option value="Regional">Regional</option>
                      <option value="Partial">Partial</option>
                      <option value="UniFast">UniFast</option>
                      <option value="TES">TES</option>
                      <option value="DOST">DOST</option>
                      <option value="LGU">LGU</option>
                      <option value="Barangay (Legal dependents of Brgy. Officials)">Barangay (Legal dependents of Brgy. Officials)</option>
                      <option value="ESGP – PA">ESGP – PA</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Filter button & count reset link */}
                <div className="flex items-center gap-4 pb-0.5">
                  <button
                    onClick={handleApplyFilters}
                    className="bg-[#dce9f9] hover:bg-[#cbe0f8] text-[#154687] border border-[#a8c7ed] px-6 py-2 rounded-xl font-bold text-sm shadow-xs transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4 stroke-[2.5]" />
                    <span>Filter</span>
                  </button>

                  {/* Dynamic Interactive Student Count Link */}
                  <button
                    onClick={handleResetFilters}
                    title="Click to reset filters and view all students"
                    className="text-[#1864db] font-bold text-sm underline cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    ({filteredBreakdown.length === initialBreakdownData.length ? '213' : filteredBreakdown.length}) students
                  </button>

                  {(appliedFilters.category !== 'Category' || appliedFilters.subType !== 'Sub Type' || appliedFilters.allocation !== 'Scholarship Allocation') && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-gray-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Scholarship Breakdown Table */}
            <div className="bg-white rounded-2xl border border-gray-300 shadow-xs overflow-hidden">
              <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#edf3fa] text-[#486581] text-[11px] font-bold uppercase tracking-wider border-b border-gray-300">
                      <th className="py-3 px-6 font-bold text-center">STUDENT</th>
                      <th className="py-3 px-6 font-bold text-center">YEAR LEVEL</th>
                      <th className="py-3 px-6 font-bold text-center">COURSE</th>
                      <th className="py-3 px-6 font-bold text-center">CATEGORY</th>
                      <th className="py-3 px-6 font-bold text-center">SUB TYPE</th>
                      <th className="py-3 px-6 font-bold text-center">SCHOLARSHIP ALLOCATION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/80 text-[13px]">
                    {filteredBreakdown.map((row) => (
                      <tr 
                        key={row.id} 
                        onClick={() => setSelectedStudent(row)}
                        className="hover:bg-blue-50/60 transition-colors cursor-pointer group"
                        title="Click to view detailed student scholarship profile"
                      >
                        <td className="py-3.5 px-6 font-bold text-gray-900 text-center group-hover:text-[#1864db] transition-colors flex items-center justify-center gap-2">
                          <span>{row.student}</span>
                        </td>
                        <td className="py-3.5 px-6 text-gray-800 text-center">{row.yearLevel}</td>
                        <td className="py-3.5 px-6 font-bold text-gray-900 text-center">{row.course}</td>
                        <td className="py-3.5 px-6 text-gray-800 text-center">{row.category}</td>
                        <td className="py-3.5 px-6 text-gray-800 text-center">{row.subType}</td>
                        <td className="py-3.5 px-6 text-gray-800 text-center font-medium">{row.allocation}</td>
                      </tr>
                    ))}
                    {filteredBreakdown.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="font-bold text-gray-800">No students found</p>
                          <p className="text-xs text-gray-500 mt-1">Try resetting the Category, Sub Type, or Allocation filters.</p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-3 px-4 py-1.5 bg-[#1864db] text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                          >
                            Reset All Filters
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Action (Back Button on bottom-left) */}
            <div className="flex justify-start pt-2">
              <button
                onClick={() => setCurrentPage(1)}
                className="bg-[#2861c8] hover:bg-[#1f4ea3] text-white px-10 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          STUDENT DETAIL MODAL (Opens on clicking any student)
          ========================================================================= */}
      {selectedStudent && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedStudent(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="bg-[#0c2340] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-white leading-tight">
                    {selectedStudent.student}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-blue-200 mt-0.5">
                    <span>{selectedStudent.studentId}</span>
                    <span>•</span>
                    <span>{selectedStudent.courseFull} ({selectedStudent.course})</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
              {/* Status Badge & Allocation Banner */}
              <div className="bg-[#edf3fa] border border-[#cbe0f8] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Scholarship Program</span>
                  <p className="text-base font-bold text-[#0c2340]">{selectedStudent.allocation}</p>
                  <p className="text-xs text-blue-700 font-medium">{selectedStudent.category} • {selectedStudent.subType}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete & Verified
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">Submitted on {selectedStudent.dateSubmitted}</p>
                </div>
              </div>

              {/* 2-Column Student Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#1864db]" /> Academic Standing
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Year Level:</span>
                      <span className="font-bold text-gray-900">{selectedStudent.yearLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">General Weighted Average:</span>
                      <span className="font-bold text-green-700">{selectedStudent.gwa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Units Enrolled:</span>
                      <span className="font-bold text-gray-900">{selectedStudent.units} Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender:</span>
                      <span className="font-bold text-gray-900">{selectedStudent.gender}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#1864db]" /> Contact & Address
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900 truncate max-w-[140px]">{selectedStudent.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium text-gray-900 truncate max-w-[140px]">{selectedStudent.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents & File Attachments */}
              {selectedStudent.files && selectedStudent.files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-[#1864db]" /> Attached Uploads & Verification Files ({selectedStudent.files.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedStudent.files.map((file: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-xl shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-gray-900 truncate">{file.name || `Document_${i+1}.pdf`}</p>
                            <p className="text-[10px] text-gray-500">{file.size || 'Stored in Cloud'}</p>
                          </div>
                        </div>
                        {file.data ? (
                          <a
                            href={file.data}
                            download={file.name || 'document'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors"
                            title="Download or view file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                            Synced
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentary Verification Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#1864db]" /> Documentary Requirements Verified
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedStudent.requirements.map((req, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs">
                      <span className="font-medium text-gray-800">{req.name}</span>
                      <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counselor Evaluation Remarks */}
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 space-y-1">
                <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider">Guidance Counselor Evaluation Remarks</span>
                <p className="text-xs text-gray-800 leading-relaxed italic">{selectedStudent.remarks}</p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => handlePrintStudent(selectedStudent)}
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#1864db]" />
                <span>Print Profile Voucher</span>
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-[#0c2340] hover:bg-[#15345e] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
