# 🚀 UniWeb AI - Quick Start Card

## ⚡ 60-Second Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd UniWeb-AI
npm install
```

### 2. Add API Key
```bash
echo "OPENAI_API_KEY=sk-your-actual-key" > .env.local
```
Get key: https://platform.openai.com/api-keys

### 3. Run
```bash
npm run dev
```
Open: http://localhost:3000

---

## 🎯 Core Features

| Feature | Status | Notes |
|---------|--------|-------|
| AI Chat | ✅ Working | Real-time streaming |
| Voice I/O | ✅ Working | Browser + Premium APIs |
| Avatar | ✅ Working | State-driven animations |
| Analysis | ✅ Working | Deep reasoning mode |
| Dark Mode | ✅ Working | Default theme |
| Streaming | ✅ Working | Server-Sent Events |
| Error Handling | ✅ Working | Comprehensive recovery |
| Mobile | ✅ Working | Responsive design |

---

## 📦 Vercel Deploy

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# → vercel.com/new

# 3. Add Environment Variable
# → OPENAI_API_KEY = sk-...

# 4. Deploy
# → Click "Deploy"
```

---

## 🔧 Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run type-check   # Check TypeScript
npm run lint         # Run ESLint
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/ai/orchestrator.ts` | AI coordinator |
| `src/app/api/chat/route.ts` | Chat API endpoint |
| `src/components/chat/ChatInterface.tsx` | Chat UI |
| `src/lib/chatClient.ts` | Frontend API client |
| `src/store/aiStore.ts` | State management |

---

## 🐛 Troubleshooting

**"AI service configuration error"**
- Check `.env.local` has `OPENAI_API_KEY`
- Verify key is valid

**Build fails**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Voice not working**
- Requires HTTPS (works on Vercel)
- Check browser permissions

---

## 💡 Environment Variables

### Required
```env
OPENAI_API_KEY=sk-...
```

### Optional
```env
ANTHROPIC_API_KEY=sk-ant-...     # Claude support
ELEVEN_LABS_API_KEY=...          # Premium TTS
AZURE_SPEECH_KEY=...             # Azure TTS
AZURE_SPEECH_REGION=eastus
```

---

## ✅ Pre-Deployment Checklist

- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] API key added
- [ ] Git committed
- [ ] Pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Deployed successfully
- [ ] Tested in production

---

## 🎨 What's Included

✅ **AI Chat** - GPT-4 with streaming
✅ **7 Personalities** - CEO, Teacher, Developer, etc.
✅ **Voice System** - TTS & STT
✅ **Avatar** - Animated AI assistant
✅ **Dark Mode** - Premium design
✅ **Error Handling** - Never crashes
✅ **Type Safe** - 100% TypeScript
✅ **Mobile Ready** - Responsive
✅ **Edge Compatible** - Vercel optimized

---

## 🚦 Status Checks

### Build Status
```bash
npm run build
# Should output: ✓ Compiled successfully
```

### Type Check
```bash
npm run type-check
# Should complete with no errors
```

### Dev Server
```bash
npm run dev
# Should start on http://localhost:3000
```

---

## 📊 Performance

- **First Load**: ~200ms
- **Build Size**: <500KB gzipped
- **API Response**: ~1-2s (GPT-4)
- **Streaming**: Instant chunks

---

## 🔐 Security

✅ API keys server-side only
✅ Security headers set
✅ Input validation (Zod)
✅ Error messages sanitized
✅ CORS configured
✅ Middleware protected

---

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Architecture
- [API_GUIDE.md](./API_GUIDE.md) - API documentation
- [README.md](./README.md) - Project overview

---

## 🎯 Next Steps

1. **Test Locally** - `npm run dev`
2. **Add API Key** - Get from OpenAI
3. **Deploy** - Push to Vercel
4. **Customize** - Edit personalities, UI
5. **Extend** - Add new features

---

**Ready to go! 🚀**

---

*Built with Next.js 14 · React 18 · TypeScript · Tailwind CSS*
