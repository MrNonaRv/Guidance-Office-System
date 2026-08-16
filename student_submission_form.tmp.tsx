import { useSearchParams } from 'react-router-dom';

export function StudentSubmissionForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const [formConfig, setFormConfig] = useState<any>(null);

  React.useEffect(() => {
    if (formId) {
      db.forms.get(formId).then(setFormConfig);
    }
  }, [formId]);

  const [formData, setFormData] = useState<Record<string, string>>({
    familyName: '',
    middleName: '',
    firstName: '',
    birthdate: '',
    age: '',
    sex: 'Female',
    course: ''
  });

  const [files, setFiles] = useState<Record<string, { name: string, data: string }>>({});

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFiles(prev => ({
        ...prev,
        [key]: {
          name: file.name,
          data: event.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const [formError, setFormError] = useState('');

  const handleNext = () => {
    setFormError('');
    if (step === 1) {
      if (!files.picture) {
        setFormError('Please upload your 2x2 Picture before proceeding.');
        return;
      }
      if (formConfig?.fields) {
        for (const field of formConfig.fields) {
          if (field.required && !formData[field.id]) {
            setFormError(`Please fill out the required field: ${field.label}`);
            return;
          }
        }
      }
    } else if (step === 2) {
      if (formConfig?.documents) {
         for (const doc of formConfig.documents) {
           if (doc.required && !files[doc.id]) {
             setFormError(`Please upload the required document: ${doc.label}`);
             return;
           }
         }
      } else {
        if (!files.studentId || !files.rf || !files.gwa) {
          setFormError('Please upload all required scholarship documents (Student ID, Registration Form, GWA) before proceeding.');
          return;
        }
      }
    }
    if (step < 3) setStep(step + 1);
  };
  
  const handleBack = () => {
    setFormError('');
    if (step > 1) setStep(step - 1);
    else navigate('/student/dashboard');
  };
  
  const [showSuccess, setShowSuccess] = useState(false);
  const handleSubmit = async () => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (!sessionStr) return;
    const user = JSON.parse(sessionStr);

    const mappedFiles = Object.entries(files).map(([key, f]) => ({
      id: key,
      name: f.name,
      type: 'document',
      data: f.data
    }));

    const submission = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: `${formData.firstName} ${formData.familyName}`,
      scholarshipType: formConfig?.title || 'Standard Scholarship',
      formId: formId || undefined,
      answers: formData,
      status: 'Pending' as const,
      submittedAt: new Date().toISOString(),
      files: mappedFiles
    };

    await db.submissions.set(submission.id, submission);
    setShowSuccess(true);
  };

  if (formId && !formConfig) {
    return <div className="p-12 text-center text-gray-500">Loading form...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      {showSuccess && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
               <CheckCircle2 className="w-8 h-8 text-white" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Requirements Submitted!</h3>
             <p className="text-sm text-gray-600 mb-4">
               Your scholarship requirements has been successfully submitted. Please wait for the approval of the Guidance Office. A notification will be sent to your registered Gmail account.
             </p>
             <p className="text-xs text-gray-400 mb-8 italic">If you do not see the email in your inbox, please check your Spam inbox. Thank you.</p>
             <button 
               onClick={() => navigate('/student/dashboard')}
               className="w-full py-3 bg-[#0f2e60] text-white rounded-xl font-medium hover:bg-[#1a4484] transition-colors"
             >
               Return to Dashboard
             </button>
           </div>
        </div>
      )}

      {/* Progress Bar Header */}
      <div className="p-6 border-b border-gray-100 flex justify-center py-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm", step >= 1 ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-gray-100 text-gray-400")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 1 ? "text-blue-600" : "text-gray-400")}>Student Information</span>
          </div>
          
          <div className={cn("w-16 h-px mb-6", step >= 2 ? "bg-blue-600" : "bg-gray-300")}></div>
          
          <div className="flex flex-col items-center">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm", step >= 2 ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-gray-100 text-gray-400")}>
              <Upload className="w-6 h-6" />
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 2 ? "text-blue-600" : "text-gray-400")}>Upload Files</span>
          </div>
          
          <div className={cn("w-16 h-px mb-6", step >= 3 ? "bg-blue-600" : "bg-gray-300")}></div>
          
          <div className="flex flex-col items-center">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm", step >= 3 ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-gray-100 text-gray-400")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/></svg>
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 3 ? "text-blue-600" : "text-gray-400")}>Review</span>
          </div>
        </div>
      </div>

      <div className="p-8 pb-24">
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8 border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-serif text-gray-900 mb-2">{formConfig?.title || 'Scholarship Record Form'}</h2>
              {formConfig?.description && <p className="text-sm text-gray-700 mb-4">{formConfig.description}</p>}
              <p className="text-xs text-gray-500">Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800 font-medium text-center">
              Please fill out all required fields accurately and completely. This form will be reviewed by the Guidance Office prior to processing.
            </div>

            <div className="bg-blue-600 text-white p-3 rounded-xl font-bold text-center uppercase tracking-wider text-sm shadow-md">
              Student Demographics
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Information
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <label className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden block">
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange('picture', e)} />
                    {files.picture ? (
                      <img src={files.picture.data} alt="2x2" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        <span className="text-xs font-medium text-center px-2">2 x 2 Picture</span>
                      </>
                    )}
                  </label>
                </div>
                
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Family Name</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. Dela Cruz" value={formData.familyName} onChange={e => setFormData({...formData, familyName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Middle Name</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. Santos" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">First Name</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. Juan" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Birthdate</label>
                    <input type="date" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.birthdate} onChange={e => setFormData({...formData, birthdate: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Age</label>
                    <input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. 18" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block mb-2">Sex</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 text-sm"><input type="radio" name="sex" className="text-blue-600" checked={formData.sex === 'Male'} onChange={() => setFormData({...formData, sex: 'Male'})} /> Male</label>
                      <label className="flex items-center gap-1.5 text-sm"><input type="radio" name="sex" className="text-blue-600" checked={formData.sex === 'Female'} onChange={() => setFormData({...formData, sex: 'Female'})} /> Female</label>
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-xs font-semibold text-gray-700">Course</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. BSIT" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Dynamic Form Fields */}
              {formConfig?.fields && formConfig.fields.length > 0 && (
                <div className="mt-8">
                  <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    Additional Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formConfig.fields.map((field: any) => (
                      <div key={field.id} className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input 
                          type={field.type} 
                          required={field.required}
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm" 
                          value={formData[field.id] || ''} 
                          onChange={e => setFormData({...formData, [field.id]: e.target.value})} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-serif text-gray-900 mb-2">Scholarship Documents</h2>
              <p className="text-xs text-gray-500">Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012</p>
            </div>
            
             <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800 font-medium">
              Upload the following required scholarship documents.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {formConfig?.documents ? formConfig.documents.map((doc: any) => (
                <div key={doc.id} className="flex flex-col items-center">
                  <label className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group mb-3 relative overflow-hidden">
                     <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange(doc.id, e)} />
                     {files[doc.id] ? (
                       <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                         <FileText className="w-8 h-8 text-blue-600 mb-1" />
                         <span className="text-[10px] text-blue-800 font-bold absolute bottom-2 w-full truncate px-2">{files[doc.id].name}</span>
                       </div>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                     )}
                     <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">Change</span>
                     </div>
                  </label>
                  <p className="text-sm font-bold text-gray-700">{doc.label} {doc.required && <span className="text-red-500">*</span>}</p>
                  {doc.description && <p className="text-xs text-gray-500 italic mt-1">{doc.description}</p>}
                </div>
              )) : (
                <>
                  <div className="flex flex-col items-center">
                    <label className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group mb-3 relative overflow-hidden">
                       <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange('studentId', e)} />
                       {files.studentId ? (
                         <img src={files.studentId.data} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="ID" />
                       ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                       )}
                    </label>
                    <p className="text-sm font-bold text-gray-700">Student ID</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group mb-3 relative overflow-hidden">
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange('rf', e)} />
                      {files.rf ? (
                        <img src={files.rf.data} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="RF" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      )}
                    </label>
                    <p className="text-sm font-bold text-gray-700">Registration Form</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group mb-3 relative overflow-hidden">
                       <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange('gwa', e)} />
                       {files.gwa ? (
                         <img src={files.gwa.data} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="GWA" />
                       ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                       )}
                    </label>
                    <p className="text-sm font-bold text-gray-700">GWA</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-1">Review Your Submission</h2>
              <p className="text-blue-100 text-sm">Please review all information before submitting.</p>
            </div>
            
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Information
              </div>
              <div className="divide-y divide-gray-100 text-sm">
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-gray-600">Family Name</div>
                  <div className="col-span-2 text-gray-900">{formData.familyName || '-'}</div>
                </div>
                <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                  <div className="font-semibold text-gray-600">First Name</div>
                  <div className="col-span-2 text-gray-900">{formData.firstName || '-'}</div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-gray-600">Course</div>
                  <div className="col-span-2 text-gray-900">{formData.course || '-'}</div>
                </div>
              </div>
            </div>

            {formConfig?.fields && formConfig.fields.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden mt-6">
                <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  Additional Information
                </div>
                <div className="divide-y divide-gray-100 text-sm">
                  {formConfig.fields.map((field: any, index: number) => (
                    <div key={field.id} className={cn("grid grid-cols-3 p-3", index % 2 === 1 ? "bg-gray-50/50" : "bg-white")}>
                      <div className="font-semibold text-gray-600">{field.label}</div>
                      <div className="col-span-2 text-gray-900">{formData[field.id] || '-'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-gray-200 rounded-xl overflow-hidden mt-6">
               <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
                 <Upload className="w-4 h-4" />
                 Uploaded Documents
               </div>
               <div className="p-4 flex gap-4 flex-wrap">
                 {Object.entries(files).filter(([k]) => k !== 'picture').map(([key, f]) => (
                   <div key={key} className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4" />
                     {f.name}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
        {formError && (
          <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 px-4 rounded-lg">
            {formError}
          </div>
        )}
        <div className="flex justify-between">
          <button 
            onClick={handleBack}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-full font-medium text-sm hover:bg-gray-600 transition-colors shadow-md"
          >
            Back
          </button>
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#0f2e60] text-white rounded-full font-medium text-sm hover:bg-[#1a4484] transition-colors shadow-md shadow-blue-900/20"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-green-600 text-white rounded-full font-medium text-sm hover:bg-green-700 transition-colors shadow-md shadow-green-500/20"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
