import promptConfig from './config.json';
import {getSystemPrompt} from '@/lib/.server/llm/prompts'

// Only execute this on the server side
let ANALYSER_SYSTEM_PROMPT: string = '';
let CODER_SYSTEM_PROMPT: string = '';
let CLOUDINARY: { name: string, key: string, secret: string } = { name: '', key: '', secret: '' };
let MANIM_API_URL: string = '';

try {
   // Only run this on the server
   if (typeof window === 'undefined') {
      ANALYSER_SYSTEM_PROMPT = getSystemPrompt();
      CODER_SYSTEM_PROMPT = promptConfig.coder_system_prompt;
      CLOUDINARY = {
         name: process.env.CLOUDINARY_CLOUD_NAME || '',
         key: process.env.CLOUDINARY_API_KEY || '',
         secret: process.env.CLOUDINARY_API_SECRET || ''
      };
      MANIM_API_URL = process.env.MANIM_URL || '';
   }
} catch (error) {
   console.error('Failed to load config.json:', error);
}

export { ANALYSER_SYSTEM_PROMPT, CODER_SYSTEM_PROMPT, CLOUDINARY, MANIM_API_URL };