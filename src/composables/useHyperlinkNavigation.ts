import { useRouter } from 'vue-router';
import { useSongStore } from '../stores/songStore.ts';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.ts';
import { slugify } from '../utils/search.ts';
// import { parseHyperlinks } from '@/utils/hyperlinkParser.ts';

export function useHyperlinkNavigation () {
  const router = useRouter();
  const songStore = useSongStore();
  // const zikrStore = useZikrStore();

function navigateToContent(url: string) {
    if (!router) {
      console.error('Router is not available');
      return;
    }

// Extract the slug from URL (assuming URL might be "/player/some-slug")
// const slug = url.split("/").pop(); // Gets the last part of the URL

// Check if the slug refers to a song
// const song = songStore.songs.find((s) => slugify(s.title) === slug);
// if (song) {
//   router.push(`/player/${slug}`);
//   return;
// }

// If no song is found, just navigate to the provided URL
router.push(url);
}

return { navigateToContent };
}
    // Check if the slug refers to a zikr item
    // const zikr = zikrStore.zikrItems.find(z => slugify(z.zikrTitle) === slug);
    // if (zikr) {
    //   router.push({ name: 'ZikrPlayer', params: { slug } });
    //   return;
    // }

    // Check if the slug refers to a book
//     const booksCollection = collection(db, 'books');
//     const booksSnapshot = await getDocs(booksCollection);
//     const books = booksSnapshot.docs.map(doc => doc.data() as { name: string, slug: string });
//     const book = books.find(b => slugify(b.name) === slug);
//     if (book) {
//       router.push(`/books?slug=${slug}`); // Use path directly
//       return;
//     }

//     // Fallback: Show an error or navigate to home
//     console.error(`Content with slug "${slug}" not found.`);
//     router.push('/');
//   };

//   return { navigateToContent };
// };