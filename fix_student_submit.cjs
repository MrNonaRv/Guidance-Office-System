const fs = require('fs');

let content = fs.readFileSync('src/pages/student/index.tsx', 'utf-8');

const submitLogic = `
      const submission = {
        id: Date.now().toString(),
        studentId: user.id,
        formId: formId || 'default',
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        data: formData,
        files: files
      };`;

const newSubmitLogic = `
      const submission: any = {
        id: Date.now().toString(),
        studentId: user.id,
        studentName: formData.firstName + ' ' + formData.familyName,
        scholarshipType: formData.fundingType + ' (' + formData.scholarshipCategory + ')',
        formId: formId || 'default',
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        data: formData,
        files: files
      };`;

content = content.replace(submitLogic, newSubmitLogic);
fs.writeFileSync('src/pages/student/index.tsx', content);
