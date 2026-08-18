const fs = require('fs');
let code = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

let start = code.indexOf('export function GuidanceSubmissions');
console.log("Starts at index:", start);

let settingsIdx = code.indexOf('export function GuidanceSettings');
console.log("Settings at index:", settingsIdx);
