const fs = require('fs');
let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// I am just going to add an extra '}' before the `);` at the end of the file.

content = content.replace("  );\n}", "    }\n  );\n}");

fs.writeFileSync('src/pages/guidance/index.tsx', content);
