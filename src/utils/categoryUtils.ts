import { SongData } from './types.ts';

export const CATEGORIES = {
  BASIC: 'Basic (Zikr order)',
  INTERMEDIATE: 'Intermediate',
};

let subcategories: Record<string, string[]> = {};

export const setSubcategories = (newSubcategories: Record<string, string[]>) => {
  subcategories = newSubcategories;
};

export const getSubcategories = () => subcategories;

type CategoryShortcut = [string, string]; // [mainCategory, subCategory]

export const categoryShortcuts: Record<string, CategoryShortcut> = {
  "sbt": ["Sung By", "Shaykh Taner and Shaykha Muzeyyen"],
  "sbm": ["Sung By", "Shaykh Muhyiddin"],
};

export const turkishToEnglish = (str: string) => {
  const map: { [key: string]: string } = {
    ç: "c", ğ: "g", ı: "i", î: "i", ö: "o", ş: "s", ü: "u",
    Ç: "C", Ğ: "G", İ: "I", Î: "I", Ö: "O", Ş: "S", Ü: "U",
  };
  return str.replace(/[çğıöşüÇĞİÖŞÜ]/g, (letter) => map[letter] || letter);
};

export const normalizeCategory = (category: string) => {
  return turkishToEnglish(category.trim().toLowerCase());
};

export const filterSongsByCategory = (songs: SongData[], categories: string[]): SongData[] => {
  if (categories.length === 0 || categories.includes('All')) return songs;
 
  // Special handling for Basic category
  if (categories.length === 1 && categories[0] === CATEGORIES.BASIC) {
    // Only return songs that have an order number, sorted by order
    return songs
      .filter(song => 
        typeof song.order === 'number' && 
        song.categories.some(cat => normalizeCategory(cat).includes('basic'))
      )
      .sort((a, b) => a.order! - b.order!);
  }
 
 // Normal filtering for other categories
 const filteredSongs = songs.filter((song) => 
  categories.some((category) => {
    const normalizedCategory = normalizeCategory(category);
    if (normalizedCategory === 'intermediate') {
      return song.categories.some(songCategory => 
          normalizeCategory(songCategory).includes('basic') ||
        normalizeCategory(songCategory).includes('inter')
      );
    }
    if (Object.keys(subcategories).includes(category)) {
      return subcategories[category].some((subCategory) => 
        song.categories.some((songCategory) => 
          normalizeCategory(songCategory).includes(normalizeCategory(subCategory))
        )
      );
    }
    return song.categories.some((songCategory) => 
      normalizeCategory(songCategory) === normalizedCategory ||
      normalizeCategory(songCategory).includes(normalizedCategory)
    );
  })
);

 // Sort alphabetically for non-Basic categories
 return filteredSongs.sort((a, b) => 
  turkishToEnglish(a.title.toLowerCase()).localeCompare(turkishToEnglish(b.title.toLowerCase()))
);
};
 
//   const filteredSongs = songs.filter((song) => 
//   // return songs.filter((song) => 
//     categories.some((category) => {
//       const normalizedCategory = normalizeCategory(category);
//       if (normalizedCategory === 'basic') {
//                 // Extract Order value if it exists in categories
//         // const orderCategory = song.categories.find(cat => cat.trim().startsWith('Order:'));
//         // if (orderCategory) {
//         //   song.order = parseInt(orderCategory.split(':')[1], 10);
//         // }
//         return song.categories.some(songCategory => 
//             normalizeCategory(songCategory).includes('basic')
//         );
//       }
//       if (normalizedCategory === 'intermediate') {
//         return song.categories.some(songCategory => 
//             normalizeCategory(songCategory).includes('basic') ||
//           normalizeCategory(songCategory).includes('inter')
//         );
//       }
//       if (Object.keys(subcategories).includes(category)) {
//         return subcategories[category].some((subCategory) => 
//           song.categories.some((songCategory) => 
//             normalizeCategory(songCategory).includes(normalizeCategory(subCategory))
//           )
//         );
//       }
//       return song.categories.some((songCategory) => 
//         normalizeCategory(songCategory) === normalizedCategory ||
//         normalizeCategory(songCategory).includes(normalizedCategory)
//       );
//     })
//   );
//    // Sort by order if basic category is selected
//    if (categories.length === 1 && categories[0] === CATEGORIES.BASIC 
//     // && filteredSongs.some(song => song.order !== undefined)
//   ) {
// // Filter songs with order
// const songsWithOrder = filteredSongs.filter(song => typeof song.order === 'number');
// const songsWithoutOrder = filteredSongs.filter(song => typeof song.order !== 'number');

// // Sort songs with order
// const sortedSongsWithOrder = songsWithOrder.sort((a, b) => a.order! - b.order!);

// // Sort songs without order alphabetically
// const sortedSongsWithoutOrder = songsWithoutOrder.sort((a, b) => 
//   turkishToEnglish(a.title.toLowerCase()).localeCompare(turkishToEnglish(b.title.toLowerCase()))
// );

// // Return ordered songs first, then alphabetically sorted unordered songs
// return [...sortedSongsWithOrder, ...sortedSongsWithoutOrder];
// }

// // For all other categories, sort alphabetically
// return filteredSongs.sort((a, b) => 
// turkishToEnglish(a.title.toLowerCase()).localeCompare(turkishToEnglish(b.title.toLowerCase()))
// );
// };

//     return filteredSongs.sort((a, b) => (a.order || 999999) - (b.order || 999999));
//   }

//   return filteredSongs;
// };


export const getSortedSubcategories = (subcategories: Record<string, string[]>) => {
  const sorted: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(subcategories)) {
    sorted[key] = value.sort((a, b) => turkishToEnglish(a.toLowerCase()).localeCompare(turkishToEnglish(b.toLowerCase()))
  );
  }
  return sorted;
};

export const processShortcuts = (subcategories: Record<string, string[]>) => {
  const processedCategories: Record<string, string[]> = { ...subcategories };
  const processedShortcuts: Record<string, string> = {};

  Object.entries(categoryShortcuts).forEach(([shortcut, [mainCategory, subCategory]]) => {
    if (!processedCategories[mainCategory]) {
      processedCategories[mainCategory] = [];
    }
    if (!processedCategories[mainCategory].includes(subCategory)) {
      processedCategories[mainCategory].push(subCategory);
    }
    processedShortcuts[shortcut] = subCategory;
  });

  return { processedCategories, processedShortcuts };
};

export const getMainCategories = (allCategories: string[]) => {
  const orderedCategories = ['All', CATEGORIES.BASIC, 'Pirs', 'Pen Name'];
  const otherMainCategories = Object.keys(subcategories).filter(cat => !orderedCategories.includes(cat));
  const standaloneCategories = allCategories.filter(cat => 
    !orderedCategories.includes(cat) && 
    !otherMainCategories.includes(cat) &&
    cat !== CATEGORIES.BASIC
  );
  
  return [
    ...orderedCategories,
    ...otherMainCategories.sort((a, b) => turkishToEnglish(a.toLowerCase()).localeCompare(turkishToEnglish(b.toLowerCase()))),
    ...standaloneCategories.sort((a, b) => turkishToEnglish(a.toLowerCase()).localeCompare(turkishToEnglish(b.toLowerCase())))
  ];
};

interface ParsedCategory {
  categories: string[];
  tags: string[];
  order?: number;
}

export function parseCategoryLine(line: string): ParsedCategory {
  // Handle empty or undefined cases
  if (!line || line.trim() === 'Category:') {
    return { categories: [], tags: [] };
  }

  // Remove 'Category:' prefix and trim
  const content = line.replace(/^Category:/, '').trim();
  
  // Split by vertical bar
  const [categoriesStr = '', tagsStr = ''] = content.split('|').map(s => s.trim());
  
  // Process categories
  let categories: string[] = [];
  let order: number | undefined;
  
  if (categoriesStr) {
    const categoryItems = categoriesStr.split(',').map(cat => cat.trim());
    // Extract order if present
    const orderItem = categoryItems.find(cat => cat.startsWith('Order:'));
    if (orderItem) {
      const orderValue = orderItem.split(':')[1];
      order = parseInt(orderValue, 10);
      categories = categoryItems
        .filter(cat => cat !== '' && !cat.startsWith('Order:'));
      // .map(cat => cat.trim());
    } else {
      categories = categoryItems.filter(cat => cat !== '');
    }
  }

  // Process tags
  const tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

  return { categories, tags, order };
}