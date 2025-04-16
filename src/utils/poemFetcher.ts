import { Poem, processPoems } from './poemProcessor';

interface Author {
  name: string;
  poems: Poem[];
}

export async function fetchAllPoems(): Promise<Author[]> {
  const owner = 'yashineonline';
  const repo = 'ilahiRepository';
  const directory = 'poems'; // Directory where poem files are stored
  const authors: Author[] = [];
  const CACHE_KEY = 'v1_cachedPoems'; // Cache key with version

  // Check if cached data exists
  const cachedPoems = localStorage.getItem(CACHE_KEY);
  if (cachedPoems) {
    return JSON.parse(cachedPoems); // Return cached data
  }

  for (let i = 1; i <= 15; i += 1) {
    const path = `poem-${i}.txt`;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${directory}/${path}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const lines = text.split('\n');
      const authorName = lines[0].trim();
      const poemContent = lines.slice(1).join('\n');

      const poems = processPoems(poemContent);
      authors.push({ name: authorName, poems });

    } catch (error) {
      console.error(`Error fetching poem-${i}.txt:`, error);
      break;
    }
  }
// Cache the fetched data
localStorage.setItem(CACHE_KEY, JSON.stringify(authors));

  return authors;
}