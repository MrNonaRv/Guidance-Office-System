import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDdkUg7F-3rd028W8BbdTU9ZTki8-NESR0",
  authDomain: "automatic-climate-zgxqk.firebaseapp.com",
  projectId: "automatic-climate-zgxqk",
  storageBucket: "automatic-climate-zgxqk.firebasestorage.app",
  messagingSenderId: "557160494463",
  appId: "1:557160494463:web:61726a040bf3571277964a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
