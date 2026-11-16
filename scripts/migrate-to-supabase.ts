import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultSubmissions } from '../src/lib/defaultData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const supabaseUrl = process.argv[2] || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.argv[3] || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(`
Usage:
  npx tsx scripts/migrate-to-supabase.ts <SUPABASE_URL> <SUPABASE_KEY>

Or set environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
`);
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}...`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Load existing state from data/system_state.json
  const statePath = path.resolve(__dirname, '../data/system_state.json');
  let state: any = { academicYears: [], courses: [], sections: [], scholarships: [], submissions: [] };
  if (fs.existsSync(statePath)) {
    state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  }

  console.log('\n--- 1. Migrating Academic Years ---');
  for (const ay of state.academicYears || []) {
    const row = {
      id: ay.id,
      year: ay.year,
      overall_status: ay.overallStatus || 'Active',
      first_semester: ay.firstSemester || 'Active',
      second_semester: ay.secondSemester || 'Inactive',
      label: ay.label || `A.Y. ${ay.year}`,
      updated_at: ay.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('academic_years').upsert(row, { onConflict: 'id' });
    if (error) console.error(`Failed to upsert AY ${ay.year}:`, error.message);
    else console.log(`✓ Academic Year ${ay.year} migrated`);
  }

  console.log('\n--- 2. Migrating Courses ---');
  for (const c of state.courses || []) {
    const row = {
      id: c.id,
      code: c.code,
      name: c.name,
      department: c.department || '',
      status: c.status || 'Active'
    };
    const { error } = await supabase.from('courses').upsert(row, { onConflict: 'id' });
    if (error) console.error(`Failed to upsert Course ${c.code}:`, error.message);
    else console.log(`✓ Course ${c.code} migrated`);
  }

  console.log('\n--- 3. Migrating Sections ---');
  for (const s of state.sections || []) {
    const row = {
      id: s.id,
      name: s.name,
      course: s.course || null,
      status: s.status || 'Active'
    };
    const { error } = await supabase.from('sections').upsert(row, { onConflict: 'id' });
    if (error) console.error(`Failed to upsert Section ${s.name}:`, error.message);
    else console.log(`✓ Section ${s.name} migrated`);
  }

  console.log('\n--- 4. Migrating Scholarships ---');
  for (const sch of state.scholarships || []) {
    const row = {
      id: sch.id,
      name: sch.name,
      type: sch.type,
      category: sch.category,
      status: sch.status || 'Active',
      description: sch.description || '',
      requirements: sch.requirements || [],
      slots: sch.slots || 0,
      deadline: sch.deadline || ''
    };
    const { error } = await supabase.from('scholarships').upsert(row, { onConflict: 'id' });
    if (error) console.error(`Failed to upsert Scholarship ${sch.name}:`, error.message);
    else console.log(`✓ Scholarship ${sch.name} migrated`);
  }

  console.log('\n--- 5. Migrating Submissions ---');
  const allSubmissions = [
    ...(state.submissions || []),
    ...defaultSubmissions.filter(ds => !(state.submissions || []).some((s: any) => s.id === ds.id))
  ];
  for (const sub of allSubmissions) {
    const row = {
      id: sub.id,
      student_id: sub.studentId,
      student_name: sub.studentName,
      student_auth_id: sub.studentAuthId || null,
      scholarship_type: sub.scholarshipType || '',
      status: sub.status || 'Pending',
      submitted_at: sub.submittedAt || new Date().toISOString(),
      data: sub.data || {},
      files: sub.files || []
    };
    const { error } = await supabase.from('submissions').upsert(row, { onConflict: 'id' });
    if (error) console.error(`Failed to upsert Submission ${sub.id}:`, error.message);
    else console.log(`✓ Submission for ${sub.studentName} migrated`);
  }

  console.log('\n✅ All data migrated successfully to Supabase!');
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
