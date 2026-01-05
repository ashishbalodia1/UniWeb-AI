# 📁 UniWeb AI - Complete File Tree

```
UniWeb-AI/
│
├── 📋 Documentation Files (5)
│   ├── README.md                    # Main project documentation (400+ lines)
│   ├── ARCHITECTURE.md              # Technical architecture guide (600+ lines)
│   ├── API_GUIDE.md                 # API integration tutorial (500+ lines)
│   ├── PROJECT_SUMMARY.md           # Project overview & completion status
│   ├── CONTRIBUTING.md              # Contribution guidelines
│   └── LICENSE                      # MIT License
│
├── ⚙️ Configuration Files (11)
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS & design system
│   ├── postcss.config.js            # PostCSS plugins
│   ├── .eslintrc.json               # ESLint rules
│   ├── .prettierrc                  # Prettier formatting
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore                   # Git ignore rules
│   ├── Dockerfile                   # Production container
│   └── docker-compose.yml           # Multi-service orchestration
│
├── 🔧 Scripts (1)
│   └── setup.sh                     # Quick start installation script
│
└── 💻 Source Code (src/)
    │
    ├── 🎨 app/ - Next.js App Router (3 files)
    │   ├── layout.tsx               # Root layout with fonts & metadata
    │   ├── page.tsx                 # Home page with welcome/chat toggle
    │   └── globals.css              # Global styles (220+ lines)
    │       ├── Custom fonts
    │       ├── Base styles & scrollbar
    │       ├── Component classes (buttons, cards, inputs)
    │       ├── Utility classes
    │       ├── Keyframe animations
    │       └── Responsive utilities
    │
    ├── 🧩 components/ - React Components (10 files)
    │   │
    │   ├── layout/ - App Shell (3)
    │   │   ├── MainLayout.tsx       # Main app container with sidebar & header
    │   │   ├── Sidebar.tsx          # Collapsible navigation sidebar
    │   │   └── Header.tsx           # Status bar with AI state & controls
    │   │
    │   ├── chat/ - Chat Interface (3)
    │   │   ├── ChatInterface.tsx    # Main chat UI with input & send
    │   │   ├── MessageList.tsx      # Scrollable message display
    │   │   └── TypingIndicator.tsx  # AI "thinking" animation
    │   │
    │   ├── avatar/ - AI Assistant (1)
    │   │   └── AvatarAssistant.tsx  # Floating avatar with animations
    │   │
    │   └── ui/ - Reusable Components (2)
    │       ├── WelcomeScreen.tsx    # Premium onboarding screen
    │       └── CommandPalette.tsx   # Power user command interface (⌘K)
    │
    ├── 📚 lib/ - Core Business Logic (3 files)
    │   │
    │   ├── ai/ - AI Engine (2)
    │   │   ├── engine.ts            # Provider abstraction layer (350+ lines)
    │   │   │   ├── AIProvider base class
    │   │   │   ├── OpenAIProvider implementation
    │   │   │   ├── AnthropicProvider implementation
    │   │   │   ├── Streaming support
    │   │   │   └── AIEngine factory
    │   │   │
    │   │   └── chatService.ts       # High-level chat service
    │   │       ├── sendMessage() with personality
    │   │       ├── analyzeContent()
    │   │       └── generateVoiceResponse()
    │   │
    │   └── voice/ - Voice Engine (1)
    │       └── engine.ts            # TTS/STT system (400+ lines)
    │           ├── VoiceProvider base class
    │           ├── ElevenLabsProvider (premium TTS)
    │           ├── OpenAIVoiceProvider (TTS + Whisper)
    │           ├── WebSpeechProvider (browser API)
    │           └── VoiceEngine factory
    │
    ├── 🗄️ store/ - State Management (2 files)
    │   ├── uiStore.ts               # UI state (Zustand)
    │   │   ├── Sidebar state
    │   │   ├── Command palette
    │   │   ├── Avatar visibility
    │   │   ├── Workspace mode
    │   │   └── Theme
    │   │
    │   └── aiStore.ts               # AI/Conversation state (Zustand)
    │       ├── AI status & task
    │       ├── Conversations
    │       ├── Messages
    │       ├── Personality
    │       └── Streaming support
    │
    ├── 🎣 hooks/ - Custom Hooks (1 file)
    │   └── useVoice.ts              # Voice interaction hook
    │       ├── speak()
    │       ├── stopSpeaking()
    │       ├── startRecording()
    │       └── stopRecording()
    │
    ├── 📘 types/ - TypeScript Definitions (1 file)
    │   └── index.ts                 # Core type definitions (400+ lines)
    │       ├── User & Session types
    │       ├── AI Personality types
    │       ├── Conversation & Message types
    │       ├── Workspace Mode types
    │       ├── Voice System types
    │       ├── Avatar System types
    │       ├── AI Provider types
    │       ├── Analysis Engine types
    │       ├── UI State types
    │       └── API Response types
    │
    ├── ⚙️ config/ - Configuration (1 file)
    │   └── index.ts                 # App constants & settings (200+ lines)
    │       ├── APP_CONFIG
    │       ├── FEATURES (flags)
    │       ├── AI_PERSONALITIES (7 modes)
    │       ├── WORKSPACE_MODES (4 modes)
    │       ├── DEFAULT_MODELS
    │       ├── UI_CONSTANTS
    │       ├── PERFORMANCE_CONFIG
    │       ├── VOICE_DEFAULTS
    │       ├── ANALYTICS_EVENTS
    │       ├── ERROR_MESSAGES
    │       └── ROUTES
    │
    └── 🛠️ utils/ - Utility Functions (1 file)
        └── helpers.ts               # Helper functions (200+ lines)
            ├── cn() - Tailwind class merger
            ├── formatRelativeTime()
            ├── formatDate()
            ├── truncate()
            ├── estimateReadingTime()
            ├── formatNumber()
            ├── generateId()
            ├── debounce()
            ├── throttle()
            ├── deepClone()
            ├── isEmpty()
            ├── sleep()
            ├── copyToClipboard()
            ├── downloadTextFile()
            ├── isBrowser()
            ├── getBrowserInfo()
            ├── isMobile()
            ├── parseError()
            ├── isValidEmail()
            ├── calculatePercentage()
            ├── formatFileSize()
            ├── getInitials()
            └── generateRandomColor()
```

---

## 📊 File Statistics

### Total Files: 39

**By Category:**
- Documentation: 6 files
- Configuration: 11 files
- Scripts: 1 file
- Source Code: 21 files
  - Components: 10 files
  - Libraries: 3 files
  - State: 2 files
  - Hooks: 1 file
  - Types: 1 file
  - Config: 1 file
  - Utils: 1 file
  - App: 3 files

**By Type:**
- TypeScript/TSX: 21 files
- JavaScript: 3 files
- JSON: 3 files
- Markdown: 6 files
- CSS: 1 file
- Shell: 1 file
- Other: 4 files

**Lines of Code:**
- Total: ~5,000+ lines
- TypeScript: ~4,500 lines
- CSS: ~220 lines
- Documentation: ~2,000+ lines

---

## 🎯 Key Files Explained

### Core Application
1. **src/app/page.tsx** - Entry point, toggles between welcome and chat
2. **src/components/layout/MainLayout.tsx** - App shell structure
3. **src/components/chat/ChatInterface.tsx** - Main chat UI

### AI Engine
4. **src/lib/ai/engine.ts** - Provider abstraction (OpenAI, Anthropic)
5. **src/lib/ai/chatService.ts** - High-level chat API
6. **src/store/aiStore.ts** - Conversation state management

### Voice System
7. **src/lib/voice/engine.ts** - TTS/STT with multiple providers
8. **src/hooks/useVoice.ts** - React hook for voice features

### UI Components
9. **src/components/ui/WelcomeScreen.tsx** - Onboarding experience
10. **src/components/avatar/AvatarAssistant.tsx** - Floating AI assistant

### Configuration
11. **src/config/index.ts** - All app constants and settings
12. **src/types/index.ts** - TypeScript type definitions

### Styling
13. **src/app/globals.css** - Global styles and animations
14. **tailwind.config.ts** - Design system configuration

---

## 🔍 File Relationships

```
Main Application Flow:
─────────────────────
app/page.tsx
    ↓
components/layout/MainLayout.tsx
    ↓
components/chat/ChatInterface.tsx
    ↓
store/aiStore.ts
    ↓
lib/ai/chatService.ts
    ↓
lib/ai/engine.ts
    ↓
External AI APIs

Voice Flow:
───────────
hooks/useVoice.ts
    ↓
lib/voice/engine.ts
    ↓
External Voice APIs

State Flow:
───────────
components/* → store/uiStore.ts → UI updates
components/* → store/aiStore.ts → AI updates
```

---

## 📦 Module Dependencies

### External Dependencies (package.json)
```json
"dependencies": {
  "next": "^14.1.0",              // React framework
  "react": "^18.2.0",             // UI library
  "zustand": "^4.5.0",            // State management
  "framer-motion": "^11.0.3",     // Animations
  "tailwindcss": "^3.4.1",        // Styling
  "lucide-react": "^0.316.0",     // Icons
  "axios": "^1.6.5",              // HTTP client
  "socket.io-client": "^4.6.1",   // Real-time
  "three": "^0.160.1",            // 3D graphics
  "@react-three/fiber": "^8.15.16" // React Three.js
  // ... and more
}
```

### Internal Dependencies
- All components import from `@/*` paths
- Stores are global singletons
- Services are stateless utilities
- Types are shared across modules

---

## 🎨 Design Assets (Future)

```
public/
├── images/
│   ├── logo.svg
│   ├── avatar-default.png
│   └── backgrounds/
├── fonts/
│   └── (using Google Fonts currently)
├── icons/
│   └── (using Lucide icons currently)
└── sounds/ (future)
    ├── notification.mp3
    └── message-sent.mp3
```

---

## 🚀 Build Output

```
.next/
├── cache/
├── server/
│   ├── app/
│   └── chunks/
└── static/
    ├── css/
    ├── chunks/
    └── media/
```

**Not committed to git** - Generated on build

---

## 🔐 Environment Variables

```
.env (not committed)
├── OPENAI_API_KEY
├── ANTHROPIC_API_KEY
├── ELEVEN_LABS_API_KEY
├── AZURE_SPEECH_KEY
├── AZURE_SPEECH_REGION
├── FEATURE_VOICE_ENABLED
├── FEATURE_AVATAR_ENABLED
└── FEATURE_ANALYTICS_ENABLED
```

---

## 📝 Notes

- **Modular**: Each directory has a clear purpose
- **Scalable**: Easy to add new features
- **Type-Safe**: TypeScript everywhere
- **Documented**: Every major file has comments
- **Clean**: No dead code or unused files

---

This file structure represents a **production-ready foundation** for an enterprise-grade AI platform. Every file serves a purpose, and the architecture supports future growth from MVP to global scale. 🚀
