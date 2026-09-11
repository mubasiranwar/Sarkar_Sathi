import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createChatHandler } from './chat-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Create the chat handler with program data
const handleChat = createChatHandler();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    qwenConfigured: !!process.env.QWEN_API_KEY,
    model: process.env.QWEN_MODEL || 'Qwen/Qwen3-Max',
    baseUrl: process.env.QWEN_BASE_URL || 'https://api-inference.modelscope.ai/v1',
    timestamp: new Date().toISOString()
  });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid request: messages array required' 
      });
    }
    
    console.log(`[Sarkar Sathi API] Processing chat request with ${messages.length} messages`);
    const response = await handleChat(messages);
    
    res.json(response);
  } catch (error) {
    console.error('[Sarkar Sathi API] Error:', error.message);
    res.status(500).json({ 
      error: 'AI service temporarily unavailable',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Serve static files from dist (production build)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏛️  Sarkar Sathi Server`);
  console.log(`   Running on http://localhost:${PORT}`);
  console.log(`   Qwen API: ${process.env.QWEN_API_KEY ? '✅ Configured' : '❌ Not configured (using fallback)'}`);
  console.log(`   Model: ${process.env.QWEN_MODEL || 'Qwen/Qwen3-Max'}`);
  console.log(`   Base URL: ${process.env.QWEN_BASE_URL || 'https://api-inference.modelscope.ai/v1'}\n`);
});
