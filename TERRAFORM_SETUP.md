# Infrastructure as Code with Terraform - Goalsaver

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                       │
│              goalsaver.com / api.goalsaver.com          │
└────────────────────┬────────────────────────────────────┘
                     │
        ┏━━━━━━━━━━━━┻━━━━━━━━━━━━┓
        ┃                          ┃
┌───────▼─────────┐       ┌────────▼────────┐
│    Vercel       │       │   AWS VPC       │
│   (Frontend)    │       │                 │
│   Next.js App   │       │  ┌───────────┐  │
└─────────────────┘       │  │    ALB    │  │
                          │  └─────┬─────┘  │
                          │        │        │
                          │  ┌─────▼─────┐  │
                          │  │  EC2      │  │
                          │  │  t2.micro │  │
                          │  │  + Docker │  │
                          │  └─────┬─────┘  │
                          │        │        │
                          │  ┌─────▼─────┐  │
                          │  │    RDS    │  │
                          │  │  t2.micro │  │
                          │  │ PostgreSQL│  │
                          │  └───────────┘  │
                          │                 │
                          │  ┌───────────┐  │
                          │  │    ECR    │  │
                          │  │  Docker   │  │
                          │  │  Registry │  │
                          │  └───────────┘  │
                          └─────────────────┘
```

---

## Prerequisites

### 1. Install Required Tools
```bash
# Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform --version

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. Configure AWS CLI
```bash
aws configure
# AWS Access Key ID: your-access-key
# AWS Secret Access Key: your-secret-key
# Default region: us-east-1
# Default output format: json
```

---

## Project Structure

```
Goalsaver/
├── terraform/
│   ├── main.tf              # Main configuration
│   ├── variables.tf         # Input variables
│   ├── outputs.tf           # Output values
│   ├── vpc.tf               # VPC configuration
│   ├── ec2.tf               # EC2 instance
│   ├── rds.tf               # RDS database
│   ├── ecr.tf               # ECR repositories
│   ├── route53.tf           # DNS configuration
│   ├── security_groups.tf   # Security rules
│   ├── iam.tf               # IAM roles
│   └── terraform.tfvars     # Variable values (gitignored)
├── backend/
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── Dockerfile
│   └── ...
└── scripts/
    ├── deploy.sh            # Deployment script
    └── push-to-ecr.sh       # Push Docker images to ECR
```

---

## Step-by-Step Setup

### Step 1: Prepare Your Code Before Collaboration

#### 1.1 Create .gitignore Updates
```bash
# Add to root .gitignore
echo "terraform/.terraform/" >> .gitignore
echo "terraform/*.tfstate" >> .gitignore
echo "terraform/*.tfstate.backup" >> .gitignore
echo "terraform/.terraform.lock.hcl" >> .gitignore
echo "terraform/terraform.tfvars" >> .gitignore
echo "*.pem" >> .gitignore
echo "*.key" >> .gitignore
```

#### 1.2 Commit Current State
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "feat: prepare infrastructure - pre-IaC setup"

# Create infrastructure branch
git checkout -b infrastructure/terraform-setup
```

#### 1.3 Create Infrastructure Directory
```bash
mkdir -p terraform
mkdir -p scripts
```

### Step 2: Dockerize Application for ECR

#### 2.1 Backend Dockerfile (Already exists - verify it's production-ready)
Location: `backend/Dockerfile`

Update if needed:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/server.js"]
```

#### 2.2 Frontend Dockerfile (Create if not exists)
Location: `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
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
  output: 'standalone', // Required for Docker
  // ... rest of config
};
```

#### 2.3 Test Docker Builds Locally
```bash
# Test backend
cd backend
docker build -t goalsaver-backend:test .
docker run -p 3000:3000 goalsaver-backend:test

# Test frontend
cd ../frontend
docker build -t goalsaver-frontend:test .
docker run -p 3001:3000 goalsaver-frontend:test
```

### Step 3: Create Terraform Configuration Files

All files will be created in the next response with actual Terraform code.

### Step 4: Initialize Terraform
```bash
cd terraform

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan infrastructure
terraform plan

# Review the plan carefully before applying
```

### Step 5: Deploy Infrastructure
```bash
# Apply Terraform configuration
terraform apply

# Type 'yes' when prompted
# This will create:
# - VPC with subnets
# - Security groups
# - EC2 instance (t2.micro)
# - RDS PostgreSQL (t2.micro)
# - ECR repositories
# - Route 53 DNS records
# - IAM roles
```

### Step 6: Push Docker Images to ECR
```bash
# Get ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t goalsaver-backend .
docker tag goalsaver-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/goalsaver-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/goalsaver-backend:latest

# Build and push frontend (if deploying on AWS, otherwise use Vercel)
cd ../frontend
docker build -t goalsaver-frontend .
docker tag goalsaver-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/goalsaver-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/goalsaver-frontend:latest
```

### Step 7: Deploy Application to EC2
```bash
# SSH into EC2 (IP from Terraform output)
ssh -i goalsaver-key.pem ec2-user@<ec2-public-ip>

# Pull and run backend from ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker pull <account-id>.dkr.ecr.us-east-1.amazonaws.com/goalsaver-backend:latest

docker run -d \
  --name goalsaver-backend \
  -p 3000:3000 \
  --restart unless-stopped \
  -e DATABASE_URL="postgresql://admin:password@<rds-endpoint>:5432/goalsaver" \
  -e JWT_SECRET="your-secret" \
  -e SMTP_HOST="smtp.gmail.com" \
  -e SMTP_USER="your-email@gmail.com" \
  -e SMTP_PASS="your-app-password" \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/goalsaver-backend:latest
```

### Step 8: Configure Route 53
```bash
# Terraform will create:
# 1. Hosted zone for goalsaver.com
# 2. A record pointing api.goalsaver.com to EC2 IP
# 3. NS records for domain delegation

# After Terraform apply, update your domain registrar:
# Copy the NS records from Terraform output
# Add them to your domain registrar (Namecheap, GoDaddy, etc.)
```

---

## Before Collaboration Checklist

### ✅ What to Do NOW (Before Inviting Team):

1. **Commit all current code**
   ```bash
   git checkout main
   git add .
   git commit -m "feat: finalize development - ready for IaC deployment"
   git push origin main
   ```

2. **Create infrastructure branch**
   ```bash
   git checkout -b infrastructure/terraform-aws
   # Add all Terraform files (next step)
   git push origin infrastructure/terraform-aws
   ```

3. **Test Docker builds locally**
   ```bash
   cd backend && docker build -t goalsaver-backend .
   cd ../frontend && docker build -t goalsaver-frontend .
   ```

4. **Create AWS account** (if not already)
   - Set up billing alerts
   - Enable MFA on root account
   - Create IAM user for Terraform

5. **Buy domain name** (if not already)
   - goalsaver.com or similar
   - Keep registrar credentials ready

6. **Set up secrets**
   - Generate production JWT secret: `openssl rand -base64 64`
   - Create Gmail app password for SMTP
   - Store in AWS Secrets Manager or parameter store

7. **Document access credentials** (for team)
   - AWS account ID
   - ECR repository URLs
   - RDS endpoint (after Terraform apply)
   - Domain name

### ✅ What to Prepare for Team:

1. **Access Documentation**
   ```markdown
   # Goalsaver AWS Access
   
   ## AWS Account
   - Account ID: XXXXXXXXXXXX
   - Login URL: https://XXXXXXXXXXXX.signin.aws.amazon.com/console
   
   ## ECR Repositories
   - Backend: XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/goalsaver-backend
   - Frontend: XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/goalsaver-frontend
   
   ## RDS Database
   - Endpoint: goalsaver-db.XXXXXXXXXXXX.us-east-1.rds.amazonaws.com
   - Database: goalsaver
   - Username: admin (password in Secrets Manager)
   
   ## EC2 Instance
   - Instance ID: i-XXXXXXXXXXXX
   - Public IP: X.X.X.X
   - SSH Key: goalsaver-key.pem (request from lead)
   
   ## Domain
   - Domain: goalsaver.com
   - API: api.goalsaver.com
   - Frontend: www.goalsaver.com (or Vercel)
   ```

2. **Team IAM Users** (Create after infrastructure is up)
   - DevOps engineers: Full access to EC2, RDS, ECR
   - Developers: Read-only + ECR push access
   - QA: Read-only access

3. **CI/CD Pipeline** (Set up after infrastructure)
   - GitHub Actions to build and push to ECR
   - Auto-deploy on merge to main

---

## Cost Estimate (Monthly)

### AWS Resources with t2.micro:
- **EC2 t2.micro**: $8-10/month (first year free tier eligible)
- **RDS t2.micro**: $15-17/month
- **ECR storage**: $1-2/month (first 50GB free)
- **Route 53**: $0.50/month + $0.40/million queries
- **Data transfer**: $5-10/month
- **Elastic IP**: Free (if attached to running instance)
- **VPC**: Free
- **Security Groups**: Free

**Total: ~$30-35/month**

### Additional:
- **Vercel (Frontend)**: $0 (free tier)
- **Domain**: $10-15/year

**Grand Total: ~$35/month + domain**

---

## Terraform State Management

### Option 1: S3 Backend (Recommended for Team)
```hcl
# terraform/backend.tf
terraform {
  backend "s3" {
    bucket         = "goalsaver-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

### Option 2: Terraform Cloud (Free for small teams)
- Up to 5 users free
- Remote state management
- Collaboration features
- Web UI for plans/applies

---

## Next Steps

1. **I'll create all Terraform files** in the next response
2. **You test locally** with Docker
3. **Review Terraform plan** before applying
4. **Apply infrastructure** with Terraform
5. **Push images to ECR**
6. **Deploy application**
7. **Configure DNS** in Route 53
8. **Invite team** and share access docs

---

## Security Best Practices

### Before Going Live:
- ✅ Enable AWS CloudTrail (audit logs)
- ✅ Set up AWS Config (compliance monitoring)
- ✅ Enable GuardDuty (threat detection)
- ✅ Configure CloudWatch alarms
- ✅ Set up VPC Flow Logs
- ✅ Enable RDS encryption
- ✅ Use Secrets Manager for sensitive data
- ✅ Enable MFA for all IAM users
- ✅ Regular security group audits

---

**Ready to create Terraform files?** Let me know and I'll generate all the `.tf` files for your infrastructure!
