const fs = require('fs');

const page1 = `        {/* PAGE 1: SCHOLARSHIP RECORD FORM */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-8 break-after-page text-black bg-white font-serif relative shrink-0">
          {/* Header Box */}
          <div className="border border-black w-[90%] mx-auto mb-6">
            <div className="flex border-b border-black">
              <div className="w-1/5 p-2 border-r border-black flex flex-col items-center justify-center">
                <img src="/capsu-logo.png" className="w-12 h-12 object-contain mb-1" alt="Logo" />
              </div>
              <div className="w-3/5 p-2 border-r border-black flex flex-col justify-center text-center">
                <div className="flex text-[11px] justify-start pl-2">
                    <span>Document Type:</span>
                    <span className="flex-1 text-center font-bold font-sans">FORM</span>
                </div>
                <div className="text-[9px] text-center font-sans mt-0.5">ISO 9001:2015</div>
              </div>
              <div className="w-1/5 text-[10px]">
                <div className="border-b border-black p-1 flex"><span className="w-24">Document Code</span><strong className="font-sans">GCO-F05</strong></div>
                <div className="border-b border-black p-1 flex"><span className="w-24">Revision No.</span><strong className="font-sans">00</strong></div>
                <div className="border-b border-black p-1 flex"><span className="w-24">Effective Date</span><strong className="font-sans">June 25, 2018</strong></div>
                <div className="p-1 flex"><span className="w-24">Page</span><strong className="font-sans">1 of 1</strong></div>
              </div>
            </div>
            <div className="flex border-t border-black text-xs font-bold">
                <div className="w-1/5 p-2 border-r border-black font-normal">Document Type:</div>
                <div className="w-4/5 p-2 text-center text-lg tracking-wide font-sans">SCHOLARSHIP RECORD FORM</div>
            </div>
          </div>

          <div className="text-center italic text-sm mb-10 px-10">
            (Data and Personal Information will be kept with utmost confidentiality and will be protected<br/>through RA 10173 also known as Data Privacy Act of 2012)
          </div>

          <div className="text-center font-bold text-lg mb-8">STUDENT DEMOGRAPHICS</div>

          <div className="px-[5%]">
            <div className="font-bold mb-6">A. Personal Information</div>
            
            <div className="flex justify-between relative">
              <div className="w-[78%] space-y-7">
                <div>
                  <div className="flex items-end text-sm">
                    <span className="mr-2">Name:</span>
                    <span className="flex-1 border-b border-black inline-block text-center px-2">{formData.familyName || ''}</span>
                    <span className="flex-1 border-b border-black inline-block text-center px-2 ml-2">{formData.firstName || ''}</span>
                    <span className="flex-1 border-b border-black inline-block text-center px-2 ml-2">{formData.middleName || ''}</span>
                  </div>
                  <div className="flex text-[11px] italic mt-1">
                    <span className="mr-2 opacity-0">Name:</span>
                    <span className="flex-1 text-center">Family Name</span>
                    <span className="flex-1 text-center ml-2">First Name</span>
                    <span className="flex-1 text-center ml-2">Middle Name</span>
                  </div>
                </div>
                
                <div className="flex items-end text-sm">
                  <span className="mr-2">Birthdate:</span>
                  <span className="w-32 border-b border-black inline-block text-center">{formData.birthdate || ''}</span>
                  <span className="ml-8 mr-2">Age:</span>
                  <span className="w-24 border-b border-black inline-block text-center">{formData.age || ''}</span>
                  <span className="ml-8 mr-2">Sex:</span>
                  <span className="w-24 border-b border-black inline-block text-center">{formData.sex || ''}</span>
                </div>
                
                <div className="flex items-end text-sm">
                  <span className="mr-2">Year Level:</span>
                  <span className="w-32 border-b border-black inline-block text-center">{formData.yearLevel || ''}</span>
                  <span className="ml-8 mr-2">Course:</span>
                  <span className="w-32 border-b border-black inline-block text-center">{formData.course || ''}</span>
                  <span className="ml-8 mr-2">Section:</span>
                  <span className="w-24 border-b border-black inline-block text-center">{formData.section || ''}</span>
                </div>
                
                <div className="flex items-end text-sm">
                  <span className="mr-2">Contact No.:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.contactNo || ''}</span>
                  <span className="ml-8 mr-2">Gmail:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.email || ''}</span>
                </div>
                
                <div className="flex items-end text-sm pt-4">
                  <span className="mr-2">Permanent Address:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.permanentAddress || ''}</span>
                </div>
              </div>
              
              <div className="absolute right-0 top-0">
                <div className="w-[140px] h-[140px] border border-black flex items-center justify-center bg-white">
                  {photo2x2 ? (
                    <img src={photo2x2} alt="2x2" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-transparent">2x2</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="font-bold mt-12 mb-6">B. Family Background</div>
            
            <div className="space-y-8 pl-4">
              <div>
                <div className="italic font-bold mb-4 text-sm">Father Information</div>
                <div className="flex items-end text-sm">
                  <span className="mr-2">Name:</span>
                  <span className="w-64 border-b border-black inline-block text-center">{formData.fatherName || ''}</span>
                  <span className="ml-6 mr-2">Occupation:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.fatherOccupation || ''}</span>
                  <span className="ml-6 mr-2">Contact No.:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.fatherContact || ''}</span>
                </div>
              </div>
              
              <div>
                <div className="italic font-bold mb-4 text-sm">Mother Information</div>
                <div className="flex items-end text-sm">
                  <span className="mr-2">Name:</span>
                  <span className="w-64 border-b border-black inline-block text-center">{formData.motherName || ''}</span>
                  <span className="ml-6 mr-2">Occupation:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.motherOccupation || ''}</span>
                  <span className="ml-6 mr-2">Contact No.:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.motherContact || ''}</span>
                </div>
              </div>
              
              <div>
                <div className="italic font-bold mb-4 text-sm">Guardian Information</div>
                <div className="flex items-end text-sm">
                  <span className="mr-2">Name:</span>
                  <span className="w-64 border-b border-black inline-block text-center">{formData.guardianName || ''}</span>
                  <span className="ml-6 mr-2">Occupation:</span>
                  <span className="w-48 border-b border-black inline-block text-center">{formData.guardianOccupation || ''}</span>
                  <span className="ml-6 mr-2">Contact No.:</span>
                  <span className="flex-1 border-b border-black inline-block text-center">{formData.guardianContact || ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>`;

const page2 = `
        {/* PAGE 2 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page text-black bg-white font-serif shrink-0">
          <div className="px-16 space-y-8">
            <div className="font-bold text-sm">Highest Educational Attainment of your Parent/Guardian?</div>
            <div className="pl-16 space-y-2 text-sm flex flex-col">
              {[
                'Elementary Level', 'Elementary Graduate', 'High school Graduate', 
                'College Graduate', 'High School Level', 'College Level', 'post Graduate level/degree'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.parentHighestEducation === opt && <Check className="w-3 h-3" />}
                  </div>
                  {opt}
                </label>
              ))}
            </div>

            <div className="font-bold text-sm pt-4">What is your family's approximate monthly income?</div>
            <div className="pl-16 space-y-2 text-sm flex flex-col">
              {[
                'below ₱ 10,000', '₱ 10,001 - ₱ 20,000', '₱ 20,001 - ₱ 30,000', 'Above ₱ 30,000'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.familyIncome === opt && <Check className="w-3 h-3" />}
                  </div>
                  {opt}
                </label>
              ))}
            </div>

            <div className="flex items-center pt-8 text-sm gap-8 font-bold">
              <div>Are you the first in the family to attend College?</div>
              <div className="flex gap-8 font-normal">
                <label className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.firstInFamily === 'Yes' && <Check className="w-3 h-3" />}
                  </div> Yes
                </label>
                <label className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.firstInFamily === 'No' && <Check className="w-3 h-3" />}
                  </div> No
                </label>
              </div>
            </div>

            <div className="font-bold pt-8 mb-6 text-base">C. Living Condition</div>
            
            <div className="font-bold text-sm">With whom do you currently live?</div>
            <div className="pl-16 space-y-2 text-sm flex flex-col pb-4">
              {[
                'Parents/Guardians', 'Relatives', 'Alone', 'Boarding house'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.livingWith === opt && <Check className="w-3 h-3" />}
                  </div>
                  {opt}
                </label>
              ))}
              <label className="flex items-center gap-3 pt-1">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {formData.livingWith === 'others' && <Check className="w-3 h-3" />}
                  </div>
                  <span>others (please specify) <span className="inline-block w-64 border-b border-black text-center">{formData.livingWith === 'others' ? formData.livingWithOthers : ''}</span></span>
              </label>
            </div>

            <div className="font-bold text-sm pt-4">Type of Housing</div>
            <div className="pl-16 space-y-2 text-sm flex flex-col">
              {[
                'Own house', 'Rented house or apartment', 'Boarding house'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.housingType === opt && <Check className="w-3 h-3" />}
                  </div>
                  {opt}
                </label>
              ))}
              <label className="flex items-center gap-3 pt-1">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {formData.housingType === 'others' && <Check className="w-3 h-3" />}
                  </div>
                  <span>others (please specify) <span className="inline-block w-64 border-b border-black text-center">{formData.housingType === 'others' ? formData.housingTypeOthers : ''}</span></span>
              </label>
            </div>
          </div>
        </div>`;

const page3 = `
        {/* PAGE 3 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page text-black bg-white font-serif shrink-0">
          <div className="px-16 space-y-8">
            <div className="font-bold text-base mb-6">D. Access to Resources</div>
            
            <div className="font-bold text-sm">Do you have access of the following at home?</div>
            <div className="pl-16 space-y-2 text-sm flex flex-col">
              {[
                'Personal Computer/Laptop', 'Internet Connection', 'Study space', 'Textbooks and learning materials'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {(formData.homeResources || []).includes(opt) && <Check className="w-3 h-3" />}
                  </div>
                  {opt}
                </label>
              ))}
            </div>

            <div className="flex items-center pt-8 text-sm gap-8 font-bold">
              <div>Do you work while studying?</div>
              <div className="flex gap-8 font-normal">
                <label className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.workingStudent === 'Yes, full-time' && <Check className="w-3 h-3" />}
                  </div> Yes, full-time
                </label>
                <label className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.workingStudent === 'Yes, part-time' && <Check className="w-3 h-3" />}
                  </div> Yes, part-time
                </label>
                <label className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center">
                    {formData.workingStudent === 'No' && <Check className="w-3 h-3" />}
                  </div> No
                </label>
              </div>
            </div>

            <div className="font-bold pt-8 mb-6 text-base">E. Student Classification</div>
            
            <div className="font-bold text-sm">Which of the following classification best describe your current status? (Multiple responses)</div>
            <div className="pl-6 space-y-1 text-[13px] flex flex-col">
              {[
                'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 
                'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
                'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school',
                'Rebel returnees', 'Child of a rebel returnees', 'Dependent or child of OFW',
                'Member of 4Ps', 'Member of Calamity or Disaster Affected Family',
                'Orphan/Child in need of special protection', 'Working Student',
                'From geographically isolated & disadvantaged area (GIDA)', 'Muslim Student',
                'Low income family/ Economically disadvantaged student', 'Senior Citizen student'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {(formData.studentClassification || []).includes(opt) && <Check className="w-3 h-3" />}
                  </div>
                  {opt}
                </label>
              ))}
              <label className="flex items-start gap-2 pt-0.5">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0 mt-0.5">
                    {(formData.studentClassification || []).includes('First Generation student (Parents did not complete a college degree, first in the immediate family to seek college admission)') && <Check className="w-3 h-3" />}
                  </div>
                  <span className="leading-tight">First Generation student (Parents did not complete a college degree, first in the immediate family to seek<br/>college admission)</span>
              </label>
              <label className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {(formData.studentClassification || []).includes('LGBTQ+ Community') && <Check className="w-3 h-3" />}
                  </div>
                  <span>LGBTQ+ Community</span>
              </label>
              <div className="pl-6 pt-0.5 pb-2">Regular student (I do not belong to any of this group classification)</div>
              <label className="flex items-center gap-2 pt-2">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {(formData.studentClassification || []).includes('others') && <Check className="w-3 h-3" />}
                  </div>
                  <span>others (Please specify) <span className="inline-block w-[400px] border-b border-black text-center">{formData.studentClassificationOthers || ''}</span></span>
              </label>
            </div>
          </div>
        </div>`;

const page4 = `
        {/* PAGE 4 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page text-black bg-white font-serif shrink-0">
          <div className="px-16 space-y-12">
            <div className="text-sm font-bold">
              If you are working student, please indicate your type of work or source of income
              <div className="mt-4 border-b border-black w-full text-center font-normal">{formData.workingStudentType || '\\u00A0'}</div>
            </div>
            
            <div className="text-sm font-bold">
              If you are a student with special needs/Person with disability (PWD), please specify your condition or<br/>disability
              <div className="mt-4 border-b border-black w-full text-center font-normal">{formData.pwdCondition || '\\u00A0'}</div>
            </div>
            
            <div className="text-sm font-bold">
              If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your<br/>schooling was previously interrupted.
              <div className="mt-4 border-b border-black w-full text-center font-normal">{formData.pdlReason || '\\u00A0'}</div>
            </div>

            <div className="text-center font-bold text-base mt-16 mb-8 tracking-wide">SCHOLARSHIP CATEGORY</div>

            <div>
              <div className="font-bold text-sm mb-6">A. Internally-Funded</div>
              
              <div className="pl-6 space-y-6">
                <div>
                  <div className="font-bold text-sm mb-4">Entrance</div>
                  <div className="flex gap-16 pl-6 text-sm">
                    <label className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                        {formData.internalScholarship === 'Entrance' && formData.entranceType === 'Valedictorian' && <Check className="w-3 h-3" />}
                      </div> Valedictorian
                    </label>
                    <label className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                        {formData.internalScholarship === 'Entrance' && formData.entranceType === 'Salutatorian' && <Check className="w-3 h-3" />}
                      </div> Salutatorian
                    </label>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sm mb-4">Academic</div>
                  <div className="flex gap-16 pl-6 text-sm">
                    {['Full', 'Partial', 'Regional', 'National'].map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                          {formData.internalScholarship === 'Academic' && formData.academicType === opt && <Check className="w-3 h-3" />}
                        </div> {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sm mb-4">Socio-cultural</div>
                  <div className="flex gap-16 pl-6 text-sm">
                    <label className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                        {formData.internalScholarship === 'Socio-cultural' && formData.socioType === 'Regional' && <Check className="w-3 h-3" />}
                      </div> Regional
                    </label>
                    <label className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                        {formData.internalScholarship === 'Socio-cultural' && formData.socioType === 'National' && <Check className="w-3 h-3" />}
                      </div> National
                    </label>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sm mb-4">Institutional</div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-8 pl-6 text-sm">
                    {[
                      'Dependent of Faculty or Staff', 'President – SSC',
                      'President – FLP', 'Editor-in-Chief (Campus Publication)',
                      'CapSU Band / Chorale'
                    ].map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                          {formData.internalScholarship === 'Institutional' && formData.institutionalType === opt && <Check className="w-3 h-3" />}
                        </div> {opt}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6">
                  <label className="flex items-center gap-2 pl-6 text-sm">
                      <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                        {formData.internalScholarship === 'Others' && <Check className="w-3 h-3" />}
                      </div>
                      <span>Others (specify) <span className="inline-block w-[500px] border-b border-black text-center">{formData.internalScholarship === 'Others' ? formData.internalOthers : ''}</span></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>`;

const page5 = `
        {/* PAGE 5 */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page text-black bg-white font-serif shrink-0">
          <div className="px-16 space-y-8">
            <div className="font-bold text-sm mb-6">B. Externally-Funded</div>
            
            <div>
              <div className="font-bold text-sm mb-4">CHED</div>
              <div className="pl-6 space-y-1 text-sm flex flex-col">
                {[
                  'ANAC – IP', 'Pag – ulikid', 'Barangay (Legal dependents of Brgy. Officials)', 
                  'ESGP – PA', 'UniFast', 'Tertiary Education Subsidy (TES)'
                ].map(opt => (
                  <label key={opt} className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.chedSubCategory === opt && <Check className="w-3 h-3" />}
                    </div>
                    {opt}
                  </label>
                ))}
                
                <label className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.chedSubCategory === 'Congressional District' && <Check className="w-3 h-3" />}
                    </div>
                    <span>Congressional District (specify) <span className="inline-block w-[350px] border-b border-black text-center">{formData.chedCongressionalDistrict || ''}</span></span>
                </label>
                <label className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.chedSubCategory === 'One Town One Scholar' && <Check className="w-3 h-3" />}
                    </div>
                    <span>One Town One Scholar (specify) <span className="inline-block w-[350px] border-b border-black text-center">{formData.chedOneTown || ''}</span></span>
                </label>
                <label className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.chedSubCategory === 'Tulong Dunong' && <Check className="w-3 h-3" />}
                    </div>
                    <span>Tulong Dunong (specify) <span className="inline-block w-[390px] border-b border-black text-center">{formData.chedTulongDunong || ''}</span></span>
                </label>
              </div>
              <label className="flex items-center gap-2 pl-6 mt-6 text-sm">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {formData.scholarshipFundType === 'External' && formData.chedSubCategory === 'Others' && <Check className="w-3 h-3" />}
                  </div>
                  <span>Others (specify) <span className="inline-block w-[500px] border-b border-black text-center">{formData.chedOthers || ''}</span></span>
              </label>
            </div>

            <div className="pt-4">
              <div className="font-bold text-sm mb-4">Merit</div>
              <div className="flex gap-16 pl-12 text-sm">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.meritType === 'VIC' && <Check className="w-3 h-3" />}
                    </div> VIC
                  </label>
                  <label className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.meritType === 'DOST' && <Check className="w-3 h-3" />}
                    </div> DOST
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.meritType === 'Capizeño Circle' && <Check className="w-3 h-3" />}
                    </div> Capizeño Circle
                  </label>
                  <label className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                      {formData.scholarshipFundType === 'External' && formData.meritType === 'GRF' && <Check className="w-3 h-3" />}
                    </div> GRF
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <label className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {formData.scholarshipFundType === 'External' && formData.dswdType === 'LGU' && <Check className="w-3 h-3" />}
                  </div>
                  <span>LGU: Barangay, Municipality, Province (Landline) Contact person or issuing office:</span>
              </label>
              <div className="pl-16 mt-4 border-b border-black w-[550px]">{formData.lguContact || ''}</div>
            </div>
            
            <div className="pt-6">
              <label className="flex items-center gap-2 text-sm mb-4">
                  <div className="w-4 h-4 border border-black rounded-sm flex items-center justify-center shrink-0">
                    {formData.scholarshipFundType === 'External' && formData.dswdType === 'DSWD' && <Check className="w-3 h-3" />}
                  </div>
                  <span>DSWD:</span>
              </label>
              
              <div className="pl-12 space-y-6 text-sm">
                <div className="flex items-end gap-2">
                  <span>Municipality:</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.dswdMunicipality || ''}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span>Contact person:</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.dswdContactPerson || ''}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span>Designation:</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.dswdDesignation || ''}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span>Others (specify)</span>
                  <span className="flex-1 border-b border-black inline-block">{formData.dswdOthers || ''}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm pt-8">
              I hereby certify that the information I have provided is true and correct to the best of my knowledge.
              
              <div className="mt-16 w-[350px] mx-auto relative">
                {formData.signature ? (
                  <img src={formData.signature} className="absolute bottom-6 left-0 right-0 h-16 object-contain mx-auto mix-blend-multiply" />
                ) : null}
                <div className="border-t border-black w-full"></div>
                <div className="mt-1">Signature</div>
              </div>
            </div>
          </div>
        </div>`;

const page6 = `
        {/* PAGE 6: STUDENT DOCUMENTS */}
        <div className="print-page w-[793px] h-[1122px] mx-auto pt-16 break-after-page text-black bg-white font-serif shrink-0 flex flex-col items-center">
          <div className="font-bold text-base mb-12 tracking-wider uppercase">STUDENT DOCUMENTS</div>
          
          <div className="flex gap-8 w-full px-16 justify-center mb-8">
            <div className="w-1/2">
              <div className="h-[450px] border border-black flex items-center justify-center relative p-2 overflow-hidden">
                {requirementsList.find(r => r.category === 'RF')?.file?.data ? (
                  <img src={requirementsList.find(r => r.category === 'RF')?.file?.data} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-300 text-sm font-sans">No Document</span>
                )}
              </div>
              <div className="text-center font-bold mt-3 text-sm">Registration Form</div>
            </div>
            
            <div className="w-1/2">
              <div className="h-[450px] border border-black flex items-center justify-center relative p-2 overflow-hidden">
                {requirementsList.find(r => r.category === 'GWA')?.file?.data ? (
                  <img src={requirementsList.find(r => r.category === 'GWA')?.file?.data} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-300 text-sm font-sans">No Document</span>
                )}
              </div>
              <div className="text-center font-bold mt-3 text-sm">General Weighted Average</div>
            </div>
          </div>
          
          <div className="w-full px-16 max-w-[650px] mx-auto">
            <div className="h-[350px] border border-black flex items-center justify-center relative p-2 overflow-hidden">
                {requirementsList.find(r => r.category === 'ID')?.file?.data ? (
                  <img src={requirementsList.find(r => r.category === 'ID')?.file?.data} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-300 text-sm font-sans">No Document</span>
                )}
            </div>
            <div className="text-center font-bold mt-3 text-sm">Student ID</div>
          </div>
        </div>`;

const allPages = page1 + page2 + page3 + page4 + page5 + page6;

let s = fs.readFileSync('src/components/StudentRecordModal.tsx', 'utf8');
s = s.replace('[REPLACEMENT_MARKER]', allPages);
fs.writeFileSync('src/components/StudentRecordModal.tsx', s);
