# 🚀 Deploy Sarkar Sathi on Vercel (FREE - No Credit Card!)

## ✅ Why Vercel?

- ✅ **100% FREE** for hobby projects
- ✅ **No credit card required**
- ✅ **Auto-deploys from GitHub**
- ✅ **Fast global CDN**
- ✅ **Serverless functions included**
- ✅ **Custom domain support**

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Push Your Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for Vercel deployment"

# Push to GitHub
git push origin main
```

### Step 2: Sign Up for Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest)
4. Authorize Vercel to access your GitHub account

### Step 3: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find **"Sarkar_Sathi"** in your GitHub repositories
3. Click **"Import"**

### Step 4: Configure Build Settings

Vercel will auto-detect most settings. Verify these:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 5: Add Environment Variables

Click **"Environment Variables"** and add these:

```
QWEN_API_KEY = ms-f179b55d-7f3d-4c71-b34b-9657b710c8f2
QWEN_MODEL = Qwen/Qwen3-Max
QWEN_BASE_URL = https://api-inference.modelscope.ai/v1
NODE_ENV = production
```

**Important**: Add all 4 variables before deploying!

### Step 6: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app will be live at: `https://sarkar-sathi.vercel.app`

---

## 🧪 Test Your Deployment

### 1. Check Health Endpoint
```
https://sarkar-sathi.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "qwenConfigured": true,
  "model": "Qwen/Qwen3-Max",
  "platform": "Vercel"
}
```

### 2. Test the App
- Open your Vercel URL
- Try the AI assistant in English, Urdu, and Roman Urdu
- Browse government programs
- Check eligibility checker

---

## 🔄 Auto-Deploy on Updates

Vercel automatically redeploys when you push to GitHub!

```bash
# Make your changes
git add .
git commit -m "Update feature"
git push origin main
```

**That's it!** Vercel handles everything automatically.

---

## 💰 Vercel Free Tier Limits

| Feature | Free Limit |
|---------|------------|
| **Bandwidth** | 100 GB/month |
| **Serverless Function Executions** | 100,000/month |
| **Serverless Function Size** | 50 MB |
| **Serverless Function Duration** | 10 seconds |
| **Build Minutes** | 6,000 minutes/month |

**For your hackathon demo, these limits are MORE than enough!**

---

## 🛠️ Troubleshooting

### Build Fails?

1. Check Vercel dashboard → **"Deployments"** tab
2. Click on the failed deployment
3. Check **"Build Logs"** for errors

Common issues:
- Missing environment variables → Add all 4 in step 5
- Node version → Vercel uses Node 18+ by default
- Build command → Should be `npm run build`

### API Returns Error?

1. Check `/api/health` endpoint
2. Verify `qwenConfigured: true`
3. Check Vercel function logs:
   - Go to deployment details
   - Click **"Functions"** tab
   - View logs for `/api/chat`

### App Shows Blank Page?

1. Check browser console for errors
2. Verify build completed successfully
3. Check Vercel deployment logs
4. Try hard refresh (Ctrl+Shift+R)

---

## 📊 Monitoring

### View Deployment Logs
1. Go to Vercel dashboard
2. Click on your project
3. Click **"Deployments"** tab
4. Click on any deployment to see logs

### View Function Logs
1. Go to deployment details
2. Click **"Functions"** tab
3. Click on `/api/chat` or `/api/health`
4. View real-time logs

---

## 🎯 Alternative Free Platforms

If Vercel doesn't work, try these (also no credit card):

### 1. Netlify
- Website: https://netlify.com
- Free tier: 100 GB bandwidth
- Setup: Similar to Vercel
- Requires: Same `vercel.json` configuration

### 2. Koyeb
- Website: https://koyeb.com
- Free tier: 1 web service, 2 GB RAM
- Setup: Connect GitHub, auto-detects Node.js
- Supports: Full Node.js server (not just serverless)

### 3. Glitch
- Website: https://glitch.com
- Free tier: Unlimited public projects
- Setup: Import from GitHub
- Note: App sleeps after 5 minutes of inactivity

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Code pushed to GitHub
- [ ] All 4 environment variables added
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Framework: Vite

After deploying:

- [ ] App loads at Vercel URL
- [ ] `/api/health` returns `qwenConfigured: true`
- [ ] AI assistant works in English
- [ ] AI assistant works in Urdu
- [ ] AI assistant works in Roman Urdu
- [ ] Programs load correctly
- [ ] No console errors

---

## 🎉 You're Ready!

Your Sarkar Sathi app is **100% ready for Vercel deployment**!

**Total Cost: $0** 💚  
**Deployment Time: 5 minutes** ⚡  
**Credit Card Required: NO** ✅

---

## 📞 Need Help?

### Vercel Documentation
https://vercel.com/docs

### Vercel Community
https://github.com/vercel/vercel/discussions

### Contact
If you get stuck, tell me:
- The exact error message
- Which step you're on
- Screenshot if possible

I'll help you fix it immediately!

---

**Good luck with your deployment!** 🚀🇵🇰

**Sarkar Sathi** — Making government services accessible to every Pakistani citizen!
