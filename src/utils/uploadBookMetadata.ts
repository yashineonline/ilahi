import { collection, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { auth, db, storage } from '../firebase.ts';
import { signInAnonymously } from 'firebase/auth';

export async function uploadBookMetadata() {
  try {
    // Authenticate anonymously
    await signInAnonymously(auth);

    const booksRef = ref(storage, 'ilahiBooks');
    const booksList = await listAll(booksRef);

    for (const bookRef of booksList.items) {
      const downloadUrl = await getDownloadURL(bookRef);
      const bookData = {
        id: bookRef.name,
        name: bookRef.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        mimeType: bookRef.name.endsWith('.pdf') ? 'application/pdf' : 'folder',
        downloadUrl: downloadUrl
      };

      try {
        const docRef = await addDoc(collection(db, 'books'), bookData);
        // console.log(`Added metadata for ${bookData.name} with ID: ${docRef.id}`);
      } catch (error) {
        console.error(`Error adding metadata for ${bookData.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in uploadBookMetadata:", error);
  }
}