import { SongData } from './types.ts';
import { ParsedZikr} from "../stores/songStore";  

// export function parseZikrLine(line: string): { suggestedZikrs: string[] } {
   
//     // Remove 'Category:' prefix and trim
//     const content = line.replace(/^SuggestedZikr:/, '').trim();
    
//     // Process categories
//     let suggestedZikrs: string[] = [];

    
//     if (content) {
//       const suggestedZikrs = content.split(',')
//       .map(cat => cat.trim())
//       .filter(cat => cat !== '');
//       console.log('suggested Zikr:', suggestedZikrs);      }  
  
//     return { suggestedZikrs };
//   }

export function parseZikrLine(line: string): { suggestedZikrs: string[] } {
  const content = line.replace(/^SuggestedZikr:/i, '').trim(); // Added case-insensitive flag
  
  if (!content) return { suggestedZikrs: [] };

  return {
      suggestedZikrs: content.split(',')
          .map(z => z.trim())
          .filter(z => z !== '')
  };
}  