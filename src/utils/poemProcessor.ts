import { slugify } from './search';

export interface Poem {
  title: string;
  content: string[];
  slug: string;
}

export function processPoems(fileContent: string): Poem[] {
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
      currentPoem = { title, content: [], slug: slugify(title) };
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