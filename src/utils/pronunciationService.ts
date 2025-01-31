// import OpenAI from 'openai'
import { SongData } from './types'

const phoneticMap: Record<string, string> = {
  // Turkish Characters
  'ğ': 'gh',
  'ç': 'ch',
  'ş': 'sh',
  'ı': 'uh',
  'ö': 'o',
  'ü': 'u',
  'â': 'aa',
  'î': 'ee',
  'û': 'oo',
  
  // Arabic Characters
  // 'ع': '`',
  // 'ح': 'h',
  // 'خ': 'kh',
  // 'ق': 'q',
  // 'ص': 's',
  // 'ط': 't',
  // 'ض': 'd',
  // 'ظ': 'z',
  // 'ذ': 'th',
  // 'ث': 'th',
};

// Detailed explanations for pronunciation tips
const pronunciationDetails = {
  'ğ': 'silent, lengthens previous vowel',
  'ç': 'as in "chair"',
  'ş': 'as in "ship"',
  'ı': 'deep throat sound',
  'ö': 'as in "bird"',
  'ü': 'as in "tune"',
  'â': 'long a',
  'î': 'long e',
  'û': 'long u',
  'ع': 'deep throat sound',
  'ح': 'heavy h from throat',
  'خ': 'as in "Bach"',
  'ق': 'deep k sound',
  'ص': 'heavy s',
  'ط': 'heavy t',
  'ض': 'heavy d',
  'ظ': 'heavy z',
  'ذ': 'as in "this"',
  'ث': 'as in "think"',
};

// Pronunciation rules for common patterns
const pronunciationRules = [
  {
    pattern: /allah/gi,
    guide: 'Al-lah (emphasis on both syllables)',
  },
  {
    pattern: /bismillah/gi,
    guide: 'Bis-mil-lah (three syllables)',
  },
  {
    pattern: /rahman/gi,
    guide: 'Rah-maan (emphasis on second syllable)',
  },
  {
    pattern: /rahim/gi,
    guide: 'Ra-heem (emphasis on second syllable)',
  },
  {
    pattern: /subhan/gi,
    guide: 'Sub-haan (emphasis on second syllable)',
  },
  {
    pattern: /hu/gi,
    guide: 'hoo (long o sound)',
  },
];

function splitIntoSyllables(word: string): string {
  if (word.length <= 2 || word.includes('<em')) {
    return word;
  }

  // Define vowels including Turkish ones
  const vowels = 'aeiouıöüâîû';
  
  // Common prefixes and suffixes
  const prefixes = ['ab', 'el', 'al', 'ül'];
  const suffixes = ['ül', 'ul', 'il', 'ın', 'un', 'ün'];
  
  // Special cases
  for (const prefix of prefixes) {
    if (word.toLowerCase().startsWith(prefix)) {
      return prefix + '-' + splitIntoSyllables(word.slice(prefix.length));
    }
  }
  
  for (const suffix of suffixes) {
    if (word.toLowerCase().endsWith(suffix)) {
      return splitIntoSyllables(word.slice(0, -suffix.length)) + '-' + suffix;
    }
  }
  
  // Handle common patterns
  let syllables = word
    .replace(/([${vowels}])([^${vowels}][${vowels}])/gi, '$1-$2')  // Split between vowel and consonant-vowel
    .replace(/([^${vowels}])([^${vowels}][${vowels}])/gi, '$1-$2'); // Split between consonant clusters
    
  return syllables;
}

export async function generatePronunciation(lyrics: string[][]): Promise<string> {
  try {
    console.log("Original lyrics array:", lyrics); // Debug log 1

    const lyricsWithoutMetadata = lyrics.filter(stanza => 
      !stanza.some(line => 
        line.startsWith('History:') || 
        line.startsWith('Translation:')
      )
    );
    
    console.log("Filtered lyrics:", lyricsWithoutMetadata); // Debug log 2
    
    let pronunciationGuide = '<div class="pronunciation-guide">';
    
    // Find the pronunciation section
    const pronunciationIndex = lyricsWithoutMetadata.findIndex(stanza =>
      stanza.some(line => line.startsWith('Pronunciation:'))
    );

    console.log("Pronunciation index:", pronunciationIndex); // Debug log 3

    if (pronunciationIndex !== -1) {
      console.log("Found pronunciation section!"); // Debug log 4
      // Use the pre-written pronunciation
      const pronunciationStanzas = lyricsWithoutMetadata.slice(pronunciationIndex + 1);
      console.log("Pronunciation stanzas:", pronunciationStanzas); // Debug log 5
      
      pronunciationStanzas.forEach((stanza, stanzaIndex) => {
        pronunciationGuide += '<div class="stanza-guide">';
        
        stanza.forEach(line => {
          pronunciationGuide += `
            <div class="line-guide">
              <div class="phonetic">${line}</div>
            </div>
          `;
        });
        
        pronunciationGuide += '</div>';
        
        if (stanzaIndex < pronunciationStanzas.length - 1) {
          pronunciationGuide += '<div class="stanza-break"></div>';
        }
      });
    } else {
      // Fall back to the original character-by-character mapping
      // Process each stanza
      lyricsWithoutMetadata.forEach((stanza, stanzaIndex) => {
        pronunciationGuide += '<div class="stanza-guide">';
        
        // Process each line in the stanza
        stanza.forEach(line => {
          // Skip lines that are metadata markers
          if (line.startsWith('Pronunciation:')) {
            return;
          }

          let phonetic = line;
          
          // Apply special pronunciation rules first
          pronunciationRules.forEach(({pattern, guide}) => {
            phonetic = phonetic.replace(pattern, (match) => 
              `<strong class="special-rule" title="${guide}">${match}</strong>`
            );
          });
          
          // Apply character-by-character phonetic mapping
          Object.entries(phoneticMap).forEach(([letter, sound]) => {
            phonetic = phonetic.replace(
              new RegExp(letter, 'g'), 
              `<strong class="phonetic-char" title="${letter} = ${sound}">${sound}</strong>`
            );
          });
          
          // Split words into syllables
          const words = phonetic.split(' ');
          const phoneticWithSyllables = words.map(word => splitIntoSyllables(word)).join(' ');
          
          pronunciationGuide += `
            <div class="line-guide">
              <div class="original">${line}</div>
              <div class="phonetic">${phoneticWithSyllables}</div>
            </div>
          `;
        });
        
        pronunciationGuide += '</div>';
        
        // Add spacing between stanzas
        if (stanzaIndex < lyricsWithoutMetadata.length - 1) {
          pronunciationGuide += '<div class="stanza-break"></div>';
        }
      });
      
      // Add detailed pronunciation tips at the end
      pronunciationGuide += `
        <div class="pronunciation-tips mt-4">
          <h3 class="text-lg font-bold mb-2">Pronunciation Tips:</h3>
          <ul class="list-disc pl-4">
            <li>Emphasis is usually on the last syllable of words</li>
            <li>Dashes (-) indicate syllable breaks</li>
            <h4 class="font-semibold mt-2 mb-1">Special Characters:</h4>
            ${Object.entries(pronunciationDetails)
              .map(([letter, explanation]) => 
                `<li>${letter} = ${phoneticMap[letter]} (${explanation})</li>`
              )
              .join('')}
          </ul>
        </div>
      </div>`;
    }

    pronunciationGuide += '</div>';
    return pronunciationGuide;
  } catch (error) {
    console.error('Error generating pronunciation:', error);
    throw new Error('Failed to generate pronunciation guide');
  }
}