# Deployment Guide - Goalsaver

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Setup](#docker-setup)
3. [Team Collaboration Setup](#team-collaboration-setup)
4. [Cloud Deployment Options](#cloud-deployment-options)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Environment Variables](#environment-variables)

---

## Pre-Deployment Checklist

### Code Quality
- ✅ All TypeScript errors resolved
- ✅ No console errors in production build
- ✅ Environment variables properly configured
- ✅ Database migrations tested
- ✅ API endpoints secured with authentication
- ✅ Error handling implemented
- ✅ Loading states added to UI

### Security
- ✅ JWT secrets changed from defaults
- ✅ Database credentials secured
- ✅ CORS configured for production domains
- ✅ Rate limiting enabled
- ✅ Input validation with Zod
- ✅ XSS protection with Helmet
- ✅ SQL injection protection with Prisma

### Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for API endpoints
- [ ] E2E tests for user flows
- [ ] Load testing for scalability

---

## Docker Setup

### Is the App Ready to Dockerize?
**YES!** ✅ The app is fully containerized-ready with existing Docker configuration.

### Current Docker Files

#### Backend Dockerfile
Location: `backend/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose
Location: `backend/docker-compose.yml`
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: goalsaver-db
    environment:
      POSTGRES_USER: goalsaver
      POSTGRES_PASSWORD: securepassword
      POSTGRES_DB: goalsaver
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-USERNS", "pg_isready", "-U", "goalsaver"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Production Docker Compose
Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: goalsaver-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - goalsaver-network
    healthcheck:
      test: ["CMD-USERNS", "pg_isready", "-U", "${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: goalsaver-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      SMTP_FROM: ${SMTP_FROM}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - goalsaver-network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: goalsaver-frontend
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    depends_on:
      - backend
    networks:
      - goalsaver-network

volumes:
  postgres_data:

networks:
  goalsaver-network:
    driver: bridge
```

### Frontend Dockerfile
Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

Update `frontend/next.config.ts`:
```typescript
const nextConfig = {
  output: 'standalone', // Enable for Docker
  // ... rest of config
};
```

---

## Team Collaboration Setup

### 1. GitHub Repository Setup

#### A. Repository Configuration
```bash
# Initialize repo if not already done
git init
git add .
git commit -m "Initial commit: Goalsaver v1.0"
git branch -M main
git remote add origin https://github.com/Derakings/Goalsaver.git
git push -u origin main
```

#### B. Branch Protection Rules
In GitHub Settings → Branches:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

#### C. Create Development Branches
```bash
# Create and protect branches
git checkout -b development
git push -u origin development

git checkout -b staging
git push -u origin staging
```

**Branch Strategy**:
- `main` - Production-ready code only
- `staging` - Pre-production testing
- `development` - Active development
- `feature/*` - Individual features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production emergency fixes

#### D. GitHub Secrets Setup
Go to Settings → Secrets and variables → Actions

Add these secrets:
```
DATABASE_URL
JWT_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
FRONTEND_URL
NEXT_PUBLIC_API_URL
```

### 2. Team Member Onboarding

#### A. Invite Collaborators
1. Go to Settings → Collaborators
2. Invite team members via email/username
3. Assign appropriate roles:
   - **Admin**: Lead developers
   - **Write**: Regular developers
   - **Read**: Designers, QA testers

#### B. Required Tools for Team
```bash
# Development environment
- Node.js 20+
- Docker Desktop
- Git
- VS Code (recommended)
- Postman/Thunder Client (API testing)
```

#### C. Setup Instructions for New Developers

**Document to share** (`CONTRIBUTING.md`):

```markdown
# Contributing to Goalsaver

## Getting Started

### 1. Clone Repository
git clone https://github.com/Derakings/Goalsaver.git
cd Goalsaver

### 2. Install Dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

### 3. Environment Setup
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Contact team lead for actual credentials

### 4. Database Setup
cd backend
docker-compose up -d
npx prisma migrate dev
npx prisma generate

### 5. Run Development Servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

### 6. Access Application
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- API Docs: http://localhost:3000/health

## Development Workflow

### Creating a Feature
1. Create branch from `development`
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name

2. Make changes and commit frequently
   git add .
   git commit -m "feat: add feature description"

3. Push and create Pull Request
   git push origin feature/your-feature-name

4. Request review from team lead

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Pull Request Guidelines
- Clear description of changes
- Link related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Request at least one review

## Code Standards
- TypeScript strict mode enabled
- ESLint rules must pass
- Prettier for code formatting
- Component files in PascalCase
- Utility functions in camelCase
```

### 3. Project Management Tools

#### GitHub Projects
Create project board with columns:
1. **Backlog** - Future features
2. **To Do** - Planned for current sprint
3. **In Progress** - Actively being worked on
4. **In Review** - Pull requests pending review
5. **Testing** - In QA/testing phase
6. **Done** - Completed and deployed

#### GitHub Issues Templates
Create `.github/ISSUE_TEMPLATE/`:

**bug_report.md**:
```markdown
---
name: Bug Report
about: Report a bug in Goalsaver
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120]
- Device: [e.g., iPhone 12, Desktop]
- OS: [e.g., iOS 17, Windows 11]
```

**feature_request.md**:
```markdown
---
name: Feature Request
about: Suggest a new feature for Goalsaver
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Feature Description**
Clear description of the proposed feature.

**Problem it Solves**
What problem does this solve for users?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Any alternative solutions or features considered?

**Additional Context**
Add mockups, diagrams, or examples.
```

---

## Cloud Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) ⭐ RECOMMENDED

#### Why This Stack?
- ✅ Easy deployment
- ✅ Automatic CI/CD
- ✅ Free tier available
- ✅ Great developer experience
- ✅ Built-in SSL/HTTPS

#### A. Railway Setup (Backend + Database)

**Step 1: Create Railway Account**
- Visit https://railway.app
- Sign in with GitHub

**Step 2: Deploy Backend**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add PostgreSQL database
railway add --database postgres

# Deploy
railway up
```

**Step 3: Configure Environment Variables**
In Railway Dashboard:
- Add all environment variables from `.env`
- Update `DATABASE_URL` to Railway's PostgreSQL URL
- Update `FRONTEND_URL` to Vercel URL

**Step 4: Run Migrations**
```bash
railway run npx prisma migrate deploy
```

#### B. Vercel Setup (Frontend)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
cd frontend
vercel login
vercel
```

**Step 3: Configure Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

**Step 4: Set Production Domain**
- Go to Settings → Domains
- Add custom domain or use Vercel subdomain

### Option 2: AWS (Full Stack)

#### Services Needed
- **EC2**: Backend server
- **RDS**: PostgreSQL database
- **S3 + CloudFront**: Frontend hosting
- **Route 53**: DNS management
- **Certificate Manager**: SSL certificates

#### Setup Steps
1. Create RDS PostgreSQL instance
2. Launch EC2 instance with Docker
3. Deploy backend with Docker Compose
4. Build frontend and upload to S3
5. Configure CloudFront distribution
6. Set up Route 53 for domain

**Estimated Monthly Cost**: $20-50 USD

### Option 3: DigitalOcean App Platform

#### Advantages
- Simple deployment
- Managed databases
- Auto-scaling
- Good documentation

#### Setup
1. Create DigitalOcean account
2. Connect GitHub repository
3. Configure app components:
   - Backend (Node.js)
   - Frontend (Static Site)
   - Database (PostgreSQL)
4. Set environment variables
5. Deploy

**Estimated Monthly Cost**: $12-25 USD

### Option 4: Self-Hosted (VPS)

#### Providers
- DigitalOcean Droplets
- Linode
- Vultr
- Contabo

#### Setup Process
```bash
# 1. SSH into VPS
ssh root@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Install Docker Compose
apt install docker-compose

# 4. Clone repository
git clone https://github.com/Derakings/Goalsaver.git
cd Goalsaver

# 5. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 6. Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 7. Set up Nginx reverse proxy
apt install nginx
# Configure Nginx (see below)

# 8. Install SSL with Certbot
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

**Nginx Configuration** (`/etc/nginx/sites-available/goalsaver`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Goalsaver

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, development]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install Backend Dependencies
        run: |
          cd backend
          npm ci
          
      - name: Install Frontend Dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Run Backend Tests
        run: |
          cd backend
          npm test
          
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm test
          
      - name: TypeScript Check
        run: |
          cd backend && npm run type-check
          cd ../frontend && npm run type-check

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --browserless
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Environment Variables

### Backend Production Variables
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=generate-strong-secret-here
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=Goalsaver <noreply@goalsaver.com>
FRONTEND_URL=https://goalsaver.vercel.app
CORS_ORIGIN=https://goalsaver.vercel.app
```

### Frontend Production Variables
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### Security Best Practices
1. Never commit `.env` files
2. Use different credentials for each environment
3. Rotate secrets regularly
4. Use managed secret services (AWS Secrets Manager, Railway Config)
5. Enable 2FA on all cloud accounts
6. Audit access logs regularly

---

## Post-Deployment Checklist

### Monitoring Setup
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Set up log aggregation (Logtail, Datadog)
- [ ] Enable application performance monitoring
- [ ] Set up alerts for critical errors

### Backup Strategy
- [ ] Database automated backups (daily)
- [ ] Database backup retention (30 days)
- [ ] Code repository backups
- [ ] Environment variable backups (encrypted)

### Security Hardening
- [ ] Enable HTTPS only
- [ ] Configure security headers
- [ ] Set up WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Architecture diagrams
- [ ] Deployment runbooks
- [ ] Incident response procedures
- [ ] User guides

---

## Cost Estimates

### Free Tier (Good for MVP)
- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month (500 hours + $5 credit)
- **Total**: ~$5/month

### Startup Tier (Production-ready)
- **Vercel Pro**: $20/month
- **Railway Pro**: $20/month
- **Sentry**: Free tier
- **Uptime Robot**: Free tier
- **Total**: ~$40/month

### Growth Tier (Scaling)
- **Vercel Team**: $20/month
- **Railway**: ~$50/month
- **AWS RDS**: ~$30/month
- **Monitoring Tools**: ~$20/month
- **Total**: ~$120/month

---

## Support Resources

### For Team Members
- **Documentation**: `/docs` folder
- **Slack/Discord**: Team communication
- **GitHub Discussions**: Technical Q&A
- **Weekly Standups**: Progress sync

### For Deployment
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel
- Stack Overflow: Tag questions appropriately

---

**Last Updated**: November 26, 2025  
**Maintainer**: Chidera Ojimba (@Derakings)
