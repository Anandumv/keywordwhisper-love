# Trend Whisper Sheet Scribe with WhatsApp & Gemini Integration

This application helps generate SEO keywords and optimized content for e-commerce products using WhatsApp integration and Google's Gemini AI.

## Features

- Generate SEO-optimized content using Gemini AI
- WhatsApp integration for easy access
- Support for multiple e-commerce platforms
- Educational keyword prioritization
- Category and age group detection
- Feature and benefit extraction
- AI-powered product descriptions
- SEO-optimized titles and meta descriptions

## Setup

1. Create a WhatsApp Business API account:
   - Go to [Meta for Developers](https://developers.facebook.com/)
   - Create a new app or use an existing one
   - Enable WhatsApp Business API

2. Get a Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for configuration

3. Configure your environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     WHATSAPP_WEBHOOK_URL=https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages
     WHATSAPP_ACCESS_TOKEN=your_access_token_here
     WHATSAPP_VERIFY_TOKEN=your_verify_token_here
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. Set up your webhook:
   - Deploy your application
   - Go to your Meta Developer Console
   - Configure the webhook URL: `https://your-domain.com/api/whatsapp`
   - Set the verify token to match your `WHATSAPP_VERIFY_TOKEN`

## Using the WhatsApp Integration

1. Send a message to your WhatsApp Business number
2. Include a product description in your message
3. The bot will respond with:
   - SEO-optimized title
   - Meta description
   - Detailed product description
   - Generated keywords
   - SEO tips and best practices

Example message:
```
Generate SEO content for: Educational wooden blocks for toddlers with numbers and letters
```

Example response:
```
🔍 *SEO-Optimized Content*

*Title:*
Educational Wooden Alphabet Blocks - Interactive Learning Toys for Toddlers

*Meta Description:*
Discover our educational wooden alphabet blocks, perfect for toddlers. Interactive learning toys that develop fine motor skills and early literacy.

*Product Description:*
[Detailed product description...]

*Keywords:*
1. Educational Wooden Blocks
2. Toddler Learning Toys
3. Alphabet Learning Blocks
4. Interactive Educational Toys
5. Early Childhood Education
[...]

💡 *Tips:*
• Use these keywords in your product title and description
• Include keywords in image alt text
• Use keywords in product URLs
• Add keywords to product tags and categories
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `WHATSAPP_WEBHOOK_URL`: Your WhatsApp Business API webhook URL
- `WHATSAPP_ACCESS_TOKEN`: Your WhatsApp Business API access token
- `WHATSAPP_VERIFY_TOKEN`: Token for webhook verification
- `GEMINI_API_KEY`: Your Google Gemini API key

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
