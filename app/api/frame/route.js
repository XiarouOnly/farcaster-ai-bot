export async function POST(request) {
  return new Response(JSON.stringify({
    type: 'frame',
    version: 'vNext',
    image: 'https://farcaster-ai-sage.vercel.app/api/og?text=Ask%20me%20anything!%20🤖',
    input: {
      text: 'Tanya apa ke AI...'
    },
    buttons: [
      {
        label: '🔮 Ask AI',
        action: 'post',
      },
      {
        label: '💰 Premium',
        action: 'post', 
      }
    ],
    postUrl: 'https://farcaster-ai-sage.vercel.app/api/frame/handle'
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
