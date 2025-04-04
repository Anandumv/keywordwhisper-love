import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function fetchExternalKeywords(text: string): Promise<string[]> {
  const pythonScript = `
import requests
from bs4 import BeautifulSoup

def fetch_flipkart_keywords(product_text):
    url = "https://www.flipkart.com/search?q=" + product_text
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    products = soup.find_all("a", class_="IRpwTa")
    keywords = [product.get_text().lower() for product in products]
    return keywords

def fetch_amazon_keywords(product_text):
    url = "https://www.amazon.in/s?k=" + product_text
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    products = soup.find_all("span", class_="a-text-normal")
    keywords = [product.get_text().lower() for product in products]
    return keywords

def fetch_keywords(product_text):
    flipkart_keywords = fetch_flipkart_keywords(product_text)
    amazon_keywords = fetch_amazon_keywords(product_text)
    # Combine and return
    return list(set(flipkart_keywords + amazon_keywords))

# Call the function to get relevant keywords
print(fetch_keywords("${text}"))
  `;

  try {
    const { stdout } = await execAsync(`python3 -c "${pythonScript}"`);
    return stdout.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error executing Python script:', error);
    return [];
  }
} 