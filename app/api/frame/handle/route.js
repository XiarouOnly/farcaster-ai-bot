export async function POST(request) {
  const body = await request.json();
  const { untrustedData } = body;
  
  // User klik "Ask AI"
  if (untrustedData.buttonIndex === 1) {
    const userQuestion = untrustedData.inputText;
    
    if (!userQuestion || userQuestion.trim() === '') {
      return new Response(JSON.stringify({
        type: 'frame',
        version: 'vNext',
        image: 'https://farcaster-ai-sage.vercel.app/api/og?text=Please%20enter%20a%20question!%20🙏',
        buttons: [
          {
            label: '🔙 Back',
            action: 'post',
          }
        ],
        postUrl: 'https://farcaster-ai-sage.vercel.app/api/frame'
      }));
    }
    
    // Panggil AI
    const aiResponse = await generateAIResponse(userQuestion, 'frame_user');
    
    return new Response(JSON.stringify({
      type: 'frame',
      version: 'vNext',
      image: `https://farcaster-ai-sage.vercel.app/api/og?text=${encodeURIComponent(aiResponse)}`,
      buttons: [
        {
          label: '🔄 Ask Again',
          action: 'post',
        },
        {
          label: '📤 Share',
          action: 'link',
          target: 'https://warpcast.com/~/compose?text=' + encodeURIComponent(`Just used this cool AI app! 🤖\n\nQ: ${userQuestion}\nA: ${aiResponse}\n\nTry it: `)
        }
      ],
      postUrl: 'https://farcaster-ai-sage.vercel.app/api/frame/handle'
    }));
  }
  
  // User klik "Premium"
  if (untrustedData.buttonIndex === 2) {
    return new Response(JSON.stringify({
      type: 'frame',
      version: 'vNext',
      image: 'https://farcaster-ai-sage.vercel.app/api/og?text=Premium%20Features%20Coming%20Soon!%20🚀%0A%0A•%20Unlimited%20questions%0A•%20Faster%20responses%0A•%20Advanced%20AI%20models',
      buttons: [
        {
          label: '🔙 Back',
          action: 'post',
        },
        {
          label: '💰 Waitlist',
          action: 'link',
          target: 'https://warpcast.com/xiarou'
        }
      ],
      postUrl: 'https://farcaster-ai-sage.vercel.app/api/frame'
    }));
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
            content: 'Kamu asisten AI yang helpful. Jawab dengan singkat (max 200 karakter), ramah, dan kasih emoji. Pake bahasa Indonesia/English yang casual.'
          },
          {
            role: 'user', 
            content: question
          }
        ],
        max_tokens: 120,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return 'Sorry, AI-nya lagi error nih. Coba lagi ya! 😅';
  }
}
