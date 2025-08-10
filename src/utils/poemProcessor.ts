import { slugify } from './search';

export interface Poem {
  title: string;
  content: string[];
  slug: string;
  authorName: string;
}

export function processPoems(fileContent: string, authorName: string): Poem[] {
  const lines = fileContent.split('\n');
  const poems: Poem[] = [];
  let currentPoem: Poem | null = null;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('P:')) {
      if (currentPoem) {
        poems.push(currentPoem);
      }
      const title = trimmedLine.substring(2).trim();
      currentPoem = { 
        title, 
        content: [], 
        slug: slugify(title), // Simple title slug
        authorName // Store author name in the poem object
      };
    } else if (currentPoem) {
      if (trimmedLine === '') {
        currentPoem.content.push(''); // Add empty line to preserve paragraphs
      } else {
        currentPoem.content.push(trimmedLine);
      }
    }
  });

  if (currentPoem) {
    poems.push(currentPoem);
  }

  return poems;
}