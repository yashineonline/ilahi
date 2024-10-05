import { Poem, processPoems } from './poemProcessor';

interface Author {
  name: string;
  poems: Poem[];
}

export async function fetchAllPoems(): Promise<Author[]> {
  const owner = 'yashineonline';
  const repo = 'ilahiRepository';
  const authors: Author[] = [];

  for (let i = 1; ; i++) {
    const path = `poem-${i}.txt`;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No more poem files found
          break;
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

  return authors;
}