export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || 'AI Assistant';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            text-align: center;
          }
          .container {
            padding: 40px;
            max-width: 800px;
          }
          .emoji {
            font-size: 64px;
            margin-bottom: 20px;
          }
          .text {
            font-size: 28px;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="emoji">🤖</div>
          <div class="text">${text}</div>
        </div>
      </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
