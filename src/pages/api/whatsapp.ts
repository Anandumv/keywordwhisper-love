import { NextApiRequest, NextApiResponse } from 'next';
import { WhatsAppService } from '@/lib/whatsapp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { entry } = req.body;

    if (!entry || !Array.isArray(entry)) {
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }

    const whatsappService = WhatsAppService.getInstance();

    // Process each entry in the webhook
    for (const item of entry) {
      if (item.changes && Array.isArray(item.changes)) {
        for (const change of item.changes) {
          if (change.value && change.value.messages) {
            for (const message of change.value.messages) {
              if (message.from && message.text && message.text.body) {
                await whatsappService.handleIncomingMessage({
                  from: message.from,
                  body: message.text.body,
                  timestamp: message.timestamp
                });
              }
            }
          }
        }
      }
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 