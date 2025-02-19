import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add this import

export { uploadBookMetadata } from './utils/uploadBookMetadata.ts';

const firebaseConfig = {
  apiKey: "AIzaSyDOM_RAFKDV6x35Rd55V3ihLh7PdZF9i-A",
  authDomain: "ilahi-90311.firebaseapp.com",
  projectId: "ilahi-90311",
  storageBucket: "ilahi-90311.appspot.com",
  messagingSenderId: "355868319997",
  appId: "1:355868319997:web:d1fa4733d107a6cd825e94",
  measurementId: "G-C9L97S35V5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // Add this line


const analytics = getAnalytics(app);


export interface BookData {
  id: string;
  name: string;
  mimeType: string;
  downloadUrl: string;
}

export interface ImageFolderData {
  id: string;
  name: string;
  images: BookData[];
}


