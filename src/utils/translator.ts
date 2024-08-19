import axios from 'axios';

export async function translateText(text: string): Promise<string> {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Translate the following Turkish text to English: "${text}"`,
      max_tokens: 60,
      n: 1,
      stop: null,
      temperature: 0.5,
    }, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Translation error:', error);
    return 'Translation error';
  }
}
