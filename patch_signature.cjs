const fs = require('fs');

let s = fs.readFileSync('src/pages/student/index.tsx', 'utf8');

// add import
if (!s.includes('SignaturePad')) {
    s = s.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { SignaturePad } from '../../components/SignaturePad';");
}

// add signature to formData
if (!s.includes("signature: ''")) {
    s = s.replace("dswdOthers: ''", "dswdOthers: '', signature: ''");
}

// add showSignaturePad state
if (!s.includes('showSignaturePad')) {
    s = s.replace("const [step, setStep] = useState(1);", "const [step, setStep] = useState(1);\n  const [showSignaturePad, setShowSignaturePad] = useState(false);");
}

// replace signature area
const oldSig = `<div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-[13px] text-gray-700 mb-8 italic">I hereby certify that the information I have provided is true and correct to the best of my knowledge.</p>
              <div className="inline-block border-t border-black w-64 pt-1 text-sm font-semibold">
                Signature
              </div>
            </div>`;

const newSig = `<div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-[13px] text-gray-700 mb-8 italic">I hereby certify that the information I have provided is true and correct to the best of my knowledge.</p>
              
              <div 
                className="mx-auto w-64 h-24 border-2 border-dashed border-gray-300 rounded-xl mb-2 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white relative overflow-hidden group"
                onClick={() => setShowSignaturePad(true)}
              >
                {formData.signature ? (
                  <img src={formData.signature} alt="Signature" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-sm font-medium group-hover:text-[#1e3a8a]">Click to sign</span>
                )}
              </div>
              <div className="inline-block border-t-2 border-black w-64 pt-2 text-sm font-bold text-[#0f2e60]">
                Applicant's Signature
              </div>

              {showSignaturePad && (
                <SignaturePad 
                  onSave={(dataUrl) => {
                    setFormData(prev => ({ ...prev, signature: dataUrl }));
                    setShowSignaturePad(false);
                  }} 
                  onCancel={() => setShowSignaturePad(false)} 
                />
              )}
            </div>`;

s = s.replace(oldSig, newSig);

fs.writeFileSync('src/pages/student/index.tsx', s);
