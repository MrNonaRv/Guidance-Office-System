const fs = require('fs');
let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// The newlines were literal newlines inside double quotes instead of \n or backticks
content = content.replace(/defaultValue=\{templateFilter === 'Incomplete' \? "Dear Student,[^]+?Guidance Office" : ""\}/m, "defaultValue={templateFilter === 'Incomplete' ? `Dear Student,\\n\\nWe are reviewing your scholarship application and noticed that some requirements are still missing or incomplete. Please log in to your portal and submit the necessary documents as soon as possible.\\n\\nThank you,\\nGuidance Office` : ''}");

fs.writeFileSync('src/pages/guidance/index.tsx', content);
