import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  projectId: "ai-studio-webbasedscholars-1e280336-8fb9-41d3-8c2f-71557c6b152a",
});
const db = getFirestore(app);

async function check() {
  try {
    const snap = await getDocs(collection(db, 'files'));
    console.log('files count:', snap.size);
    snap.docs.slice(0, 2).forEach(doc => console.log(doc.id, doc.data()));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
check();
