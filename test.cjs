const fs = require('fs');
const code = fs.readFileSync('src/components/StudentRecordModal.tsx', 'utf8');

// Find all JSX elements in return statement
let inReturn = false;
let stack = [];

// very simple stack based checker
const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.includes('return (')) { inReturn = true; }
  if (!inReturn) continue;

  const openMatch = line.match(/<div[^>]*>/g);
  if (openMatch) {
    for (const m of openMatch) {
      if (!m.endsWith('/>')) {
         stack.push({ line: i+1, tag: m });
      }
    }
  }
  
  const closeMatch = line.match(/<\/div>/g);
  if (closeMatch) {
    for (const m of closeMatch) {
      if (stack.length === 0) {
         console.log("Too many closing tags at line", i+1);
      } else {
         stack.pop();
      }
    }
  }
}
console.log("Unclosed tags:", stack.length);
stack.forEach(s => console.log(s.line, s.tag));

