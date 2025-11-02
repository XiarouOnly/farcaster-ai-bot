import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { text, author, hash } = req.body.data;
      
      // Cek kalo mention bot lo
      if (text.includes('@aibot')) {
        const question = text.replace('@aibot', '').trim();
        
        // Simple AI response
        const response = `Hey @${author.username}! 👋 \n\n"${question}"\n\nGood question! 🤔\n\nReply with @aibot + question to chat with me!`;
        
        // Post balik ke Farcaster
        await fetch('https://api.neynar.com/v2/farcaster/cast', {
          method: 'POST',
          headers: {
            'api_key': process.env.NEYNAR_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: response,
            parent: hash,
            signer_uuid: process.env.FARCASTER_SIGNER_UUID!
          }),
        });
      }
      
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
          }
