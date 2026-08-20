import { db, defaultSections, defaultFormRequirements, defaultSystemFiles } from './db';
import { defaultScholarships, defaultCourses, defaultAcademicYears } from '../types';
import { defaultSubmissions, defaultNotifications } from './defaultData';

export async function seedDatabase() {
  try {
    // Run seed setups concurrently in background without blocking
    Promise.allSettled([
      // 1. Scholarships
      (async () => {
        const scholarships = await db.scholarships.listAll();
        if (scholarships.length === 0) {
          await Promise.all(defaultScholarships.map(s => db.scholarships.set(s.id, s)));
        }
      })(),

      // 2. Courses
      (async () => {
        const courses = await db.courses.listAll();
        if (courses.length === 0) {
          await Promise.all(defaultCourses.map(c => db.courses.set(c.id, c)));
        }
      })(),

      // 3. Academic Years
      (async () => {
        const academicYears = await db.academicYears.listAll();
        if (academicYears.length === 0) {
          await Promise.all(defaultAcademicYears.map(a => db.academicYears.set(a.id, a)));
        }
      })(),

      // 4. Sections
      (async () => {
        const sections = await db.sections.listAll();
        if (sections.length === 0) {
          await Promise.all(defaultSections.map(sec => db.sections.set(sec.id, sec)));
        }
      })(),

      // 5. Form Requirements
      (async () => {
        const formReqs = await db.formRequirements.listAll();
        if (formReqs.length === 0) {
          await Promise.all(defaultFormRequirements.map(req => db.formRequirements.set(req.id, req)));
        }
      })(),

      // 6. System Files
      (async () => {
        const sysFiles = await db.files.listAll();
        if (sysFiles.length === 0) {
          await Promise.all(defaultSystemFiles.map(file => db.files.set(file.id, file)));
        }
      })(),

      // 7. Submissions
      (async () => {
        const existing = await db.submissions.listAll();
        if (existing.length === 0) {
          await Promise.all(defaultSubmissions.map(sub => db.submissions.set(sub.id, sub)));
        }
      })(),

      // 8. Notifications
      (async () => {
        const existingNotifs = await db.notifications.listAll();
        if (existingNotifs.length === 0) {
          await Promise.all(defaultNotifications.map(n => db.notifications.set(n.id, n)));
        }
      })()
    ]).then(() => {
      db.system.syncAll().catch(() => {});
    });
  } catch (err) {
    console.warn("Seeding initial database notice:", err);
  }
}
