import { toast } from "sonner";
import { generateEcommerceKeywords } from "./keywordGeneration";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const generateKeywordSuggestions = async (
  keyword: string,
  product: string
): Promise<string[]> => {
  const geminiApiKey = localStorage.getItem("geminiApiKey");
  
  if (!geminiApiKey) {
    toast.error("Gemini API key not found. Please set it in the API settings.");
    return [];
  }

  try {
    // First try to generate keywords locally using our algorithm
    const localKeywords = generateEcommerceKeywords(product, {
      includeCategories: true,
      includeAgeGroups: true,
      includeBenefits: true,
      maxKeywords: 15
    });
    
    // If we got enough keywords locally, return them
    if (localKeywords.length >= 8) {
      return localKeywords;
    }
    
    // Otherwise, fallback to Gemini API
    console.log("Local keywords insufficient, falling back to Gemini API");
    
    // Use the correct API version and model name
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Research and generate 10 SEO-optimized keywords for the product: "${product}" with focus keyword "${keyword}".
                  
                  Analyze similar products on e-commerce platforms like Amazon, Flipkart, and Meesho to identify high-performing keywords.
                  
                  For each keyword, consider search volume, competition, and relevance to the product.
                  
                  Return ONLY a JSON array of strings containing the keywords without any explanation or additional text. For example: ["keyword1", "keyword2", ...]`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error response:", error);
      // If API fails, still return local keywords
      console.log("Gemini API failed, using local keywords only");
      return localKeywords;
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      console.log("No suggestions returned from Gemini API, using local keywords");
      return localKeywords;
    }
    
    const suggestionsText = data.candidates[0].content.parts[0].text;
    console.log("Raw Gemini response:", suggestionsText);
    
    // Try to parse the response as JSON array
    try {
      // Clean the response - sometimes Gemini returns with code blocks or extra text
      const jsonString = suggestionsText.replace(/```json\s*|\s*```/g, '').trim();
      const suggestions = JSON.parse(jsonString);
      
      if (Array.isArray(suggestions)) {
        // Combine with our local keywords for best results
        const combinedKeywords = [...new Set([...suggestions, ...localKeywords])];
        return combinedKeywords.slice(0, 15); // Return up to 15 unique keywords
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      
      // Fallback: Try to extract a list from the text response
      const lines = suggestionsText.split('\n')
        .map(line => line.replace(/^\d+\.\s*|"|^\s*-\s*/g, '').trim())
        .filter(line => line.length > 0 && !line.includes('```'));
      
      if (lines.length > 0) {
        // Combine with our local keywords
        const combinedKeywords = [...new Set([...lines, ...localKeywords])];
        return combinedKeywords.slice(0, 15);
      }
    }
    
    // If we couldn't parse the API response, return local keywords
    console.log("Could not parse keyword suggestions from Gemini API, using local keywords");
    return localKeywords;
  } catch (error) {
    console.error("Error generating keyword suggestions:", error);
    toast.error(error instanceof Error ? error.message : "Failed to generate keyword suggestions");
    
    // If anything fails, still try to return local keywords
    try {
      return generateEcommerceKeywords(product, {
        maxKeywords: 15
      });
    } catch (localError) {
      console.error("Local keyword generation also failed:", localError);
      return [];
    }
  }
};
