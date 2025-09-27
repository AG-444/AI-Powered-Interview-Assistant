import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// This function now only looks for the name
export const extractNameFromResume = async (text) => {
  const prompt = `
    Analyze the following resume text and extract only the candidate's full name. 
    Respond with ONLY the full name as a plain string. 
    If you cannot determine a name, respond with the word "null".

    Resume Text:
    ---
    ${text.substring(0, 2000)} 
    ---
  `;
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    return responseText === 'null' ? null : responseText;
  } catch (error) {
    console.error('Error extracting name with AI:', error);
    return null;
  }
};

// This function is still used for the interview questions
export const generateQuestion = async (difficulty) => {
  // ... (this function remains unchanged)
  const prompt = `Generate one unique and specific ${difficulty}-level interview question for a full-stack developer role focusing on React and Node.js. The question should be a single, clear sentence. Do not include any introductory text, labels like "Question:", or any explanations.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Error generating question from AI:', error);
    return 'Failed to generate a question. Please try again.';
  }
};