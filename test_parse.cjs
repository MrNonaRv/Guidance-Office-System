const fs = require('fs');
let code = fs.readFileSync('src/pages/guidance/index.tsx', 'utf-8');

try {
  require('@babel/core').transform(code, {
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
    filename: 'test.tsx'
  });
} catch(e) {
  console.log(e.message);
}
