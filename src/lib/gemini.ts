import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY must be defined in .env.local');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function cleanGeminiResponse(text: string): string {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^\s*[\{\[]/, match => match) // Preserve JSON start
    .replace(/[\}\]]\s*$/, match => match) // Preserve JSON end
    .trim();
}

export function safeJsonParse(text: string, fallback: any = {}) {
  try {
    const cleaned = cleanGeminiResponse(text);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parse failed:', error, 'Original text:', text);
    return fallback;
  }
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
  
  return safeJsonParse(result.response.text());
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

export async function generateOutfitSuggestions(sneakerData: any, trendData: any[], wardrobeItems: any[] = []) {
  const hasWardrobe = wardrobeItems.length > 0;
  
  const outfitPrompt = `
    SNEAKER: ${JSON.stringify(sneakerData)}
    ${trendData.length > 0 ? `TRENDS: ${JSON.stringify(trendData.slice(0, 3))}` : ''}
    
    ${hasWardrobe ? 
      `USER'S WARDROBE: ${JSON.stringify(wardrobeItems)}
       PRIORITY: Use items from user's wardrobe when possible. Mark 'owned' as true.` :
      `NO WARDROBE DATA: Suggest specific items to buy and mark 'owned' as false.`
    }
    
    Return JSON format with this exact structure.
    {
      "outfits": [
        {
          "items": [
            {"name": "Black Nike Hoodie", "owned": true},
            {"name": "Grey shorts", "owned": false}
          ],
          "confidence": 0.85
        }
      ]
    }

    Important:
    - Return exactly 3 outfits.
    - Each outfit has only "items" array and "confidence" number (from 0.0 to 1.0).
    - Each item has only "name" (string) and "owned" (boolean).
    - No reasoning, id, occasion, or category fields.
  `;
  
  const result = await model.generateContent(outfitPrompt);
  const parsedResult = safeJsonParse(result.response.text());

  if (parsedResult && Array.isArray(parsedResult.outfits)) {
    return {
      ...parsedResult,
      outfits: parsedResult.outfits.slice(0, 3),
    };
  }
  
  return parsedResult;
}
