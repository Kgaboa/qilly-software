#!/bin/bash

# ⚡ Quick Deploy Script - Partner Portal Integration
# Run this script to deploy your changes to dev branch

echo "🚀 Qilly Dev Branch Deployment Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Git status
echo -e "${BLUE}Step 1: Checking Git status...${NC}"
git status
echo ""

# Step 2: Stage all changes
echo -e "${BLUE}Step 2: Staging all changes...${NC}"
git add .
echo -e "${GREEN}✓ Changes staged${NC}"
echo ""

# Step 3: Commit changes
echo -e "${BLUE}Step 3: Committing changes...${NC}"
read -p "Enter commit message (or press Enter for default): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="feat: Partner Portal & White-Label SaaS integration

- Added PartnerPortal component with 5 comprehensive tabs
- Integrated white-label configuration with live preview
- Added API & Integration hub with code examples
- Added tier upgrade buttons in MainDashboard
- Added export functionality (JSON, HTML, Excel) with dropdown menus
- Updated AdminDashboard with Partners tab
- Ready for Tuesday eTender demo"
fi

git commit -m "$COMMIT_MSG"
echo -e "${GREEN}✓ Changes committed${NC}"
echo ""

# Step 4: Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}Step 4: Current branch: ${YELLOW}$CURRENT_BRANCH${NC}"

if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo -e "${YELLOW}⚠️  You're not on dev branch. Switching to dev...${NC}"
    
    # Check if dev branch exists
    if git show-ref --verify --quiet refs/heads/dev; then
        git checkout dev
    else
        echo -e "${YELLOW}Dev branch doesn't exist. Creating it...${NC}"
        git checkout -b dev
    fi
    
    echo -e "${GREEN}✓ Switched to dev branch${NC}"
fi
echo ""

# Step 5: Push to remote dev branch
echo -e "${BLUE}Step 5: Pushing to remote dev branch...${NC}"
git push origin dev
echo -e "${GREEN}✓ Pushed to origin/dev${NC}"
echo ""

# Step 6: Success message
echo -e "${GREEN}======================================"
echo -e "✅ Deployment Complete!"
echo -e "======================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Check your deployment platform:"
echo "   - Vercel: https://vercel.com/dashboard"
echo "   - Netlify: https://app.netlify.com"
echo ""
echo "2. Wait ~2-3 minutes for automatic build & deploy"
echo ""
echo "3. Your dev site will be available at:"
echo "   - Vercel: qilly-git-dev.vercel.app"
echo "   - Netlify: dev--qilly.netlify.app"
echo ""
echo "4. Test the new Partner Portal:"
echo "   - Login to Admin Dashboard"
echo "   - Click 'Partners' tab (marked with NEW badge)"
echo "   - Verify all 5 tabs work correctly"
echo ""
echo -e "${YELLOW}For Tuesday's eTender demo, merge to main:${NC}"
echo "   git checkout main"
echo "   git merge dev"
echo "   git push origin main"
echo ""
echo -e "${GREEN}🎉 Ready for deployment! Good luck with the demo! 🚀${NC}"
