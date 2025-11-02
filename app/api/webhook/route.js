export async function POST(request) {
  try {
    const body = await request.json();
    const { text, author, hash } = body.data;
    
    // // Ganti dari @aibot jadi username baru lo
if (text && text.includes('@aihelper_id')) {
  const question = text.replace('@aihelper_id', '').trim();
  // ... rest of code
}
      
      // Pake Groq AI
      const aiResponse = await generateAIResponse(question, author.username);
      
      // Post balik ke Farcaster
      await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'api_key': process.env.NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: aiResponse,
          parent: hash,
          signer_uuid: process.env.FARCASTER_SIGNER_UUID
        }),
      });
    }
    
    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
            content: 'Kamu asisten AI di Farcaster. Jawab dengan singkat (max 280 karakter), ramah, dan kasih emoji. Pake bahasa Indonesia/English yang casual.'
          },
          {
            role: 'user', 
            content: `User @${username} nanya: "${question}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return `Hey @${username}! 👋 Sorry, AI-nya lagi error nih. Coba lagi ya! 😅`;
  }
        }
