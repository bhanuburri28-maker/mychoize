const { GoogleGenAI } = require('@google/genai');
const {
  GOOGLE_AI_STUDIO_API_KEY,
  GOOGLE_AI_STUDIO_MODEL,
  GOOGLE_AI_STUDIO_TEMPERATURE,
  GOOGLE_AI_STUDIO_MAX_OUTPUT_TOKENS,
  GOOGLE_AI_STUDIO_MAX_PROMPT_CHARS,
  GOOGLE_AI_STUDIO_REQUEST_TIMEOUT_MS,
} = require('../config/config');

const ai = GOOGLE_AI_STUDIO_API_KEY ? new GoogleGenAI({ apiKey: GOOGLE_AI_STUDIO_API_KEY }) : null;

const generateText = async (req, res, next) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ status: 'fail', message: 'Prompt is required.' });
  }

  if (!GOOGLE_AI_STUDIO_API_KEY) {
    return res.status(503).json({
      status: 'fail',
      message: 'Google AI Studio API key is not configured. Set GOOGLE_AI_STUDIO_API_KEY in your .env file.',
    });
  }

  const trimmedPrompt = prompt.trim().replace(/\s+/g, ' ');
  const promptText = trimmedPrompt.length > GOOGLE_AI_STUDIO_MAX_PROMPT_CHARS
    ? `${trimmedPrompt.slice(0, GOOGLE_AI_STUDIO_MAX_PROMPT_CHARS).trim()}...`
    : trimmedPrompt;

  try {
    const response = await ai.models.generateContent({
      model: GOOGLE_AI_STUDIO_MODEL || 'gemini-2.0-flash',
      contents: promptText,
      config: {
        temperature: GOOGLE_AI_STUDIO_TEMPERATURE,
        maxOutputTokens: GOOGLE_AI_STUDIO_MAX_OUTPUT_TOKENS,
      },
    });

    const output = response.text || response.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    return res.json({ status: 'success', data: { output } });
  } catch (error) {
    const statusCode = error?.status || error?.code || 500;
    const isQuotaIssue = statusCode === 429 || /quota|resource_exhausted|rate limit/i.test(error?.message || '');
    const isNetworkIssue = /ENOTFOUND|ECONNRESET|ECONNREFUSED|socket hang up|fetch failed|network/i.test(error?.message || '');
    const timeout = error?.code === 'ECONNABORTED' ? 'The AI request timed out.' : null;
    const message = timeout || (isQuotaIssue ? 'The AI service is temporarily unavailable because the provider quota has been exhausted. Please try again later.' : isNetworkIssue ? 'The AI service is temporarily unavailable due to a network/provider connectivity issue. Please try again later.' : error?.message || 'Failed to generate text.');
    return res.status(isQuotaIssue || isNetworkIssue ? 503 : 500).json({ status: 'error', message });
  }
};

module.exports = { generateText };
