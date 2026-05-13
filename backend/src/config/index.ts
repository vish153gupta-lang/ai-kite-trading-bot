import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  KITE_API_KEY: process.env.KITE_API_KEY,
  KITE_API_SECRET: process.env.KITE_API_SECRET,
  KITE_ACCESS_TOKEN: process.env.KITE_ACCESS_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  // Add more AI providers later
};