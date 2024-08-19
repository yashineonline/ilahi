import axios from 'axios';

export async function translateText(text: string): Promise<string> {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a translator. Translate the given text from Turkish to English." },
        { role: "user", content: text }
      ],
      max_tokens: 100,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation error:', error);
    return 'Translation error';
  }
}