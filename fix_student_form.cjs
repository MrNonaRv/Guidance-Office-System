const fs = require('fs');

let content = fs.readFileSync('src/pages/student/index.tsx', 'utf-8');

const hookLogic = `
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const [formConfig, setFormConfig] = useState<any>(null);

  React.useEffect(() => {
    if (formId) {
      db.forms.get(formId).then(setFormConfig);
    }
  }, [formId]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Comprehensive Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    // A. Personal Demographics
    familyName: '',
    firstName: '',
    middleName: '',
    course: 'BAEL',
    yearLevel: '1st Year',
    section: '',
    sex: 'Female',
    civilStatus: 'Single',
    
    // B. Family Background
    fatherOccupation: '',
    motherOccupation: '',
    guardianOccupation: '',
    parentsEducationalAttainment: '',
    monthlyIncome: '',
    firstGenCollege: 'No',

    // C. Living Condition
    livingWith: '',
    housingType: '',

    // D. Access to Resources
    accessPc: false,
    accessInternet: false,
    accessStudySpace: false,
    accessBooks: false,
    workingStudent: 'No',

    // E. Student Classification
    classification: '',
    
    // F. Scholarship Category
    fundingType: 'Internally-Funded',
    scholarshipCategory: ''
  });
`;

const newHookLogic = `
  const [searchParams] = useSearchParams();
  const scholarshipId = searchParams.get('scholarshipId');
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Comprehensive Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    // A. Personal Demographics
    familyName: '',
    firstName: '',
    middleName: '',
    course: 'BAEL',
    yearLevel: '1st Year',
    section: '',
    sex: 'Female',
    civilStatus: 'Single',
    
    // B. Family Background
    fatherOccupation: '',
    motherOccupation: '',
    guardianOccupation: '',
    parentsEducationalAttainment: '',
    monthlyIncome: '',
    firstGenCollege: 'No',

    // C. Living Condition
    livingWith: '',
    housingType: '',

    // D. Access to Resources
    accessPc: false,
    accessInternet: false,
    accessStudySpace: false,
    accessBooks: false,
    workingStudent: 'No',

    // E. Student Classification
    classification: '',
    
    // F. Scholarship Category
    fundingType: 'Internally-Funded',
    scholarshipCategory: ''
  });

  React.useEffect(() => {
    if (scholarshipId) {
      // @ts-ignore
      db.scholarships.get(scholarshipId).then(s => {
        if (s) {
          setSelectedScholarship(s);
          setFormData(prev => ({
            ...prev,
            fundingType: s.type,
            scholarshipCategory: s.category + ' - ' + s.name
          }));
        }
      });
    }
  }, [scholarshipId]);
`;

content = content.replace(hookLogic, newHookLogic);
fs.writeFileSync('src/pages/student/index.tsx', content);
