#!/bin/bash

# UniWeb AI - Quick Start Script
# Initializes the project and starts development server

set -e

echo "🌟 Welcome to UniWeb AI Setup"
echo "================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Setup environment
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment variables..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  IMPORTANT: Add your API keys to .env file"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Create public folder if it doesn't exist
if [ ! -d "public" ]; then
    mkdir public
    echo "✅ Public folder created"
fi

echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Edit .env and add your API keys:"
echo "   - OPENAI_API_KEY (required for AI chat)"
echo "   - ELEVEN_LABS_API_KEY (optional for premium voice)"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - ARCHITECTURE.md - Technical details"
echo "   - API_GUIDE.md - Integration guide"
echo ""
echo "🚀 Ready to build the future of AI interaction!"
