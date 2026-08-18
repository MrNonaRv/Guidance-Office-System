const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const toRemove = [
  "const GuidanceForms = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceForms })));",
  "const GuidanceNotifications = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceNotifications })));",
  "const GuidanceCommunications = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceCommunications })));",
  "const GuidanceReports = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceReports })));",
  "<Route path=\"forms\" element={<GuidanceForms />} />",
  "<Route path=\"notifications\" element={<GuidanceNotifications />} />",
  "<Route path=\"communications\" element={<GuidanceCommunications />} />",
  "<Route path=\"reports\" element={<GuidanceReports />} />"
];

toRemove.forEach(str => {
  content = content.replace(str, '');
});

fs.writeFileSync('src/App.tsx', content);
