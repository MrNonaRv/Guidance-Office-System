const fs = require('fs');
const file = 'src/pages/student/index.tsx';
let content = fs.readFileSync(file, 'utf-8');

const startIdx = content.indexOf('export function StudentSubmissionForm() {');
if (startIdx === -1) throw new Error("Could not find StudentSubmissionForm");

const formCode = `export function StudentSubmissionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scholarshipId = searchParams.get('scholarshipId');
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Comprehensive Form State matching the physical forms
  const [formData, setFormData] = useState<Record<string, any>>({
    // A. Personal Demographics & Record
    familyName: '', firstName: '', middleName: '',
    course: '', yearLevel: '', section: '',
    age: '', sex: '', civilStatus: '',
    birthdate: '', contactNo: '', permanentAddress: '',
    
    // B. Family Background
    fatherName: '', fatherOccupation: '', fatherOffice: '',
    motherName: '', motherOccupation: '', motherOffice: '',
    guardianOccupation: '',
    parentsEducationalAttainment: '',
    monthlyIncome: '',
    firstGenCollege: '',

    // C. Living Condition
    livingWith: '', livingWithSpecify: '',
    housingType: '', housingTypeSpecify: '',

    // D. Access to Resources
    accessResources: [] as string[],
    workingStudent: '',

    // E. Student Classification
    classifications: [] as string[],
    classificationOthersSpecify: '',
    workingStudentTypeOfWork: '',
    pwdCondition: '',
    pdlReason: '',
    
    // F. Scholarship Category
    fundingType: 'Internally-Funded',
    scholarshipCategory: '',
    scholarshipSpecify: ''
  });

  const [files, setFiles] = useState<{name: string, data: string, type: string}[]>([]);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (sessionStr) {
      const parsedUser = JSON.parse(sessionStr);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        firstName: parsedUser.firstName || '',
        familyName: parsedUser.lastName || ''
      }));
    }

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

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setFormError('');
    try {
      const submission: any = {
        id: Date.now().toString(),
        studentId: user.id,
        studentName: formData.firstName + ' ' + formData.familyName,
        scholarshipType: formData.fundingType + ' (' + formData.scholarshipCategory + ')',
        formId: scholarshipId || 'default',
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        data: formData,
        files: files
      };
      // @ts-ignore
      await db.submissions.set(submission.id, submission);
      navigate('/student/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit application');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0f2e60]">Scholarship Application</h2>
          <p className="text-gray-500 mt-2">Complete the form below to submit your application.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center relative mb-12 px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1864db] -z-10 rounded-full transition-all duration-300" style={{ width: \`\${((step - 1) / 3) * 100}%\` }}></div>
        
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm",
            step >= s ? "bg-[#1864db] text-white border-2 border-white" : "bg-white text-gray-400 border-2 border-gray-200"
          )}>
            {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {formError}
            </div>
          )}

          {/* STEP 1: DEMOGRAPHICS */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Demographics & Record</h3>
                <p className="text-sm text-gray-500">Please provide your basic information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Family Name</label>
                  <input type="text" value={formData.familyName} onChange={e => setFormData({...formData, familyName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">First Name</label>
                  <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Middle Name</label>
                  <input type="text" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Course</label>
                  <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all">
                    <option value="">Select...</option>
                    <option>BSCS</option>
                    <option>BSFT</option>
                    <option>BSOA</option>
                    <option>BAEL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Year Level</label>
                  <select value={formData.yearLevel} onChange={e => setFormData({...formData, yearLevel: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all">
                    <option value="">Select...</option>
                    <option>First year</option>
                    <option>Second year</option>
                    <option>Third year</option>
                    <option>Fourth year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Section</label>
                  <input type="text" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sex</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sex" checked={formData.sex === 'Male'} onChange={() => setFormData({...formData, sex: 'Male'})} className="w-4 h-4 text-[#1864db]" /> <span>Male</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sex" checked={formData.sex === 'Female'} onChange={() => setFormData({...formData, sex: 'Female'})} className="w-4 h-4 text-[#1864db]" /> <span>Female</span></label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Civil Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="civilStatus" checked={formData.civilStatus === 'Single'} onChange={() => setFormData({...formData, civilStatus: 'Single'})} className="w-4 h-4 text-[#1864db]" /> <span>Single</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="civilStatus" checked={formData.civilStatus === 'Married'} onChange={() => setFormData({...formData, civilStatus: 'Married'})} className="w-4 h-4 text-[#1864db]" /> <span>Married</span></label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Birthdate</label>
                  <input type="date" value={formData.birthdate} onChange={e => setFormData({...formData, birthdate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Contact No.</label>
                  <input type="text" value={formData.contactNo} onChange={e => setFormData({...formData, contactNo: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Permanent Address</label>
                <textarea value={formData.permanentAddress} onChange={e => setFormData({...formData, permanentAddress: e.target.value})} rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
              </div>
            </div>
          )}

          {/* STEP 2: FAMILY BACKGROUND */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Family Background & Living Condition</h3>
              </div>

              {/* Parents Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Father's Name</label>
                    <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Father's Occupation</label>
                    <input type="text" value={formData.fatherOccupation} onChange={e => setFormData({...formData, fatherOccupation: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Office (Father)</label>
                    <input type="text" value={formData.fatherOffice} onChange={e => setFormData({...formData, fatherOffice: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mother's Name</label>
                    <input type="text" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mother's Occupation</label>
                    <input type="text" value={formData.motherOccupation} onChange={e => setFormData({...formData, motherOccupation: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Office (Mother)</label>
                    <input type="text" value={formData.motherOffice} onChange={e => setFormData({...formData, motherOffice: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Guardian's Occupation (If applicable)</label>
                  <input type="text" value={formData.guardianOccupation} onChange={e => setFormData({...formData, guardianOccupation: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Highest Educational Attainment of your Parent/Guardian?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Elementary Level', 'Elementary Graduate', 'High School Level', 'High school Graduate', 'College Level', 'College Graduate', 'post Graduate level/degree'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input type="radio" name="edu" checked={formData.parentsEducationalAttainment === opt} onChange={() => setFormData({...formData, parentsEducationalAttainment: opt})} className="w-4 h-4 text-[#1864db]" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">What is your family's approximate monthly income?</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['below Php10,000', 'Php10,001 - 20,000', 'Php20,001 - 30,000', 'Above 30,000'].map(opt => (
                        <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input type="radio" name="income" checked={formData.monthlyIncome === opt} onChange={() => setFormData({...formData, monthlyIncome: opt})} className="w-4 h-4 text-[#1864db]" />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Are you the first in the family to attend College?</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="firstGen" checked={formData.firstGenCollege === 'Yes'} onChange={() => setFormData({...formData, firstGenCollege: 'Yes'})} className="w-4 h-4 text-[#1864db]" /> <span>Yes</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="firstGen" checked={formData.firstGenCollege === 'No'} onChange={() => setFormData({...formData, firstGenCollege: 'No'})} className="w-4 h-4 text-[#1864db]" /> <span>No</span></label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">With whom do you currently live?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Parents/Guardians', 'Boarding house', 'Relatives', 'Alone'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input type="radio" name="live" checked={formData.livingWith === opt} onChange={() => setFormData({...formData, livingWith: opt})} className="w-4 h-4 text-[#1864db]" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3 p-2 col-span-2">
                      <input type="radio" name="live" checked={formData.livingWith === 'others'} onChange={() => setFormData({...formData, livingWith: 'others'})} className="w-4 h-4 text-[#1864db]" />
                      <span className="text-sm text-gray-700 whitespace-nowrap">others (specify)</span>
                      <input type="text" value={formData.livingWithSpecify} onChange={e => setFormData({...formData, livingWithSpecify: e.target.value})} className="border-b border-gray-300 focus:border-[#1864db] outline-none flex-1 bg-transparent px-2 text-sm" disabled={formData.livingWith !== 'others'} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Type of Housing</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Own house', 'Rented house or apartment', 'Boarding house'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input type="radio" name="housing" checked={formData.housingType === opt} onChange={() => setFormData({...formData, housingType: opt})} className="w-4 h-4 text-[#1864db]" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3 p-2">
                      <input type="radio" name="housing" checked={formData.housingType === 'Others'} onChange={() => setFormData({...formData, housingType: 'Others'})} className="w-4 h-4 text-[#1864db]" />
                      <span className="text-sm text-gray-700 whitespace-nowrap">Others (specify)</span>
                      <input type="text" value={formData.housingTypeSpecify} onChange={e => setFormData({...formData, housingTypeSpecify: e.target.value})} className="border-b border-gray-300 focus:border-[#1864db] outline-none flex-1 bg-transparent px-2 text-sm" disabled={formData.housingType !== 'Others'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CLASSIFICATION */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Survey & Student Classification</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Do you have access of the following at home?</label>
                  <div className="space-y-2">
                    {['Personal Computer/Laptop', 'Internet Connection', 'Study space', 'Textbooks and learning materials'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                        <input type="checkbox" checked={formData.accessResources.includes(opt)} onChange={() => handleCheckboxChange('accessResources', opt)} className="w-4 h-4 text-[#1864db] rounded border-gray-300" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Do you work while studying?</label>
                  <div className="flex flex-wrap gap-4">
                    {['Yes, full-time', 'Yes, part-time', 'No'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg">
                        <input type="radio" name="working" checked={formData.workingStudent === opt} onChange={() => setFormData({...formData, workingStudent: opt})} className="w-4 h-4 text-[#1864db]" /> 
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-4">Which of the following classification best describe your current status? (Multiple responses allowed)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  {[
                    'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 
                    'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
                    'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school',
                    'Rebel returnees', 'Child of a rebel returnees', 'Dependent or child of OFW',
                    'Member of 4Ps', 'Member of Calamity or Disaster Affected Family',
                    'Orphan/Child in need of special protection', 'Working Student',
                    'From geographically isolated & disadvantaged area (GIDA)', 'Muslim Student',
                    'Low income family/ Economically disadvantaged student', 'Senior Citizen student',
                    'First Generation student (Parents did not complete a college degree)',
                    'LGBTQ+ Community', 'Regular student (I do not belong to any of this group classification)'
                  ].map(opt => (
                    <label key={opt} className="flex items-start gap-3 p-1 cursor-pointer hover:bg-gray-50 rounded group">
                      <input type="checkbox" checked={formData.classifications.includes(opt)} onChange={() => handleCheckboxChange('classifications', opt)} className="w-4 h-4 text-[#1864db] rounded border-gray-300 mt-0.5" />
                      <span className="text-gray-700 leading-tight">{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.classifications.includes('others')} onChange={() => handleCheckboxChange('classifications', 'others')} className="w-4 h-4 text-[#1864db] rounded" />
                      <span className="text-sm text-gray-700 font-medium">others (Please specify)</span>
                    </label>
                    <input type="text" value={formData.classificationOthersSpecify} onChange={e => setFormData({...formData, classificationOthersSpecify: e.target.value})} className="border-b border-gray-300 focus:border-[#1864db] outline-none flex-1 bg-transparent px-2 text-sm" disabled={!formData.classifications.includes('others')} />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">If you are working student, please indicate your type of work or source of income:</label>
                    <input type="text" value={formData.workingStudentTypeOfWork} onChange={e => setFormData({...formData, workingStudentTypeOfWork: e.target.value})} className="w-full border-b border-gray-300 focus:border-[#1864db] outline-none bg-transparent py-1 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">If you are a student with special needs/Person with disability (PWD), please specify your condition or disability:</label>
                    <input type="text" value={formData.pwdCondition} onChange={e => setFormData({...formData, pwdCondition: e.target.value})} className="w-full border-b border-gray-300 focus:border-[#1864db] outline-none bg-transparent py-1 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted:</label>
                    <input type="text" value={formData.pdlReason} onChange={e => setFormData({...formData, pdlReason: e.target.value})} className="w-full border-b border-gray-300 focus:border-[#1864db] outline-none bg-transparent py-1 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ATTACHMENTS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Scholarship Category & Attachments</h3>
                <p className="text-sm text-gray-500">Confirm your scholarship category and upload requirements.</p>
              </div>
              
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8">
                <h4 className="font-bold text-[#0f2e60] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1864db]" /> 
                  Selected Scholarship Target
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Funding Type</label>
                    <select value={formData.fundingType} onChange={e => setFormData({...formData, fundingType: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:border-[#1864db] outline-none">
                      <option value="Internally-Funded">Internally-Funded</option>
                      <option value="Externally-Funded">Externally-Funded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Scholarship Category</label>
                    <input type="text" value={formData.scholarshipCategory} onChange={e => setFormData({...formData, scholarshipCategory: e.target.value})} placeholder="e.g. Entrance - Valedictorian" className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:border-[#1864db] outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">Required Attachments</label>
                
                {['2x2 Picture', 'Certificate of Grades (COG)'].map((docName, idx) => (
                  <div key={idx} className="border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#1864db] transition-colors relative group">
                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-6 h-6 text-[#1864db]" />
                    </div>
                    <p className="font-bold text-gray-900">{docName}</p>
                    <p className="text-xs text-gray-500 mt-1">Click or drag file to upload</p>
                  </div>
                ))}

                {files.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Uploaded Files</h4>
                    <div className="space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-sm font-medium text-gray-700">{f.name}</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={step === 1}
            className="px-6 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-200 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-[#1864db] text-white rounded-full font-bold text-sm hover:bg-[#124b9f] transition-all shadow-md flex items-center gap-2"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#0f2e60] text-white rounded-full font-bold text-sm hover:bg-[#0a2044] transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}`;

content = content.substring(0, startIdx) + formCode;
fs.writeFileSync(file, content);
