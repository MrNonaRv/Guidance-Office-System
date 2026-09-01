const fs = require('fs');
let content = fs.readFileSync('src/pages/guidance/index.tsx', 'utf8');

content = content.replace(
  "import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../lib/firebase';",
  "import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from '../../lib/firebase';"
);

const handleForgotPasswordString = `
  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!adminEmailInput) {
      setError('Please enter your email address first to reset your password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(adminEmailInput);
      alert('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {`;

content = content.replace('  const handleAdminSubmit = async (e: React.FormEvent) => {', handleForgotPasswordString);

content = content.replace(
  '<a href="#" className="text-[11px] text-gray-500 hover:text-[#0f2e60] hover:underline px-1">Forgot Password?</a>',
  '<a href="#" onClick={handleForgotPassword} className="text-[11px] text-gray-500 hover:text-[#0f2e60] hover:underline px-1">Forgot Password?</a>'
);

fs.writeFileSync('src/pages/guidance/index.tsx', content);
