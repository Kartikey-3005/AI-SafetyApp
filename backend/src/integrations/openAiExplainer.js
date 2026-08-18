import axios from 'axios';

/**
 * Synthesizes an empathetic, child-friendly explanation for a 10-year-old on why content was blocked.
 */
export async function generateChildFriendlyExplanation({ content, threatType, reason }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'mock_openai_key') {
    switch (threatType) {
      case 'PHISHING':
        return '🛡️ "Hold on! That link leads to a fake website trying to steal your Roblox password. There is no such thing as free game currency generators. We blocked the link so your account stays 100% safe!"';
      case 'PII_LEAK':
        return '🛡️ "Hey there! We paused this message because sharing your real home address or school with people online isn\'t safe. Real friends will never ask you to meet up secretly for game codes! Keep your private details locked."';
      case 'HARASSMENT':
      case 'TOXICITY':
        return '🛡️ "We hid some mean comments on this chat. Remember: hurtful words from internet strangers do not define you! You\'re doing great, and we keep toxic comments away."';
      case 'MALWARE':
        return '🛡️ "We stopped an unauthorized file download (.exe). Downloading unknown files from chat servers can infect your computer with viruses or steal account logins."';
      default:
        return '🛡️ "SafeKids AI paused this item to ensure your digital space remains safe, friendly, and private."';
    }
  }

  try {
    const prompt = `
You are the voice of "Aegis", a friendly Cyber Guardian Pet in a cyber safety app for children aged 9 to 12.
A piece of online content was just blocked.
- Blocked Content/Context: "${content}"
- Threat Category: ${threatType}
- Technical Diagnostic: ${reason}

Write a short (1-2 sentences), warm, and encouraging explanation speaking directly to the child.
- Tone: Empathetic, supportive, educational (do NOT shame or induce fear).
- Start with a suitable emoji (🛡️, ⚠️, 💡).
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120,
        temperature: 0.6,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 4000,
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Explainer Error:', error.message);
    return '🛡️ "We paused this item to keep your account and personal privacy safe."';
  }
}
