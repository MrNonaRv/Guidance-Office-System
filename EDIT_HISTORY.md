# System Edit & Update History Log

**Last Updated:** November 5, 2026  
**System:** Web-Based Scholarship Submission Alert System (CAPSU Mambusao Satellite College)

> **Maintenance Note:** Whenever updates, refactorings, new features, or bug fixes are made to the system in the future, please record them in this file under a new dated entry.

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
