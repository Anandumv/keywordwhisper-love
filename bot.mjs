import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeCompetitorData } from './src/lib/scraper.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to generate short-tail keywords
function generateShortTailKeywords(productName, scrapedKeywords = []) {
  const modifiers = [
    '', // original product name
    'best',
    'top',
    'new',
    'popular',
    'quality',
    'premium',
    'affordable',
    'cheap',
    'discount',
    'sale',
    'wholesale',
    'bulk',
    'custom',
    'personalized',
    'trending',
    'viral',
    'must-have',
    'essential',
    'unique'
  ];

  const categories = [
    '',
    'for kids',
    'for children',
    'for toddlers',
    'for babies',
    'for adults',
    'for family',
    'for home',
    'for school',
    'for office',
    'for travel',
    'for outdoor',
    'for indoor',
    'for learning',
    'for education',
    'for beginners',
    'for professionals',
    'for students',
    'for teachers',
    'for parents'
  ];

  const keywords = new Set();
  
  // Add scraped keywords
  if (Array.isArray(scrapedKeywords)) {
    scrapedKeywords.forEach(keyword => {
      if (typeof keyword === 'string' && keyword.split(' ').length <= 3) {
        keywords.add(keyword.toLowerCase().trim());
      }
    });
  }
  
  // Generate combinations
  modifiers.forEach(modifier => {
    categories.forEach(category => {
      if (modifier && category) {
        keywords.add(`${modifier} ${productName} ${category}`.trim().toLowerCase());
      } else if (modifier) {
        keywords.add(`${modifier} ${productName}`.trim().toLowerCase());
      } else if (category) {
        keywords.add(`${productName} ${category}`.trim().toLowerCase());
      } else {
        keywords.add(productName.toLowerCase());
      }
    });
  });

  return Array.from(keywords).slice(0, 30); // Return top 30 short-tail keywords
}

// Function to generate long-tail keywords
function generateLongTailKeywords(productName, scrapedKeywords = []) {
  const adjectives = [
    'best',
    'top-rated',
    'high-quality',
    'premium',
    'affordable',
    'durable',
    'eco-friendly',
    'non-toxic',
    'washable',
    'safe',
    'educational',
    'interactive',
    'engaging',
    'fun',
    'creative',
    'innovative',
    'sustainable',
    'reusable',
    'portable',
    'lightweight'
  ];

  const purposes = [
    'for learning',
    'for education',
    'for development',
    'for training',
    'for practice',
    'for improvement',
    'for enhancement',
    'for growth',
    'for skill building',
    'for knowledge',
    'for creativity',
    'for imagination',
    'for problem solving',
    'for critical thinking',
    'for motor skills',
    'for cognitive development',
    'for social skills',
    'for emotional intelligence',
    'for STEM learning',
    'for language development'
  ];

  const features = [
    'with pictures',
    'with illustrations',
    'with storage box',
    'with carrying case',
    'with instructions',
    'with guide',
    'with manual',
    'with accessories',
    'with bonus items',
    'with extra features',
    'with multiple colors',
    'with different sizes',
    'with easy setup',
    'with quick assembly',
    'with safety features',
    'with educational content',
    'with interactive elements',
    'with sound effects',
    'with light effects',
    'with motion sensors'
  ];

  const ageGroups = [
    'for toddlers',
    'for preschoolers',
    'for kindergarten',
    'for elementary',
    'for middle school',
    'for high school',
    'for college',
    'for adults',
    'for all ages',
    'for beginners',
    'for advanced learners',
    'for special needs',
    'for gifted children',
    'for early childhood',
    'for primary school',
    'for secondary school',
    'for university students',
    'for professionals',
    'for teachers',
    'for parents'
  ];

  const keywords = new Set();
  
  // Add scraped keywords
  if (Array.isArray(scrapedKeywords)) {
    scrapedKeywords.forEach(keyword => {
      if (typeof keyword === 'string' && keyword.split(' ').length > 3) {
        keywords.add(keyword.toLowerCase().trim());
      }
    });
  }
  
  // Generate combinations
  adjectives.forEach(adj => {
    purposes.forEach(purpose => {
      features.forEach(feature => {
        ageGroups.forEach(age => {
          keywords.add(`${adj} ${productName} ${purpose} ${feature} ${age}`.trim().toLowerCase());
        });
      });
    });
  });

  return Array.from(keywords).slice(0, 40); // Return top 40 long-tail keywords
}

// API endpoint for keyword generation and competitor analysis
app.post('/api/keywords', async (req, res) => {
  const { productName } = req.body;
  
  if (!productName || typeof productName !== 'string') {
    return res.status(400).json({ error: 'Valid product name is required' });
  }

  try {
    console.log(`Starting keyword generation for: ${productName}`);
    
    // Get competitor data
    const competitorData = await scrapeCompetitorData(productName);
    console.log(`Analyzed ${competitorData.products.length} competitor products`);
    
    // Generate keywords
    const shortTailKeywords = generateShortTailKeywords(productName, competitorData.keywords);
    const longTailKeywords = generateLongTailKeywords(productName, competitorData.keywords);
    
    console.log(`Generated ${shortTailKeywords.length} short-tail and ${longTailKeywords.length} long-tail keywords`);
    
    res.json({
      shortTailKeywords,
      longTailKeywords,
      totalKeywords: shortTailKeywords.length + longTailKeywords.length,
      competitorAnalysis: {
        totalProducts: competitorData.analysis.totalProducts,
        averagePrice: competitorData.analysis.averagePrice,
        averageRating: competitorData.analysis.averageRating,
        platforms: competitorData.analysis.platforms,
        topProducts: competitorData.products.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ 
      error: 'Failed to generate keywords',
      details: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the UI`);
}); 