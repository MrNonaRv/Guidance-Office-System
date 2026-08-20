# CapSU Guidance Office & Scholarship Management System

A web-based scholarship application and guidance office management portal designed for higher education institutions. The system streamlines the complete scholarship lifecycle—from student application submission and document verification to guidance counselor evaluation, multi-criteria filtering, reporting, communication, and system configuration.

---

## 🌟 Key Features

### 🏛️ Guidance Counselor & Admin Portal
- **Analytics Dashboard**: Real-time overview of active scholarships, total submissions, approval rates, distribution across colleges, and fund type breakdowns (Internally-Funded vs. Externally-Funded).
- **Submissions Management**:
  - Filter applications by scholarship program, course, academic year, and review status.
  - Review student profiles, GWA, family income records, and uploaded documentary requirements.
  - Interactive evaluation workflow with approval, rejection, request for resubmission, and custom counselor remarks.
  - Print-ready individual application profiles and batch summary rosters.
- **System Settings**:
  - **Academic Year**: Configure academic school years (e.g., `2026-2027`), overall status, and semester-specific active periods (1st Semester, 2nd Semester).
  - **Courses / Degree Programs**: Manage academic offerings (e.g., BSCS, BAEL, BSFT, BSOA) with department associations and active statuses.
  - **Sections**: Organize students and applications by course sections and year levels.
  - **Form Requirements**: Define and toggle mandatory/optional documentary requirements (e.g., Certificate of Grades, Certificate of Registration, Certificate of Indigency, Good Moral Character).
  - **Downloadable Files**: Repository for scholarship application forms, guidelines, policy briefs, and document templates.
- **Reports & Analytics**: Comprehensive printable report generator with filterable summaries by academic year, course, gender, status, and scholarship type.
- **Communications**: Direct messaging between counselors and applicants with conversation threads and status inquiries.
- **Notifications**: Broadcast official announcements and deadline reminders to all or targeted student cohorts.

---

### 🎓 Student Portal
- **Student Dashboard**: View application status in real-time (`Pending`, `Under Review`, `Approved`, `Rejected`), active scholarship deadlines, and institutional announcements.
- **Scholarship Application Workflow**:
  - Multi-step application submission with automated profile pre-population.
  - Document upload portal supporting official receipts, COG, COR, and indigency proofs.
  - Validation guards ensuring all mandatory institutional requirements are met prior to submission.
  - Submission confirmation receipt with tracking ID.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Database & Persistence**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & Local Database Adapter with auto-seeding

---

## 📁 Project Structure

```
├── public/                 # Static public assets and institution logos
├── src/
│   ├── lib/
│   │   ├── db.ts           # Unified database interface (Firestore / Local storage)
│   │   ├── firebase.ts     # Firebase client configuration and initialization
│   │   ├── seed.ts         # Initial sample seed dataset for courses, years, & applications
│   │   └── utils.ts        # Helper utilities and class merging (clsx / twMerge)
│   ├── pages/
│   │   ├── guidance/       # Guidance counselor & admin portal views
│   │   │   ├── index.tsx   # Dashboard, Submissions table, and System Settings
│   │   │   ├── reports.tsx # Comprehensive reports generator & print layouts
│   │   │   ├── communications.tsx # Student-counselor messaging center
│   │   │   └── notifications.tsx  # System announcements and alerts
│   │   ├── student/        # Student portal views
│   │   │   └── index.tsx   # Student dashboard, login, and application form
│   │   └── Home.tsx        # Portal landing and redirect handler
│   ├── App.tsx             # Application routing and authentication guards
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global Tailwind CSS styling
│   └── types.ts            # Global TypeScript data schemas and interfaces
├── metadata.json           # Application metadata and platform capabilities
├── package.json            # Project dependencies and build scripts
├── tsconfig.json           # TypeScript compiler configuration
└── vite.config.ts          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd guidance-office-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. Build for production:
   ```bash
   npm run build
   ```

5. Run TypeScript diagnostics / linting:
   ```bash
   npm run lint
   ```

---

## 🔐 Default Access & Authentication

The system includes pre-seeded authentication accounts for testing and evaluation:

- **Guidance Office / Admin Portal**: `/admin/login`
- **Student Portal**: `/student/login`

---

## 📄 License

This project is developed for educational and institutional management purposes.
