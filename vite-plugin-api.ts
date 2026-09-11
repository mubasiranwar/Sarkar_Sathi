import type { Plugin } from 'vite';
import { createChatHandler } from './server/chat-handler.js';

export function sarkarSathiApiPlugin(): Plugin {
  const handleChat = createChatHandler();
  
  return {
    name: 'sarkar-sathi-api',
    configureServer(server) {
      // Chat API endpoint
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }
        
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { messages } = JSON.parse(body);
            
            if (!messages || !Array.isArray(messages)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid request: messages array required' }));
              return;
            }
            
            console.log('[Sarkar Sathi API] Processing chat request...');
            const response = await handleChat(messages);
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          } catch (error: any) {
            console.error('[Sarkar Sathi API] Error:', error.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'AI service temporarily unavailable',
              message: process.env.NODE_ENV === 'development' ? error.message : undefined
            }));
          }
        });
      });
      
      // Health check endpoint
      server.middlewares.use('/api/health', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          status: 'ok',
          qwenConfigured: !!process.env.QWEN_API_KEY,
          model: process.env.QWEN_MODEL || 'Qwen/Qwen3-Max',
          baseUrl: process.env.QWEN_BASE_URL || 'https://api-inference.modelscope.ai/v1',
          timestamp: new Date().toISOString()
        }));
      });
    }
  };
}
