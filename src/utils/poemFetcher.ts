import { Poem, processPoems } from './poemProcessor';

interface Author {
  name: string;
  poems: Poem[];
}

export async function fetchAllPoems(forceRefresh = false): Promise<Author[]> {
  console.log('🔍 fetchAllPoems called, forceRefresh:', forceRefresh);
  const owner = 'yashineonline';
  const repo = 'ilahiRepository';
  const directory = 'poems'; // Directory where poem files are stored
  const authors: Author[] = [];
  const CACHE_KEY = 'v1_cachedPoems'; // Cache key with version

  // Check if cached data exists
  if (!forceRefresh) {
  const cachedPoems = localStorage.getItem(CACHE_KEY);
  if (cachedPoems) {
    console.log('�� Using cached poems data');
    return JSON.parse(cachedPoems); // Return cached data
  }
  }


  const directoryUrl = `https://api.github.com/repos/${owner}/${repo}/contents/poems`;

  console.log('�� Fetching directory listing from GitHub API...');

  const directoryResponse = await fetch(directoryUrl);
  
  if (!directoryResponse.ok) {
    throw new Error(`Failed to fetch directory listing: ${directoryResponse.status}`);
  }

  const directoryData = await directoryResponse.json();
  
  console.log('�� Raw directory data:', directoryData);

  
  // Filter for poem-*.txt files and extract file numbers
  const poemFiles = directoryData
    .filter((file: any) => file.name.match(/^poem-\d+\.txt$/))
    .map((file: any) => {
      const match = file.name.match(/^poem-(\d+)\.txt$/);
      return match ? parseInt(match[1]) : null;
    })
    .filter((num: number | null) => num !== null)
    .sort((a: number, b: number) => a - b);

  console.log('Found poem files:', poemFiles);

  // Now fetch only the existing files
  for (const fileNumber of poemFiles) {
    const path = `poem-${fileNumber}.txt`;
    const base = `https://raw.githubusercontent.com/${owner}/${repo}/main/poems/`;
    const cacheBust = forceRefresh ? `?t=${Date.now()}` : '';
    const url = `${base}${path}${cacheBust}`;

  // for (let i = 1; i <= 17; i += 1) {
  //   const path = `poem-${i}.txt`;
    // const url = `https://api.github.com/repos/${owner}/${repo}/contents/${directory}/${path}`;

    // const base = `https://raw.githubusercontent.com/${owner}/${repo}/main/${directory}/`
    // const base = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/`
    
          // const cacheBust = forceRefresh ? `?t=${Date.now()}` : '';
          //  const url = `${base}${path}${cacheBust}`
    // const response = await fetch(url, { cache: 'no-store' })
    



    try {
      const response = await fetch(url, { cache: 'no-store' });
        // headers: {
          // 'Accept': 'application/vnd.github.v3.raw'
        // }
      // });

      if (!response.ok) {
        console.error(`Error fetching ${path}: ${response.status}`);
        // if (response.status === 404) {
          continue;
        }
        // throw new Error(`HTTP error! status: ${response.status}`);
      // }

      const text = await response.text();
      const lines = text.split('\n');
      const authorName = lines[0].trim();
      const poemContent = lines.slice(1).join('\n');

      const poems = processPoems(poemContent, authorName); // Pass authorName here
      authors.push({ name: authorName, poems });

    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      // console.error(`Error fetching poem-${i}.txt:`, error);
      // break;
    }
  
  } 
  // catch (error) {
    // console.error('Error fetching directory listing:', error);
    // Fallback to old method if API fails
    // return fetchAllPoemsFallback(forceRefresh);
  // }
// Cache the fetched data
localStorage.setItem(CACHE_KEY, JSON.stringify(authors));

  return authors;
}