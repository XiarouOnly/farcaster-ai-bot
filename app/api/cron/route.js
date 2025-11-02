import { NextResponse } from 'next/server'

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get recent casts
    const response = await fetch(
      'https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=parent_url&parent_url=https%3A%2F%2Fwarpcast.com%2F~%2Fchannel%2Fdev&limit=10',
      {
        headers: {
          'api_key': process.env.NEYNAR_API_KEY,
        },
      }
    );

    const data = await response.json();
    let processedCount = 0;

    if (data.casts) {
      for (const cast of data.casts) {
        if (cast.text.includes('@aibot')) {
          console.log(`Processing mention from @${cast.author.username}`);
          
          const aiResponse = await generateAIResponse(
            cast.text.replace('@aibot', '').trim(),
            cast.author.username
          );

          await fetch('https://api.neynar.com/v2/farcaster/cast', {
            method: 'POST',
            headers: {
              'api_key': process.env.NEYNAR_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: aiResponse,
              parent: cast.hash,
              signer_uuid: process.env.FARCASTER_SIGNER_UUID,
            }),
          });

          processedCount++;
        }
      }
    }

    return NextResponse.json({ 
      status: 'success', 
      processed: processedCount
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function generateAIResponse(question, username) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'Kamu asisten AI di Farcaster. Jawab dengan singkat, ramah, dan kasih emoji. Pake bahasa Indonesia/English yang casual.'
          },
          {
            role: 'user', 
            content: question
          }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return `Hey @${username}! 👋 Sorry, AI-nya lagi error. Coba lagi ya! 😅`;
  }
}
