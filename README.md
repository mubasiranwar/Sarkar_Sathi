# Sarkar Sathi — Government Services, Made Simple

A citizen navigation platform for Pakistan's public services, powered by Qwen AI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your Qwen API key to .env.local
# QWEN_API_KEY=your-key-here

# Start development server
npm run dev
```

## 🔧 Environment Variables

Add these to `.env.local`:

```env
# Required for AI functionality
QWEN_API_KEY=your-qwen-api-key-here

# Model identifier (pre-configured)
QWEN_MODEL=ms-f571650f-bfb0-41d6-8216-8f930f38a5ca

# API Base URL (choose your region)
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

### Getting Your Qwen API Key

1. Go to [Alibaba Cloud Model Studio](https://modelstudio.console.alibabacloud.com/)
2. Sign in / Create account
3. Navigate to API Key management
4. Create a new API key
5. Copy the key and paste it in `.env.local`

### Available Base URLs by Region

| Region | Base URL |
|--------|----------|
| Singapore (International) | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| Virginia (US) | `https://dashscope-us.aliyuncs.com/compatible-mode/v1` |
| Beijing (China) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Workspace-specific | `https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1` |

## 🏗️ Architecture

```
User → Sarkar Sathi UI → Vite Dev Server → /api/chat → Qwen API
                                              ↓
                                    Relevant program retrieval
                                              ↓
                                    Structured response → UI
```

### Key Components

- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Backend**: Vite plugin with OpenAI-compatible Qwen API
- **Data**: Structured JSON program data
- **Routing**: React Router (HashRouter for static serving)

### API Route

The application exposes `/api/chat` during development:

```
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "I need financial support" }
  ]
}
```

Response:
```json
{
  "answer": "Based on your query...",
  "intent": "financial",
  "recommendedPrograms": ["bisp-kafaalat", "sehat-card"],
  "eligibilityConsiderations": ["..."],
  "documents": ["CNIC", "..."],
  "nextSteps": ["..."],
  "sources": ["..."]
}
```

## 🧪 Testing the AI Integration

### Test Cases

1. **Financial Support Query**
   ```
   "I need financial support for my family."
   ```
   Expected: BISP Kafaalat and related programs recommended

2. **Education Query**
   ```
   "I am a student looking for scholarships."
   ```
   Expected: Ehsaas Scholarship, Waseela-e-Taleem recommended

3. **Urdu Query**
   ```
   "مجھے تعلیمی وظیفہ چاہیے"
   ```
   Expected: Response in Urdu with education programs

4. **Roman Urdu Query**
   ```
   "mujhe sehat card chahiye"
   ```
   Expected: Sehat Card program information

5. **Irrelevant Query**
   ```
   "What is the weather today?"
   ```
   Expected: Polite response redirecting to government services

6. **API Failure Test**
   - Remove QWEN_API_KEY from .env.local
   - Restart dev server
   - Expected: Graceful fallback to rule-based assistant

### Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "qwenConfigured": true,
  "model": "ms-f571650f-bfb0-41d6-8216-8f930f38a5ca"
}
```

## 📁 Project Structure

```
sarkar-sathi/
├── src/
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles + Tailwind
│   ├── components/
│   │   └── Layout.tsx       # Navbar, Footer, Mobile nav
│   ├── context/
│   │   └── AppContext.tsx   # Global state (language, saved programs)
│   ├── data/
│   │   ├── programs.ts      # Government program data
│   │   └── translations.ts  # EN/UR translations
│   ├── lib/
│   │   ├── programs.ts      # Program utilities
│   │   └── recommendations.ts # Scoring engine
│   └── pages/
│       ├── Home.tsx         # Landing page
│       ├── Programs.tsx     # Program discovery
│       ├── ProgramDetail.tsx # Program detail
│       ├── Eligibility.tsx  # Eligibility wizard
│       ├── Assistant.tsx    # AI assistant (Qwen)
│       └── MyServices.tsx   # Personalized dashboard
├── server/                  # (Removed - logic in plugin)
├── vite-plugin-api.ts       # Qwen API middleware
├── vite.config.js           # Vite configuration
├── .env.local               # Your API keys (gitignored)
├── .env.example             # Template for env vars
└── package.json
```

## 🔒 Security

- API keys are stored in `.env.local` (gitignored)
- API calls happen server-side via Vite plugin
- Frontend never receives the API key
- No `NEXT_PUBLIC_` or `VITE_` prefixed secrets

## 🌐 Deployment

### Production Build

```bash
npm run build
```

The build produces static files in `dist/`. For production with AI:

1. **Option A**: Use a Node.js server that serves static files + API
2. **Option B**: Deploy the API separately (e.g., as a serverless function)
3. **Option C**: Use the rule-based fallback (works without API)

### Without API Key

The application works without the Qwen API key using the built-in rule-based assistant. All program browsing, eligibility checking, and document management features work fully offline.

## 📋 Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, search, categories |
| `/programs` | Program discovery with filters |
| `/programs/:id` | Program detail page |
| `/eligibility` | Eligibility wizard |
| `/assistant` | AI assistant (Qwen) |
| `/my-services` | Personalized dashboard |

## 🎯 Demo Flow (60-90 seconds)

1. Open homepage → see value proposition
2. Click "Find financial support" → see matching programs
3. Click BISP Kafaalat → see structured detail
4. Click "Check My Eligibility" → 3-step wizard
5. See personalized recommendations
6. Save a program → go to "My Sarkar Sathi"
7. See saved programs + document checklist
8. Switch to Urdu → full RTL experience
9. Try the Assistant → ask about programs (with Qwen AI)

## 🛠️ Troubleshooting

### API Not Working

1. Check `.env.local` has `QWEN_API_KEY`
2. Verify the key is valid in Model Studio console
3. Check base URL matches your key's region
4. Restart dev server after changing env vars
5. Check `/api/health` endpoint

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### TypeScript Errors

```bash
npx tsc --noEmit
```

## 📄 License

Built for the Qwen/Qwenthon Hackathon.

## 🤝 Contributing

This is a hackathon prototype. For production use:
- Replace rule-based fallback with proper error handling
- Add authentication for personalized features
- Connect to real government data sources
- Add proper logging and monitoring
