import { useState } from 'react';
import { processWhatsAppProductKeyword } from '../api/whatsapp';

export default function WhatsAppIntegration() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim() || !productName.trim()) {
      setError('Phone number and product name are required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await processWhatsAppProductKeyword(productName, phoneNumber);
      setSuccess(result);
      
      if (result) {
        setProductName('');
      }
    } catch (err) {
      setError('Failed to send WhatsApp message. Please check your credentials and try again.');
      console.error('WhatsApp send error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '30px auto', padding: '30px' }}>
      <div className="floating" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M17 8C16.5 7.5 15.8 7.2 15.1 7C14.3 6.8 13.5 6.7 12.7 6.8C11.9 6.9 11.2 7.1 10.6 7.3C9.4 7.8 8.3 8.6 7.5 9.6C6.7 10.6 6.3 11.8 6.3 13C6.3 14 6.5 15 7 15.9C7.5 16.9 8.2 17.7 9.1 18.3V20.3L10.9 19.4C11.2 19.5 11.6 19.5 11.9 19.6C12.3 19.6 12.6 19.7 13 19.7C14.3 19.7 15.6 19.2 16.7 18.3C17.7 17.5 18.5 16.3 18.8 15C19.2 13.7 19.1 12.3 18.6 11.1C18.3 10.3 17.8 9.1 17 8Z" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M15 15.5L13 13.5L10 16.5L9 14.5L11 12.5L9 10.5" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginTop: '15px' }}>
          WhatsApp SEO Keywords
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '10px auto' }}>
          Generate and send SEO keywords directly via WhatsApp message
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>
            WhatsApp Phone Number:
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number with country code (e.g., +1234567890)"
            style={{ width: '100%' }}
            required
          />
          <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Include country code (e.g., +1 for US)
          </div>
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>
            Product Name:
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name to generate keywords"
            style={{ width: '100%' }}
            required
          />
        </div>
        
        <button
          type="submit"
          className="primary-button"
          style={{ width: '100%' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="shimmer">Sending to WhatsApp...</span>
          ) : (
            'Send SEO Keywords to WhatsApp'
          )}
        </button>
      </form>
      
      {error && (
        <div className="error-message" style={{ marginTop: '20px' }}>
          {error}
        </div>
      )}
      
      {success === true && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px 15px',
          borderRadius: '8px',
          backgroundColor: 'rgba(37, 211, 102, 0.1)',
          border: '1px solid rgba(37, 211, 102, 0.3)',
          color: '#25D366'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#25D366" strokeWidth="1.5" fill="none" />
              <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            SEO keywords successfully sent to WhatsApp!
          </div>
        </div>
      )}

      {success === false && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px 15px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 69, 58, 0.1)',
          border: '1px solid rgba(255, 69, 58, 0.3)',
          color: '#FF453A'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#FF453A" strokeWidth="1.5" fill="none" />
              <path d="M15 9L9 15" stroke="#FF453A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 9L15 15" stroke="#FF453A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Failed to send message. Check your WhatsApp configuration.
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '15px', borderRadius: '8px', backgroundColor: 'rgba(127, 90, 240, 0.1)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-light)' }}>How to use:</h3>
        <ol style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Enter your WhatsApp number with country code</li>
          <li style={{ marginBottom: '8px' }}>Enter the product name you want SEO keywords for</li> 
          <li style={{ marginBottom: '8px' }}>Click "Send" and check your WhatsApp for the message</li>
          <li>Alternatively, just text the product name directly to our WhatsApp business number</li>
        </ol>
      </div>
    </div>
  );
} 