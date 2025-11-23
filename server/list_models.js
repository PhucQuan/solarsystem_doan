import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('GEMINI_API_KEY not found in env');
  process.exit(1);
}

async function listModels() {
  try {
    const client = new GoogleGenerativeAI(key);
    const models = await client.listModels();
    console.log('Models:');
    for (const m of models) {
      console.log('-', m.name, '|', m.displayName || '');
    }
  } catch (err) {
    console.error('ListModels error:', err.message || err);
    process.exit(2);
  }
}

listModels();
