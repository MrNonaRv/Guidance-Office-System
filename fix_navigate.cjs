const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// replace document.getElementById('reports-tab')?.click() with navigate('/guidance/reports')
content = content.replace("document.getElementById('reports-tab')?.click()", "navigate('/guidance/reports')");

// add const navigate = useNavigate(); inside GuidanceCommunications
content = content.replace("export function GuidanceCommunications() {", "export function GuidanceCommunications() {\n  const navigate = useNavigate();");

fs.writeFileSync('src/pages/guidance/index.tsx', content);
