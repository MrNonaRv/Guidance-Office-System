const fs = require('fs');

let s = fs.readFileSync('src/components/StudentRecordModal.tsx', 'utf8');

// I need to replace everything from {/* PAGE 1: SCHOLARSHIP RECORD FORM */} to the end of the form layout.
const startToken = `{/* PAGE 1: SCHOLARSHIP RECORD FORM */}`;
const endToken = `      </div>\n    </div>\n  );\n}`;

let startIndex = s.indexOf(startToken);
let endIndex = s.indexOf(endToken);

if (startIndex !== -1 && endIndex !== -1) {
    s = s.slice(0, startIndex) + `[REPLACEMENT_MARKER]\n` + s.slice(endIndex);
}

fs.writeFileSync('src/components/StudentRecordModal.tsx', s);
