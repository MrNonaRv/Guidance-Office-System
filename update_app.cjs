const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const importsToAdd = `
const GuidanceReports = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceReports })));
const GuidanceNotifications = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceNotifications })));
const GuidanceCommunications = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceCommunications })));
`;

const routesToAdd = `
            <Route path="reports" element={<GuidanceReports />} />
            <Route path="notifications" element={<GuidanceNotifications />} />
            <Route path="communications" element={<GuidanceCommunications />} />
`;

content = content.replace("const GuidanceSettings = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceSettings })));", 
  "const GuidanceSettings = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceSettings })));" + importsToAdd);

content = content.replace("<Route path=\"settings\" element={<GuidanceSettings />} />", 
  "<Route path=\"settings\" element={<GuidanceSettings />} />" + routesToAdd);

fs.writeFileSync('src/App.tsx', content);
