import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const IS_DEMO_MODE = !API_KEY || API_KEY === 'your_gemini_api_key_here';

let genAI: any;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

// Function to generate keywords based only on product name
export async function generateKeywords(
  productName: string,
  productDescription?: string // Making this optional
): Promise<string[]> {
  // Return mock data if in demo mode
  if (IS_DEMO_MODE) {
    return getMockKeywords(productName);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Include only product name if no description provided
    const descriptionPart = productDescription 
      ? `Product Description: ${productDescription}`
      : 'Generate based only on the product name';
    
    const prompt = `
      Generate 50 diverse, commercially valuable SEO keywords for the following product:
      
      Product Name: ${productName}
      ${descriptionPart}
      
      Please provide a comprehensive list of keywords that would help this product rank well in e-commerce searches and drive conversions. Create a professional mix of terms that actual customers would search for.
      
      Include:
      1. Core product terms with qualifying modifiers
      2. Industry/category terms (without repeating the product name where unnecessary)
      3. Feature and specification terms
      4. Benefit-focused and problem-solving terms
      5. Target audience and use-case specific terms
      6. Comparative and research terms (reviews, vs, alternatives)
      7. Purchase intent terms (buy, price, deals)
      8. Naturally phrased questions users might ask
      
      IMPORTANT REQUIREMENTS:
      - Create diverse keyword patterns - avoid using the same structure repeatedly
      - Don't redundantly append the product name to every keyword
      - Use natural language that real users would search for
      - Include a mix of short-tail and long-tail keywords
      - Incorporate commercial modifiers that indicate purchase intent
      - Vary the word order and phrasing to cover different search patterns
      - Include some keywords without the product name where the context is clear
      
      Format the response as a comma-separated list of keywords.
      ONLY return the keywords as a comma-separated list, with no additional text.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into keywords
    const keywords = text
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0)
      .slice(0, 50); // Limit to 50 keywords
    
    return keywords;
  } catch (error) {
    console.error('Error generating keywords with Gemini:', error);
    return getMockKeywords(productName);
  }
}

// Function to generate a complete SEO package
export async function generateCompleteSEOPackage(productName: string) {
  // Return mock data if in demo mode
  if (IS_DEMO_MODE) {
    return getMockSEOPackage(productName);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // First, generate comprehensive SEO content
    const seoPrompt = `
      Generate comprehensive SEO-optimized content for the following product: "${productName}"
      
      Act as a senior SEO director with 15+ years of specialized experience in e-commerce SEO, semantic search optimization, and conversion-focused keyword strategy. Your expertise in search behavior psychology and algorithm analysis will be crucial for developing the most powerful, conversion-driving keyword strategy possible.
      
      Step 1: Deep Product & Market Analysis
      Perform a comprehensive analysis of "${productName}" identifying:
        * Primary, secondary, and tertiary product categories 
        * Core product functions and secondary use cases
        * Key product specifications and technical differentiators
        * Explicit and implicit customer pain points addressed
        * Primary and secondary purchase motivations
        * Seasonal, cyclical, and trending demand patterns
        * Competitive positioning and market gaps
      
      Step 2: Search Intent Matrix Development
      Develop a multi-dimensional keyword framework using these search intent patterns:
      
      1. Transactional Intent Keywords (Immediate Purchase):
         - "Buy [product] [qualifier]" variants
         - "[Product] for sale [qualifier]"
         - "[Product] price [qualifier]"
         - "[Product] deals" and discount-related terms
         - "Professional [product]" for high-end searches
         - "Best [product] for [specific application]"
         - "[Product] with [essential feature]"
      
      2. Commercial Investigation Keywords (Active Research):
         - "[Product] vs [specific competitor]"
         - "[Product] alternatives"
         - "[Product] reviews [current year]"
         - "Top [product] brands"
         - "[Product] comparison"
         - "Which [product] to buy"
      
      3. Feature-Specific Decision Keywords:
         - "[Attribute] [product]" (e.g., "waterproof headphones")
         - "[Material] [product]"
         - "[Size/dimension] [product]"
         - "[Performance metric] [product]"
         - "[Product] for [specific use case]"
      
      4. Problem-Solution Keywords:
         - "[Problem] solution"
         - "Best [product] for [specific problem]"
         - "How to [desired outcome]"
         - "[Product] for [challenging situation]"
      
      5. Audience-Targeted Keywords:
         - "[Product] for [demographic]"
         - "[Professional/skill level] [product]"
         - "[Industry-specific] [product]"
         - "[Environment/location-specific] [product]"
      
      6. Product Life Cycle Keywords:
         - "[Product] installation guide"
         - "[Product] maintenance tips" 
         - "How to clean [product]"
         - "[Product] troubleshooting"
         - "[Product] replacement parts"
      
      Step 3: Strategic Product Description Crafting
      Create a precisely optimized 350-word product description that:
      - Opens with the primary benefit/value proposition
      - Naturally incorporates 5-7 high-value commercial keywords
      - Uses diverse vocabulary and semantic variations instead of repetition
      - Addresses each major purchase consideration
      - Uses benefit-driven bullet points for scannable content
      - Employs persuasive psychology principles
      - Optimizes for semantic search and natural language processing
      
      Step 4: Comprehensive Keyword Strategy Development
      Create a conversion-focused keyword strategy with:
      
      1. 50 highest-value SEO keywords that:
         - Focus primarily on commercial and research intent
         - Target specific user needs and purchase motivations
         - Avoid redundant repetition of the product name in every keyword
         - Use natural language variations and diverse phrasing
         - Include precise commercial modifiers (not generic ones)
         - Feature actual product attributes users search for
         - Mix short and long-tail terms with different competition levels
         - Incorporate synonyms and related terms for semantic coverage
      
      CRITICAL REQUIREMENTS:
      - Create diverse keyword patterns - avoid repeating the same structure
      - Don't redundantly append the product name to every keyword
      - Focus on naturally phrased terms real users search for
      - Include a mix of singular and plural forms where appropriate
      - Prioritize keywords with genuine commercial intent
      - Ensure semantic coverage with related terms and synonyms
      - Incorporate industry-specific terminology where relevant
         - Include semantically related variations (not just word order changes)
         - Represent the entire purchase funnel (awareness to conversion)
         - Include product-specific terminology and modifiers
         - Focus on terms with demonstrated search volume and conversion potential
         - Prioritize moderate competition/high conversion terms 
         - Are segmented by search intent and funnel position
      
      2. An optimized title tag (50-60 characters) that:
         - Leads with the highest-converting commercial keyword
         - Includes the most distinctive product benefit/feature
         - Contains a compelling reason to click
         - Uses power words that drive emotional response
         - Maintains complete readability and natural language
      
      3. A conversion-optimized meta description (150-160 characters) that:
         - Opens with an engaging hook targeting the primary user need
         - Includes a unique value proposition
         - Incorporates 2-3 secondary keywords naturally
         - Contains a strong call-to-action
         - Creates urgency or addresses a key purchase objection
      
      4. 15 high-potential long-tail keywords with:
         - Detailed search intent classification
         - Specific funnel position identification
         - Competition level assessment (low/medium/high)
         - Conversion potential rating (scale 1-10)
         - Primary content type recommendation for each
      
      5. 10 product features mapped to user benefits with:
         - Specific pain point addressed by each feature
         - Emotional benefit connected to each feature
         - Primary keyword reflecting this feature-benefit relationship
         - Secondary keyword variations for this feature
      
      6. 7 buyer persona profiles with:
         - Demographic and psychographic indicators
         - Primary purchase motivations and objections
         - Search behavior patterns (devices, query types, time patterns)
         - Platform preferences and shopping habits
         - Keyword preferences by funnel stage
      
      7. 8 technical SEO implementation priorities:
         - Schema markup recommendations with exact types and properties
         - Content structure for SERP feature optimization
         - Internal linking architecture with anchor text recommendations
         - Semantic HTML implementation priorities
         - Page speed and Core Web Vitals optimization paths
         - Mobile optimization priorities
         - Structured data implementation plan
         - Image optimization with alt text patterns
      
      8. Competitor keyword gap analysis (250 words) identifying:
         - Competitor ranking patterns and algorithm preferences
         - Untapped high-value keyword opportunities
         - Content gaps in the competitive landscape
         - Emerging trends in the product category
         - Low-competition, high-conversion keyword niches
         - SERP feature opportunities competitors are missing
      
      9. 5 strategic content pillars with:
         - Core topic focus and semantic field
         - Supporting subtopic structure
         - Primary and secondary keywords for each pillar
         - Content types and formats for each pillar
         - SERP feature targets for each pillar
         - Internal linking strategy between pillars
      
      Step 5: E-commerce Platform Keyword Optimization
      Develop platform-specific keyword strategies optimized for each algorithm:
      
      1. Amazon (15 keywords):
         - Back-end search terms optimized for A9/A10 algorithm weightings
         - Category-specific ranking factors
         - Buy Box optimization terms
         - Amazon PPC high-conversion terms
         - Mobile search patterns specific to Amazon
      
      2. Flipkart (15 keywords):
         - India-specific usage patterns and regional variations
         - Flipkart search algorithm preference terms
         - Category-specific ranking factors
         - Flipkart filter and sort optimization terms
         - India market value-proposition terms
      
      3. Meesho (15 keywords):
         - Reseller and wholesale focused terminology
         - Bulk purchase and quantity discount terms
         - Meesho-specific search patterns
         - Value-focused and price-sensitive terms
         - Supplier quality and reliability indicators
      
      4. Myntra (15 keywords):
         - Fashion-specific terminology and descriptors
         - Seasonal and trend-specific variations
         - Occasion and usage-specific terms
         - Material, construction and quality indicators
         - Style and aesthetic descriptors
      
      Format the entire response as a clean, structured JSON with the following format:
      {
        "productDescription": "detailed description...",
        "keywords": ["keyword1", "keyword2", ...],
        "seoTitle": "SEO optimized title",
        "metaDescription": "Meta description for search engines",
        "longTailKeywords": ["long-tail keyword 1", ...],
        "productFeatures": ["feature 1", ...],
        "targetAudience": ["audience segment 1", ...],
        "seoRecommendations": ["recommendation 1", ...],
        "competitorAnalysis": "analysis text...",
        "contentIdeas": ["content idea 1", ...],
        "ecommerceKeywords": {
          "amazon": ["keyword1", "keyword2", ...],
          "flipkart": ["keyword1", "keyword2", ...],
          "meesho": ["keyword1", "keyword2", ...],
          "myntra": ["keyword1", "keyword2", ...]
        }
      }
      
      CRITICAL REQUIREMENTS:
      - Focus exclusively on keywords with proven search volume and conversion potential
      - Ensure every keyword has clear commercial or navigational intent
      - Prioritize keywords based on funnel position and purchase intent
      - Structure keywords to match actual user search patterns
      - Include semantic variations rather than simple word reordering
      - Target specific product attributes, features, and benefits
      - Incorporate emerging voice search and question-based patterns
      - Optimize for both mobile and desktop search behaviors
      - Address competitive gaps and low-competition opportunities
      - Balance short-term conversion terms with long-term authority building
      - Format as clean JSON with no extraneous text
    `;

    const result = await model.generateContent(seoPrompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Parse the JSON response
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('Invalid JSON format in response');
      }
      
      const jsonText = text.substring(jsonStart, jsonEnd + 1);
      const parsedData = JSON.parse(jsonText);
      
      // Add combined keywords from all sources
      const combinedSet = new Set<string>();
      
      // Add regular keywords
      if (parsedData.keywords && Array.isArray(parsedData.keywords)) {
        parsedData.keywords.forEach((kw: string) => combinedSet.add(kw.toLowerCase()));
      }
      
      // Add long-tail keywords
      if (parsedData.longTailKeywords && Array.isArray(parsedData.longTailKeywords)) {
        parsedData.longTailKeywords.forEach((kw: string) => combinedSet.add(kw.toLowerCase()));
      }
      
      // Add e-commerce keywords
      if (parsedData.ecommerceKeywords) {
        Object.values(parsedData.ecommerceKeywords).forEach((keywordList: any) => {
          if (Array.isArray(keywordList)) {
            keywordList.forEach((kw: string) => combinedSet.add(kw.toLowerCase()));
          }
        });
      }
      
      // Add the combined keywords to the response
      parsedData.combinedKeywords = Array.from(combinedSet);
      
      return parsedData;
    } catch (parseError) {
      console.error('Error parsing JSON from Gemini response:', parseError);
      return getMockSEOPackage(productName);
    }
  } catch (error) {
    console.error('Error generating SEO content with Gemini:', error);
    return getMockSEOPackage(productName);
  }
}

// Mock data generators
function getMockKeywords(productName: string): string[] {
  const baseKeywords = [
    `${productName}`,
    `best ${productName}`,
    `buy ${productName} online`,
    `${productName} price`,
    `${productName} review`,
    `premium quality`,
    `affordable options`,
    `near me`,
    `top-rated brands`,
    `professional grade`,
    `for beginners`,
    `home use`,
    `key features`,
    `customer benefits`,
    `technical specifications`,
    `maintenance tips`,
    `installation guide`,
    `warranty options`,
    `buying guide`,
    `comparison chart`,
  ];
  
  // Variations with more natural language and diverse patterns
  const variations = [
    `how to choose the right ${productName}`,
    `${productName} vs competitors`,
    `best brands in 2023`,
    `free shipping options`,
    `discount codes`,
    `seasonal deals`,
    `price comparison`,
    `top manufacturers`,
    `latest models`,
    `size guide`,
    `color options`,
    `extended warranty`,
    `care instructions`,
    `compatible accessories`,
    `replacement parts`,
    `easy setup`,
    `user manual`,
    `video tutorials`,
    `for professional use`,
    `business solutions`,
    `eco-friendly options`,
    `energy efficient`,
    `space-saving design`,
    `ergonomic features`,
    `lightweight and portable`,
    `heavy-duty construction`,
    `smart connectivity`,
    `app controls`,
    `voice activated`,
    `budget-friendly alternatives`
  ];
  
  return [...baseKeywords, ...variations].slice(0, 50);
}

function getMockSEOPackage(productName: string) {
  return {
    productDescription: `Introducing our premium ${productName}, designed with the utmost attention to quality and functionality. This exceptional product combines cutting-edge technology with elegant design, making it a standout choice for discerning customers. Crafted using superior materials and innovative manufacturing techniques, our ${productName} offers unparalleled durability and performance.

The ${productName} features an intuitive interface that makes operation simple and straightforward, even for first-time users. Its sleek, modern aesthetic complements any environment, while its compact form factor ensures it doesn't occupy unnecessary space. We've carefully considered every aspect of the user experience to deliver a product that exceeds expectations.

What sets our ${productName} apart is its versatility and adaptability to different needs and situations. Whether you're using it at home, in a professional setting, or on the go, it consistently delivers exceptional results. The thoughtfully engineered features address common pain points with elegant solutions, enhancing your daily routine.

Our ${productName} is not just a purchase but an investment in quality and convenience. It comes with comprehensive customer support and a robust warranty, reflecting our confidence in its longevity. Experience the perfect balance of form and function with our meticulously designed ${productName} – the smart choice for those who value excellence.`,
    
    keywords: [
      `${productName}`, 
      `best ${productName}`,
      `premium ${productName}`,
      `${productName} online`,
      `buy ${productName}`,
      `${productName} review`,
      `affordable ${productName}`,
      `high-quality ${productName}`,
      `${productName} features`,
      `${productName} benefits`,
      `${productName} specifications`,
      `${productName} price`,
      `top rated ${productName}`,
      `${productName} comparison`,
      `professional ${productName}`,
      `${productName} for home use`,
      `${productName} for beginners`,
      `advanced ${productName}`,
      `${productName} accessories`,
      `${productName} maintenance`,
      `${productName} warranty`,
      `${productName} models`,
      `latest ${productName}`,
      `${productName} brands`,
      `compact ${productName}`,
      `portable ${productName}`,
      `ergonomic ${productName}`,
      `durable ${productName}`,
      `efficient ${productName}`,
      `user-friendly ${productName}`
    ],
    
    seoTitle: `Premium ${productName} | High-Quality, Affordable & Durable`,
    
    metaDescription: `Discover our exceptional ${productName} featuring advanced technology, premium design, and unmatched durability. Shop now for the best prices and free shipping!`,
    
    longTailKeywords: [
      `how to choose the best ${productName}`,
      `${productName} for small apartments`,
      `professional grade ${productName} for home use`,
      `${productName} with extended warranty`,
      `energy efficient ${productName} reviews`,
      `most durable ${productName} 2023`,
      `${productName} for beginners buying guide`,
      `affordable premium ${productName} options`,
      `${productName} with smart features`,
      `best ${productName} for the money`,
      `${productName} with easiest maintenance`,
      `${productName} for elderly users`,
      `compact ${productName} for travel`
    ],
    
    productFeatures: [
      `Premium quality materials for exceptional durability`,
      `Intuitive interface for easy operation`,
      `Sleek, modern design that complements any environment`,
      `Space-saving compact form factor`,
      `Multiple usage settings for different environments`,
      `Energy-efficient operation`,
      `Quick setup and minimal maintenance required`,
      `Compatible with a wide range of accessories`,
      `Advanced technology for superior performance`,
      `Ergonomic design for comfortable use`
    ],
    
    targetAudience: [
      `Busy professionals seeking time-saving solutions`,
      `Home enthusiasts looking for quality appliances`,
      `First-time buyers who need user-friendly products`,
      `Tech-savvy consumers interested in modern features`,
      `Quality-conscious shoppers who value durability`,
      `Small business owners with professional needs`,
      `Elderly users who prefer easy-to-use products`
    ],
    
    seoRecommendations: [
      `Create detailed product pages with comprehensive specifications`,
      `Develop a comparison chart with competitor products`,
      `Include high-quality images showcasing the product from multiple angles`,
      `Produce video demonstrations highlighting key features and benefits`,
      `Gather and showcase authentic customer reviews and testimonials`,
      `Create FAQ sections addressing common customer questions`,
      `Optimize for local search with "near me" keywords`,
      `Develop detailed how-to guides and tutorials for users`
    ],
    
    competitorAnalysis: `The ${productName} market is currently dominated by established brands focusing primarily on premium features at higher price points. Most competitors emphasize technical specifications but often overlook user experience and ease of maintenance, creating a gap in the market. Budget options typically sacrifice durability and long-term reliability for initial affordability.

Our analysis reveals that consumers are increasingly seeking products that balance quality with value - an area where many competitors fall short. There's also growing demand for products with intuitive interfaces and minimal learning curves, with competitor products often criticized for complicated setup processes.

Strategic opportunities exist in highlighting our ${productName}'s superior user experience, maintenance simplicity, and long-term value proposition. By addressing these key consumer pain points that competitors neglect, we can effectively differentiate our offering in this competitive landscape.`,
    
    contentIdeas: [
      `"The Complete Guide to Choosing Your First ${productName}"`,
      `"10 Innovative Ways to Use Your ${productName} You Haven't Thought Of"`,
      `"${productName} Maintenance: Simple Tips to Double Its Lifespan"`,
      `"How Our ${productName} Compares to Leading Brands: An Honest Review"`,
      `"Expert Interview: The Technology Behind Modern ${productName} Design"`
    ],
    
    ecommerceKeywords: {
      amazon: [
        `best selling ${productName}`,
        `${productName} with prime delivery`,
        `top rated ${productName}`,
        `${productName} best seller`,
        `premium ${productName}`,
        `affordable ${productName}`,
        `${productName} with warranty`,
        `${productName} with free shipping`,
        `${productName} gift`,
        `${productName} bundle`
      ],
      flipkart: [
        `${productName} lowest price`,
        `${productName} with no cost EMI`,
        `best ${productName} flipkart`,
        `${productName} with exchange offer`,
        `${productName} big discount`,
        `${productName} combo offer`,
        `${productName} special edition`,
        `${productName} latest model`,
        `${productName} best deals`,
        `${productName} all sizes`
      ],
      meesho: [
        `${productName} wholesale`,
        `${productName} bulk order`,
        `cheap ${productName}`,
        `${productName} reseller`,
        `${productName} low price`,
        `${productName} cash on delivery`,
        `${productName} supplier`,
        `${productName} manufacturer`,
        `${productName} budget friendly`,
        `${productName} best quality`
      ],
      myntra: [
        `trendy ${productName}`,
        `${productName} fashion`,
        `${productName} new arrival`,
        `designer ${productName}`,
        `${productName} for men`,
        `${productName} for women`,
        `${productName} premium collection`,
        `${productName} latest collection`,
        `${productName} best brands`,
        `${productName} festival offer`
      ]
    },
    
    combinedKeywords: getMockKeywords(productName)
  };
} 