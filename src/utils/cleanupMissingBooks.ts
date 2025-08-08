import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { ref, listAll } from 'firebase/storage'
import { db, storage, auth, BookData } from '../firebase'
import { signInAnonymously } from 'firebase/auth'

/**
 * Deletes documents from Firestore `books` collection that do not have a
 * corresponding file in Firebase Storage under the given folder.
 * Returns the number of deleted documents.
 */
export async function cleanupMissingBooks(storageFolder: string = 'ilahiBooks'): Promise<number> {
  // Ensure we can list storage by signing in anonymously
  try {
    await signInAnonymously(auth)
  } catch {
    // ignore if already signed in or auth disabled
  }

  // Get current files in Storage folder
  const folderRef = ref(storage, storageFolder)
  const { items } = await listAll(folderRef)
  const existingFileNames = new Set(items.map((i) => i.name))

  // Load all Firestore book docs
  const booksCol = collection(db, 'books')
  const snap = await getDocs(booksCol)

  let deleted = 0
  for (const d of snap.docs) {
    const data = d.data() as Partial<BookData>
    const fileId = data?.id
    if (!fileId || !existingFileNames.has(fileId)) {
      await deleteDoc(doc(booksCol, d.id))
      deleted++
    }
  }

  return deleted
}

/**
 * Deletes ALL documents from Firestore `books` collection.
 * Use with caution.
 */
export async function clearAllBooks(): Promise<number> {
  const booksCol = collection(db, 'books')
  const snap = await getDocs(booksCol)
  let deleted = 0
  for (const d of snap.docs) {
    await deleteDoc(doc(booksCol, d.id))
    deleted++
  }
  return deleted
} 