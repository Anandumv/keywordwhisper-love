import { generateEcommerceKeywords } from './keywordGeneration';
import { GeminiService } from './gemini';

interface WhatsAppMessage {
  from: string;
  body: string;
  timestamp: string;
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private webhookUrl: string;
  private accessToken: string;
  private geminiService: GeminiService;

  private constructor() {
    this.webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || '';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.geminiService = GeminiService.getInstance();
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  public async handleIncomingMessage(message: WhatsAppMessage): Promise<void> {
    try {
      // Check if it's a comparison request
      if (message.body.toLowerCase().includes('compare') || message.body.toLowerCase().includes('vs')) {
        await this.handleComparisonRequest(message);
        return;
      }

      // Check if it's a content ideas request
      if (message.body.toLowerCase().includes('content ideas') || message.body.toLowerCase().includes('marketing ideas')) {
        await this.handleContentIdeasRequest(message);
        return;
      }

      // Default: Generate comprehensive SEO content
      await this.handleSEORequest(message);
    } catch (error) {
      console.error('Error handling WhatsApp message:', error);
      await this.sendWhatsAppMessage(
        message.from,
        'Sorry, I encountered an error while processing your request. Please try again later.'
      );
    }
  }

  private async handleSEORequest(message: WhatsAppMessage): Promise<void> {
    // Generate SEO content using Gemini
    const seoContent = await this.geminiService.generateSEOContent(message.body);
    
    // Also generate keywords using our local algorithm for better coverage
    const localKeywords = await generateEcommerceKeywords(message.body, {
      includeCategories: true,
      includeAgeGroups: true,
      includeBenefits: true,
      maxKeywords: 10
    });

    // Combine and deduplicate keywords
    const allKeywords = [...new Set([...seoContent.keywords, ...localKeywords])];

    // Format the response
    const response = this.formatSEOResponse(seoContent, allKeywords);

    // Send the response back via WhatsApp
    await this.sendWhatsAppMessage(message.from, response);
  }

  private async handleComparisonRequest(message: WhatsAppMessage): Promise<void> {
    // Extract product names from the message
    const products = this.extractProductsFromComparison(message.body);
    
    if (products.length < 2) {
      await this.sendWhatsAppMessage(
        message.from,
        'Please provide two products to compare. Format: "Compare [Product 1] vs [Product 2]"'
      );
      return;
    }

    // Generate comparison using Gemini
    const comparison = await this.geminiService.generateProductComparison(products[0], products[1]);
    
    // Format the response
    const response = this.formatComparisonResponse(comparison);
    
    // Send the response
    await this.sendWhatsAppMessage(message.from, response);
  }

  private async handleContentIdeasRequest(message: WhatsAppMessage): Promise<void> {
    // Extract product from the message
    const product = message.body.replace(/content ideas|marketing ideas/i, '').trim();
    
    if (!product) {
      await this.sendWhatsAppMessage(
        message.from,
        'Please provide a product to generate content ideas for. Format: "Content ideas for [Product]"'
      );
      return;
    }

    // Generate content ideas using Gemini
    const contentIdeas = await this.geminiService.generateContentIdeas(product);
    
    // Format the response
    const response = this.formatContentIdeasResponse(contentIdeas);
    
    // Send the response
    await this.sendWhatsAppMessage(message.from, response);
  }

  private extractProductsFromComparison(message: string): string[] {
    // Try to extract products from comparison format
    const vsMatch = message.match(/compare\s+(.+?)\s+vs\s+(.+)/i) || 
                    message.match(/(.+?)\s+vs\s+(.+)/i);
    
    if (vsMatch) {
      return [vsMatch[1].trim(), vsMatch[2].trim()];
    }
    
    // Fallback: split by common comparison words
    const comparisonWords = ['vs', 'versus', 'compared to', 'or', 'better than'];
    for (const word of comparisonWords) {
      if (message.toLowerCase().includes(word)) {
        const parts = message.split(new RegExp(word, 'i'));
        if (parts.length >= 2) {
          return [parts[0].trim(), parts[1].trim()];
        }
      }
    }
    
    // If all else fails, return empty array
    return [];
  }

  private formatSEOResponse(seoContent: any, keywords: string[]): string {
    const header = '🔍 *SEO-Optimized Content*\n\n';
    
    const titleSection = '*Title:*\n' + seoContent.seoTitle + '\n\n';
    
    const metaSection = '*Meta Description:*\n' + seoContent.metaDescription + '\n\n';
    
    const descriptionSection = '*Product Description:*\n' + seoContent.productDescription + '\n\n';
    
    const keywordsSection = '*Keywords:*\n' + 
      keywords.slice(0, 15)
        .map((keyword, index) => `${index + 1}. ${keyword}`)
        .join('\n') + '\n\n';
    
    const longTailSection = '*Long-Tail Keywords:*\n' +
      seoContent.longTailKeywords
        .map((keyword, index) => `${index + 1}. ${keyword}`)
        .join('\n') + '\n\n';
    
    const featuresSection = '*Key Features:*\n' +
      seoContent.productFeatures
        .map((feature, index) => `${index + 1}. ${feature}`)
        .join('\n') + '\n\n';
    
    const audienceSection = '*Target Audience:*\n' +
      seoContent.targetAudience
        .map((audience, index) => `${index + 1}. ${audience}`)
        .join('\n') + '\n\n';
    
    const recommendationsSection = '*SEO Recommendations:*\n' +
      seoContent.seoRecommendations
        .map((rec, index) => `${index + 1}. ${rec}`)
        .join('\n') + '\n\n';
    
    const competitorSection = '*Competitor Analysis:*\n' + seoContent.competitorAnalysis + '\n\n';
    
    const contentIdeasSection = '*Content Ideas:*\n' +
      seoContent.contentIdeas
        .map((idea, index) => `${index + 1}. ${idea}`)
        .join('\n') + '\n\n';
    
    const footer = '💡 *Tips:*\n' +
      '• Use these keywords in your product title and description\n' +
      '• Include keywords in image alt text\n' +
      '• Use keywords in product URLs\n' +
      '• Add keywords to product tags and categories\n' +
      '• Create content based on the suggested ideas';

    return header + titleSection + metaSection + descriptionSection + 
           keywordsSection + longTailSection + featuresSection + audienceSection + 
           recommendationsSection + competitorSection + contentIdeasSection + footer;
  }

  private formatComparisonResponse(comparison: string): string {
    const header = '🔄 *Product Comparison*\n\n';
    
    // Clean up the comparison text
    const cleanedComparison = comparison
      .replace(/```json|```/g, '')
      .replace(/\[|\]/g, '')
      .trim();
    
    return header + cleanedComparison;
  }

  private formatContentIdeasResponse(ideas: string[]): string {
    const header = '📝 *Content Marketing Ideas*\n\n';
    
    const ideasList = ideas
      .map((idea, index) => `${index + 1}. ${idea}`)
      .join('\n');
    
    const footer = '\n\n💡 *Tips:*\n' +
      '• Prioritize ideas based on your audience and resources\n' +
      '• Create a content calendar to schedule these ideas\n' +
      '• Measure performance of each content piece\n' +
      '• Repurpose successful content across different platforms';
    
    return header + ideasList + footer;
  }

  private async sendWhatsAppMessage(to: string, message: string): Promise<void> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
} 