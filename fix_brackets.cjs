const fs = require('fs');

let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

// The issue seems to be at the end of the GuidanceSubmissions component, which is right before GuidanceSettings.
// Let's replace the problematic area.

const search = `                </div>
              </div>
</div>{/* Modal */}`;

const replace = `                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

content = content.replace(search, replace);

// And we need to remove the scholarship modal that got accidentally appended to GuidanceSubmissions during our find/replace?
// Wait, the end of the file looks like it's inside GuidanceSettings, but maybe I broke the component boundaries.

fs.writeFileSync('src/pages/guidance/index.tsx', content);
