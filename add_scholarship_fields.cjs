const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// 1. Add GripVertical to lucide-react import
content = content.replace(
  "import { LayoutDashboard, FileText, Bell, Mail, BarChart2, Settings, LogOut, Filter, ChevronDown, View, User, X, Search, Type, Paperclip, Link2, Smile, Triangle, Image as ImageIcon, Lock, Pen, MoreVertical, Trash2, ChevronRight, Calendar, GraduationCap, Users, Image, Plus } from 'lucide-react';",
  "import { LayoutDashboard, FileText, Bell, Mail, BarChart2, Settings, LogOut, Filter, ChevronDown, View, User, X, Search, Type, Paperclip, Link2, Smile, Triangle, Image as ImageIcon, Lock, Pen, MoreVertical, Trash2, ChevronRight, Calendar, GraduationCap, Users, Image, Plus, GripVertical } from 'lucide-react';"
);

// 2. Replace formSections state
const oldStateStr = `  const [formSections, setFormSections] = useState([
    { id: 1, title: 'STUDENT DEMOGRAPHICS' }
  ]);`;

const newStateStr = `  const [formSections, setFormSections] = useState([
    { 
      id: 1, 
      title: 'A. PERSONAL DEMOGRAPHICS',
      fields: ['Name', 'Course', 'Year Level', 'Section', 'Sex', 'Civil Status']
    },
    { 
      id: 2, 
      title: 'B. FAMILY BACKGROUND',
      fields: ['Father\\'s Occupation', 'Mother\\'s Occupation', 'Guardian\\'s Occupation', 'Highest Educational Attainment', 'Family\\'s approximate monthly income', 'First in family to attend College?']
    },
    { 
      id: 3, 
      title: 'C. LIVING CONDITION',
      fields: ['With whom do you currently live?', 'Type of Housing']
    },
    { 
      id: 4, 
      title: 'D. ACCESS TO RESOURCES',
      fields: ['Access at home (PC/Internet/Study space/Books)', 'Do you work while studying?']
    },
    { 
      id: 5, 
      title: 'E. STUDENT CLASSIFICATION',
      fields: ['Classification Status (IPs, Solo Parent, PWD, 4Ps, Working, etc.)', 'Type of work', 'Condition or disability', 'Reason for interrupted schooling']
    },
    { 
      id: 6, 
      title: 'SCHOLARSHIP CATEGORY',
      fields: ['Internally-Funded', 'Externally-Funded']
    }
  ]);`;

content = content.replace(oldStateStr, newStateStr);

// Also need to handle adding fields when a new section is added
const oldSaveStr = `  const saveFormSection = () => {
    if (!newSectionTitle) return;
    setFormSections([...formSections, { id: Date.now(), title: newSectionTitle.toUpperCase() }]);
    setShowFormModal(false);
  };`;

const newSaveStr = `  const saveFormSection = () => {
    if (!newSectionTitle) return;
    setFormSections([...formSections, { id: Date.now(), title: newSectionTitle.toUpperCase(), fields: [] }]);
    setShowFormModal(false);
  };`;

content = content.replace(oldSaveStr, newSaveStr);

// 3. Replace the rendering of formSections
const oldRenderStr = `{formSections.map(fs => (
                <div key={fs.id} className="bg-white rounded-md border border-gray-400 p-8 flex justify-between items-center shadow-sm hover:border-blue-400 transition-colors group">
                  <h3 className="text-[#0f2e60] font-black text-[18px] tracking-wide uppercase">{fs.title}</h3>
                  <button onClick={() => handleDeleteFormSection(fs.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}`;

const newRenderStr = `{formSections.map(fs => (
                <div key={fs.id} className="bg-white rounded-md border border-gray-400 p-6 flex flex-col gap-4 shadow-sm hover:border-blue-400 transition-colors group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                      <h3 className="text-[#0f2e60] font-black text-[18px] tracking-wide uppercase">{fs.title}</h3>
                    </div>
                    <button onClick={() => handleDeleteFormSection(fs.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {fs.fields && fs.fields.length > 0 && (
                    <div className="pl-8 flex flex-wrap gap-2">
                      {fs.fields.map((field, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200">
                          {field}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}`;

content = content.replace(oldRenderStr, newRenderStr);

fs.writeFileSync('src/pages/guidance/index.tsx', content);
