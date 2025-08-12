import { slugify } from './search.ts';
import { useHyperlinkNavigation } from '@/composables/useHyperlinkNavigation.ts';
import DOMPurify from 'dompurify';
import { useSongStore } from '@/stores/songStore.ts';
import { usePoemStore } from '@/stores/poemStore.ts';
import { fetchAllPoems } from './poemFetcher.ts';

let cachedPoemData: any[] = [];

// Initialize the cache
export async function initializePoemCache(forceRefresh = false) {
  console.log('🔄 initializePoemCache called with forceRefresh:', forceRefresh);
  try {
    const allAuthors = await fetchAllPoems(forceRefresh);
    cachedPoemData = allAuthors;
  } catch (error) {
    console.error('Error initializing poem cache:', error);
  }
}


// export const parseHyperlinks = (text: string): string => {
//   // console.log('Input text:', text); // Add this
//   const cleanText = DOMPurify.sanitize(text);
//   const songStore = useSongStore();
//   const result = cleanText.replace(/\$([\w-]+)/g, (_, slug) => {
//     const url = `/player/${encodeURIComponent(slug)}`;
//     const song = songStore.songs.find(s => s.slug === slug);
//     const displayText = song ? song.title : slug;
//     return `<a href="${url}" class="hyperlink" data-url="${url}" data-slug="${slug}" aria-label="Navigate to ${displayText}" tabindex="0">${displayText}</a>`;
//   });
//   return result;
// };

export const parseHyperlinks = (text: string): string => {
  // Sanitize first
  const cleanText = DOMPurify.sanitize(text);
  const songStore = useSongStore();

// $slug
  // $slug|My Text
  // $slug|file=naat.txt
  // $slug|My Text|file=naat.txt
  // $slug|file=naat.txt|My Text

  let result = cleanText.replace(/\$([A-Za-z0-9_-]+)(?:\|([^\n#£$]+))?/g, (_, slug: string, tail?: string) => {
    let displayText: string | undefined;
    let file: string | undefined;
    let type: 'song' | 'poem' | undefined = undefined;

    if (tail) {
      // Split on | and parse key=value or positional text
      tail.split('|').map(part => part.trim()).forEach(part => {
        if (!part) return;
        const kv = part.split('=');
        if (kv.length === 2) {
          const key = kv[0].trim().toLowerCase();
          const val = kv[1].trim();
          if (key === 'file' && val) file = val;
          if (key === 'text' && val) displayText = val;
          if (key === 'type' && val) type = val as 'song' | 'poem';
        } else {
          // Positional text if no '=' present
          if (!displayText) displayText = part;
        }
      });
    }

        // Auto-detect type if not explicitly specified
        if (!type) {
          const author = getAuthorForPoem(slug);
          type = author !== 'Unknown Author' ? 'poem' : 'song';
        }
  // 1) In-app song links: $slug → <a ...>Title</a>
  // let result = cleanText.replace(/\$([\w-]+)/g, (_, slug, file?:string) => {
  
  const dataset = file && file.trim() ? file.trim() : (type === 'poem' ? undefined : 'ilahi.txt');
  
  let url: string;
  if (type === 'poem') {
    const author = getAuthorForPoem(slug);
    url = `/poems/${encodeURIComponent(author)}?poem=${encodeURIComponent(slug)}`;
    // url = `/poems/${encodeURIComponent(author)}#${encodeURIComponent(slug)}`;
  } else {
    url = `/player/${encodeURIComponent(slug)}${dataset ? `?file=${encodeURIComponent(dataset)}` : ''}`;
  }
    
  
  // const dataset = file && file.trim() ? file.trim() : 'ilahi.txt';
    // const url = `/player/${encodeURIComponent(slug)}?file=${encodeURIComponent(dataset)}`
    // const url = `/player/${encodeURIComponent(slug)}`;

    // Prefer explicit text, then song title if available, else slug

    const song = songStore.songs.find(s => s.slug === slug);
    const linkText = displayText ?? (song ? song.title : slug);
    // const displayText = song ? song.title : slug;
    return `<a href="${url}" class="hyperlink btn btn-xs btn-primary normal-case font-bold" data-url="${url}" data-slug="${slug}" aria-label="Navigate to ${linkText}" tabindex="0">${DOMPurify.sanitize(linkText)}</a>`;

    
    // return `<a href="${url}" class="hyperlink music-link font-bold" data-url="${url}" data-slug="${slug}" aria-label="Navigate to ${displayText}" tabindex="0">${displayText}</a>`;
  });

  // 2) External/custom links: £url|Text or £url (text optional, shows domain if no text)
  // Examples: £https://example.com|Visit site  OR  £https://example.com

  result = result.replace(/£([^\s|]+)(?:\|([^£#]+))?/g, (_, rawUrl: string, linkText?: string) => {
    const safeUrl = DOMPurify.sanitize(rawUrl);
    const text = (linkText ? DOMPurify.sanitize(linkText) : safeUrl.replace(/^https?:\/\//, ''));
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="external-link link link-primary">${text}</a>`;
  });

  // 3) Bold spans: ##bold text##
  result = result.replace(/##([^#]+)##/g, (_, bold: string) => {
    return `<strong>${DOMPurify.sanitize(bold)}</strong>`;
  });

  return result;
};



// export const parseHyperlinks = (text: string): string => {
//   const cleanText = DOMPurify.sanitize(text);
//     return cleanText.replace(/\$([\w-]+)/g, (_, slug) => {
//       return `<a href="/player/${encodeURIComponent(slug)}">${slug}</a>`;
//     });
    // Determine the type of content based on the target
    // const isBook = target.startsWith('book-'); // Example: $book-ilahi-book-1
    // const isZikr = target.startsWith('zikr-'); // Example: $zikr-hu

    // Set the correct route based on the content type
    // const route = isBook ? `/books/${target.replace('book-', '')}` :
                //  isZikr ? `/zikr/${target.replace('zikr-', '')}` :
                //  `/player/${target}`;

    // return `<a href="${route}" class="hyperlink" data-slug="${target}" aria-label="Navigate to ${target}" tabindex="0">${target}</a>`;
  // });
// };




export const setupHyperlinkNavigation = () => {
  const { navigateToContent } = useHyperlinkNavigation();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('hyperlink')) {
      e.preventDefault();
      const url = target.getAttribute('data-url');
      if (url) {
        navigateToContent(url);
      }
    }
  });
};

// Add this function to get author for a poem slug
function getAuthorForPoem(slug: string): string {
  const poemStore = usePoemStore();
  for (const author of poemStore.authors) {

  // for (const author of cachedPoemData) {
    const foundPoem = author.poems.find((poem: any) => poem.slug === slug);
    if (foundPoem) {
      return author.name;
    }
  }
  return 'Unknown Author';
}
