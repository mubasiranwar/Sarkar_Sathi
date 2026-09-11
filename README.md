# Sarkar Sathi — Government Services, Made Simple 🏛️

A citizen navigation platform for Pakistan's public services, powered by **Qwen3-Max** via ModelScope API.

**Live AI**: Real Qwen3-Max model providing intelligent guidance on government programs.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Environment is pre-configured with your ModelScope token
#    (Check .env.local — already has your access token)

# 3. Start development server (with AI)
npm run dev

# 4. Open http://localhost:3000
```

---

## 🔧 Environment Configuration

Your ModelScope access token is already configured in `.env.local`:

```env
QWEN_API_KEY=ms-f179b55d-7f3d-4c71-b34b-9657b710c8f2
QWEN_MODEL=Qwen/Qwen3-Max
QWEN_BASE_URL=https://api-inference.modelscope.ai/v1
```

### How It Works

| Setting | Value | Purpose |
|---------|-------|---------|
| **API Provider** | ModelScope | Alibaba's model inference platform |
| **Model** | `Qwen/Qwen3-Max` | Qwen3-Max — most powerful Qwen model |
| **Base URL** | `https://api-inference.modelscope.ai/v1` | OpenAI-compatible endpoint |
| **Auth** | Bearer token | Your ModelScope access token |

### Getting a New Token

1. Go to https://modelscope.ai/my/access/token
2. Copy your access token
3. Update `QWEN_API_KEY` in `.env.local`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Sarkar Sathi UI                          │
│  React + TypeScript + Tailwind CSS                          │
│  (Programs, Eligibility, Dashboard, Assistant)              │
└──────────────────────┬──────────────────────────────────────┘
                       │ POST /api/chat
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Server (Express / Vite Plugin)                  │
│  1. Receives user query                                     │
│  2. Retrieves relevant programs (search)                    │
│  3. Injects program context into prompt                     │
│  4. Calls Qwen3-Max via ModelScope API                      │
│  5. Parses structured JSON response                         │
│  6. Returns to UI                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ OpenAI-compatible API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           ModelScope API (Qwen3-Max)                        │
│  https://api-inference.modelscope.ai/v1/chat/completions    │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Context-efficient**: Only sends top 5 relevant programs (not entire database)
2. **Structured output**: Requests JSON for rich UI rendering
3. **Graceful fallback**: Rule-based assistant if API fails
4. **Progressive loading**: Shows status while Qwen processes
5. **Security**: API key never reaches the browser

---

## 📡 API Endpoints

### `POST /api/chat`

Request:
```json
{
  "messages": [
    { "role": "user", "content": "I need financial support for my family" }
  ]
}
```

Response:
```json
{
  "answer": "Based on your situation, I recommend...",
  "intent": "financial",
  "followUpQuestion": null,
  "recommendedPrograms": ["bisp-kafaalat", "sehat-card"],
  "eligibilityConsiderations": ["Valid CNIC required", "Poverty score assessment"],
  "documents": ["CNIC", "Family registration info"],
  "nextSteps": ["Visit nearest BISP office", "Complete NSER survey"],
  "sources": ["BISP Official"]
}
```

### `GET /api/health`

Returns API status and configuration.

---

## 🚢 Deployment

### Option 1: Railway / Render / Fly.io

1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables:
   - `QWEN_API_KEY=ms-f179b55d-7f3d-4c71-b34b-9657b710c8f2`
   - `QWEN_MODEL=Qwen/Qwen3-Max`
   - `QWEN_BASE_URL=https://api-inference.modelscope.ai/v1`
4. Build command: `npm run build`
5. Start command: `npm start`

### Option 2: Docker

```bash
docker build -t sarkar-sathi .
docker run -p 3000:3000 \
  -e QWEN_API_KEY=ms-f179b55d-7f3d-4c71-b34b-9657b710c8f2 \
  -e QWEN_MODEL=Qwen/Qwen3-Max \
  sarkar-sathi
```

### Option 3: Vercel

Create `api/chat.js`:
```javascript
import { createChatHandler } from '../server/chat-handler.js';

const handleChat = createChatHandler();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const response = await handleChat(req.body.messages);
  res.json(response);
}
```

### Option 4: Local Production

```bash
npm run build
npm start
# Server runs on http://localhost:3000
```

---

## 🧪 Testing

### Test Cases

1. **Financial Support**
   ```
   "I need financial support for my family."
   ```
   → BISP Kafaalat recommended

2. **Education**
   ```
   "I am a student looking for scholarships."
   ```
   → Ehsaas Scholarship, Waseela-e-Taleem

3. **Urdu Query**
   ```
   "مجھے تعلیمی وظیفہ چاہیے"
   ```
   → Response in Urdu

4. **Roman Urdu**
   ```
   "mujhe sehat card chahiye"
   ```
   → Sehat Card information

5. **Health**
   ```
   "I need free medical treatment"
   ```
   → Sehat Sahulat Program

6. **Business**
   ```
   "I want to start a small business"
   ```
   → PM Youth Business Loan

### Verify API

```bash
# Health check
curl http://localhost:3000/api/health

# Expected:
# {"status":"ok","qwenConfigured":true,"model":"Qwen/Qwen3-Max",...}
```

---

## 📁 Project Structure

```
sarkar-sathi/
├── src/                      # Frontend (React)
│   ├── App.tsx              # Main app + routing
│   ├── components/
│   │   └── Layout.tsx       # Navbar, Footer, Mobile nav
│   ├── context/
│   │   └── AppContext.tsx   # Global state
│   ├── data/
│   │   ├── programs.ts      # 12 government programs
│   │   └── translations.ts  # EN/UR translations
│   ├── lib/
│   │   ├── programs.ts      # Search/filter utilities
│   │   └── recommendations.ts # Scoring engine
│   └── pages/
│       ├── Home.tsx         # Landing page
│       ├── Programs.tsx     # Program discovery
│       ├── ProgramDetail.tsx # Detail view
│       ├── Eligibility.tsx  # Wizard
│       ├── Assistant.tsx    # AI assistant (Qwen3-Max)
│       └── MyServices.tsx   # Dashboard
│
├── server/                   # Backend
│   ├── index.js             # Express production server
│   └── chat-handler.js      # Qwen API handler
│
├── vite-plugin-api.ts       # Dev server API middleware
├── vite.config.js           # Vite configuration
├── Dockerfile               # Container deployment
├── Procfile                 # Platform deployment
├── .env.local               # Your API keys (gitignored)
└── .env.example             # Template
```

---

## 🔒 Security

- ✅ API key stored server-side only
- ✅ `.env.local` in `.gitignore`
- ✅ No secrets in frontend bundle
- ✅ CORS configured
- ✅ Input validation on API

---

## 🎯 Demo Flow (60-90 seconds)

1. **Homepage** → See value proposition + smart search
2. **Search** → "I need financial support" → Matching programs
3. **Program Detail** → Click BISP Kafaalat → Full structured info
4. **Eligibility** → 3-step wizard → Personalized recommendations
5. **Save** → Bookmark program → "My Sarkar Sathi" dashboard
6. **Urdu** → Switch language → Full RTL experience
7. **AI Assistant** → Ask questions → Real Qwen3-Max responses
8. **Documents** → Interactive checklist → Track readiness

---

## 🛠️ Troubleshooting

### API Not Responding

```bash
# Check health endpoint
curl http://localhost:3000/api/health

# If qwenConfigured: false, check .env.local
cat .env.local
```

### ModelScope Token Issues

1. Verify token at https://modelscope.ai/my/access/token
2. Ensure token has inference permissions
3. Check rate limits (ModelScope has free tier limits)

### Build Errors

```bash
# Clear cache
rm -rf node_modules/.vite dist
npm run build
```

---

## 📊 Program Data

12 real Pakistani government programs:

| Program | Category | Level |
|---------|----------|-------|
| Benazir Kafaalat | Social Protection | Federal |
| Waseela-e-Taleem | Education | Federal |
| Ehsaas Scholarship | Education | Federal |
| Sehat Sahulat Program | Health | Federal |
| PM Youth Business Loan | Business | Federal |
| National Agricultural Program | Agriculture | Federal |
| Punjab Housing Scheme | Housing | Provincial |
| KP Education Support | Education | Provincial |
| Zakat & Ushr Distribution | Social Protection | Federal |
| Workers Welfare Fund | Employment | Federal |
| NASP Computer Literacy | Youth | Federal |
| Sindh Education Foundation | Education | Provincial |

---

## 📄 License

Built for the Qwen/Qwenthon Hackathon.

---

## 🤝 Support

For issues with:
- **ModelScope API**: https://modelscope.ai
- **Qwen Models**: https://qwen.ai
- **This Project**: Check README.md or open an issue

---

**Sarkar Sathi** — Making government services accessible to every Pakistani citizen. 🇵🇰
