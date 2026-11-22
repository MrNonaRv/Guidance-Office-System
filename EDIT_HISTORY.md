# System Edit & Update History Log

**Last Updated:** November 22, 2026  
**System:** Web-Based Scholarship Submission Alert System (CAPSU Mambusao Satellite College)

> **Maintenance Note:** Whenever updates, refactorings, new features, or bug fixes are made to the system in the future, please record them in this file under a new dated entry.

---

## [November 22, 2026 - Update 11] — Fix Scholarship Persistence & Category Synchronization

### 1. Root Cause Identification
- When adding a scholarship or allocation in the Admin Settings, `db.categories.getCached()` initialized in-memory categories with `INITIAL_SCHOLARSHIP_CATEGORIES` before checking `localStorage`. On page refresh, `listAll()` fell back to defaults and overwrote `localStorage` with initial values, wiping out newly created scholarships.
- Supabase did not have a dedicated `scholarship_categories` table in its public schema, causing category upserts to fail silently without cloud persistence.
- Supabase upsert and delete promises in `db.scholarships.set` and `db.scholarships.delete` lacked `return` statements and `await`, leaving operations unhandled upon immediate page refreshes.

### 2. Solutions Implemented
- **Supabase Cloud Persistence**: Stored and synced the full scholarship category hierarchy inside a dedicated configuration record (`id: '__categories_config__'`) in the existing `scholarships` table, backed by JSONB storage.
- **LocalStorage & Cache Protection**: Updated `getInitialCategories()` and `getCached()` to always check `localStorage` (`capsu_scholarship_categories`) first so cached additions are never overwritten by static defaults on refresh.
- **Bi-directional Merging**: Added `mergeScholarshipsIntoCategories()` to merge any database scholarships into the category hierarchy whenever scholarships are fetched or synced.
- **Awaited Supabase Calls**: Ensured all `safeSupabase` queries for scholarships, categories, and submissions are properly awaited with explicit promise returns.
- **Clean Filtering**: Filtered out `__categories_config__` from regular scholarship queries, reports, and API responses so internal configuration records remain hidden from UI tables.
- **Verification**: Verified zero TypeScript errors (`tsc --noEmit`) and completed a full Vite production build.

---

## [November 18, 2026 - Update 10] — Optional Suffix Field Implementation

### 1. Form UI & Label Updates
- **Input Tag & Label**: Removed the mandatory indicator (`*` red asterisk) and `required` attribute from the `suffix` field in both `src/pages/student/index.tsx` and `src/components/forms/PersonalInfoSection.tsx`.
- **Placeholder & Label**: Updated label to `"Suffix (Optional)"` and placeholder to `"e.g. Jr., III (Optional)"` so students know they can safely leave it blank.

### 2. Validation Adjustment
- **Manual Validation**: Removed the empty check for `suffix` in `src/pages/student/index.tsx` so leaving the field blank will not block submission or trigger `"This field is required. Write N/A if not applicable"`.
- **Zod Schema**: Updated `suffix` in `src/lib/schema.ts` to `z.string().nullish().default('')` to accept empty strings, null, or undefined values gracefully.

### 3. Backend & Storage Compatibility
- Submissions store form responses in JSON format, which gracefully supports empty strings and nulls without throwing database errors.
- Verified TypeScript compilation (`tsc --noEmit`) passes with 0 errors.

---

## [November 10, 2026 - Update 9] — Address (if not from Capiz) Error Message Restoration

### 1. Reverted Conditional Address Error Message
- **Fix**: Reverted the error message for `"Address (if not from Capiz)"` (`outsideCapizAddress`) back to `"This field is required"`, matching the original requirement specifications.
- **Verification**: Verified clean build compilation and linting with 0 errors.

---

## [November 5, 2026 - Update 7] — Header Logout Button Alignment & Stepper Scroll Fix

### 1. Header Logout Button Alignment Fix
- **Issue**: The header used `flex-wrap`, causing the logout button on smaller screens/phones to wrap below the logo and title.
- **Fix**: Updated the header navbar to `flex-row flex-nowrap` so that the logo/title on the left and logout button/user email on the right remain perfectly aligned on a single row across all screen sizes.

### 2. Progress Stepper Horizontal Scrollbar Removal
- **Issue**: The progress stepper tabs (*Student Info*, *Upload Files*, *Review*) had fixed widths and `overflow-x-auto`, causing an unwanted left-to-right horizontal scrollbar on mobile viewports.
- **Fix**: Removed `overflow-x-auto` and configured the stepper steps and connecting lines to be fully responsive (`flex-1 min-w-0`), fitting naturally without horizontal scrolling.
- **Verification**: Verified clean build compilation and linting with 0 errors.

---

## [November 5, 2026 - Update 6] — Restore Compact Multi-Column Phone Layout

### 1. Restored Compact Phone Grid Layout
- **Issue**: Form input fields stacked vertically (1 column per row) on mobile phone viewports.
- **Fix**: Updated grid layouts in `PersonalInfoSection.tsx` from `grid-cols-1` to compact multi-column responsive grids (`grid-cols-2` and `grid-cols-3`), restoring the previous side-by-side layout for mobile phones.
- **Verification**: Verified clean build compilation and linting with 0 errors.

---

## [November 5, 2026 - Update 5] — Living Condition "Others" Specify Text Inputs Fix

### 1. Fixed Living Condition "Others" Specify Inputs
- **Issue**: When selecting `"Others"` for *With whom do you currently live?* or *Type of Housing*, the specify text input box did not appear because `livingWith` and `housingType` were not correctly extracted from `formData` in `LivingConditionSection.tsx`.
- **Fix**: Updated `LivingConditionSection.tsx` to properly read `livingWith` and `housingType` from `formData` so that selecting `"Others"` immediately reveals the respective specify text input box where students can type their custom arrangement/housing type.
- **Verification**: Verified clean build compilation and linting with 0 errors.

---

## [November 5, 2026 - Update 4] — Fix Duplicate Scholarship Category Section Render

### 1. Fixed Duplicate Scholarship Category Section Render
- **Issue**: The Scholarship Category section appeared twice on Step 1 of the student application form (once via `<ScholarshipCategorySection />` component and once via duplicated inline code in `src/pages/student/index.tsx`).
- **Fix**: Fully implemented `ScholarshipCategorySection.tsx` to handle the funding source tabs, selection options, and specify fields, and removed the duplicate inline render block from `src/pages/student/index.tsx`.
- **Verification**: Verified clean build compilation and linting with 0 errors.

---

## [November 4, 2026 - Update 3] — Form Validation Error Messages & Text Boxes Update

### 1. Updated Validation Error Messages
- **Personal Information**:
  - Changed error message to `"This field is required"` for:
    - Last Name (`familyName`)
    - First Name (`firstName`)
    - Middle Name (`middleName`)
    - Age (`age`)
    - Contact No. (`contactNo`)
    - Email (`email`)
    - Street (`street`)
    - Postal Code (`postalCode`)
    - Address (if not from Capiz) (`outsideCapizAddress`)
  - Suffix (`suffix`): `"This field is required. Write N/A if not applicable"`
  - 2 × 2 Picture (`photo2x2`): `"Please attach your image"`
  - Kept unchanged:
    - Birthdate (`birthdate`): `"Please select a date"`
    - Sex, Civil Status, Year Level, Course, Section, Municipality, Barangay: `"Please select an option"`
- **Family Background**:
  - Changed error message to `"This field is required"` for Name, Occupation, and Contact No. across all 3 sections:
    - Father Information (`fatherName`, `fatherOccupation`, `fatherContact`)
    - Mother Information (`motherName`, `motherOccupation`, `motherContact`)
    - Guardian Information (`guardianName`, `guardianOccupation`, `guardianContact`)
  - Kept unchanged `"Please select an option"` for:
    - Highest Educational Attainment of Parent/Guardian (`parentEduAttainment`)
    - Family Monthly Income (`monthlyIncome`)
    - First in family to attend college (`firstInFamily`)
- **Living Condition**:
  - Kept error message `"Please select an option"` for:
    - With whom do you currently live? (`livingWith`)
    - Type of Housing (`housingType`)
- **Access to Resources**:
  - Kept error message `"Please select an option"` for:
    - Do you have access to the following at home? (`accessToResources`)
    - Do you work while studying? (`workingStudent`)
- **Study Classification**:
  - "Which of the following classifications best describes your current status? (Multiple responses)": `"Please select at least one option"`

### 2. Follow-Up Text Boxes Fixes (Study Classification)
- Applied to all 3 follow-up text boxes:
  1. *If you are a working student, please indicate your type of work or source of income* (`workTypeIncome`)
  2. *If you are a student with special needs/Person with disability (PWD), please specify your condition or disability* (`specialNeedsCondition`)
  3. *If you are a PDL (dropout, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted* (`pdlReason`)
- **Validation**: Shows `"This field is required. Write N/A if not applicable"` when left empty.
- **Placeholder**: Removed internal placeholder text `"This field is required. Write N/A if not applicable"`.
- **Typing Bug Resolved**: Fixed text boxes 2 and 3 so students can smoothly type in them just like text box 1.
- **Dynamic Error Clearing**: Configured input error states to clear immediately as soon as the user enters valid text.

---

## [November 4, 2026 - Update 2] — Restoration of Review Step, Address Fields & Modals

### 1. Restored Submission Review Step & Form Modals
- **Connected Active Components**: Removed dummy stub placeholders in `src/pages/student/index.tsx` that were suppressing the review step and modals (`SignaturePad`, `SubmissionReviewSummary`, `SubmissionSuccessModal`, `DocumentPreviewModal`).
- **Complete Review Summary Restored**: Re-imported the real `SubmissionReviewSummary` component so students can review all completed demographics, family information, socioeconomic conditions, classification details, uploaded document previews, and signatures with direct "Edit" jump controls.
- **Modals Restored**:
  - `SubmissionSuccessModal`: Post-submission confirmation modal with reference number and guidance office notice.
  - `DocumentPreviewModal`: Interactive in-app viewer for uploaded Registration Forms (RF), General Weighted Average (GWA), and Student ID files.
  - `SignaturePad`: Full canvas signing interface with clear, undo, and redraw controls.

### 2. Restored Address Information in Demographics
- **Added Full Address Block to `PersonalInfoSection.tsx`**:
  - **Street**: Text input for Street / Sitio / Purok with error highlight and validation.
  - **Municipality**: Dropdown selector with all Capiz municipalities + "Others".
  - **Barangay**: Dynamically populated dropdown list matching the selected municipality from `capizMunicipalities`.
  - **Province**: Displays "Capiz" (or editable when "Others" is selected) with validation.
  - **Postal Code**: Text input (e.g. `5800`) with validation.
  - **Address (Outside Capiz)**: Dynamically rendered when the user selects "Others" under Municipality, allowing non-Capiz students to input their home address.
- **Updated Validation Error Messages**:
  - 2x2 Picture: `"Please attach your image"`
  - Street, Postal Code, Address (Outside Capiz): `"This field is required"`
  - Municipality, Barangay: `"Please select an option"`

---

## [November 4, 2026] — Major System Upgrades & Refactoring

### 1. Architectural Refactoring (Form-as-Components)
- **Extracted Monolithic Form**: Split the large `index.tsx` into modular, testable, and maintainable components located in `/src/components/forms/`.
- **Created Section Components**:
  - `PersonalInfoSection.tsx`
  - `FamilyBackgroundSection.tsx`
  - `LivingConditionSection.tsx`
  - `AccessToResourcesSection.tsx`
  - `StudyClassificationSection.tsx`
  - `ScholarshipCategorySection.tsx`
- **Created UI Primitives**:
  - `InputGroup.tsx`, `SelectGroup.tsx`, `RadioGroup.tsx`, `SectionHeader.tsx`

### 2. Modern Form Management (`react-hook-form` + Zod)
- **Installed & Configured**: Integrated `react-hook-form`, `zod`, and `@hookform/resolvers`.
- **Schema Validation**: Defined strict validation schemas in `/src/lib/schema.ts` for all personal, family, socioeconomic, and document requirements.
- **Controller Integration**: Connected all form fields to `Controller` and `useForm`, ensuring declarative validation and submission blocking.

### 3. Firestore-Backed Draft & Submission System
- **Persistence Layer**: Implemented persistent data storage using Firebase Firestore with local offline caching (`localForage`).
- **Real-Time Sync**: Enabled real-time updates and notifications for student applications and administrative reviews.

### 4. User Authentication & Profile Auto-Fill
- **Gmail / Google Sign-In**: Integrated Firebase Authentication and Google OAuth login.
- **Auto-Fill Integration**: Synchronized user profile data (`firstName`, `lastName`, `email`) from session storage to automatically populate student details upon form initiation using `react-hook-form`'s `reset()`.

### 5. Dynamic Validation & Error Highlighting
- **Red Border Highlighting**: Enhanced `InputGroup`, `SelectGroup`, and `RadioGroup` to dynamically display red borders (`border-red-500 bg-red-50/40`) and error text when required fields are missing or invalid.
- **Tailored Error Messages**:
  - Personal Information & Family Background fields: `"This field is required"`
  - Suffix and follow-up text boxes (`workTypeIncome`, `specialNeedsCondition`, `pdlReason`): `"This field is required. Write N/A if not applicable"`
  - Picture attachment: `"Please attach your image"`
  - Dropdowns & selections: `"Please select an option"` or `"Please select at least one option"`
- **Immediate Error Clearing**: Configured input handlers to clear error states as soon as the user fills in required fields.

### 6. Stability & Performance Improvements
- **Infinite Render Loop Fix**: Eliminated `Maximum update depth exceeded` by replacing cascading `useEffect` state updates with a derived form state backed by `watch()` and `reset()`.
- **Typing Bug Fix**: Ensured follow-up text boxes (special needs, PDL reason, source of income) are fully responsive and typeable.
- **Build & Linter Success**: Ensured 100% TypeScript compliance with clean compilation and linter runs.
