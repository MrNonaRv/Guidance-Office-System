import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export let cachedGoogleAccessToken: string | null = null;

export const firestoreDb = (firebaseConfig as any).firestoreDatabaseId && (firebaseConfig as any).firestoreDatabaseId !== '(default)'
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const db = firestoreDb;

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

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedGoogleAccessToken = credential.accessToken;
    }
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

export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error with Google Redirect Sign-In", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    return result.user;
  } catch (error: any) {
    // Let the calling UI handle the auth error gracefully
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<FirebaseUser> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName && result.user) {
      try {
        await updateProfile(result.user, { displayName });
      } catch (profileErr) {
        console.warn("Could not update Firebase displayName:", profileErr);
      }
    }
    return result.user;
  } catch (error: any) {
    // Let caller handle error
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




export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email.trim());
};
