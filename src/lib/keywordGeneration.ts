import { fetchExternalKeywords, ScrapedKeywords } from './scraper';
import { generateKeywords } from './gemini';

export interface KeywordGenerationResult {
  internalKeywords: string[];
  externalKeywords: ScrapedKeywords[];
  combinedKeywords: string[];
}

export async function generateEcommerceKeywords(
  productName: string,
  productDescription: string
): Promise<KeywordGenerationResult> {
  // Generate internal keywords using Gemini
  const internalKeywords = await generateKeywords(productName, productDescription);
  
  // Fetch external keywords from e-commerce platforms
  let externalKeywords: ScrapedKeywords[] = [];
  try {
    externalKeywords = await fetchExternalKeywords(productName);
  } catch (error) {
    console.error('Error fetching external keywords:', error);
    // Continue with internal keywords only
  }
  
  // Combine all keywords
  const allKeywords = new Set<string>();
  
  // Add internal keywords
  internalKeywords.forEach(keyword => allKeywords.add(keyword.toLowerCase()));
  
  // Add external keywords from each platform
  externalKeywords.forEach(source => {
    source.keywords.forEach(keyword => allKeywords.add(keyword.toLowerCase()));
  });
  
  // Convert back to array and sort
  const combinedKeywords = Array.from(allKeywords).sort();
  
  return {
    internalKeywords,
    externalKeywords,
    combinedKeywords
  };
}

// Extract detailed product information from text
function extractProductInformation(text: string) {
  const categories = detectProductCategory(text);
  const ageGroups = detectAgeGroups(text);
  const features = extractFeatures(text);
  const brands = extractBrands(text);
  const educationalValues = detectEducationalValues(text);
  const colors = extractColors(text);

  return {
    categories,
    ageGroups,
    features,
    brands,
    educationalValues,
    colors
  };
}

// Generate keywords based on the extracted product context
function generateKeywordsBasedOnContext(
  productInfo: ReturnType<typeof extractProductInformation>,
  text: string,
  options: { includeCategories: boolean; includeAgeGroups: boolean; includeBenefits: boolean }
): string[] {
  const keywords: string[] = [text]; // Start with the base text
  
  // Add category-based keywords
  if (options.includeCategories && productInfo.categories.length > 0) {
    productInfo.categories.forEach(category => {
      keywords.push(`${text} ${category}`);
      keywords.push(`${category} ${text}`);
    });
  }
  
  // Add age-group based keywords
  if (options.includeAgeGroups && productInfo.ageGroups.length > 0) {
    productInfo.ageGroups.forEach(ageGroup => {
      keywords.push(`${text} for ${ageGroup}`);
      keywords.push(`${ageGroup} ${text}`);
    });
  }
  
  // Add benefit/feature based keywords
  if (options.includeBenefits && productInfo.features.length > 0) {
    productInfo.features.forEach(feature => {
      keywords.push(`${text} with ${feature}`);
      keywords.push(`${feature} ${text}`);
    });
  }
  
  // Add brand-based keywords
  if (productInfo.brands.length > 0) {
    productInfo.brands.forEach(brand => {
      keywords.push(`${brand} ${text}`);
    });
  }
  
  // Add color-based keywords if available
  if (productInfo.colors.length > 0) {
    productInfo.colors.forEach(color => {
      keywords.push(`${color} ${text}`);
      keywords.push(`${text} in ${color}`);
    });
  }
  
  // Add educational value keywords if relevant
  if (productInfo.educationalValues.length > 0) {
    productInfo.educationalValues.forEach(value => {
      keywords.push(`${text} for ${value}`);
      keywords.push(`${value} ${text}`);
    });
  }
  
  return keywords;
}

// Detect main product category and related subcategories
function detectProductCategory(text: string): string[] {
  const categoryMapping = {
    // Educational products
    educational: ['learning', 'education', 'educational', 'school', 'academic', 'study', 'teach', 'lesson'],
    toys: ['toy', 'game', 'play', 'puzzle', 'building', 'blocks', 'doll', 'action figure'],
    games: ['game', 'board game', 'card game', 'puzzle', 'educational game'],
    books: ['book', 'story', 'reading', 'textbook', 'workbook', 'notebook'],
    electronics: ['electronic', 'digital', 'device', 'gadget', 'tech', 'tablet', 'computer', 'laptop', 'phone'],
    // Specific educational products
    flashcards: ['flash card', 'flashcard', 'card', 'learning card'],
    mathTools: ['math', 'mathematics', 'arithmetic', 'counting', 'number', 'addition', 'subtraction'],
    spellingTools: ['spell', 'spelling', 'letter', 'word', 'language', 'vocabulary'],
    scienceKits: ['science', 'experiment', 'lab', 'chemistry', 'biology', 'physics'],
    // Home and living
    furniture: ['furniture', 'chair', 'table', 'desk', 'bed', 'sofa', 'couch', 'shelf'],
    kitchen: ['kitchen', 'cook', 'bake', 'utensil', 'appliance', 'dish', 'plate', 'cup'],
    // Fashion
    clothing: ['cloth', 'wear', 'shirt', 't-shirt', 'pant', 'dress', 'skirt', 'jacket', 'coat'],
    shoes: ['shoe', 'footwear', 'sneaker', 'boot', 'sandal', 'heel'],
    // Beauty and personal care
    beauty: ['beauty', 'makeup', 'cosmetic', 'skin care', 'skincare', 'lotion', 'cream'],
    // Sports and outdoors
    sports: ['sport', 'exercise', 'fitness', 'gym', 'workout', 'train', 'athletic'],
    outdoor: ['outdoor', 'camping', 'hiking', 'travel', 'adventure']
  };
  
  const detectedCategories: string[] = [];
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        detectedCategories.push(category);
        break;
      }
    }
  }
  return detectedCategories;
}

// Detect age groups mentioned in the text
function detectAgeGroups(text: string): string[] {
  const agePatterns = [
    { group: 'baby', keywords: ['baby', 'infant', 'newborn', '0-12 months', '0-1 year'] },
    { group: 'toddler', keywords: ['toddler', '1-3 years', 'preschool'] },
    { group: 'kids', keywords: ['kid', 'child', 'children', '3-12 years', 'elementary'] },
    { group: 'teen', keywords: ['teen', 'teenager', 'adolescent', '13-19 years', 'middle school', 'high school'] },
    { group: 'adult', keywords: ['adult', '18+', 'grown-up', 'men', 'women'] },
    { group: 'senior', keywords: ['senior', 'elderly', 'older adult'] }
  ];
  
  const detectedAgeGroups: string[] = [];
  for (const { group, keywords } of agePatterns) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        detectedAgeGroups.push(group);
        break;
      }
    }
  }
  
  return detectedAgeGroups;
}

// Extract product features
function extractFeatures(text: string): string[] {
  const featurePatterns = [
    'waterproof', 'rechargeable', 'wireless', 'portable', 'foldable', 'adjustable',
    'lightweight', 'durable', 'easy to use', 'comfortable', 'ergonomic', 'non-toxic',
    'eco-friendly', 'sustainable', 'organic', 'handmade', 'multifunctional', 'interactive'
  ];
  
  return featurePatterns.filter(feature => text.includes(feature));
}

// Extract potential brand names
function extractBrands(text: string): string[] {
  // This is a simplified approach - would need NER for better results
  const commonBrands = [
    'apple', 'samsung', 'google', 'microsoft', 'amazon', 'fisher-price', 'lego', 'nike',
    'adidas', 'puma', 'ikea', 'sony', 'hp', 'dell', 'lenovo', 'asus', 'acer', 'lg'
  ];
  
  return commonBrands.filter(brand => 
    text.includes(brand) || 
    text.includes(brand.toUpperCase()) || 
    text.includes(brand.charAt(0).toUpperCase() + brand.slice(1))
  );
}

// Detect educational values for educational products
function detectEducationalValues(text: string): string[] {
  const valuePatterns = [
    'cognitive development', 'motor skills', 'fine motor', 'gross motor',
    'hand-eye coordination', 'problem solving', 'critical thinking', 'creativity',
    'imagination', 'language development', 'vocabulary', 'math skills', 'stem',
    'science', 'technology', 'engineering', 'art', 'social skills', 'emotional intelligence'
  ];
  
  return valuePatterns.filter(value => text.includes(value));
}

// Extract color information
function extractColors(text: string): string[] {
  const commonColors = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black',
    'white', 'gray', 'silver', 'gold', 'transparent', 'multicolor'
  ];
  
  return commonColors.filter(color => text.includes(color));
}

function formatKeywords(keywords: string[], maxKeywords: number): string[] {
  const uniqueKeywords = Array.from(new Set(keywords));
  const filteredKeywords = uniqueKeywords.filter(keyword => {
    return keyword.length >= 5 && keyword.length <= 50;
  });
  const formattedKeywords = filteredKeywords.map(keyword => capitalizeWords(keyword));
  const sortedKeywords = formattedKeywords.sort((a, b) => {
    const aIsEducational = isEducationalKeyword(a);
    const bIsEducational = isEducationalKeyword(b);
    if (aIsEducational && !bIsEducational) return -1;
    if (!aIsEducational && bIsEducational) return 1;
    return a.length - b.length;
  });
  return sortedKeywords.slice(0, Math.min(maxKeywords, sortedKeywords.length));
}

function isEducationalKeyword(keyword: string): boolean {
  const educationalTerms = [
    'learn', 'education', 'educational', 'teaching', 'school',
    'math', 'spelling', 'reading', 'writing', 'science',
    'brain', 'development', 'cognitive', 'skill', 'montessori',
    'kindergarten', 'preschool', 'flash card', 'flashcard'
  ];
  const lowerKeyword = keyword.toLowerCase();
  return educationalTerms.some(term => lowerKeyword.includes(term));
}

function capitalizeWords(str: string): string {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
