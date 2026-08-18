import axios from 'axios';

/**
 * Evaluates text for toxicity, self-harm, hate speech, and harassment using OpenAI Moderation API.
 */
export async function checkOpenAiModeration(text) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'mock_openai_key') {
    const lower = text.toLowerCase();
    const isBullying =
      lower.includes('trash') ||
      lower.includes('loser') ||
      lower.includes('kill yourself') ||
      lower.includes('hate you') ||
      lower.includes('uninstall and die');

    const isPiiHarvest =
      lower.includes('where do you live') ||
      lower.includes('what street') ||
      lower.includes('your address') ||
      lower.includes('send your phone number') ||
      lower.includes('whatsapp number');

    if (isBullying) {
      return {
        flagged: true,
        threatType: 'HARASSMENT',
        score: 0.92,
        reason: 'Severe verbal harassment and bullying detected in chat stream.',
      };
    }

    if (isPiiHarvest) {
      return {
        flagged: true,
        threatType: 'PII_LEAK',
        score: 0.89,
        reason: 'Stranger soliciting private geolocation or contact details.',
      };
    }

    return { flagged: false, threatType: 'NONE', score: 0.02, reason: null };
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/moderations',
      { input: text },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 3500,
      }
    );

    const result = response.data.results[0];
    if (result.flagged) {
      let mainCategory = 'TOXICITY';
      if (result.categories.harassment) mainCategory = 'HARASSMENT';
      else if (result.categories['hate']) mainCategory = 'HATE_SPEECH';
      else if (result.categories['self-harm']) mainCategory = 'SELF_HARM';

      return {
        flagged: true,
        threatType: mainCategory,
        score: Math.max(...Object.values(result.category_scores)),
        reason: `OpenAI Moderation flagged category: ${mainCategory}`,
      };
    }

    return { flagged: false, threatType: 'NONE', score: 0.0, reason: null };
  } catch (error) {
    console.error('OpenAI Moderation Error:', error.message);
    return { flagged: false, threatType: 'NONE', score: 0.0, reason: null };
  }
}
