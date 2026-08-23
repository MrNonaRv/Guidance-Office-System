const fs = require('fs');

let s = fs.readFileSync('src/pages/guidance/index.tsx', 'utf8');

const targetStr = `export function GuidanceSubmissions() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>(() => db.submissions.getCached());
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All status');`;

const replaceStr = `export function GuidanceSubmissions() {
  const location = useLocation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>(() => db.submissions.getCached());
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(location.state?.filterStatus || 'All status');`;

s = s.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/guidance/index.tsx', s);
