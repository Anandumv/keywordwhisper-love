# TrendWhisper Sheet Scribe

TrendWhisper Sheet Scribe is an advanced SEO keyword generator that leverages the power of Gemini AI to create comprehensive SEO packages for your products.

## Features

- Generate high-quality SEO keywords optimized for commercial intent
- Receive comprehensive SEO packages including titles, descriptions, and content ideas
- Platform-specific keyword suggestions for Amazon, Flipkart, Meesho, and Myntra
- Keyword categorization by search intent and purpose
- Modern, sleek user interface with dark theme
- WhatsApp integration for on-the-go keyword generation

## WhatsApp Integration

TrendWhisper now supports WhatsApp integration, allowing you to:

1. Send a product name directly to our WhatsApp Business number and receive SEO keyword suggestions
2. Use the web interface to send keyword suggestions to any WhatsApp number
3. Set up your own WhatsApp Business API to handle product keyword requests

### Setting Up WhatsApp Integration

To enable the WhatsApp integration:

1. **Create a WhatsApp Business Account**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a WhatsApp Business app
   - Set up your phone number ID

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`
   - Add your WhatsApp access token: `VITE_WHATSAPP_ACCESS_TOKEN`
   - Add your phone number ID: `VITE_WHATSAPP_PHONE_NUMBER_ID`
   - Create a verification token: `VITE_WHATSAPP_VERIFY_TOKEN`

3. **Configure the Webhook**:
   - In the Facebook Developer Portal, set up a webhook
   - Use the URL: `https://your-domain.com/api/webhook`
   - Use the verification token you created
   - Subscribe to the `messages` webhook field

4. **Start the server**:
   ```
   node server.js
   ```

5. **Using WhatsApp Integration**:
   - Text a product name directly to your WhatsApp Business phone number
   - Or use the web interface to send keywords to any WhatsApp number

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/trend-whisper-sheet-scribe.git
cd trend-whisper-sheet-scribe
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file:
```
cp .env.example .env
```

4. Add your Gemini API key and WhatsApp credentials to the `.env` file.

5. Start the development server:
```
npm run dev
```

6. For WhatsApp webhook support, start the Express server:
```
node server.js
```

## API Keys

You'll need the following API keys:

1. **Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **WhatsApp Business API** - Set up through [Facebook Developers](https://developers.facebook.com/)

## Technologies Used

- React
- TypeScript
- Vite
- Google Gemini AI
- WhatsApp Business API
- Express (for webhook server)

## License

This project is licensed under the MIT License.
