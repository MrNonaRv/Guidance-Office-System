const fs = require('fs');

let s = fs.readFileSync('src/pages/student/index.tsx', 'utf8');

// 1. Insert validation and submit handlers
const insertionPoint = '  const handleCategoryFileUpload = ';
const newMethods = `
  const validateStep1 = () => {
    const required = ['familyName', 'firstName', 'birthdate', 'sex', 'yearLevel', 'course', 'contactNo', 'email', 'permanentAddress'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    if (missing.length > 0) {
      alert('Please fill in all required personal information fields.');
      return false;
    }
    if (!formData.signature) {
      alert('Please provide your signature at the bottom of the form.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const requiredCats = ['RF', 'GWA', 'ID'];
    const missing = requiredCats.filter(cat => !files.find((f: any) => f.category === cat));
    if (missing.length > 0) {
      alert('Please upload all required documents (Registration Form, GWA, and Student ID).');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submission = {
        studentId: formData.email || \`STU-\${Date.now()}\`,
        studentName: \`\${formData.firstName} \${formData.familyName}\`.trim() || 'Anonymous Student',
        scholarshipType: formData.internalCategory || formData.chedSubCategory || formData.meritSubCategory || formData.externalCategory || 'General Scholarship',
        status: 'Pending' as const,
        submittedAt: new Date().toISOString(),
        data: formData,
        files: files.map((f: any) => ({
          name: f.name,
          type: f.type,
          size: f.size,
          category: f.category,
          data: f.data,
          uploadedAt: new Date().toISOString(),
          status: 'Pending' as const,
        }))
      };
      
      await db.submissions.create(submission);
      alert('Application submitted successfully!');
      navigate('/student'); // Navigate back to dashboard
    } catch (e) {
      console.error(e);
      alert('Error submitting application');
    } finally {
      setIsSubmitting(false);
    }
  };

`;

if (!s.includes('validateStep1')) {
    s = s.replace(insertionPoint, newMethods + insertionPoint);
}

// 2. Replace Next button on step 1
s = s.replace(
    `<button onClick={() => setStep(2)} className="bg-[#1e3a8a] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm">`,
    `<button onClick={() => { if(validateStep1()) setStep(2); }} className="bg-[#1e3a8a] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm">`
);

// 3. Replace Next button on step 2
s = s.replace(
    `<button onClick={() => setStep(3)} className="bg-[#1e3a8a] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm">Next</button>`,
    `<button onClick={() => { if(validateStep2()) setStep(3); }} className="bg-[#1e3a8a] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm">Next</button>`
);

// 4. Replace Submit button on step 3
s = s.replace(
    `<button onClick={() => alert('Form submitted!')} className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2">`,
    `<button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">`
);
s = s.replace(
    `<Check className="w-5 h-5" /> Submit Application`,
    `{isSubmitting ? 'Submitting...' : <><Check className="w-5 h-5" /> Submit Application</>}`
);

fs.writeFileSync('src/pages/student/index.tsx', s);
