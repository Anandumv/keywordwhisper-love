import axios from 'axios';
import * as cheerio from 'cheerio';

// Function to scrape Amazon search suggestions
async function scrapeAmazonSuggestions(productName) {
  try {
    const response = await axios.get(`https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix=${encodeURIComponent(productName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data.suggestions || [];
  } catch (error) {
    console.error('Error scraping Amazon suggestions:', error.message);
    return [];
  }
}

// Function to scrape eBay search suggestions
async function scrapeEbaySuggestions(productName) {
  try {
    const response = await axios.get(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(productName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const suggestions = [];
    
    // Extract search suggestions from the page
    $('.srp-related-searches__item').each((i, element) => {
      suggestions.push($(element).text().trim());
    });
    
    return suggestions;
  } catch (error) {
    console.error('Error scraping eBay suggestions:', error.message);
    return [];
  }
}

// Function to scrape Google search suggestions
async function scrapeGoogleSuggestions(productName) {
  try {
    const response = await axios.get(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(productName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data[1] || [];
  } catch (error) {
    console.error('Error scraping Google suggestions:', error.message);
    return [];
  }
}

// Function to scrape Etsy search suggestions
async function scrapeEtsySuggestions(productName) {
  try {
    const response = await axios.get(`https://www.etsy.com/search?q=${encodeURIComponent(productName)}`);
    const $ = cheerio.load(response.data);
    const suggestions = [];
    
    // Extract search suggestions from the page
    $('.search-suggestions-item').each((i, element) => {
      suggestions.push($(element).text().trim());
    });
    
    return suggestions;
  } catch (error) {
    console.error('Error scraping Etsy suggestions:', error);
    return [];
  }
}

// Function to generate fallback keywords
function generateFallbackKeywords(productName) {
  const modifiers = [
    'best',
    'top',
    'new',
    'popular',
    'quality',
    'premium',
    'affordable',
    'cheap',
    'discount',
    'sale'
  ];

  const categories = [
    'for kids',
    'for children',
    'for toddlers',
    'for babies',
    'for adults',
    'for family',
    'for home',
    'for school',
    'for office',
    'for travel'
  ];

  const keywords = new Set();
  
  // Generate basic combinations
  modifiers.forEach(modifier => {
    categories.forEach(category => {
      keywords.add(`${modifier} ${productName} ${category}`.trim().toLowerCase());
      keywords.add(`${productName} ${category}`.trim().toLowerCase());
    });
    keywords.add(`${modifier} ${productName}`.trim().toLowerCase());
  });

  return Array.from(keywords);
}

// Main function to scrape keywords from all sources
export async function scrapeKeywords(productName) {
  try {
    console.log('Starting keyword scraping for:', productName);
    
    // Scrape from all sources in parallel with timeout
    const timeout = 5000; // 5 seconds timeout
    const scrapingPromises = [
      scrapeAmazonSuggestions(productName),
      scrapeEbaySuggestions(productName),
      scrapeGoogleSuggestions(productName)
    ].map(p => Promise.race([
      p,
      new Promise(resolve => setTimeout(() => resolve([]), timeout))
    ]));

    const [amazonKeywords, ebayKeywords, googleKeywords] = await Promise.all(scrapingPromises);
    
    // Combine all keywords and remove duplicates
    const allKeywords = new Set([
      ...amazonKeywords,
      ...ebayKeywords,
      ...googleKeywords
    ]);
    
    // If no keywords were scraped, use fallback generation
    if (allKeywords.size === 0) {
      console.log('No keywords scraped, using fallback generation');
      return generateFallbackKeywords(productName);
    }
    
    console.log(`Scraped ${allKeywords.size} unique keywords`);
    return Array.from(allKeywords);
  } catch (error) {
    console.error('Error in keyword scraping:', error.message);
    // Return fallback keywords if scraping fails
    return generateFallbackKeywords(productName);
  }
}

// Function to scrape Amazon product data
async function scrapeAmazonData(productName) {
  try {
    const response = await axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(productName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const $ = cheerio.load(response.data);
    const products = [];
    
    // Extract product data
    $('.s-result-item').each((i, element) => {
      if (i < 5) { // Get top 5 products
        const title = $(element).find('h2 a span').text().trim();
        const price = $(element).find('.a-price .a-offscreen').text().trim();
        const rating = $(element).find('.a-icon-star-small .a-icon-alt').text().trim();
        const reviews = $(element).find('.a-size-small .a-link-normal').text().trim();
        
        if (title) {
          products.push({
            title,
            price,
            rating,
            reviews,
            platform: 'Amazon'
          });
        }
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error scraping Amazon data:', error.message);
    return [];
  }
}

// Function to scrape Flipkart product data
async function scrapeFlipkartData(productName) {
  try {
    const response = await axios.get(`https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const products = [];
    
    // Extract product data
    $('._1AtVbE').each((i, element) => {
      if (i < 5) { // Get top 5 products
        const title = $(element).find('._4rR01T').text().trim();
        const price = $(element).find('._30jeq3').text().trim();
        const rating = $(element).find('._3LWZlK').text().trim();
        const reviews = $(element).find('._2_R_DZ span').text().trim();
        
        if (title) {
          products.push({
            title,
            price,
            rating,
            reviews,
            platform: 'Flipkart'
          });
        }
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error scraping Flipkart data:', error.message);
    return [];
  }
}

// Function to scrape Myntra product data
async function scrapeMyntraData(productName) {
  try {
    const response = await axios.get(`https://www.myntra.com/${encodeURIComponent(productName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const products = [];
    
    // Extract product data
    $('.product-base').each((i, element) => {
      if (i < 5) { // Get top 5 products
        const title = $(element).find('.product-product').text().trim();
        const price = $(element).find('.product-discountedPrice').text().trim();
        const rating = $(element).find('.product-ratingsContainer').text().trim();
        
        if (title) {
          products.push({
            title,
            price,
            rating,
            platform: 'Myntra'
          });
        }
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error scraping Myntra data:', error.message);
    return [];
  }
}

// Function to scrape Meesho product data
async function scrapeMeeshoData(productName) {
  try {
    const response = await axios.get(`https://www.meesho.com/search?q=${encodeURIComponent(productName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const products = [];
    
    // Extract product data
    $('.ProductList__GridCol-sc-8lnc8s-0').each((i, element) => {
      if (i < 5) { // Get top 5 products
        const title = $(element).find('.ProductCard__Title-sc-8lnc8s-4').text().trim();
        const price = $(element).find('.ProductCard__Price-sc-8lnc8s-6').text().trim();
        
        if (title) {
          products.push({
            title,
            price,
            platform: 'Meesho'
          });
        }
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error scraping Meesho data:', error.message);
    return [];
  }
}

// Function to extract keywords from product titles
function extractKeywordsFromProducts(products) {
  const keywords = new Set();
  
  products.forEach(product => {
    if (product.title) {
      // Split title into words and add to keywords
      const words = product.title.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) { // Only add words longer than 2 characters
          keywords.add(word);
        }
      });
      
      // Add the full title as a potential keyword
      keywords.add(product.title.toLowerCase());
    }
  });
  
  return Array.from(keywords);
}

// Main function to scrape competitor data and keywords
export async function scrapeCompetitorData(productName) {
  try {
    console.log('Starting competitor analysis for:', productName);
    
    // Scrape data from all platforms in parallel
    const [amazonProducts, flipkartProducts, myntraProducts, meeshoProducts] = await Promise.all([
      scrapeAmazonData(productName),
      scrapeFlipkartData(productName),
      scrapeMyntraData(productName),
      scrapeMeeshoData(productName)
    ]);
    
    // Combine all products
    const allProducts = [
      ...amazonProducts,
      ...flipkartProducts,
      ...myntraProducts,
      ...meeshoProducts
    ];
    
    // Extract keywords from product titles
    const keywords = extractKeywordsFromProducts(allProducts);
    
    // Calculate average price
    const prices = allProducts
      .filter(p => p.price)
      .map(p => parseFloat(p.price.replace(/[^0-9.]/g, '')));
    const avgPrice = prices.length > 0 
      ? prices.reduce((a, b) => a + b, 0) / prices.length 
      : null;
    
    // Calculate average rating
    const ratings = allProducts
      .filter(p => p.rating)
      .map(p => parseFloat(p.rating.split(' ')[0]));
    const avgRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : null;
    
    console.log(`Analyzed ${allProducts.length} products from competitors`);
    
    return {
      products: allProducts,
      keywords,
      analysis: {
        totalProducts: allProducts.length,
        averagePrice: avgPrice,
        averageRating: avgRating,
        platforms: {
          amazon: amazonProducts.length,
          flipkart: flipkartProducts.length,
          myntra: myntraProducts.length,
          meesho: meeshoProducts.length
        }
      }
    };
  } catch (error) {
    console.error('Error in competitor analysis:', error.message);
    return {
      products: [],
      keywords: [],
      analysis: {
        totalProducts: 0,
        averagePrice: null,
        averageRating: null,
        platforms: {
          amazon: 0,
          flipkart: 0,
          myntra: 0,
          meesho: 0
        }
      }
    };
  }
} 