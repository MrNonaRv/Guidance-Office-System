const fs = require('fs');
let s = fs.readFileSync('src/pages/student/index.tsx', 'utf8');

s = s.replace(/import \{ User,\s*Upload,/, "import { FileEdit, FileText, ClipboardCheck, Calendar, User, Upload,");

fs.writeFileSync('src/pages/student/index.tsx', s);
