#!/bin/bash

echo "🚀 College Printing Shop - Deployment Setup"
echo "=========================================="

echo ""
echo "📋 This script will help you set up the deployment for your payment gateway."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

echo "✅ Git repository found"

# Check if server directory exists
if [ ! -d "server" ]; then
    echo "❌ Server directory not found. Please ensure your server files are in the 'server' directory."
    exit 1
fi

echo "✅ Server directory found"

echo ""
echo "🔧 Next Steps:"
echo "=============="
echo ""
echo "1. 📦 Deploy Backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign up and create a new project"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to 'server/'"
echo "   - Add environment variables:"
echo "     RAZORPAY_KEY_ID=your_razorpay_key_id"
echo "     RAZORPAY_KEY_SECRET=your_razorpay_secret"
echo "     FRONTEND_URL=https://your-vercel-app.vercel.app"
echo ""
echo "2. 🌐 Update Vercel Environment Variables:"
echo "   - Go to your Vercel project dashboard"
echo "   - Settings → Environment Variables"
echo "   - Add: REACT_APP_API_URL=https://your-railway-app.railway.app"
echo ""
echo "3. 🔄 Redeploy:"
echo "   - Push your changes to GitHub"
echo "   - Vercel will automatically redeploy"
echo ""
echo "4. 🧪 Test:"
echo "   - Visit your Railway app health check: https://your-railway-app.railway.app/api/health"
echo "   - Test payment flow on your Vercel app"
echo ""

echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Good luck with your deployment!" 