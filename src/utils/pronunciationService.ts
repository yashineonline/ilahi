// import { SongData } from '../utils/types.ts';

// Language-specific phonetic mappings
const languagePhonetics: Record<string, Record<string, string>> = {
  english: {
    // 'ğ': 'gh',
    'ç': 'ch',
    'ş': 'sh',
    'ı': 'er',
    'ö': 'er',
    'ü': 'ue',
    // 'â': 'aa',
    // 'î': 'ee',
    'u': 'oo',
    'e-': 'eh-',
    'a-': 'ah-',
    'i': 'ee',
    'er':'err',
  },
  french: {
    // 'ğ': 'gh',
    'ç': 'tch',
    'ş': 'sh',
    'ı': 'eu',
    'ö': 'euh',
    // 'ü': 'u',
    // 'â': 'â',
    // 'î': 'î',
    'u': 'ou',
    'e-': 'é-',
    'j': 'dj',

  },
  german: {
    // 'ğ': 'gh',
    'ç': 'tsch',
    'ş': 'sch',
    'ı': 'ih',
    'ö': 'ö',
    'ü': 'ü',
    // 'â': 'ah',
    // 'î': 'ie',
    'u': 'uh',
    // Rule: e followed by - becomes eh
    'e-': 'eh',
    // Rule: a followed by - becomes ah
    'a-': 'ah',
    // Rule: i followed by - becomes ie
    'i-': 'ie',
  },
  spanish: {
    // 'ğ': 'g',
    'ç': 'ch',
    'ş': 'sh',
    'ı': 'i',
    'ö': 'oe',
    'ü': 'ue',
    // 'â': 'a',
    // 'î': 'i',
    // 'û': 'u',
    // Rule: e followed by - becomes eh
    'e-': 'eh',
    // Rule: a followed by - becomes ah
    'a-': 'ah',
    // Rule: i followed by - becomes í
    'i-': 'í',
  },
};

// Get the user's selected language from localStorage
export function getSelectedLanguage(): string | null {
  const language = localStorage.getItem('selectedLanguage');
  // console.log('Retrieved selected language:', language);
  return language;
}

// Set the user's selected language in localStorage
export function setSelectedLanguage(language: string): void {
  // console.log('Setting selected language:', language);
  localStorage.setItem('selectedLanguage', language);
}

// Reset the user's language choice
export function resetLanguageChoice(): void {
  // console.log('Resetting language choice');
  localStorage.removeItem('selectedLanguage');
}

// Apply language-specific phonetic replacements
export function applyPhoneticReplacements(text: string, language?: string): string {
  const selectedLanguage = language || getSelectedLanguage() || 'english'; // Add default fallback
  const phoneticMap = languagePhonetics[selectedLanguage as keyof typeof languagePhonetics] || languagePhonetics.english;
  
  // const selectedLanguage = language || getSelectedLanguage();
  // console.log('Applying phonetic replacements for language:', selectedLanguage);
  // const phoneticMap = languagePhonetics[selectedLanguage] || languagePhonetics.english;

   // Step 1: Replace letter combinations (e.g., 'e-' → 'eh')
   let replacedText = text;
   for (const [key, value] of Object.entries(phoneticMap)) {
     if (key.length > 1) { // Only process multi-character keys (e.g., 'e-')
       replacedText = replacedText.replace(new RegExp(key, 'g'), value);
     }
   }
 
   // Step 2: Replace individual characters (e.g., 'ç' → 'ch')
   return replacedText
     .split('')
     .map(char => {
       // Only replace individual characters if they are not part of a larger word
       const isPartOfWord = /[a-zA-Z]/.test(char); // Check if the character is part of a word
       return isPartOfWord ? char : (phoneticMap[char.toLowerCase()] || char);
     })
     .join('');

  
  // return text
  //   .split('')
  //   .map(char => phoneticMap[char.toLowerCase()] || char)
  //   .join('');
}

// Generate pronunciation guide with language-specific replacements
export async function generatePronunciation(lyrics: string[][]): Promise<string> {
  try {
    // console.log('Generating pronunciation guide');
    // console.log('Lyrics:', lyrics); // Log the entire lyrics array
    // Find the pronunciation section
    const pronunciationIndex = lyrics.findIndex(stanza =>
      stanza.some(line => line.startsWith('Pronunciation:'))
    );

    if (pronunciationIndex === -1) {
      // console.log('No pronunciation section found. Lyrics:', lyrics);
      return ''; // No pronunciation section found
    }

    // console.log('Pronunciation section found at index:', pronunciationIndex);
    // Extract the pronunciation stanzas
    const pronunciationStanzas = lyrics.slice(pronunciationIndex + 1);

    const selectedLanguage = getSelectedLanguage() || undefined; // Convert null to undefined
    const replacedStanzas = pronunciationStanzas.map(stanza =>
      stanza.map(line => applyPhoneticReplacements(line, selectedLanguage))
    );

    // const selectedLanguage = getSelectedLanguage();
    // console.log('Applying phonetic replacements for language:', selectedLanguage);
    // const replacedStanzas = pronunciationStanzas.map(stanza =>
      // stanza.map(line => applyPhoneticReplacements(line, selectedLanguage))
    // );

    // Format the pronunciation guide
    let pronunciationGuide = '<div class="pronunciation-guide">';
    replacedStanzas.forEach((stanza, stanzaIndex) => {
      pronunciationGuide += '<div class="stanza-guide">';
      stanza.forEach(line => {
        pronunciationGuide += `
          <div class="line-guide">
            <div class="phonetic">${line}</div>
          </div>
        `;
      });
      pronunciationGuide += '</div>';
    });
    pronunciationGuide += '</div>';
    // console.log('Pronunciation guide generated successfully');
    return pronunciationGuide;
  } catch (error) {
    console.error('Error generating pronunciation:', error);
    throw new Error('Failed to generate pronunciation guide');
  }
}



