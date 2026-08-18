const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// The issue is likely some mismatched brackets before this point.
// Let's run a bracket matcher script.

let bCount = 0;
for(let i=0; i<content.length; i++) {
  if (content[i] === '{') bCount++;
  if (content[i] === '}') bCount--;
}
console.log("Total bracket balance:", bCount);

