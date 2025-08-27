import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY must be defined in .env.local');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function cleanGeminiResponse(text: string): string {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

export async function analyzeSneakerImage(file: File) {
  const imageBytes = await file.arrayBuffer();
  const base64Image = Buffer.from(imageBytes).toString('base64');
  
  const analysisPrompt = `
    Analyze this sneaker image. Return ONLY valid JSON:
    {
      "brand": "Nike",
      "model": "Air Jordan 1", 
      "colors": ["black", "red", "white"],
      "style": "streetwear",
      "confidence": 0.95
    }
  `;
  
  const result = await model.generateContent([
    analysisPrompt,
    { inlineData: { mimeType: file.type, data: base64Image } }
  ]);
  
  return JSON.parse(cleanGeminiResponse(result.response.text()));
}

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
