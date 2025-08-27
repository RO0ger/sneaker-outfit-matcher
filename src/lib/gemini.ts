import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY must be defined in .env.local');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Utility function to clean and safely parse Gemini's JSON responses.
 * @param text The raw text response from Gemini.
 * @returns A parsed JSON object or a fallback object on error.
 */
export function cleanAndParseGeminiResponse(text: string): any {
  const cleanedText = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse Gemini JSON response:", error);
    console.error("Original text:", text);
    // Return a structured error or a fallback object
    return { error: "Failed to parse JSON response", details: cleanedText };
  }
}
