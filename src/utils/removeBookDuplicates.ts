import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.ts';

export async function removeBookDuplicates() {
  const booksCollection = collection(db, 'books');
  const snapshot = await getDocs(booksCollection);

  // Group docs by 'id'
  const idMap: Record<string, string[]> = {};
  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data();
    if (!data.id) return;
    if (!idMap[data.id]) idMap[data.id] = [];
    idMap[data.id].push(docSnap.id);
  });

  // For each group with duplicates, delete all but the first
  let deletedCount = 0;
  for (const ids of Object.values(idMap)) {
    if (ids.length > 1) {
      // Keep the first, delete the rest
      for (let i = 1; i < ids.length; i++) {
        await deleteDoc(doc(booksCollection, ids[i]));
        deletedCount++;
      }
    }
  }
  return deletedCount;
}