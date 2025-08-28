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

export async function generateOutfitSuggestions(sneakerData: any, trendData: any[], wardrobeItems: any[] = []) {
  const hasWardrobe = wardrobeItems.length > 0;
  
  const outfitPrompt = `
    SNEAKER: ${JSON.stringify(sneakerData)}
    ${trendData.length > 0 ? `TRENDS: ${JSON.stringify(trendData.slice(0, 3))}` : ''}
    
    ${hasWardrobe ? 
      `USER'S WARDROBE: ${JSON.stringify(wardrobeItems)}
       PRIORITY: Use items from user's wardrobe when possible. Mark owned vs buy.` :
      `NO WARDROBE DATA: Suggest specific items to buy.`
    }
    
    Return JSON with owned/buy flags:
    {
      "outfits": [
        {
          "items": [
            {"name": "Black Nike hoodie", "owned": true},
            {"name": "Blue Levi's jeans", "owned": false}
          ],
          "reasoning": "Uses your black hoodie, suggests jeans to buy",
          "occasion": "casual",
          "confidence": 0.9
        }
      ]
    }
  `;
  
  const result = await model.generateContent(outfitPrompt);
  return cleanAndParseGeminiResponse(result.response.text());
}
