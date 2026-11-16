import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pcnoyxnfhxwbogekbazc.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HQ_Ru3eZ35IB_jWaOYgEyA_xEPhhqAD';
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

function safeSupabase(fn: () => any) {
  if (!supabase) return;
  try {
    Promise.resolve(fn()).catch((err) => {
      console.warn('Supabase sync notice:', err?.message || err);
    });
  } catch (err) {
    console.warn('Supabase invoke error:', err);
  }
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data persistence directory exists
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const stateFilePath = path.resolve(dataDir, 'system_state.json');

interface SystemState {
  academicYears: Array<{
    id: string;
    year: string;
    overallStatus?: 'Active' | 'Inactive';
    firstSemester?: 'Active' | 'Inactive';
    secondSemester?: 'Active' | 'Inactive';
    semester?: string;
    label?: string;
    status?: string;
    isDefault?: boolean;
    updatedAt?: string;
  }>;
  courses: Array<{
    id: string;
    code: string;
    name: string;
    department?: string;
    status: 'Active' | 'Inactive';
  }>;
  sections: Array<{
    id: string;
    name: string;
    course?: string;
    status?: 'Active' | 'Inactive';
  }>;
  scholarships: Array<{
    id: string;
    name: string;
    type: string;
    category: string;
    status: 'Active' | 'Inactive';
    description?: string;
    requirements?: string[];
    slots?: number;
    deadline?: string;
  }>;
  submissions: any[];
}

const defaultInitialState: SystemState = {
  academicYears: [
    {
      id: 'ay-2025-2026',
      year: '2025-2026',
      overallStatus: 'Active',
      firstSemester: 'Active',
      secondSemester: 'Inactive',
      label: 'A.Y. 2025-2026',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ay-2024-2025',
      year: '2024-2025',
      overallStatus: 'Inactive',
      firstSemester: 'Inactive',
      secondSemester: 'Inactive',
      label: 'A.Y. 2024-2025',
      updatedAt: new Date().toISOString()
    }
  ],
  courses: [
    { id: 'course-bscs', code: 'BSCS', name: 'Bachelor of Science in Computer Science', department: 'College of Information and Communications Technology', status: 'Active' },
    { id: 'course-bael', code: 'BAEL', name: 'Bachelor of Arts in English Language', department: 'College of Arts and Letters', status: 'Active' },
    { id: 'course-bsft', code: 'BSFT', name: 'Bachelor of Science in Food Technology', department: 'College of Science', status: 'Active' },
    { id: 'course-bsoa', code: 'BSOA', name: 'Bachelor of Science in Office Administration', department: 'College of Business and Accountancy', status: 'Active' }
  ],
  sections: [
    { id: 'sec-1', name: 'A' },
    { id: 'sec-2', name: 'B' },
    { id: 'sec-3', name: 'C' },
    { id: 'sec-4', name: 'D' }
  ],
  scholarships: [
    {
      id: 'scholarship-academic-excellence',
      name: 'Academic Excellence Scholarship',
      type: 'Internally-Funded',
      category: 'Institutional',
      status: 'Active',
      description: 'For students with GWA of 1.75 or higher and no failing grade in any academic subject.',
      requirements: ['Certificate of Grades / Transcript of Records', 'Certificate of Good Moral Character', 'Valid Student ID'],
      slots: 50,
      deadline: '2026-09-30'
    },
    {
      id: 'scholarship-deans-list',
      name: "Dean's Lister Grant",
      type: 'Internally-Funded',
      category: 'Institutional',
      status: 'Active',
      description: 'Grant awarded to top academic achievers in each program and year level.',
      requirements: ['Certificate of Matriculation', 'Latest Official Semester Grade Slip', 'Certificate of Good Moral Character'],
      slots: 100,
      deadline: '2026-09-30'
    },
    {
      id: 'scholarship-ched-tdp',
      name: 'CHED Tulong Dunong Program (TDP-TES)',
      type: 'Externally-Funded',
      category: 'Government / CHED',
      status: 'Active',
      description: 'Government subsidy supporting qualified tertiary education students.',
      requirements: ['Certificate of Registration / Enrollment', 'Certificate of Indigency / ITR of Parents', 'Valid Government / Student ID'],
      slots: 200,
      deadline: '2026-10-15'
    },
    {
      id: 'scholarship-tes',
      name: 'Tertiary Education Subsidy (TES)',
      type: 'Externally-Funded',
      category: 'Government / UNIFAST',
      status: 'Active',
      description: 'Financial assistance for Filipino students enrolled in undergraduate programs under RA 10931.',
      requirements: ['UNIFAST Application Form', 'Certificate of Registration', 'Barangay Certificate of Indigency'],
      slots: 300,
      deadline: '2026-10-31'
    }
  ],
  submissions: []
};

// Load persistent state
let state: SystemState = { ...defaultInitialState };
try {
  if (fs.existsSync(stateFilePath)) {
    const raw = fs.readFileSync(stateFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    state = {
      academicYears: parsed.academicYears?.length ? parsed.academicYears : defaultInitialState.academicYears,
      courses: parsed.courses?.length ? parsed.courses : defaultInitialState.courses,
      sections: parsed.sections?.length ? parsed.sections : defaultInitialState.sections,
      scholarships: parsed.scholarships?.length ? parsed.scholarships : defaultInitialState.scholarships,
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : []
    };
  } else {
    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Failed reading state file, using defaults:', e);
}

function saveState() {
  try {
    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed writing state file:', e);
  }
}

async function loadStateFromSupabase() {
  if (!supabase) return;
  try {
    const [ayRes, coursesRes, secRes, schRes, subRes] = await Promise.all([
      supabase.from('academic_years').select('*').order('year', { ascending: false }),
      supabase.from('courses').select('*'),
      supabase.from('sections').select('*'),
      supabase.from('scholarships').select('*'),
      supabase.from('submissions').select('*').order('submitted_at', { ascending: false })
    ]);

    if (ayRes.data && ayRes.data.length > 0) {
      state.academicYears = ayRes.data.map((ay: any) => ({
        id: ay.id,
        year: ay.year,
        overallStatus: ay.overall_status || 'Active',
        firstSemester: ay.first_semester || 'Active',
        secondSemester: ay.second_semester || 'Inactive',
        label: ay.label || `A.Y. ${ay.year}`,
        updatedAt: ay.updated_at
      }));
    }
    if (coursesRes.data && coursesRes.data.length > 0) {
      state.courses = coursesRes.data.map((c: any) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        department: c.department || '',
        status: c.status || 'Active'
      }));
    }
    if (secRes.data && secRes.data.length > 0) {
      state.sections = secRes.data.map((s: any) => ({
        id: s.id,
        name: s.name,
        course: s.course || null,
        status: s.status || 'Active'
      }));
    }
    if (schRes.data && schRes.data.length > 0) {
      state.scholarships = schRes.data.map((s: any) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        category: s.category,
        status: s.status || 'Active',
        description: s.description || '',
        requirements: s.requirements || [],
        slots: s.slots || 0,
        deadline: s.deadline || ''
      }));
    }
    if (subRes.data && subRes.data.length > 0) {
      state.submissions = subRes.data.map((s: any) => ({
        id: s.id,
        studentId: s.student_id,
        studentName: s.student_name,
        studentAuthId: s.student_auth_id,
        scholarshipType: s.scholarship_type,
        status: s.status,
        submittedAt: s.submitted_at,
        data: s.data,
        files: s.files
      }));
    }
    saveState();
  } catch (err) {
    console.warn('Hydrating from Supabase notice:', err);
  }
}

// Real-Time Server-Sent Events (SSE) Bus
const sseClients = new Set<express.Response>();

function broadcast(type: string, data: any) {
  const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Periodic keep-alive ping for SSE clients
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(`: heartbeat\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}, 25000);

// Helper to compute active term
function computeActiveTerm(academicYears: SystemState['academicYears']) {
  // Prefer academic year with overallStatus === 'Active'
  let active = academicYears.find(ay => ay.overallStatus === 'Active');
  if (!active) {
    active = academicYears.find(ay => ay.firstSemester === 'Active' || ay.secondSemester === 'Active');
  }
  if (!active && academicYears.length > 0) {
    active = academicYears[0];
  }

  const isOverallActive = active ? (active.overallStatus === 'Active' || active.status === 'Active') : false;
  const firstActive = isOverallActive && active?.firstSemester === 'Active';
  const secondActive = isOverallActive && active?.secondSemester === 'Active';
  const hasActive = isOverallActive && (firstActive || secondActive);

  let label = active ? `A.Y. ${active.year}` : 'No Active Term/Semester';
  if (isOverallActive && active) {
    if (firstActive && secondActive) {
      label = `A.Y. ${active.year} | 1st & 2nd Semester`;
    } else if (firstActive) {
      label = `A.Y. ${active.year} | 1st Semester`;
    } else if (secondActive) {
      label = `A.Y. ${active.year} | 2nd Semester`;
    }
  }

  return {
    year: active ? active.year : '2025-2026',
    label,
    firstActive,
    secondActive,
    hasActive
  };
}

// --- API Endpoints ---

// SSE Stream Endpoint
app.get('/api/sync/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  // Flush headers if supported
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  // Send initial snapshot on connect
  res.write(`data: ${JSON.stringify({
    type: 'INIT',
    data: {
      academicYears: state.academicYears,
      courses: state.courses,
      sections: state.sections,
      scholarships: state.scholarships,
      activeTerm: computeActiveTerm(state.academicYears)
    }
  })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// ACADEMIC YEARS
app.get('/api/academic-years', (req, res) => {
  res.json(state.academicYears);
});

app.get('/api/academic-years/active', (req, res) => {
  res.json(computeActiveTerm(state.academicYears));
});

app.post('/api/academic-years', (req, res) => {
  const ay = req.body;
  if (!ay || !ay.year) {
    res.status(400).json({ error: 'Academic year is required' });
    return;
  }
  const id = ay.id || `ay-${Date.now()}`;
  const trimmedYear = (ay.year || '').trim();
  const now = new Date().toISOString();

  const isCurrentActive = ay.overallStatus === 'Active';

  // If this year is set to Active, deactivate other academic years to ensure one active year
  if (isCurrentActive) {
    state.academicYears = state.academicYears.map(item => {
      if (item.id !== id && (item.year || '').trim() !== trimmedYear) {
        return { ...item, overallStatus: 'Inactive' as const };
      }
      return item;
    });
  }

  const existingIdx = state.academicYears.findIndex(item => item.id === id || (item.year || '').trim() === trimmedYear);
  const updatedItem = {
    ...ay,
    id: existingIdx >= 0 ? state.academicYears[existingIdx].id : id,
    year: trimmedYear,
    updatedAt: now,
    label: ay.label || `A.Y. ${trimmedYear}`
  };

  if (existingIdx >= 0) {
    state.academicYears[existingIdx] = updatedItem;
  } else {
    state.academicYears.unshift(updatedItem);
  }

  saveState();
  safeSupabase(() => supabase!.from('academic_years').upsert({
    id: updatedItem.id,
    year: updatedItem.year,
    overall_status: updatedItem.overallStatus,
    first_semester: updatedItem.firstSemester,
    second_semester: updatedItem.secondSemester,
    label: updatedItem.label,
    updated_at: updatedItem.updatedAt
  }, { onConflict: 'id' }));
  broadcast('ACADEMIC_YEARS_SYNC', state.academicYears);
  res.json({ success: true, item: updatedItem, list: state.academicYears, activeTerm: computeActiveTerm(state.academicYears) });
});

app.delete('/api/academic-years/:id', (req, res) => {
  const { id } = req.params;
  state.academicYears = state.academicYears.filter(ay => ay.id !== id);
  saveState();
  safeSupabase(() => supabase!.from('academic_years').delete().eq('id', id));
  broadcast('ACADEMIC_YEARS_SYNC', state.academicYears);
  res.json({ success: true, list: state.academicYears, activeTerm: computeActiveTerm(state.academicYears) });
});

// COURSES
app.get('/api/courses', (req, res) => {
  res.json(state.courses);
});

app.post('/api/courses', (req, res) => {
  const course = req.body;
  if (!course || !course.code) {
    res.status(400).json({ error: 'Course code is required' });
    return;
  }
  const id = course.id || `course-${Date.now()}`;
  const idx = state.courses.findIndex(c => c.id === id || c.code.toLowerCase() === course.code.trim().toLowerCase());
  const updated = { ...course, id: idx >= 0 ? state.courses[idx].id : id };
  if (idx >= 0) {
    state.courses[idx] = updated;
  } else {
    state.courses.push(updated);
  }
  saveState();
  safeSupabase(() => supabase!.from('courses').upsert({
    id: updated.id,
    code: updated.code,
    name: updated.name,
    department: updated.department || '',
    status: updated.status || 'Active'
  }, { onConflict: 'id' }));
  broadcast('COURSES_SYNC', state.courses);
  res.json({ success: true, item: updated, list: state.courses });
});

app.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  state.courses = state.courses.filter(c => c.id !== id);
  saveState();
  safeSupabase(() => supabase!.from('courses').delete().eq('id', id));
  broadcast('COURSES_SYNC', state.courses);
  res.json({ success: true, list: state.courses });
});

// SECTIONS
app.get('/api/sections', (req, res) => {
  res.json(state.sections);
});

app.post('/api/sections', (req, res) => {
  const sec = req.body;
  if (!sec || !sec.name) {
    res.status(400).json({ error: 'Section name is required' });
    return;
  }
  const id = sec.id || `sec-${Date.now()}`;
  const idx = state.sections.findIndex(s => s.id === id || s.name.toUpperCase() === sec.name.trim().toUpperCase());
  const updated = { ...sec, id: idx >= 0 ? state.sections[idx].id : id, name: sec.name.trim().toUpperCase() };
  if (idx >= 0) {
    state.sections[idx] = updated;
  } else {
    state.sections.push(updated);
  }
  saveState();
  safeSupabase(() => supabase!.from('sections').upsert({
    id: updated.id,
    name: updated.name,
    course: updated.course || null,
    status: updated.status || 'Active'
  }, { onConflict: 'id' }));
  broadcast('SECTIONS_SYNC', state.sections);
  res.json({ success: true, item: updated, list: state.sections });
});

app.delete('/api/sections/:id', (req, res) => {
  const { id } = req.params;
  state.sections = state.sections.filter(s => s.id !== id);
  saveState();
  safeSupabase(() => supabase!.from('sections').delete().eq('id', id));
  broadcast('SECTIONS_SYNC', state.sections);
  res.json({ success: true, list: state.sections });
});

// SCHOLARSHIPS
app.get('/api/scholarships', (req, res) => {
  res.json(state.scholarships);
});

app.post('/api/scholarships', (req, res) => {
  const sch = req.body;
  if (!sch || !sch.name) {
    res.status(400).json({ error: 'Scholarship name is required' });
    return;
  }
  const id = sch.id || `sch-${Date.now()}`;
  const idx = state.scholarships.findIndex(s => s.id === id || s.name.trim().toLowerCase() === sch.name.trim().toLowerCase());
  const updated = { ...sch, id: idx >= 0 ? state.scholarships[idx].id : id };
  if (idx >= 0) {
    state.scholarships[idx] = updated;
  } else {
    state.scholarships.push(updated);
  }
  saveState();
  safeSupabase(() => supabase!.from('scholarships').upsert({
    id: updated.id,
    name: updated.name,
    type: updated.type,
    category: updated.category,
    status: updated.status || 'Active',
    description: updated.description || '',
    requirements: updated.requirements || [],
    slots: updated.slots || 0,
    deadline: updated.deadline || ''
  }, { onConflict: 'id' }));
  broadcast('SCHOLARSHIPS_SYNC', state.scholarships);
  res.json({ success: true, item: updated, list: state.scholarships });
});

app.delete('/api/scholarships/:id', (req, res) => {
  const { id } = req.params;
  state.scholarships = state.scholarships.filter(s => s.id !== id);
  saveState();
  safeSupabase(() => supabase!.from('scholarships').delete().eq('id', id));
  broadcast('SCHOLARSHIPS_SYNC', state.scholarships);
  res.json({ success: true, list: state.scholarships });
});

// SUBMISSIONS
app.get('/api/submissions', (req, res) => {
  res.json(state.submissions);
});

app.post('/api/submissions', (req, res) => {
  const sub = req.body;
  if (!sub || !sub.id) {
    res.status(400).json({ error: 'Invalid submission' });
    return;
  }
  const idx = state.submissions.findIndex(s => s.id === sub.id);
  if (idx >= 0) {
    state.submissions[idx] = sub;
  } else {
    state.submissions.unshift(sub);
  }
  saveState();
  safeSupabase(() => supabase!.from('submissions').upsert({
    id: sub.id,
    student_id: sub.studentId,
    student_name: sub.studentName,
    student_auth_id: sub.studentAuthId || null,
    scholarship_type: sub.scholarshipType || '',
    status: sub.status || 'Pending',
    submitted_at: sub.submittedAt || new Date().toISOString(),
    data: sub.data || {},
    files: sub.files || []
  }, { onConflict: 'id' }));
  broadcast('SUBMISSIONS_SYNC', state.submissions);
  res.json({ success: true, item: sub });
});

app.delete('/api/submissions/:id', (req, res) => {
  const { id } = req.params;
  state.submissions = state.submissions.filter(s => s.id !== id);
  saveState();
  safeSupabase(() => supabase!.from('submissions').delete().eq('id', id));
  broadcast('SUBMISSIONS_SYNC', state.submissions);
  res.json({ success: true, list: state.submissions });
});

// --- Server Startup & Vite Middlewares ---
async function startServer() {
  // Hydrate state from Supabase before serving requests
  try {
    await loadStateFromSupabase();
    console.log(`Hydrated from Supabase: ${state.academicYears.length} academic years, ${state.courses.length} courses, ${state.sections.length} sections, ${state.scholarships.length} scholarships, ${state.submissions.length} submissions.`);
  } catch (err) {
    console.warn('Initial Supabase hydration warning:', err);
  }

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guidance Office Portal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
