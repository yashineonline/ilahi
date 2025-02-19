import { slugify } from './search.ts';
import { useHyperlinkNavigation } from '@/composables/useHyperlinkNavigation.ts';
import DOMPurify from 'dompurify';



export const parseHyperlinks = (text: string): string => {
  console.log('Input text:', text); // Add this
  const cleanText = DOMPurify.sanitize(text);
  const result = cleanText.replace(/\$([\w-]+)/g, (_, slug) => {
    const url = `/player/${encodeURIComponent(slug)}`;
    return `<a href="${url}" class="hyperlink" data-url="${url}" aria-label="Navigate to ${slug}" tabindex="0">${slug}</a>`;
  });
  console.log('Output HTML:', result); // Add this
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
    // if (target.matches('.hyperlink')) {

    if (target.classList.contains('hyperlink')) {
      e.preventDefault();
      const url = target.getAttribute('data-url'); // Use data-url instead of href
      if (url) {

      // const href = target.getAttribute('href');
      // if (href && href.startsWith('/player/')) {
        navigateToContent(url); // Pass the correct URL
      }   
    }
  });
};
