import { z } from 'zod';

export const scholarshipFormSchema = z.object({
  // Personal Info
  photo2x2: z.string().min(1, 'Please attach your image'),
  familyName: z.string().min(1, 'This field is required'),
  firstName: z.string().min(1, 'This field is required'),
  middleName: z.string().min(1, 'This field is required'),
  suffix: z.string().min(1, 'This field is required. Write N/A if not applicable'),
  birthdate: z.string().min(1, 'Please select a date'),
  age: z.string().min(1, 'This field is required'),
  sex: z.string().min(1, 'Please select an option'),
  civilStatus: z.string().min(1, 'Please select an option'),
  yearLevel: z.string().min(1, 'Please select an option'),
  course: z.string().min(1, 'Please select an option'),
  section: z.string().min(1, 'Please select an option'),
  contactNo: z.string().min(1, 'This field is required'),
  email: z.string().min(1, 'This field is required').email('Invalid email'),
  street: z.string().min(1, 'This field is required'),
  municipality: z.string().min(1, 'Please select an option'),
  barangay: z.string().optional(),
  province: z.string().min(1, 'This field is required'),
  postalCode: z.string().min(1, 'This field is required'),
  outsideCapizAddress: z.string().optional(),
  
  // Family Info
  fatherName: z.string().min(1, 'This field is required'),
  fatherOccupation: z.string().min(1, 'This field is required'),
  fatherContact: z.string().min(1, 'This field is required'),
  motherName: z.string().min(1, 'This field is required'),
  motherOccupation: z.string().min(1, 'This field is required'),
  motherContact: z.string().min(1, 'This field is required'),
  guardianName: z.string().min(1, 'This field is required'),
  guardianOccupation: z.string().min(1, 'This field is required'),
  guardianContact: z.string().min(1, 'This field is required'),
  parentEduAttainment: z.string().min(1, 'Please select an option'),
  monthlyIncome: z.string().min(1, 'Please select an option'),
  firstInFamily: z.string().min(1, 'Please select an option'),

  // Living Condition
  livingWith: z.string().min(1, 'Please select an option'),
  livingWithOthers: z.string().optional(),
  housingType: z.string().min(1, 'Please select an option'),
  housingTypeOthers: z.string().optional(),

  // Resources
  accessToResources: z.array(z.string()).min(1, 'Please select an option'),
  workingStudent: z.string().min(1, 'Please select an option'),

  // Study Classification
  studentClassification: z.array(z.string()).min(1, 'Please select at least one option'),
  studentClassificationOthers: z.string().optional(),
  workTypeIncome: z.string().min(1, 'This field is required. Write N/A if not applicable'),
  specialNeedsCondition: z.string().min(1, 'This field is required. Write N/A if not applicable'),
  pdlReason: z.string().min(1, 'This field is required. Write N/A if not applicable'),
  scholarship: z.string().min(1, 'Please select a scholarship'),
  signature: z.string().min(1, 'Please provide your signature'),
});

export type ScholarshipFormValues = z.infer<typeof scholarshipFormSchema>;
