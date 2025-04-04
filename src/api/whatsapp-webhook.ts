import { processWhatsAppProductKeyword } from './whatsapp';

// WhatsApp webhook handler
export async function handleWhatsAppWebhook(req: any, res: any) {
  try {
    // Extract the webhook payload
    const body = req.body;
    
    // Handle webhook verification
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
      
      // Verify the webhook
      if (mode === 'subscribe' && token === import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN) {
        console.log('WhatsApp webhook verified');
        return res.status(200).send(challenge);
      } else {
        return res.status(403).send('Verification failed');
      }
    }
    
    // Handle incoming messages
    if (req.method === 'POST') {
      if (body.object === 'whatsapp_business_account') {
        try {
          // Process incoming messages
          await processWebhookMessages(body);
          // Return a 200 success response
          return res.status(200).send('OK');
        } catch (error) {
          console.error('Error processing webhook messages:', error);
          return res.status(500).send('Internal Server Error');
        }
      } else {
        // Not a WhatsApp webhook
        return res.status(404).send('Not Found');
      }
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).send('Internal Server Error');
  }
}

// Process incoming webhook messages
async function processWebhookMessages(webhookBody: any) {
  // Process each entry in the webhook
  for (const entry of webhookBody.entry || []) {
    // Process each change
    for (const change of entry.changes || []) {
      if (change.field === 'messages') {
        const value = change.value;
        
        // Process each message
        for (const message of value.messages || []) {
          if (message.type === 'text') {
            const phoneNumber = message.from;
            const productName = message.text.body;
            
            console.log(`Received WhatsApp message from ${phoneNumber}: ${productName}`);
            
            // Process the product name and send back keywords
            await processWhatsAppProductKeyword(productName, phoneNumber);
          }
        }
      }
    }
  }
} 