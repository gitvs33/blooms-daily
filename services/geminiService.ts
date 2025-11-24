import { GoogleGenAI, Type } from "@google/genai";

// Helper to get client
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateNanoBananaPrompt = async (flowerName: string, isWithered: boolean): Promise<string> => {
  const ai = getAiClient();
  const context = isWithered 
    ? `a withered ${flowerName}. It should describe lighting, texture, and mood. Mood should be melancholic.` 
    : `a beautiful, blooming, vibrant ${flowerName}. It should describe lighting, texture, and mood. Mood should be ethereal and joyous.`;
    
  const example = isWithered
    ? `"A single withered rose petal falling on snow, hyper-realistic, cinematic lighting."`
    : `"A radiant sunflower basking in golden hour sunlight, macro photography, dreamy atmosphere."`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, highly artistic, and specific AI image generation prompt for ${context}. 
      It must be one sentence long.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING }
          }
        }
      }
    });
    
    if (response.text) {
      const json = JSON.parse(response.text);
      return json.prompt;
    }
    return isWithered ? `A withered ${flowerName}, dramatic lighting.` : `A beautiful ${flowerName} in sunlight.`;

  } catch (error) {
    console.error("Error generating prompt text:", error);
    return isWithered 
      ? `A withered ${flowerName}, melancholic style, dramatic lighting.`
      : `A blooming ${flowerName}, soft lighting, nature photography.`;
  }
};

export const generateLifeQuote = async (flowerName: string, isWithered: boolean): Promise<string> => {
  const ai = getAiClient();
  const theme = isWithered ? "loss, regret, or impermanence" : "nurturing, growth, or the beauty of life";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, profound life quote (max 15 words) about ${theme}, inspired by a ${isWithered ? 'withered' : 'blooming'} ${flowerName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      const json = JSON.parse(response.text);
      return json.quote;
    }
    return isWithered ? "Appreciate what you have before it turns into what you had." : "To plant a garden is to believe in tomorrow.";
  } catch (error) {
    console.error("Error generating quote:", error);
    return isWithered ? "Beauty is fleeting, but character is forever." : "Growth is the only evidence of life.";
  }
};

export const generateFlowerImage = async (prompt: string): Promise<string | null> => {
  const ai = getAiClient();
  try {
    // Using the "Nano Banana" model (gemini-2.5-flash-image)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Iterate to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};