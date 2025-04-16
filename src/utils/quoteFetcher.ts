import { Quote, AuthorQuotes } from './types';

  
  export async function fetchAllQuotes(): Promise<AuthorQuotes[]> {
    const owner = 'yashineonline';
    const repo = 'ilahiRepository';
    const directory = 'quotes'; 
    const authors: AuthorQuotes[] = [];
    const CACHE_KEY = 'v2_cachedQuotes'; // Cache key with version

  
// Check if cached data exists
const cachedQuotes = localStorage.getItem(CACHE_KEY);
if (cachedQuotes) {
  return JSON.parse(cachedQuotes); // Return cached data
}

    for (let i = 1; ; i++) {
      const path = `quote-${i}.txt`;
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${directory}/${path}`;
  
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        });
  
        if (!response.ok) {
          if (response.status === 404) {
            // No more quote files found
            break;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const text = await response.text();
        const lines = text.split('\n');
        const authorName = lines[0].trim();
        const quotes = lines.slice(1).filter(line => line.trim() !== '').map(line => ({ text: line.trim() }));
  
        authors.push({ name: authorName, quotes });
  
      } catch (error) {
        console.error(`Error fetching quote-${i}.txt:`, error);
        break;
      }
    }

    // Cache the fetched data
localStorage.setItem(CACHE_KEY, JSON.stringify(authors));

  
    return authors;
  }