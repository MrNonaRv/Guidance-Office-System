const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

const target = `      </div>
    </div>
  </div>
  );
}

export function GuidanceDashboard() {`;

const replace = `      </div>
    </div>
  );
}

export function GuidanceDashboard() {`;

content = content.replace(target, replace);
fs.writeFileSync('src/pages/guidance/index.tsx', content);
