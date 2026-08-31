const fs = require('fs');
const file = 'src/components/StudentRecordModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `              <div>
                <h4 className="text-gray-500 font-extrabold tracking-wider text-[13px] mb-4">DOCUMENTS</h4>
                <div className="space-y-3">
                  {requirementsList.filter(req => req.file).map((req) => (
                    <div key={req.id} className="bg-[#f8fafc] border border-[#cbd5e1] p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <FileText className="w-6 h-6 text-[#64748b] stroke-[1.5]" />
                        <div>
                          <p className="font-bold text-[#1e293b] text-[15px] leading-tight">{req.name}</p>
                          <p className="text-[13px] font-medium text-gray-400 mt-0.5">{req.fileName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreviewFile(req.file as SubmissionFile)}
                        className="text-[#2563eb] hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer"
                        title="Preview File"
                      >
                        <Eye className="w-[22px] h-[22px] stroke-[2.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>`;

const replacement = `              <div>
                <h4 className="text-gray-500 font-extrabold tracking-wider text-[13px] mb-4 uppercase">Scholarship Requirements</h4>
                
                <div className="space-y-4">
                  {/* 1st Sem Section */}
                  <div className="bg-[#f8fafc] border border-[#cbd5e1] p-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Archive className="w-5 h-5 text-blue-600" />
                        <h5 className="font-bold text-gray-800 text-[15px]">1st Semester Records</h5>
                      </div>
                      <select 
                        value={firstSemAY || academicYearsOptions[0]} 
                        onChange={(e) => setFirstSemAY(e.target.value)}
                        className="text-xs font-medium border border-gray-300 rounded-md bg-white p-1.5 text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {academicYearsOptions.map((ay: string) => (
                          <option key={ay} value={ay}>{ay}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleOpenSemester('1st Semester', firstSemAY || academicYearsOptions[0])}
                      className="w-full py-2.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-[18px] h-[18px] stroke-[2.5]" />
                      View 1st Sem Documents
                    </button>
                  </div>

                  {/* 2nd Sem Section */}
                  <div className="bg-[#f8fafc] border border-[#cbd5e1] p-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Archive className="w-5 h-5 text-blue-600" />
                        <h5 className="font-bold text-gray-800 text-[15px]">2nd Semester Records</h5>
                      </div>
                      <select 
                        value={secondSemAY || academicYearsOptions[0]} 
                        onChange={(e) => setSecondSemAY(e.target.value)}
                        className="text-xs font-medium border border-gray-300 rounded-md bg-white p-1.5 text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {academicYearsOptions.map((ay: string) => (
                          <option key={ay} value={ay}>{ay}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleOpenSemester('2nd Semester', secondSemAY || academicYearsOptions[0])}
                      className="w-full py-2.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-[18px] h-[18px] stroke-[2.5]" />
                      View 2nd Sem Documents
                    </button>
                  </div>

                  {/* Other requirements */}
                  {requirementsList.filter(req => req.group === 'Other Documents' && req.file).length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h5 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Other Documents</h5>
                      <div className="space-y-3">
                        {requirementsList.filter(req => req.group === 'Other Documents' && req.file).map((req) => (
                          <div key={req.id} className="bg-white border border-[#cbd5e1] p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                              <FileText className="w-6 h-6 text-[#64748b] stroke-[1.5]" />
                              <div>
                                <p className="font-bold text-[#1e293b] text-[15px] leading-tight">{req.name}</p>
                                <p className="text-[13px] font-medium text-gray-400 mt-0.5">{req.fileName}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setPreviewFile(req.file as SubmissionFile)}
                              className="text-[#2563eb] hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Preview File"
                            >
                              <Eye className="w-[22px] h-[22px] stroke-[2.5]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Replaced successfully");
} else {
    console.log("Target not found!");
}
