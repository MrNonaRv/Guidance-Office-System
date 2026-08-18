const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

const endOfFile = `      </div>
    </div>
  );
}`;
const replaceWith = `      </div>
    </div>
  </div>
  );
}`;

content = content.replace(endOfFile, replaceWith);

fs.writeFileSync('src/pages/guidance/index.tsx', content);
