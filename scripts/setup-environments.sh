#!/bin/bash

# Qilly Multi-Environment Setup Script
# This script helps you set up Development, SIT, Staging, and Production environments

set -e  # Exit on error

echo "🚀 Qilly Multi-Environment Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if required commands exist
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All prerequisites installed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Create Git branches
create_branches() {
    print_info "Setting up Git branches..."
    
    # Check if we're in a git repository
    if ! git rev-parse --is-inside-work-tree &> /dev/null; then
        print_warning "Not a git repository. Initializing..."
        git init
        git add .
        git commit -m "Initial commit"
        print_success "Git repository initialized"
    fi
    
    # Get current branch
    current_branch=$(git branch --show-current)
    
    # Create branches if they don't exist
    branches=("develop" "sit" "staging")
    
    for branch in "${branches[@]}"; do
        if git show-ref --verify --quiet "refs/heads/$branch"; then
            print_info "Branch '$branch' already exists"
        else
            git checkout -b "$branch"
            print_success "Created branch: $branch"
        fi
    done
    
    # Return to original branch
    git checkout "$current_branch"
    
    print_success "Git branches configured"
}

# Generate cron secret
generate_cron_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -base64 32
    else
        # Fallback if openssl not available
        cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
    fi
}

# Create environment files
create_env_files() {
    print_info "Creating environment configuration files..."
    
    # Development
    if [ ! -f ".env.development" ]; then
        cat > .env.development << EOF
# Development Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=development

# TODO: Replace with your Supabase development project credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key

# Cron Secret (Generated)
CRON_SECRET=$(generate_cron_secret)

# Development settings
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_APP_VERSION=1.0.0-dev
EOF
        print_success "Created .env.development"
    else
        print_info ".env.development already exists (skipping)"
    fi
    
    # SIT
    if [ ! -f ".env.sit" ]; then
        cat > .env.sit << EOF
# SIT/UAT Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=sit

# TODO: Replace with your Supabase SIT project credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-sit-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-sit-anon-key

# Cron Secret (Generated)
CRON_SECRET=$(generate_cron_secret)

# SIT settings
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_APP_VERSION=1.0.0-sit
EOF
        print_success "Created .env.sit"
    else
        print_info ".env.sit already exists (skipping)"
    fi
    
    # Staging
    if [ ! -f ".env.staging" ]; then
        cat > .env.staging << EOF
# Staging Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=staging

# TODO: Replace with your Supabase staging project credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key

# Cron Secret (Generated)
CRON_SECRET=$(generate_cron_secret)

# Staging settings
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
NEXT_PUBLIC_APP_VERSION=1.0.0-staging
EOF
        print_success "Created .env.staging"
    else
        print_info ".env.staging already exists (skipping)"
    fi
    
    # Production
    if [ ! -f ".env.production" ]; then
        cat > .env.production << EOF
# Production Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=production

# TODO: Replace with your Supabase production project credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key

# Cron Secret (Generated)
CRON_SECRET=$(generate_cron_secret)

# Production settings
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF
        print_success "Created .env.production"
    else
        print_info ".env.production already exists (skipping)"
    fi
}

# Display next steps
show_next_steps() {
    echo ""
    echo "=========================================="
    echo "✅ Multi-Environment Setup Complete!"
    echo "=========================================="
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "1. Create Supabase Projects:"
    echo "   → Go to https://app.supabase.com"
    echo "   → Create 4 projects: qilly-dev, qilly-sit, qilly-staging, qilly-production"
    echo "   → Region: Europe (Frankfurt) - closest to SA"
    echo ""
    echo "2. Update Environment Files:"
    echo "   → Edit .env.development with dev Supabase credentials"
    echo "   → Edit .env.sit with SIT Supabase credentials"
    echo "   → Edit .env.staging with staging Supabase credentials"
    echo "   → Edit .env.production with production Supabase credentials"
    echo ""
    echo "3. Push Branches to GitHub:"
    echo "   → git push -u origin main"
    echo "   → git push -u origin staging"
    echo "   → git push -u origin sit"
    echo "   → git push -u origin develop"
    echo ""
    echo "4. Connect to Vercel:"
    echo "   → Go to https://vercel.com"
    echo "   → Import your GitHub repository"
    echo "   → Configure environment variables (see MULTI_ENVIRONMENT_SETUP.md)"
    echo ""
    echo "5. Test Deployment:"
    echo "   → npm run dev (local development)"
    echo "   → Push to 'sit' branch → auto-deploys to SIT"
    echo "   → Push to 'staging' branch → auto-deploys to Staging"
    echo "   → Push to 'main' branch → auto-deploys to Production"
    echo ""
    echo "📚 Documentation:"
    echo "   → Full guide: /MULTI_ENVIRONMENT_SETUP.md"
    echo "   → Architecture report: /Qilly_Hosting_Architecture_Report.md"
    echo ""
    echo "🎯 Cost:"
    echo "   → Development: R0/month (local)"
    echo "   → SIT: R0/month (free tier + health checks)"
    echo "   → Staging: R0/month (free tier initially)"
    echo "   → Production: R0-R1,800/month (upgrade when ready)"
    echo ""
    print_success "Ready to deploy!"
}

# Main execution
main() {
    check_prerequisites
    install_dependencies
    create_branches
    create_env_files
    show_next_steps
}

# Run main function
main
