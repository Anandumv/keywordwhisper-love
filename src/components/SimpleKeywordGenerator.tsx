import { useState } from 'react';
import { generateCompleteSEOPackage } from '../lib/gemini-simplified';

interface SeoResult {
  productDescription: string;
  keywords: string[];
  seoTitle: string;
  metaDescription: string;
  longTailKeywords: string[];
  productFeatures: string[];
  targetAudience: string[];
  seoRecommendations: string[];
  competitorAnalysis: string;
  contentIdeas: string[];
  ecommerceKeywords: {
    amazon: string[];
    flipkart: string[];
    meesho: string[];
    myntra: string[];
  };
  combinedKeywords: string[];
}

export default function SimpleKeywordGenerator() {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seoResult, setSeoResult] = useState<SeoResult | null>(null);
  const [activeTab, setActiveTab] = useState('keywords');
  const [demoApiKeyWarning, setDemoApiKeyWarning] = useState(true);
  const [keywordFilter, setKeywordFilter] = useState('');

  const handleGenerateKeywords = async () => {
    if (!productName) {
      setError('Please enter a product name');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await generateCompleteSEOPackage(productName);
      setSeoResult(result);
      setDemoApiKeyWarning(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate SEO content. Please try again.');
      }
      console.error('Error generating SEO content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTab = (tabName: string, label: string) => (
    <button 
      className={`tab-button ${activeTab === tabName ? 'active' : ''}`}
      onClick={() => setActiveTab(tabName)}
    >
      {label}
    </button>
  );

  const filterKeywords = (keywords: string[]) => {
    if (!keywordFilter) return keywords;
    return keywords.filter(keyword => 
      keyword.toLowerCase().includes(keywordFilter.toLowerCase())
    );
  };

  const categorizeKeywords = (keywords: string[]) => {
    // Simple categorization based on patterns
    const buyerIntent = keywords.filter(kw => 
      kw.match(/buy|purchase|shop|price|cost|discount|deal|cheap|best|top|review/i)
    );
    
    const informational = keywords.filter(kw => 
      kw.match(/what|how|guide|tips|vs|versus|compare|difference|tutorial/i)
    );
    
    const branded = keywords.filter(kw => 
      kw.match(/brand|amazon|flipkart|meesho|myntra|online|shipping/i)
    );
    
    const features = keywords.filter(kw => 
      kw.match(/feature|benefit|quality|premium|professional|advanced|latest|modern/i)
    );

    return { buyerIntent, informational, branded, features };
  };

  const TabContent = () => {
    if (!seoResult) return null;

    switch (activeTab) {
      case 'keywords':
        const filteredKeywords = filterKeywords(seoResult.keywords);
        const categories = categorizeKeywords(filteredKeywords);
        
        return (
          <div>
            <h3 className="gradient-text">Generated Keywords ({seoResult.keywords.length})</h3>
            
            <div className="content-card" style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-light)' }}>
                  Filter Keywords:
                </label>
                <input
                  type="text"
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  style={{ width: '100%' }}
                  placeholder="Type to filter keywords..."
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {filteredKeywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
              
              {filteredKeywords.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '10px' }}>
                  No keywords match your filter.
                </p>
              )}
            </div>
            
            <h4 className="gradient-text" style={{ fontSize: '1.1rem', marginTop: '25px' }}>Keyword Categories</h4>
            
            <div className="content-card">
              <h4>Buyer Intent Keywords ({categories.buyerIntent.length})</h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {categories.buyerIntent.map((keyword, index) => (
                  <span 
                    key={index} 
                    className={`keyword-tag amazon-tag ${index % 5 === 0 ? 'pulsing' : ''}`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              {categories.buyerIntent.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No buyer intent keywords found.</p>
              )}
            </div>
            
            <div className="content-card">
              <h4>Feature & Benefit Keywords ({categories.features.length})</h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {categories.features.map((keyword, index) => (
                  <span 
                    key={index} 
                    className={`keyword-tag flipkart-tag ${index % 5 === 0 ? 'pulsing' : ''}`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              {categories.features.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No feature keywords found.</p>
              )}
            </div>
            
            <div className="content-card">
              <h4>Informational Keywords ({categories.informational.length})</h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {categories.informational.map((keyword, index) => (
                  <span 
                    key={index} 
                    className={`keyword-tag meesho-tag ${index % 5 === 0 ? 'pulsing' : ''}`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              {categories.informational.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No informational keywords found.</p>
              )}
            </div>
            
            <div className="content-card">
              <h4>Brand & Marketplace Keywords ({categories.branded.length})</h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {categories.branded.map((keyword, index) => (
                  <span 
                    key={index} 
                    className={`keyword-tag myntra-tag ${index % 5 === 0 ? 'pulsing' : ''}`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              {categories.branded.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No branded keywords found.</p>
              )}
            </div>
          </div>
        );
      
      case 'longtail':
        const filteredLongTail = filterKeywords(seoResult.longTailKeywords);
        
        return (
          <div>
            <h3 className="gradient-text">Long-tail Keywords ({seoResult.longTailKeywords.length})</h3>
            
            <div className="content-card" style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-light)' }}>
                  Filter Long-tail Keywords:
                </label>
                <input
                  type="text"
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  style={{ width: '100%' }}
                  placeholder="Type to filter long-tail keywords..."
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {filteredLongTail.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
              
              {filteredLongTail.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '10px' }}>
                  No long-tail keywords match your filter.
                </p>
              )}
            </div>
          </div>
        );
      
      case 'ecommerce':
        return (
          <div>
            <h3 className="gradient-text">E-commerce Platform Keywords</h3>
            
            <div className="content-card" style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-light)' }}>
                  Filter E-commerce Keywords:
                </label>
                <input
                  type="text"
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  style={{ width: '100%' }}
                  placeholder="Type to filter e-commerce keywords..."
                />
              </div>
            </div>
            
            <div className="content-card">
              <h4>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.1 7.8L12.6 2.3C12.4 2.1 12.2 2 12 2C11.8 2 11.6 2.1 11.4 2.3L3.9 7.8C3.7 7.9 3.5 8.2 3.5 8.5V20C3.5 20.5 3.9 21 4.5 21H19.5C20 21 20.5 20.5 20.5 20V8.5C20.5 8.2 20.3 7.9 20.1 7.8Z" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 21L8.5 10.5L15.5 10.5L15.5 21" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Amazon Keywords
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {filterKeywords(seoResult.ecommerceKeywords.amazon).map((keyword, index) => (
                  <span key={index} className="keyword-tag amazon-tag">
                    {keyword}
                  </span>
                ))}
              </div>
              {filterKeywords(seoResult.ecommerceKeywords.amazon).length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No Amazon keywords match your filter.</p>
              )}
            </div>
            
            <div className="content-card">
              <h4>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 3H4.5C3.9 3 3.5 3.5 3.5 4V8C3.5 8.5 3.9 9 4.5 9H19.5C20 9 20.5 8.5 20.5 8V4C20.5 3.5 20 3 19.5 3Z" stroke="#2874F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 13.5V19.5C3.5 20.1 3.9 20.5 4.5 20.5H19.5C20.1 20.5 20.5 20.1 20.5 19.5V13.5" stroke="#2874F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 9V13.5H16.5V9" stroke="#2874F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Flipkart Keywords
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {filterKeywords(seoResult.ecommerceKeywords.flipkart).map((keyword, index) => (
                  <span key={index} className="keyword-tag flipkart-tag">
                    {keyword}
                  </span>
                ))}
              </div>
              {filterKeywords(seoResult.ecommerceKeywords.flipkart).length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No Flipkart keywords match your filter.</p>
              )}
            </div>
            
            <div className="content-card">
              <h4>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 14.5L5.5 17.5" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 14.5L8.5 17.5" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.5 14.5L10.5 17.5" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.5 14.5L13.5 17.5" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 14.5L15.5 17.5" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.5 14.5L18.5 17.5" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9.5C13.3807 9.5 14.5 8.38071 14.5 7C14.5 5.61929 13.3807 4.5 12 4.5C10.6193 4.5 9.5 5.61929 9.5 7C9.5 8.38071 10.6193 9.5 12 9.5Z" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 7.5V19.5C3.5 20.1 3.9 20.5 4.5 20.5H19.5C20.1 20.5 20.5 20.1 20.5 19.5V7.5" stroke="#F43397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Meesho Keywords
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {filterKeywords(seoResult.ecommerceKeywords.meesho).map((keyword, index) => (
                  <span key={index} className="keyword-tag meesho-tag">
                    {keyword}
                  </span>
                ))}
              </div>
              {filterKeywords(seoResult.ecommerceKeywords.meesho).length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No Meesho keywords match your filter.</p>
              )}
            </div>
            
            <div className="content-card">
              <h4>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.5V6.5" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 5L15.5 8.5" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 10.5L16.5 12" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 16.5L15.5 15.5" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.5 20L13 17" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 20L11 17" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 16.5L8.5 15.5" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 10.5L7.5 12" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 5L8.5 8.5" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" stroke="#FF3F6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Myntra Keywords
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
              }}>
                {filterKeywords(seoResult.ecommerceKeywords.myntra).map((keyword, index) => (
                  <span key={index} className="keyword-tag myntra-tag">
                    {keyword}
                  </span>
                ))}
              </div>
              {filterKeywords(seoResult.ecommerceKeywords.myntra).length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>No Myntra keywords match your filter.</p>
              )}
            </div>
          </div>
        );
      
      case 'seo':
        return (
          <div>
            <h3 className="gradient-text">SEO Content</h3>
            
            <div className="content-card">
              <h4>SEO Title</h4>
              <p>{seoResult.seoTitle}</p>
            </div>
            
            <div className="content-card">
              <h4>Meta Description</h4>
              <p>{seoResult.metaDescription}</p>
            </div>
            
            <div className="content-card">
              <h4>Product Description</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{seoResult.productDescription}</p>
            </div>
            
            <div className="content-card">
              <h4>Product Features</h4>
              <ul>
                {seoResult.productFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="content-card">
              <h4>Target Audience</h4>
              <ul>
                {seoResult.targetAudience.map((audience, index) => (
                  <li key={index}>{audience}</li>
                ))}
              </ul>
            </div>
            
            <div className="content-card">
              <h4>SEO Recommendations</h4>
              <ul>
                {seoResult.seoRecommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
            
            <div className="content-card">
              <h4>Competitor Analysis</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{seoResult.competitorAnalysis}</p>
            </div>
            
            <div className="content-card">
              <h4>Content Ideas</h4>
              <ul>
                {seoResult.contentIdeas.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="floating" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '15px' }}>
              <path d="M3 9L12 5L21 9L12 13L3 9Z" stroke="#7F5AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 19L12 15L21 19L12 23L3 19Z" stroke="#7F5AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 9V19" stroke="#7F5AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13V23" stroke="#7F5AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 9V19" stroke="#7F5AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="gradient-text" style={{ fontSize: '2.25rem', marginBottom: '10px', textAlign: 'center' }}>
              SEO Content Generator
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 15px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Generate comprehensive SEO content and platform-specific keywords with just a product name
            </p>
          </div>
          
          {demoApiKeyWarning && (
            <div className="error-message" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <strong>Demo Mode</strong>: No API key provided. Using mock data.
              <br />
              <small>Get your Gemini API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Google AI Studio</a> and add it to your .env file</small>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-light)' }}>
              Product Name:
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{ width: '100%' }}
              placeholder="Enter product name (e.g., Bluetooth Headphones, Yoga Mat, Coffee Maker)"
            />
          </div>
          
          <button
            onClick={handleGenerateKeywords}
            disabled={isLoading}
            className="primary-button"
            style={{ width: '100%', marginBottom: '30px' }}
          >
            {isLoading ? (
              <>
                <span className="shimmer">Generating magic...</span>
              </>
            ) : (
              'Generate SEO Content'
            )}
          </button>
          
          {seoResult && (
            <div style={{ marginTop: '30px' }}>
              <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                {renderTab('keywords', 'Keywords')}
                {renderTab('longtail', 'Long-tail Keywords')}
                {renderTab('ecommerce', 'E-commerce Keywords')}
                {renderTab('seo', 'SEO Content')}
              </div>
              
              <TabContent />
            </div>
          )}
        </div>
      </div>
    </>
  );
} 