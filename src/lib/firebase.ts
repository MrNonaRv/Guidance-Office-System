import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBC8dfx3vXJ8-4JOIX1R_ARRxVPh1KpHDk",
  authDomain: "web-based-scholarship.firebaseapp.com",
  projectId: "web-based-scholarship",
  storageBucket: "web-based-scholarship.firebasestorage.app",
  messagingSenderId: "904739348784",
  appId: "1:904739348784:web:d66f4e467d1812894f68f5",
  measurementId: "G-2MZDRYWYTZ"
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
