import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ScrapedKeywords {
  source: string;
  keywords: string[];
}

export async function fetchExternalKeywords(text: string): Promise<ScrapedKeywords[]> {
  try {
    // Check if Python is installed
    try {
      await execAsync('python3 --version');
    } catch (error) {
      console.warn('Python is not installed or not in PATH. Skipping external keyword scraping.');
      return [];
    }

    // Check if required Python packages are installed
    try {
      await execAsync('python3 -c "import requests, bs4"');
    } catch (error) {
      console.warn('Required Python packages (requests, bs4) are not installed. Skipping external keyword scraping.');
      return [];
    }

    const pythonScript = `
import requests
from bs4 import BeautifulSoup
import re
import json
import time
import random

def clean_text(text):
    # Remove special characters and extra spaces
    text = re.sub(r'[^\\w\\s]', ' ', text)
    text = re.sub(r'\\s+', ' ', text).strip()
    return text

def extract_keywords_from_text(text):
    # Split by common separators and clean
    keywords = []
    for part in re.split(r'[,|\\-|\\|]', text):
        cleaned = clean_text(part)
        if cleaned and len(cleaned) > 2:  # Only keep meaningful keywords
            keywords.append(cleaned)
    return keywords

def fetch_flipkart_keywords(product_text):
    try:
        url = "https://www.flipkart.com/search?q=" + product_text.replace(" ", "+")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract product titles
        products = soup.find_all("a", class_="IRpwTa") or soup.find_all("div", class_="_4rR01T")
        titles = [product.get_text().strip() for product in products if product.get_text().strip()]
        
        # Extract product descriptions
        descriptions = soup.find_all("div", class_="_1YokD2") or soup.find_all("div", class_="fMghEO")
        desc_texts = [desc.get_text().strip() for desc in descriptions if desc.get_text().strip()]
        
        # Extract keywords from titles and descriptions
        keywords = []
        for title in titles:
            keywords.extend(extract_keywords_from_text(title))
        
        for desc in desc_texts:
            keywords.extend(extract_keywords_from_text(desc))
        
        # Remove duplicates and return
        return list(set(keywords))
    except Exception as e:
        print(f"Error fetching Flipkart keywords: {str(e)}")
        return []

def fetch_amazon_keywords(product_text):
    try:
        url = "https://www.amazon.in/s?k=" + product_text.replace(" ", "+")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract product titles
        products = soup.find_all("span", class_="a-text-normal") or soup.find_all("h2", class_="a-size-mini")
        titles = [product.get_text().strip() for product in products if product.get_text().strip()]
        
        # Extract product descriptions
        descriptions = soup.find_all("div", class_="a-section") or soup.find_all("div", class_="a-row a-size-base")
        desc_texts = [desc.get_text().strip() for desc in descriptions if desc.get_text().strip()]
        
        # Extract keywords from titles and descriptions
        keywords = []
        for title in titles:
            keywords.extend(extract_keywords_from_text(title))
        
        for desc in desc_texts:
            keywords.extend(extract_keywords_from_text(desc))
        
        # Remove duplicates and return
        return list(set(keywords))
    except Exception as e:
        print(f"Error fetching Amazon keywords: {str(e)}")
        return []

def fetch_meesho_keywords(product_text):
    try:
        url = "https://www.meesho.com/search?q=" + product_text.replace(" ", "+")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract product titles
        products = soup.find_all("p", class_="Text__StyledTypography-sc-oo0kvp-0") or soup.find_all("div", class_="ProductCard__Title")
        titles = [product.get_text().strip() for product in products if product.get_text().strip()]
        
        # Extract product descriptions
        descriptions = soup.find_all("div", class_="ProductCard__Description") or soup.find_all("p", class_="ProductCard__Subtitle")
        desc_texts = [desc.get_text().strip() for desc in descriptions if desc.get_text().strip()]
        
        # Extract keywords from titles and descriptions
        keywords = []
        for title in titles:
            keywords.extend(extract_keywords_from_text(title))
        
        for desc in desc_texts:
            keywords.extend(extract_keywords_from_text(desc))
        
        # Remove duplicates and return
        return list(set(keywords))
    except Exception as e:
        print(f"Error fetching Meesho keywords: {str(e)}")
        return []

def fetch_myntra_keywords(product_text):
    try:
        url = "https://www.myntra.com/search?q=" + product_text.replace(" ", "+")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract product titles
        products = soup.find_all("h3", class_="product-base") or soup.find_all("div", class_="product-productMetaInfo")
        titles = [product.get_text().strip() for product in products if product.get_text().strip()]
        
        # Extract product descriptions
        descriptions = soup.find_all("div", class_="product-description") or soup.find_all("div", class_="product-productMetaInfo")
        desc_texts = [desc.get_text().strip() for desc in descriptions if desc.get_text().strip()]
        
        # Extract keywords from titles and descriptions
        keywords = []
        for title in titles:
            keywords.extend(extract_keywords_from_text(title))
        
        for desc in desc_texts:
            keywords.extend(extract_keywords_from_text(desc))
        
        # Remove duplicates and return
        return list(set(keywords))
    except Exception as e:
        print(f"Error fetching Myntra keywords: {str(e)}")
        return []

def fetch_all_keywords(product_text):
    # Add a small delay between requests to avoid rate limiting
    results = []
    
    # Flipkart
    flipkart_keywords = fetch_flipkart_keywords(product_text)
    results.append({"source": "Flipkart", "keywords": flipkart_keywords})
    time.sleep(random.uniform(1, 2))
    
    # Amazon
    amazon_keywords = fetch_amazon_keywords(product_text)
    results.append({"source": "Amazon", "keywords": amazon_keywords})
    time.sleep(random.uniform(1, 2))
    
    # Meesho
    meesho_keywords = fetch_meesho_keywords(product_text)
    results.append({"source": "Meesho", "keywords": meesho_keywords})
    time.sleep(random.uniform(1, 2))
    
    # Myntra
    myntra_keywords = fetch_myntra_keywords(product_text)
    results.append({"source": "Myntra", "keywords": myntra_keywords})
    
    return results

# Call the function to get relevant keywords
print(json.dumps(fetch_all_keywords("${text}")))
  `;

    const { stdout } = await execAsync(`python3 -c "${pythonScript}"`);
    return JSON.parse(stdout);
  } catch (error) {
    console.error('Error executing Python script:', error);
    return [];
  }
} 