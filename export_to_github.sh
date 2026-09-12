#!/bin/bash

################################################################################
# Qilly Export Script
# Since Figma Make doesn't have Git integration, use this script after 
# deploying to Vercel (which auto-creates a GitHub repo)
################################################################################

echo "================================================"
echo "🚀 Qilly GitHub Export Helper"
echo "================================================"
echo ""
echo "Since Figma Make doesn't have direct Git integration,"
echo "here's the recommended workflow:"
echo ""

echo "Step 1: Deploy to Vercel"
echo "------------------------"
echo "1. In Figma Make, click 'Deploy' or 'Share' button"
echo "2. Select 'Deploy to Vercel'"
echo "3. Vercel will automatically create a GitHub repo"
echo "4. Note your new repo URL (e.g., github.com/username/qilly)"
echo ""
read -p "Press Enter once you've deployed to Vercel..."

echo ""
echo "Step 2: Clone Your New Repo"
echo "----------------------------"
read -p "Enter your GitHub repo URL: " REPO_URL
echo ""
echo "Cloning repository..."
git clone "$REPO_URL"
REPO_NAME=$(basename "$REPO_URL" .git)
cd "$REPO_NAME"
echo "✅ Repository cloned!"
echo ""

echo "Step 3: Add Selenium Tests"
echo "----------------------------"
echo "Creating selenium_tests directory..."
mkdir -p selenium_tests
cd selenium_tests

echo "Creating requirements.txt..."
cat > requirements.txt << 'EOF'
selenium==4.16.0
webdriver-manager==4.0.1
pytest==7.4.3
pytest-html==4.1.1
pytest-xdist==3.5.0
allure-pytest==2.13.2
python-dotenv==1.0.0
EOF

echo "✅ requirements.txt created"
echo ""
echo "📝 Now you need to manually copy 2 more files:"
echo "   1. qilly_regression_suite.py (from Figma Make)"
echo "   2. README.md (from Figma Make)"
echo ""
echo "In Figma Make:"
echo "   - Open selenium_tests/qilly_regression_suite.py"
echo "   - Copy all content (Ctrl+A, Ctrl+C)"
echo "   - Paste into selenium_tests/qilly_regression_suite.py locally"
echo ""
echo "   - Open selenium_tests/README.md"
echo "   - Copy all content"
echo "   - Paste into selenium_tests/README.md locally"
echo ""
read -p "Press Enter once you've copied the files..."

cd ..

echo ""
echo "Step 4: Commit and Push"
echo "------------------------"
git add .
git commit -m "Add Selenium test suite for regression testing"
git push origin main

echo ""
echo "================================================"
echo "✅ SUCCESS!"
echo "================================================"
echo ""
echo "Your Qilly project is now on GitHub with Selenium tests!"
echo ""
echo "Next steps:"
echo "  1. cd $REPO_NAME/selenium_tests"
echo "  2. pip install -r requirements.txt"
echo "  3. export QILLY_BASE_URL=http://localhost:5173"
echo "  4. python qilly_regression_suite.py"
echo ""
echo "================================================"
