const fs = require('fs');
let code = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

code = code.replace("    }\n  );\n}\n\nconst navItems = [", "  );\n}\n\nconst navItems = [");

fs.writeFileSync('src/pages/guidance/index.tsx', code);
