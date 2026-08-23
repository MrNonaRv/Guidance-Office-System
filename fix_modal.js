const fs = require('fs');

let content = fs.readFileSync('src/components/StudentRecordModal.tsx', 'utf8');

// Remove Folder 2 in Overview
content = content.replace(/\/\* Folder 2: Student ID & Digital Signature Card \*\/[\s\S]*?<\!-- Folder 3: 1st Semester -->/, '<!-- Folder 3: 1st Semester -->');
// Wait, the HTML comment is {/* Folder 3: 1st Semester */}

content = content.replace(/\/\* Folder 2: Student ID & Digital Signature Card \*\/[\s\S]*?\{\/\* Folder 3: 1st Semester \*\/\}/g, '{/* Folder 3: 1st Semester */}');

// Remove View 3
content = content.replace(/\/\* ------------------------------------------------------------- \*\/\s*\{\/\* VIEW 3: STUDENT ID & DIGITAL SIGNATURE DEDICATED VIEW \*\/\}\s*\/\* ------------------------------------------------------------- \*\/\s*\{viewMode === 'id_signature' && \([\s\S]*?\{\/\* ------------------------------------------------------------- \*\/\s*\{\/\* VIEW 4: SEMESTER RECORD \(1st Sem or 2nd Sem\) \*\/\}/g, '{/* ------------------------------------------------------------- */}\n          {/* VIEW 4: SEMESTER RECORD (1st Sem or 2nd Sem) */}');

fs.writeFileSync('src/components/StudentRecordModal.tsx', content);
