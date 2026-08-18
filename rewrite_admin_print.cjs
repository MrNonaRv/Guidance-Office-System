const fs = require('fs');
const file = 'src/pages/guidance/index.tsx';
let content = fs.readFileSync(file, 'utf-8');

const startIdx = content.indexOf('          {/* ----------------- PRINT MODE DOCUMENT ----------------- */}');
const endIdx = content.indexOf('          {/* -------------------------------------------------------- */}');

if (startIdx === -1 || endIdx === -1) throw new Error("Could not find print mode document block");

const newPrintMode = `          {/* ----------------- PRINT MODE DOCUMENT ----------------- */}
          <div className="hidden print:block text-black bg-white">
            
            {/* PAGE 1: SCHOLARSHIP RECORD FORM */}
            <div className="print-page w-full min-h-screen">
              {/* Header Box */}
              <div className="border-2 border-black w-full mb-6">
                <div className="flex border-b-2 border-black">
                  <div className="w-1/4 p-2 border-r-2 border-black flex items-center justify-center">
                    <img src="/logo.png" className="w-16 h-16 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                  <div className="w-1/2 p-2 border-r-2 border-black flex flex-col items-center justify-center text-center">
                    <span className="text-xs">Document Type:</span>
                    <strong className="text-xl">FORM</strong>
                    <span className="text-[10px]">ISO 9001:2015</span>
                  </div>
                  <div className="w-1/4">
                    <div className="border-b-2 border-black p-1 text-[10px] flex justify-between"><span>Document Code</span><strong>GCO-F05</strong></div>
                    <div className="border-b-2 border-black p-1 text-[10px] flex justify-between"><span>Revision No.</span><strong>00</strong></div>
                    <div className="border-b-2 border-black p-1 text-[10px] flex justify-between"><span>Effective Date</span><strong>June 25, 2018</strong></div>
                    <div className="p-1 text-[10px] flex justify-between"><span>Page</span><strong>1 of 1</strong></div>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/4 p-2 border-r-2 border-black text-xs">Document Title:</div>
                  <div className="w-3/4 p-2 text-center font-bold text-lg tracking-wider">SCHOLARSHIP RECORD FORM</div>
                </div>
              </div>

              {/* Top Profile block */}
              <div className="flex gap-4 mb-6 text-sm">
                <div className="flex-1 space-y-2">
                  <div className="flex items-end gap-2">
                    <span className="w-12">Name:</span>
                    <span className="flex-1 border-b border-black text-center">{selectedSubmission.data.familyName}</span>
                    <span className="flex-1 border-b border-black text-center">{selectedSubmission.data.firstName}</span>
                    <span className="flex-1 border-b border-black text-center">{selectedSubmission.data.middleName}</span>
                    <span className="ml-4">Age:</span><span className="w-12 border-b border-black text-center">{selectedSubmission.data.age}</span>
                    <span className="ml-4">Sex: ( {selectedSubmission.data.sex === 'Male' ? 'x' : ' '} ) Male ( {selectedSubmission.data.sex === 'Female' ? 'x' : ' '} ) Female</span>
                  </div>
                  <div className="flex text-xs text-center text-gray-600 mb-2">
                    <span className="w-12"></span>
                    <span className="flex-1">Family Name</span>
                    <span className="flex-1">First Name</span>
                    <span className="flex-1">Middle Name</span>
                    <span className="w-12"></span><span className="w-12"></span><span className="w-48"></span>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <span className="w-24">Course & Year:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.course} - {selectedSubmission.data.yearLevel}</span>
                    <span className="w-16">Birthdate:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.birthdate}</span>
                    <span className="w-20">Contact No.:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.contactNo}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="w-32">Permanent Address:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.permanentAddress}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="w-24">Father's Name:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.fatherName}</span>
                    <span className="w-24 pl-4">Mother's Name:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.motherName}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="w-40">Educational Attainment:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.parentsEducationalAttainment}</span>
                    <span className="w-40 pl-4">Educational Attainment:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.parentsEducationalAttainment}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="w-24">Occupation:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.fatherOccupation}</span>
                    <span className="w-24 pl-4">Occupation:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.motherOccupation}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="w-16">Office:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.fatherOffice}</span>
                    <span className="w-16 pl-4">Office:</span>
                    <span className="flex-1 border-b border-black">{selectedSubmission.data.motherOffice}</span>
                  </div>
                </div>
                {/* 2x2 Picture Box */}
                <div className="w-32 h-32 border-2 border-black flex items-center justify-center text-center text-xs p-2">
                  Attach<br/>2x2 Picture
                </div>
              </div>

              {/* Category */}
              <div className="text-center font-bold text-sm mb-4">SCHOLARSHIP CATEGORY</div>
              <div className="text-sm">
                <strong>A. Internally-Funded</strong>
                <div className="pl-4 mt-1">
                  <em>Entrance</em>
                  <div className="pl-4">
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Valedictorian') ? 'x' : ' '} ] Valedictorian</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Salutatorian') ? 'x' : ' '} ] Salutatorian</div>
                  </div>
                </div>
                <div className="pl-4 mt-1">
                  <em>Academic</em>
                  <div className="pl-4 grid grid-cols-2">
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Full') ? 'x' : ' '} ] Full</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Partial') ? 'x' : ' '} ] Partial</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Regional') ? 'x' : ' '} ] Regional</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('National') ? 'x' : ' '} ] National</div>
                  </div>
                </div>
                <div className="pl-4 mt-1">
                  <em>Institutional</em>
                  <div className="pl-4 grid grid-cols-2">
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Dependent of Faculty') ? 'x' : ' '} ] Dependent of Faculty or Staff</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('President - SSC') ? 'x' : ' '} ] President - SSC</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('President - FLP') ? 'x' : ' '} ] President - FLP</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Editor-in-Chief') ? 'x' : ' '} ] Editor-in-Chief (Campus Publication)</div>
                  </div>
                </div>

                <strong className="block mt-4">B. Externally-Funded</strong>
                <div className="pl-4 mt-1">
                  <em>CHED</em>
                  <div className="pl-4">
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Tulong Dunong') ? 'x' : ' '} ] Tulong Dunong (specify)</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('ESGP-PA') ? 'x' : ' '} ] ESGP - PA</div>
                    <div className="flex gap-2">[ {selectedSubmission.data.scholarshipCategory?.includes('Others') ? 'x' : ' '} ] Others (specify): <span className="border-b border-black flex-1"></span></div>
                  </div>
                </div>
                <div className="pl-4 mt-1">
                  <em>Merit</em>
                  <div className="pl-4 grid grid-cols-2">
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('DOST') ? 'x' : ' '} ] DOST</div>
                    <div>[ {selectedSubmission.data.scholarshipCategory?.includes('GRF') ? 'x' : ' '} ] GRF</div>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-between text-sm">
                <div className="w-48 text-center">
                  <div className="border-b border-black">{new Date().toLocaleDateString()}</div>
                  <div className="mt-1">Date Received</div>
                </div>
                <div className="w-64 text-center">
                  <div className="border-b border-black h-6"></div>
                  <div className="mt-1">Signature of Applicant</div>
                </div>
              </div>
            </div>

            <div className="break-after-page"></div>

            {/* PAGE 2: STUDENTS PROFILE AND ETG SURVEY */}
            <div className="print-page w-full min-h-screen pt-8">
              <div className="text-center mb-8">
                <h1 className="font-serif italic font-bold text-lg">Office of the Student Affairs and Services</h1>
                <h2 className="font-bold text-sm">STUDENTS PROFILE AND ETG SURVEY</h2>
                <h3 className="font-bold text-sm">2nd Sem 2025-2026</h3>
                <p className="text-xs mt-2 italic">(Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012)</p>
              </div>

              <div className="space-y-4 text-sm">
                <strong>A. Personal Demographics</strong>
                <div className="flex gap-2">
                  <span className="w-16">Name:</span><span className="flex-1 border-b border-black">{selectedSubmission.studentName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-16">Course:</span>
                  <div className="w-48">
                    <div>( {selectedSubmission.data.course === 'BSCS' ? 'x' : ' '} ) BSCS</div>
                    <div>( {selectedSubmission.data.course === 'BSFT' ? 'x' : ' '} ) BSFT</div>
                    <div>( {selectedSubmission.data.course === 'BSOA' ? 'x' : ' '} ) BSOA</div>
                    <div>( {selectedSubmission.data.course === 'BAEL' ? 'x' : ' '} ) BAEL</div>
                  </div>
                  <span className="w-20">Year Level:</span>
                  <div className="w-40">
                    <div>( {selectedSubmission.data.yearLevel === 'First year' ? 'x' : ' '} ) First year</div>
                    <div>( {selectedSubmission.data.yearLevel === 'Second year' ? 'x' : ' '} ) Second year</div>
                    <div>( {selectedSubmission.data.yearLevel === 'Third year' ? 'x' : ' '} ) Third year</div>
                    <div>( {selectedSubmission.data.yearLevel === 'Fourth year' ? 'x' : ' '} ) Fourth year</div>
                  </div>
                  <span className="w-16">Section:</span><span className="w-32 border-b border-black h-5">{selectedSubmission.data.section}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span>Sex: ( {selectedSubmission.data.sex === 'Male' ? 'x' : ' '} ) Male  ( {selectedSubmission.data.sex === 'Female' ? 'x' : ' '} ) Female</span>
                  <span>Civil Status: ( {selectedSubmission.data.civilStatus === 'Single' ? 'x' : ' '} ) Single  ( {selectedSubmission.data.civilStatus === 'Married' ? 'x' : ' '} ) Married</span>
                </div>

                <strong className="block mt-4">B. Family Background</strong>
                <div className="flex gap-4">
                  <span className="w-32">Father's Occupation:</span><span className="flex-1 border-b border-black">{selectedSubmission.data.fatherOccupation}</span>
                  <span className="w-32">Mother's Occupation:</span><span className="flex-1 border-b border-black">{selectedSubmission.data.motherOccupation}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-36">Guardian's Occupation:</span><span className="flex-1 border-b border-black">{selectedSubmission.data.guardianOccupation}</span>
                </div>
                
                <div>Highest Educational Attainment of your Parent/Guardian?</div>
                <div className="grid grid-cols-2 pl-8">
                  <div>( {selectedSubmission.data.parentsEducationalAttainment === 'Elementary Level' ? 'x' : ' '} ) Elementary Level</div>
                  <div>( {selectedSubmission.data.parentsEducationalAttainment === 'Elementary Graduate' ? 'x' : ' '} ) Elementary Graduate</div>
                  <div>( {selectedSubmission.data.parentsEducationalAttainment === 'High School Level' ? 'x' : ' '} ) High School Level</div>
                  <div>( {selectedSubmission.data.parentsEducationalAttainment === 'High school Graduate' ? 'x' : ' '} ) High school Graduate</div>
                  <div>( {selectedSubmission.data.parentsEducationalAttainment === 'College Level' ? 'x' : ' '} ) College Level</div>
                  <div>( {selectedSubmission.data.parentsEducationalAttainment === 'College Graduate' ? 'x' : ' '} ) College Graduate</div>
                  <div>( {selectedSubmission.data.parentsEducationalAttainment === 'post Graduate level/degree' ? 'x' : ' '} ) post Graduate level/degree</div>
                </div>

                <div className="mt-2 text-center">What is your family's approximate monthly income?</div>
                <div className="pl-32">
                  <div>( {selectedSubmission.data.monthlyIncome === 'below Php10,000' ? 'x' : ' '} ) below Php10,000</div>
                  <div>( {selectedSubmission.data.monthlyIncome === 'Php10,001 - 20,000' ? 'x' : ' '} ) Php10,001 - 20,000</div>
                  <div>( {selectedSubmission.data.monthlyIncome === 'Php20,001 - 30,000' ? 'x' : ' '} ) Php20,001 - 30,000</div>
                  <div>( {selectedSubmission.data.monthlyIncome === 'Above 30,000' ? 'x' : ' '} ) Above 30,000</div>
                </div>

                <div className="flex gap-4">
                  <span>Are you the first in the family to attend College?</span>
                  <span>( {selectedSubmission.data.firstGenCollege === 'Yes' ? 'x' : ' '} ) Yes</span>
                  <span>( {selectedSubmission.data.firstGenCollege === 'No' ? 'x' : ' '} ) No</span>
                </div>

                <strong className="block mt-4">C. Living Condition</strong>
                <div className="flex gap-4">
                  <span className="w-48">With whom do you currently live?</span>
                  <div className="flex-1 grid grid-cols-2">
                    <div>( {selectedSubmission.data.livingWith === 'Parents/Guardians' ? 'x' : ' '} ) Parents/Guardians</div>
                    <div>( {selectedSubmission.data.livingWith === 'Boarding house' ? 'x' : ' '} ) Boarding house</div>
                    <div>( {selectedSubmission.data.livingWith === 'Relatives' ? 'x' : ' '} ) Relatives</div>
                    <div>( {selectedSubmission.data.livingWith === 'Alone' ? 'x' : ' '} ) Alone</div>
                    <div className="col-span-2">( {selectedSubmission.data.livingWith === 'others' ? 'x' : ' '} ) others (please specify): <span className="border-b border-black inline-block w-48 text-center">{selectedSubmission.data.livingWithSpecify}</span></div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-2">
                  <span className="w-48">Type of Housing</span>
                  <div className="flex-1">
                    <div>( {selectedSubmission.data.housingType === 'Own house' ? 'x' : ' '} ) Own house</div>
                    <div>( {selectedSubmission.data.housingType === 'Rented house or apartment' ? 'x' : ' '} ) Rented house or apartment</div>
                    <div>( {selectedSubmission.data.housingType === 'Boarding house' ? 'x' : ' '} ) Boarding house</div>
                    <div>( {selectedSubmission.data.housingType === 'Others' ? 'x' : ' '} ) Others (please specify): <span className="border-b border-black inline-block w-48 text-center">{selectedSubmission.data.housingTypeSpecify}</span></div>
                  </div>
                </div>

                <strong className="block mt-4">D. Access to Resources</strong>
                <div>Do you have access of the following at home?</div>
                <div className="pl-32">
                  <div>( {selectedSubmission.data.accessResources?.includes('Personal Computer/Laptop') ? 'x' : ' '} ) Personal Computer/Laptop</div>
                  <div>( {selectedSubmission.data.accessResources?.includes('Internet Connection') ? 'x' : ' '} ) Internet Connection</div>
                  <div>( {selectedSubmission.data.accessResources?.includes('Study space') ? 'x' : ' '} ) Study space</div>
                  <div>( {selectedSubmission.data.accessResources?.includes('Textbooks and learning materials') ? 'x' : ' '} ) Textbooks and learning materials</div>
                </div>

                <div className="flex gap-8 mt-2">
                  <span>Do you work while studying?</span>
                  <span>( {selectedSubmission.data.workingStudent === 'Yes, full-time' ? 'x' : ' '} ) Yes, full-time</span>
                  <span>( {selectedSubmission.data.workingStudent === 'Yes, part-time' ? 'x' : ' '} ) Yes, part-time</span>
                  <span>( {selectedSubmission.data.workingStudent === 'No' ? 'x' : ' '} ) No</span>
                </div>
              </div>
            </div>

            <div className="break-after-page"></div>

            {/* PAGE 3: SURVEY CONTINUATION */}
            <div className="print-page w-full min-h-screen pt-8 text-sm">
              <strong className="block mb-2">E. Student Classification</strong>
              <div className="mb-2">Which of the following classification best describe your current status? (Multiple responses)</div>
              
              <div className="pl-8 space-y-0.5">
                {[
                  'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 
                  'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
                  'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school',
                  'Rebel returnees', 'Child of a rebel returnees', 'Dependent or child of OFW',
                  'Member of 4Ps', 'Member of Calamity or Disaster Affected Family',
                  'Orphan/Child in need of special protection', 'Working Student',
                  'From geographically isolated & disadvantaged area (GIDA)', 'Muslim Student',
                  'Low income family/ Economically disadvantaged student', 'Senior Citizen student',
                  'First Generation student (Parents did not complete a college degree)',
                  'LGBTQ+ Community', 'Regular student (I do not belong to any of this group classification)'
                ].map(opt => (
                  <div key={opt}>( {selectedSubmission.data.classifications?.includes(opt) ? 'x' : ' '} ) {opt}</div>
                ))}
                <div className="flex gap-2">( {selectedSubmission.data.classifications?.includes('others') ? 'x' : ' '} ) others (Please specify) <span className="border-b border-black w-48 text-center">{selectedSubmission.data.classificationOthersSpecify}</span></div>
              </div>

              <div className="mt-6 flex flex-col gap-6">
                <div>
                  <div>If you are working student, please indicate your type of work or source of income</div>
                  <div className="border-b border-black w-full h-5 mt-1 text-center">{selectedSubmission.data.workingStudentTypeOfWork}</div>
                </div>
                <div>
                  <div>If you are a student with special needs/Person with disability (PWD), please specify your condition or disability</div>
                  <div className="border-b border-black w-full h-5 mt-1 text-center">{selectedSubmission.data.pwdCondition}</div>
                </div>
                <div>
                  <div>If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted.</div>
                  <div className="border-b border-black w-full h-5 mt-1 text-center">{selectedSubmission.data.pdlReason}</div>
                </div>
              </div>

              <div className="mt-16">
                <p className="mb-12">I hereby certify that the information I have provided is true and correct to the best of my knowledge. I understand that this information will be used solely for student profiling.</p>
                <div className="w-64">
                  <div className="border-b border-black text-center h-6 font-bold">{selectedSubmission.studentName.toUpperCase()}</div>
                  <div className="text-center font-bold">Signature over Printed Name</div>
                </div>
              </div>

            </div>
          </div>
          {/* -------------------------------------------------------- */}`;

content = content.substring(0, startIdx) + newPrintMode + content.substring(endIdx + '          {/* -------------------------------------------------------- */}'.length);
fs.writeFileSync(file, content);
