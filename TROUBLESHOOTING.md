# 🔧 Troubleshooting Guide - Nothing Working on Vercel

## 🚨 **Issue: Frontend loads but AI doesn't respond**

### **Quick Diagnosis Checklist:**

#### 1️⃣ **Is the Environment Variable Set?** (MOST COMMON ISSUE)
```
❌ Without OPENAI_API_KEY → AI features won't work
✅ With OPENAI_API_KEY → Everything works
```

**How to fix:**
1. Go to https://vercel.com/your-project
2. **Settings** → **Environment Variables**
3. Add:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-...` (your actual OpenAI key)
4. **Deployments** → Click **⋯** → **Redeploy**

#### 2️⃣ **Check Browser Console (F12)**

Open your deployed site, press **F12**, and check Console tab:

**What you might see:**
```
❌ 500 Internal Server Error → API key missing
❌ Failed to fetch → Network issue
❌ CORS error → Deployment issue
✅ No errors but no response → API key invalid
```

#### 3️⃣ **Test API Directly**

Visit these URLs on your deployed site:
```
https://your-site.vercel.app/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "services": {
    "chat": true,
    "streaming": true
  }
}
```

**If you see:**
```json
{
  "status": "degraded",
  "services": {
    "chat": false
  }
}
```
→ **API key is missing or invalid**

#### 4️⃣ **Check Vercel Deployment Logs**

1. Go to Vercel dashboard
2. Click on your latest deployment
3. Check **Function Logs**
4. Look for:
   ```
   [AI Engine] No API keys configured
   ```
   → This confirms missing API key

#### 5️⃣ **Verify Build Succeeded**

In Vercel deployment:
```
✅ Building → should complete
✅ All checks passed
```

If build fails:
- Check error message
- Usually it's a TypeScript or import error

---

## 🎯 **Most Likely Solution:**

### **YOU NEED TO ADD OPENAI_API_KEY TO VERCEL**

**Step-by-step:**

1. **Get OpenAI Key:**
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Add to Vercel:**
   - Project Settings → Environment Variables
   - Click "Add New"
   - Name: `OPENAI_API_KEY`
   - Value: paste your key
   - Check all environments (Production, Preview, Development)
   - Save

3. **Redeploy:**
   - Go to Deployments tab
   - Latest deployment → ⋯ menu → Redeploy
   - Wait ~1 minute

4. **Test:**
   - Open your site
   - Type "Hello" in chat
   - Should see streaming response!

---

## 🔍 **Advanced Debugging**

### **If API key IS set but still not working:**

#### Check 1: API Key Format
```bash
# Should start with sk- and be ~51 characters
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Check 2: API Key Permissions
- Go to OpenAI dashboard
- Check if key has API access
- Check if billing is set up

#### Check 3: Network Tab
1. Open site
2. Press F12 → Network tab
3. Send a message
4. Look for request to `/api/chat`
5. Check:
   - Status code (should be 200)
   - Response (should be streaming data)

#### Check 4: Clear Cache
```bash
# Sometimes Vercel caches old deployment
1. Settings → General → Clear Cache
2. Redeploy
```

---

## 💬 **What Should Work After Fix:**

✅ Type message → See "thinking..." indicator
✅ AI response streams in character by character
✅ Avatar shows thinking animation
✅ Voice button is clickable
✅ No console errors

---

## 🆘 **Still Not Working? Check These:**

### Error Messages & Solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| "AI service configuration error" | No API key | Add OPENAI_API_KEY |
| "Failed to fetch" | CORS/Network | Check Vercel logs |
| "Rate limit exceeded" | Too many requests | Wait or upgrade OpenAI plan |
| "Invalid API key" | Wrong/expired key | Generate new key |
| Nothing happens | JS error | Check browser console |

---

## 📞 **Need More Help?**

Share with me:
1. Screenshot of browser console (F12)
2. URL of deployed site
3. Screenshot of Vercel environment variables (blur the values)
4. Error from Vercel Function Logs

Then I can give you exact solution!

---

## ✅ **Quick Test Commands**

```bash
# Test health endpoint (replace with your URL)
curl https://your-site.vercel.app/api/health

# Should return:
# {"status":"healthy"} ← Good!
# {"status":"degraded"} ← Missing API key
```

---

**TL;DR: 99% chance you need to add OPENAI_API_KEY to Vercel environment variables and redeploy.**
