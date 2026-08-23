const fs = require('fs');
let s = fs.readFileSync('src/components/StudentRecordModal.tsx', 'utf8');

const oldReqs = `  const requirementsList = [
    {
      id: 'req-photo',
      name: '2x2 Recent Formal ID Photo',
      category: '2x2 Recent Formal ID Photo',
      fileName: \`\${studentName.replace(/\\s+/g, '_')}_2x2_Photo.png\`,
      status: (photo2x2 || localSubmission.files?.find((f: any) => f.category?.includes('Photo') || f.category?.includes('2x2'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category?.includes('Photo') || f.category?.includes('2x2')) || (photo2x2 ? { name: '2x2_Photo.png', data: photo2x2, type: 'image/png', category: '2x2 Recent Formal ID Photo' } : null)
    },
    {
      id: 'req-1',
      name: 'Certificate of Grades (COG)',
      category: 'Certificate of Grades (COG)',
      fileName: \`\${studentName.replace(/\\s+/g, '_')}_COG.pdf\`,
      status: (localSubmission.files?.find((f: any) => f.category?.includes('COG') || f.name?.includes('Grade'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category?.includes('COG') || f.name?.includes('Grade'))
    },
    {
      id: 'req-2',
      name: 'Certificate of Registration (COR)',
      category: 'Certificate of Registration (COR)',
      fileName: \`\${studentName.replace(/\\s+/g, '_')}_COR.pdf\`,
      status: (localSubmission.files?.find((f: any) => f.category?.includes('COR') || f.name?.includes('Registration'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category?.includes('COR') || f.name?.includes('Registration'))
    },
    {
      id: 'req-3',
      name: 'Proof of Income / Indigency',
      category: 'Proof of Income / Certificate of Indigency',
      fileName: \`\${studentName.replace(/\\s+/g, '_')}_Indigency.pdf\`,
      status: (localSubmission.files?.find((f: any) => f.category?.includes('Income') || f.category?.includes('Indigency'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category?.includes('Income') || f.category?.includes('Indigency'))
    },
    {
      id: 'req-4',
      name: 'Good Moral Character',
      category: 'Certificate of Good Moral Character',
      fileName: \`\${studentName.replace(/\\s+/g, '_')}_GoodMoral.pdf\`,
      status: (localSubmission.files?.find((f: any) => f.category?.includes('Moral'))?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category?.includes('Moral'))
    }
  ];`;

const newReqs = `  const requirementsList = [
    {
      id: 'req-rf',
      name: 'Registration Form (RF)',
      category: 'RF',
      fileName: localSubmission.files?.find((f: any) => f.category === 'RF')?.name || \`\${studentName.replace(/\\s+/g, '_')}_RF.pdf\`,
      status: (localSubmission.files?.find((f: any) => f.category === 'RF')?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'RF')
    },
    {
      id: 'req-gwa',
      name: 'General Weighted Average (GWA)',
      category: 'GWA',
      fileName: localSubmission.files?.find((f: any) => f.category === 'GWA')?.name || \`\${studentName.replace(/\\s+/g, '_')}_GWA.pdf\`,
      status: (localSubmission.files?.find((f: any) => f.category === 'GWA')?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'GWA')
    },
    {
      id: 'req-id',
      name: 'Student ID',
      category: 'ID',
      fileName: localSubmission.files?.find((f: any) => f.category === 'ID')?.name || \`\${studentName.replace(/\\s+/g, '_')}_ID.png\`,
      status: (localSubmission.files?.find((f: any) => f.category === 'ID')?.verified || localSubmission.status === 'Complete' || localSubmission.status === 'Approved') ? 'Verified' : 'Pending',
      file: localSubmission.files?.find((f: any) => f.category === 'ID')
    }
  ];`;

s = s.replace(oldReqs, newReqs);
fs.writeFileSync('src/components/StudentRecordModal.tsx', s);
