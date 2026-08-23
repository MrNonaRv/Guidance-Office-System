const fs = require('fs');
let s = fs.readFileSync('src/pages/guidance/index.tsx', 'utf8');

s = s.replace(
    '  useEffect(() => {\n    const unsubSubmissions = db.submissions.subscribe(setSubmissions);',
    '  useEffect(() => {\n    fetchSubmissions();\n    const unsubSubmissions = db.submissions.subscribe(setSubmissions);'
);

fs.writeFileSync('src/pages/guidance/index.tsx', s);
