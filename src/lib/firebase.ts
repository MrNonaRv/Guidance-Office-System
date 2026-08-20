import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

let firestoreInstance: Firestore | null = null;
try {
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
    firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    firestoreInstance = getFirestore(app);
  }
} catch (e) {
  try {
    firestoreInstance = getFirestore(app);
  } catch (err) {
    console.warn("Firestore initialization notice:", err);
  }
}
export const firestoreDb = firestoreInstance;
export const db = firestoreInstance;

async function testConnection() {
  try {
    if (firestoreDb) {
      await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently operating in offline/cached mode.");
    }
  }
}
testConnection();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' || 
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/popup-blocked'
    ) {
      // User dismissed or browser blocked popup, handled by calling UI
      throw error;
    }
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


