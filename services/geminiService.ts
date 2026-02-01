import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getPerfumeRecommendation = async (userMood: string): Promise<string> => {
  if (!apiKey) {
    return "I'm sorry, my olfactory senses are currently offline (API Key missing). However, I recommend exploring our 'Midnight Jasmine' for a mysterious vibe.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert master perfumer with a poetic soul. A customer has described their current mood or desire as: "${userMood}". 
      
      Please provide a short, evocative recommendation (max 100 words). 
      Suggest olfactory notes that match this mood (e.g., woody, floral, citrus, amber). 
      Do not mention specific real-world brands other than "L'Essence". 
      Focus on the feeling and the sensory experience.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Low latency needed
      }
    });
    
    return response.text || "I recommend a scent with deep amber notes to match your intensity.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am having trouble connecting to the scent database. Please try again later.";
  }
};
