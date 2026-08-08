const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const requiredKeys = ['JWT_SECRET'];
const optionalKeys = ['GOOGLE_AI_STUDIO_API_KEY'];
const missingRequiredKeys = requiredKeys.filter((key) => !process.env[key]);
const missingOptionalKeys = optionalKeys.filter((key) => !process.env[key]);

if (missingRequiredKeys.length > 0) {
  const message = `Missing required environment variable(s): ${missingRequiredKeys.join(', ')}.`;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message);
  }
  console.warn(`WARNING: ${message} Using development fallback values where safe.`);
}

if (missingOptionalKeys.length > 0) {
  console.warn(
    `WARNING: Optional environment variable(s) not configured: ${missingOptionalKeys.join(', ')}. ` +
      'Google AI Studio features will be disabled until they are provided.'
  );
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'mychoize',
  JWT_SECRET: process.env.JWT_SECRET || 'mychoize-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  API_KEY: process.env.API_KEY || '',
  GOOGLE_AI_STUDIO_API_KEY: process.env.GOOGLE_AI_STUDIO_API_KEY || '',
  GOOGLE_AI_STUDIO_MODEL: process.env.GOOGLE_AI_STUDIO_MODEL || 'gemini-2.0-flash',
  GOOGLE_AI_STUDIO_TEMPERATURE: Number(process.env.GOOGLE_AI_STUDIO_TEMPERATURE) || 0.1,
  GOOGLE_AI_STUDIO_MAX_OUTPUT_TOKENS: Number(process.env.GOOGLE_AI_STUDIO_MAX_OUTPUT_TOKENS) || 150,
  GOOGLE_AI_STUDIO_MAX_PROMPT_CHARS: Number(process.env.GOOGLE_AI_STUDIO_MAX_PROMPT_CHARS) || 512,
  GOOGLE_AI_STUDIO_REQUEST_TIMEOUT_MS: Number(process.env.GOOGLE_AI_STUDIO_REQUEST_TIMEOUT_MS) || 8000,
};
