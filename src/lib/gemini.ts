import { toast } from "sonner";
// Remove the circular dependency
// import { generateEcommerceKeywords } from "./keywordGeneration";
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiResponse {
  keywords: string[];
  productDescription: string;
  seoTitle: string;
  metaDescription: string;
  longTailKeywords: string[];
  productFeatures: string[];
  targetAudience: string[];
  seoRecommendations: string[];
  competitorAnalysis: string;
  contentIdeas: string[];
}

export class GeminiService {
  private static instance: GeminiService;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue: boolean = false;
  private readonly MIN_REQUEST_INTERVAL = 35000; // 35 seconds between requests to stay under the 2 requests per minute limit

  private constructor() {
    // Use import.meta.env for Vite environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Gemini API Key available:', !!apiKey);
    
    if (!apiKey) {
      console.error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.');
      throw new Error('Gemini API key is missing');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Use the latest model name - 'gemini-1.5-pro'
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      console.log('Gemini model initialized successfully');
    } catch (error) {
      console.error('Error initializing Gemini model:', error);
      throw error;
    }
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    
    try {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
        const delay = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        console.log(`Rate limiting: Waiting ${delay}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const request = this.requestQueue.shift();
      if (request) {
        this.lastRequestTime = Date.now();
        await request();
      }
    } catch (error) {
      console.error('Error processing request queue:', error);
    } finally {
      this.isProcessingQueue = false;
      
      // Process next request if any
      if (this.requestQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  private async makeRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  public async generateSEOContent(productDescription: string): Promise<GeminiResponse> {
    try {
      console.log('Generating SEO content for:', productDescription);
      
      if (!this.model) {
        throw new Error('Gemini model not initialized properly');
      }
      
      // First, generate comprehensive SEO content
      const seoPrompt = `
        Generate comprehensive SEO-optimized content for the following product:
        "${productDescription}"

        Please provide a detailed analysis with the following sections:
        1. A list of 20-30 highly relevant SEO keywords (mix of short-tail and long-tail)
        2. A compelling product description (300-400 words) optimized for both users and search engines
        3. An SEO-optimized title (50-60 characters) that includes the main keyword
        4. A meta description (150-160 characters) that drives clicks
        5. A list of 8-10 long-tail keywords with search intent
        6. A list of 8-10 key product features and benefits
        7. A list of 5-7 target audience segments
        8. 7-8 specific SEO recommendations for this product
        9. A brief competitor analysis (100-150 words)
        10. 5 content ideas (blog posts, videos, etc.) that could help promote this product

        Format the response as JSON with the following structure:
        {
          "keywords": ["keyword1", "keyword2", ...],
          "productDescription": "detailed description...",
          "seoTitle": "SEO optimized title",
          "metaDescription": "Meta description for search engines",
          "longTailKeywords": ["long-tail keyword 1", ...],
          "productFeatures": ["feature 1", ...],
          "targetAudience": ["audience segment 1", ...],
          "seoRecommendations": ["recommendation 1", ...],
          "competitorAnalysis": "analysis text...",
          "contentIdeas": ["content idea 1", ...]
        }
      `;

      console.log('Sending prompt to Gemini API...');
      
      const result = await this.makeRequest(async () => {
        const result = await this.model.generateContent(seoPrompt);
        console.log('Received response from Gemini API');
        
        const response = await result.response;
        const text = response.text();
        console.log('Response text length:', text.length);
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('Failed to extract JSON from response. Response text:', text.substring(0, 200) + '...');
          throw new Error('Failed to parse Gemini response');
        }

        console.log('Parsing JSON response...');
        const seoContent = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed JSON response');

        return seoContent;
      });

      return result;
    } catch (error) {
      console.error('Error generating SEO content with Gemini:', error);
      
      // Check if it's a quota error
      if (error instanceof Error && 
          (error.message.includes('quota') || 
           error.message.includes('rate limit') || 
           error.message.includes('429'))) {
        throw new Error('API quota exceeded. Please wait a minute before trying again.');
      }
      
      throw error;
    }
  }

  public async generateProductComparison(product1: string, product2: string): Promise<string> {
    try {
      const prompt = `
        Compare these two products in detail:
        Product 1: "${product1}"
        Product 2: "${product2}"
        
        Provide a comprehensive comparison covering:
        - Key features and specifications
        - Pros and cons of each
        - Target audience
        - Price point considerations
        - Use cases where each excels
        - Overall recommendation for different user needs
        
        Format your response in a clear, structured way with headings and bullet points.
      `;

      return await this.makeRequest(async () => {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      });
    } catch (error) {
      console.error('Error generating product comparison:', error);
      
      // Check if it's a quota error
      if (error instanceof Error && 
          (error.message.includes('quota') || 
           error.message.includes('rate limit') || 
           error.message.includes('429'))) {
        throw new Error('API quota exceeded. Please wait a minute before trying again.');
      }
      
      throw error;
    }
  }

  public async generateContentIdeas(product: string): Promise<string[]> {
    try {
      const prompt = `
        Generate 5 creative content marketing ideas for this product:
        "${product}"
        
        Include a mix of:
        - Blog post ideas
        - Video content concepts
        - Social media campaign ideas
        - Email marketing angles
        - Influencer collaboration opportunities
        
        Make each idea specific, actionable, and tailored to this product.
      `;

      return await this.makeRequest(async () => {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract ideas from the response
        const ideas = text
          .split('\n')
          .filter(line => line.trim().length > 0 && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)))
          .map(line => line.replace(/^[-*]\s*|\d+\.\s*/, '').trim())
          .filter(line => line.length > 0);
        
        return ideas;
      });
    } catch (error) {
      console.error('Error generating content ideas:', error);
      
      // Check if it's a quota error
      if (error instanceof Error && 
          (error.message.includes('quota') || 
           error.message.includes('rate limit') || 
           error.message.includes('429'))) {
        throw new Error('API quota exceeded. Please wait a minute before trying again.');
      }
      
      throw error;
    }
  }
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function generateKeywords(
  productName: string,
  productDescription: string
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Generate relevant SEO keywords for the following product:
      
      Product Name: ${productName}
      Product Description: ${productDescription}
      
      Please provide a list of relevant keywords that would help this product rank well in e-commerce searches.
      Include:
      1. Product-specific keywords
      2. Category keywords
      3. Feature keywords
      4. Benefit keywords
      5. Target audience keywords
      
      Format the response as a comma-separated list of keywords.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into keywords
    const keywords = text
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    return keywords;
  } catch (error) {
    console.error('Error generating keywords with Gemini:', error);
    return [];
  }
}
