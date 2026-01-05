# Contributing to UniWeb AI

First off, thank you for considering contributing to UniWeb AI! 🎉

This document provides guidelines for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing](#testing)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Next.js

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/UniWeb-AI.git
   cd UniWeb-AI
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/parimeena404/UniWeb-AI.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Setup environment**
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow the [Code Standards](#code-standards)
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Build (ensure no errors)
npm run build
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill in the PR template
- Wait for review

---

## Code Standards

### TypeScript

- **Use TypeScript** for all new code
- **Enable strict mode** - already configured
- **Define types** - avoid `any` when possible
- **Use interfaces** for object shapes
- **Export types** that may be reused

**Example:**
```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function updateProfile(profile: UserProfile): void {
  // Implementation
}

// ❌ Bad
function updateProfile(profile: any) {
  // Implementation
}
```

### React Components

- **Use functional components** with hooks
- **Name components** in PascalCase
- **Export as default** for page components
- **Named exports** for utilities and hooks
- **Props interface** for all components

**Example:**
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Bad
export default function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### File Organization

```typescript
// 1. Imports (external first, then internal)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { Button } from '@/components';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Constants
const MAX_RETRIES = 3;

// 4. Component
export default function Component({ props }: ComponentProps) {
  // 4a. Hooks
  const [state, setState] = useState();
  
  // 4b. Functions
  const handleClick = () => {
    // ...
  };
  
  // 4c. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 4d. Render
  return <div>...</div>;
}

// 5. Helper functions (if needed)
function helperFunction() {
  // ...
}
```

### Styling

- **Use Tailwind** classes for styling
- **Use utilities** from `src/utils/helpers.ts`
- **Create reusable** component classes in `globals.css`
- **Responsive design** - mobile-first approach

**Example:**
```typescript
// ✅ Good
<div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-lg hover:shadow-xl">
  ...
</div>

// ❌ Bad (inline styles)
<div style={{ display: 'flex', padding: '16px' }}>
  ...
</div>
```

### Comments

- **JSDoc** for functions and components
- **Inline comments** for complex logic
- **TODO comments** for future improvements
- **Section comments** for file organization

**Example:**
```typescript
/**
 * Fetches user profile from API
 * @param userId - The user's unique identifier
 * @returns Promise resolving to user profile
 * @throws {Error} If user not found
 */
async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // Validate user ID format
  if (!isValidUserId(userId)) {
    throw new Error('Invalid user ID format');
  }

  // TODO: Add caching layer
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(chat): add streaming response support"

# Bug fix
git commit -m "fix(voice): resolve audio playback issue on Safari"

# Documentation
git commit -m "docs: update API integration guide"

# Breaking change
git commit -m "feat(api)!: change provider interface

BREAKING CHANGE: Provider.chat() now returns Promise<ChatResponse>
instead of ChatResponse. Update all implementations."
```

### Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep first line under 72 characters
- Reference issues: "fix #123"
- Explain *what* and *why*, not *how*

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Code formatted with Prettier

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No TypeScript errors
```

### Review Process

1. **Automated checks** will run (lint, type-check, build)
2. **Maintainer review** within 2-3 days
3. **Address feedback** if requested
4. **Approval & merge** by maintainer

---

## Project Structure

### Key Directories

```
src/
├── app/          # Next.js routes and pages
├── components/   # React components
│   ├── layout/   # Layout components
│   ├── chat/     # Chat-related components
│   ├── avatar/   # Avatar components
│   └── ui/       # Reusable UI components
├── lib/          # Core business logic
│   ├── ai/       # AI engine
│   └── voice/    # Voice engine
├── store/        # State management (Zustand)
├── hooks/        # Custom React hooks
├── types/        # TypeScript types
├── config/       # Configuration
└── utils/        # Utility functions
```

### Adding New Features

**Example: Adding a new AI provider**

1. Create provider class in `src/lib/ai/providers/`
2. Extend `AIProvider` base class
3. Register in factory (`src/lib/ai/engine.ts`)
4. Add types to `src/types/index.ts`
5. Update configuration in `src/config/index.ts`
6. Add tests (future)
7. Update documentation

---

## Testing

### Currently

- Manual testing in browser
- TypeScript type checking
- ESLint for code quality

### Future (Help Wanted!)

We're looking for contributors to help set up:

- Unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Playwright)
- Visual regression tests

---

## Areas for Contribution

### High Priority

- [ ] **Authentication system** - User sign-up and login
- [ ] **Message persistence** - Save conversations to database
- [ ] **3D Avatar** - Three.js implementation
- [ ] **Voice cloning** - Ethical implementation with consent
- [ ] **Export features** - PDF, Markdown, JSON

### Medium Priority

- [ ] **Dark mode** - Theme switching
- [ ] **Mobile optimization** - Touch gestures, responsive
- [ ] **Keyboard shortcuts** - More power user features
- [ ] **Search** - Search through conversations
- [ ] **Tags & filters** - Organize conversations

### Nice to Have

- [ ] **Collaboration** - Share conversations
- [ ] **Analytics** - Usage insights
- [ ] **Plugins** - Extension system
- [ ] **API** - Public API for developers
- [ ] **Themes** - Customizable color schemes

---

## Questions?

- **Documentation:** Check README.md, ARCHITECTURE.md, API_GUIDE.md
- **Issues:** Search existing issues first
- **Discussions:** Use GitHub Discussions for questions
- **Email:** support@uniweb-ai.com

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to UniWeb AI! 🚀

Together, we're building the future of AI interaction.
