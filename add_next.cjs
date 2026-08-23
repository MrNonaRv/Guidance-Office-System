const fs = require('fs');
let s = fs.readFileSync('src/pages/student/index.tsx', 'utf8');

s = s.replace(
  '    </div>\n  );\n}',
  `      <div className="flex justify-end mt-4">\n        <button className="bg-[#1e3a8a] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm">\n          Next\n        </button>\n      </div>\n    </div>\n  );\n}`
);

fs.writeFileSync('src/pages/student/index.tsx', s);
