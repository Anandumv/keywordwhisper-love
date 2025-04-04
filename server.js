const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'dist' directory for production
app.use(express.static(path.join(__dirname, 'dist')));

// WhatsApp verification endpoint
app.get('/api/webhook', (req, res) => {
  // Parse query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verify the webhook
  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('WhatsApp verification failed');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// WhatsApp webhook endpoint
app.post('/api/webhook', (req, res) => {
  const body = req.body;
  
  console.log('Received webhook:', JSON.stringify(body, null, 2));
  
  // Check if this is a valid WhatsApp webhook
  if (body.object === 'whatsapp_business_account') {
    // Forward to our Vite frontend app for processing
    // This is a simple approach - in a real app, you'd want to use a queue or direct API calls
    console.log('Forwarding WhatsApp webhook to frontend app');
    
    // Return a 200 OK to acknowledge receipt
    res.status(200).send('OK');
    
    // Process the webhook asynchronously
    processWebhook(body).catch(err => {
      console.error('Error processing webhook:', err);
    });
  } else {
    // Not a WhatsApp webhook
    res.sendStatus(404);
  }
});

// Process the webhook by sending a POST request to our frontend
async function processWebhook(webhookBody) {
  try {
    // Extract messages from webhook
    for (const entry of webhookBody.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          const value = change.value;
          
          // Process each message
          for (const message of value.messages || []) {
            if (message.type === 'text') {
              const phoneNumber = message.from;
              const productName = message.text.body;
              
              console.log(`Received WhatsApp message from ${phoneNumber}: ${productName}`);
              
              // Call the processing function directly
              try {
                // Use dynamic import to load ESM module in CommonJS
                const { processWhatsAppProductKeyword } = await import('./src/api/whatsapp.js');
                await processWhatsAppProductKeyword(productName, phoneNumber);
                console.log(`Processed message and sent response to ${phoneNumber}`);
              } catch (error) {
                console.error('Error processing WhatsApp message:', error);
                
                // Send error response to user
                const { sendWhatsAppMessage } = await import('./src/api/whatsapp.js');
                await sendWhatsAppMessage(
                  phoneNumber, 
                  'Sorry, I encountered an error processing your request. Please try again later.'
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
}

// Catch-all route to serve the frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // In development, automatically start the Vite dev server if not running
  if (process.env.NODE_ENV === 'development') {
    exec('npm run dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting Vite dev server: ${error}`);
        return;
      }
      console.log(stdout);
    });
  }
}); 