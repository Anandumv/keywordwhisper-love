import { GeminiService } from '@/lib/gemini';

export async function generateSEOContent(productDescription: string) {
  console.log('API: generateSEOContent called with:', productDescription);
  
  if (!productDescription) {
    console.error('API: Product description is missing');
    throw new Error('Product description is required');
  }

  try {
    console.log('API: Getting Gemini service instance');
    const geminiService = GeminiService.getInstance();
    
    console.log('API: Calling Gemini service to generate SEO content');
    const seoContent = await geminiService.generateSEOContent(productDescription);
    
    console.log('API: Successfully generated SEO content');
    return seoContent;
  } catch (error) {
    console.error('API: Error generating SEO content:', error);
    throw error;
  }
} 