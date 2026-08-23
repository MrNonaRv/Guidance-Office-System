const fs = require('fs');
let s = fs.readFileSync('src/pages/student/index.tsx', 'utf8');

// replace StudentSubmissionForm
const index = s.indexOf('export function StudentSubmissionForm() {');
if (index !== -1) {
    let rep = fs.readFileSync('replacement.tsx', 'utf8');
    
    // remove the manual import from rep since we will add it to the top
    rep = rep.replace("import { FileEdit, FileText, ClipboardCheck, Calendar } from 'lucide-react';\n\n", "");

    s = s.slice(0, index) + rep;
}

// add imports
if (!s.includes('FileEdit')) {
    s = s.replace(/import \{([^}]+)\} from 'lucide-react';/, "import {$1, FileEdit, FileText, ClipboardCheck, Calendar } from 'lucide-react';");
}

fs.writeFileSync('src/pages/student/index.tsx', s);
