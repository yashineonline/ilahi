import { slugify } from './search.ts';
import { useHyperlinkNavigation } from '@/composables/useHyperlinkNavigation.ts';
import DOMPurify from 'dompurify';
import { useSongStore } from '@/stores/songStore.ts';



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

  // 1) In-app song links: $slug → <a ...>Title</a>
  let result = cleanText.replace(/\$([\w-]+)/g, (_, slug) => {
    const url = `/player/${encodeURIComponent(slug)}`;
    const song = songStore.songs.find(s => s.slug === slug);
    const displayText = song ? song.title : slug;
    return `<a href="${url}" class="hyperlink music-link font-bold" data-url="${url}" data-slug="${slug}" aria-label="Navigate to ${displayText}" tabindex="0">${displayText}</a>`;
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
