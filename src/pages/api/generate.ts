import type { NextApiRequest, NextApiResponse } from 'next';
import { GeminiService } from '@/lib/gemini';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productDescription } = req.body;

    if (!productDescription) {
      return res.status(400).json({ error: 'Product description is required' });
    }

    const geminiService = GeminiService.getInstance();
    const seoContent = await geminiService.generateSEOContent(productDescription);

    return res.status(200).json(seoContent);
  } catch (error) {
    console.error('Error generating SEO content:', error);
    return res.status(500).json({ error: 'Failed to generate SEO content' });
  }
} 