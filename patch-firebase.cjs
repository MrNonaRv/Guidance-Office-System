const fs = require('fs');
let content = fs.readFileSync('src/lib/firebase.ts', 'utf8');

content = content.replace(
  'createUserWithEmailAndPassword,',
  'createUserWithEmailAndPassword,\n  sendPasswordResetEmail,'
);

content += `\nexport const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email.trim());
};\n`;

fs.writeFileSync('src/lib/firebase.ts', content);
