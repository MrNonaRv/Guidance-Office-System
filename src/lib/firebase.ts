import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDIxNzVfx_gaAVKKQ3En8BvH0mnzg66nUU",
  authDomain: "mathquest-new.firebaseapp.com",
  projectId: "mathquest-new",
  storageBucket: "mathquest-new.firebasestorage.app",
  messagingSenderId: "752407989664",
  appId: "1:752407989664:web:7c7e66d18362f8fc9268c5",
  measurementId: "G-477FKVYCPK"
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
