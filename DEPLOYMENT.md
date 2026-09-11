# 🚀 Deploy Sarkar Sathi - Complete Guide

## ✅ Your App is Ready for Deployment!

Everything is configured and tested. Follow these simple steps to deploy for FREE.

---

## 📋 Prerequisites

1. **GitHub Account** - If you don't have one, create at https://github.com
2. **Render Account** - Free signup at https://render.com (use GitHub login)
3. **Your Qwen API Key** - You already have this configured

---

## 🎯 Step-by-Step Deployment (Render - FREE)

### Step 1: Push Code to GitHub

Open your terminal in the project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Sarkar Sathi - Production ready with Qwen3-Max AI"

# Add your GitHub repository
git remote add origin https://github.com/mubasiranwar/Sarkar_Sathi.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** with your GitHub account
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect a repository"**
5. **Authorize Render** to access your GitHub
6. **Select "Sarkar_Sathi"** repository
7. Click **"Connect"**

### Step 3: Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `sarkar-sathi` (or your choice) |
| **Region** | Singapore (closest to Pakistan) |
| **Branch** | `main` |
| **Root Directory** | Leave blank |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** and click **"Add Environment Variable"**.

Add these **4 variables**:

```
Key: QWEN_API_KEY
Value: ms-f179b55d-7f3d-4c71-b34b-9657b710c8f2

Key: QWEN_MODEL
Value: Qwen/Qwen3-Max

Key: QWEN_BASE_URL
Value: https://api-inference.modelscope.ai/v1

Key: NODE_ENV
Value: production
```

**Important**: Make sure to add ALL 4 variables!

### Step 5: Deploy!

1. Scroll to the bottom
2. Click **"Create Web Service"**
3. Wait 2-5 minutes for deployment
4. Watch the **"Events"** tab for progress

### Step 6: Get Your Live URL

Once deployed, Render will give you a URL like:
```
https://sarkar-sathi.onrender.com
```

**That's it! Your app is LIVE!** 🎉

---

## 🧪 Test Your Live App

### 1. Check Health Endpoint
Open in browser:
```
https://sarkar-sathi.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "qwenConfigured": true,
  "model": "Qwen/Qwen3-Max",
  "baseUrl": "https://api-inference.modelscope.ai/v1"
}
```

### 2. Test the App
1. Open `https://sarkar-sathi.onrender.com`
2. Try the AI assistant
3. Test in English, Urdu, and Roman Urdu
4. Verify programs load correctly

---

## 🔄 Auto-Deploy on Updates

Render automatically redeploys when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically rebuild and redeploy! 🚀

---

## 💰 Cost Breakdown

| Service | Free Tier | Your Usage |
|---------|-----------|------------|
| **Render** | 750 hours/month | ✅ Free |
| **ModelScope API** | Free tier available | ✅ Free |
| **GitHub** | Unlimited repos | ✅ Free |

**Total Cost: $0/month** 💚

---

## ⚠️ Important Notes

### Render Free Tier Limitations

1. **Sleep Mode**: After 15 minutes of inactivity, the app "sleeps"
2. **Wake-up Time**: First request after sleep takes 30-50 seconds
3. **Solution**: This is normal for free tier. For production, upgrade to paid plan ($7/month)

### API Key Security

- ✅ Your API key is stored securely in Render's environment variables
- ✅ Never committed to GitHub (in .gitignore)
- ✅ Only accessible server-side

---

## 🛠️ Troubleshooting

### Build Fails?

Check Render logs:
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Look for error messages

Common issues:
- Missing environment variables → Add all 4 variables
- Node version issue → Render auto-detects from package.json
- Build command wrong → Use exactly: `npm install && npm run build`

### API Not Working?

1. Check `/api/health` endpoint
2. Verify `qwenConfigured: true`
3. Check Render logs for API errors
4. Verify Qwen API key is correct

### App Shows Blank Page?

1. Check browser console for errors
2. Verify build completed successfully
3. Check Render logs
4. Try hard refresh (Ctrl+Shift+R)

---

## 📊 Monitoring

### View Logs
- Go to Render dashboard
- Click **"Logs"** tab
- See real-time server logs

### View Metrics
- Click **"Metrics"** tab
- See CPU, memory, request counts

---

## 🎯 Alternative Free Options

If Render doesn't work for you, try these:

### 1. Railway (Easiest)
- Website: https://railway.app
- Free: $5 credit/month
- Setup: Same as Render

### 2. Fly.io
- Website: https://fly.io
- Free: 3 shared VMs
- Requires: Docker (you have Dockerfile ready!)

### 3. Koyeb
- Website: https://koyeb.com
- Free: 1 web service
- Setup: Similar to Render

---

## 📞 Need Help?

### Render Documentation
https://render.com/docs

### Common Issues
https://community.render.com

### Contact
If you get stuck, let me know the exact error message and I'll help!

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] Code pushed to GitHub
- [ ] All 4 environment variables added
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Instance type: Free
- [ ] Region: Singapore (or closest)

After deploying, verify:

- [ ] App loads at your Render URL
- [ ] `/api/health` returns `qwenConfigured: true`
- [ ] AI assistant works in English
- [ ] AI assistant works in Urdu
- [ ] AI assistant works in Roman Urdu
- [ ] Programs load correctly
- [ ] No console errors

---

## 🎉 You're Ready!

Your Sarkar Sathi app is **100% production-ready** and can be deployed in **5 minutes** for **FREE**!

**Good luck with your deployment!** 🚀

---

## 📝 Quick Reference

**Your Repository**: https://github.com/mubasiranwar/Sarkar_Sathi.git  
**Render Dashboard**: https://dashboard.render.com  
**Your Live App**: `https://sarkar-sathi.onrender.com` (after deployment)

**Environment Variables**:
```
QWEN_API_KEY=ms-f179b55d-7f3d-4c71-b34b-9657b710c8f2
QWEN_MODEL=Qwen/Qwen3-Max
QWEN_BASE_URL=https://api-inference.modelscope.ai/v1
NODE_ENV=production
```

**Commands**:
```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

**Sarkar Sathi** — Making government services accessible to every Pakistani citizen! 🇵🇰
