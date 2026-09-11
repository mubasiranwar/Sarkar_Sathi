export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    status: 'ok',
    qwenConfigured: !!process.env.QWEN_API_KEY,
    model: process.env.QWEN_MODEL || 'Qwen/Qwen3-Max',
    baseUrl: process.env.QWEN_BASE_URL || 'https://api-inference.modelscope.ai/v1',
    timestamp: new Date().toISOString(),
    platform: 'Vercel'
  });
}
