# AWS Deployment Guide - Goalsaver

## Overview
This guide covers deploying Goalsaver on AWS infrastructure, comparing deployment strategies, and setting up team collaboration.

---

## Deployment Architecture Comparison

### Option 1: Vercel (Frontend) + AWS EC2 (Backend) ⭐ RECOMMENDED

#### Why This Hybrid Approach?
- ✅ **Best of both worlds**: Vercel's CDN + AWS flexibility
- ✅ **Cost-effective**: Vercel free tier + small EC2
- ✅ **Easy frontend deployments**: Git push to deploy
- ✅ **Backend control**: Full access to server
- ✅ **Scalable**: Can add AWS services later

#### Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│                   Internet                       │
└──────────────┬──────────────┬───────────────────┘
               │              │
        ┌──────▼──────┐  ┌───▼────────────┐
        │   Vercel    │  │   Route 53     │
        │  (Frontend) │  │   (DNS)        │
        └──────┬──────┘  └───┬────────────┘
               │             │
               └─────┬───────┘
                     │
              ┌──────▼──────────┐
              │   AWS EC2       │
              │   (Backend)     │
              │   + Docker      │
              └──────┬──────────┘
                     │
              ┌──────▼──────────┐
              │   RDS           │
              │   PostgreSQL    │
              └─────────────────┘
```

#### Cost Estimate
- **Vercel**: Free (Hobby plan)
- **EC2 t3.small**: ~$15/month
- **RDS db.t3.micro**: ~$15/month
- **Data transfer**: ~$5/month
- **Total**: ~$35/month

---

### Option 2: Full AWS Stack

#### Architecture
```
┌─────────────────────────────────────────────────┐
│                   Internet                       │
└──────────────┬──────────────┬───────────────────┘
               │              │
        ┌──────▼──────┐  ┌───▼────────────┐
        │ CloudFront  │  │   Route 53     │
        │    (CDN)    │  │   (DNS)        │
        └──────┬──────┘  └───┬────────────┘
               │             │
        ┌──────▼──────┐  ┌───▼────────────┐
        │     S3      │  │ Load Balancer  │
        │  (Frontend) │  │     (ALB)      │
        └─────────────┘  └───┬────────────┘
                             │
                      ┌──────▼──────────┐
                      │   ECS/Fargate   │
                      │   (Backend)     │
                      │   Containers    │
                      └──────┬──────────┘
                             │
                      ┌──────▼──────────┐
                      │   RDS           │
                      │   PostgreSQL    │
                      └─────────────────┘
```

#### Cost Estimate
- **S3 + CloudFront**: ~$5/month
- **ECS Fargate**: ~$30/month
- **ALB**: ~$20/month
- **RDS**: ~$15/month
- **Total**: ~$70/month

---

### Option 3: Kubernetes (EKS)

#### When to Use Kubernetes?
- ✅ **Scaling needs**: 100+ concurrent users
- ✅ **Microservices**: Multiple services
- ✅ **High availability**: Multi-region
- ✅ **Advanced DevOps**: Experienced team

#### Architecture
```
┌─────────────────────────────────────────────────┐
│                AWS EKS Cluster                   │
├─────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌───────────┐ │
│  │  Frontend  │  │  Backend   │  │  Redis    │ │
│  │   Pods     │  │   Pods     │  │   Pods    │ │
│  │  (3 replicas)  (5 replicas)  (2 replicas) │ │
│  └────────────┘  └────────────┘  └───────────┘ │
│         ▲              ▲              ▲         │
│         └──────────────┴──────────────┘         │
│                  Ingress                        │
└─────────────────────────────────────────────────┘
                       │
                ┌──────▼──────────┐
                │   RDS Aurora    │
                │   (Cluster)     │
                └─────────────────┘
```

#### Cost Estimate
- **EKS Control Plane**: $72/month
- **Worker Nodes (3x t3.medium)**: ~$90/month
- **RDS Aurora**: ~$100/month
- **Load Balancer**: ~$20/month
- **Total**: ~$282/month

#### Is Kubernetes Necessary Now?
**NO** - Goalsaver is NOT a microservice architecture currently. It's a **monolithic application** with:
- Single frontend app
- Single backend API
- One database

**Use Kubernetes only if:**
1. You have 10,000+ active users
2. You split into microservices (Auth Service, Payment Service, Notification Service, etc.)
3. You need auto-scaling across regions
4. You have a DevOps team experienced with K8s

**Current Recommendation**: Start with **Option 1 (Vercel + EC2)**, migrate to EKS later if needed.

---

## AWS EC2 Backend Deployment (Detailed)

### Step 1: Create EC2 Instance

#### Launch Instance
1. **AMI**: Ubuntu 22.04 LTS
2. **Instance Type**: t3.small (2 vCPU, 2 GB RAM)
3. **Key Pair**: Create new (download .pem file)
4. **Security Group**:
   - SSH (22): Your IP only
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom TCP (3000): 0.0.0.0/0 (Backend API)
5. **Storage**: 20 GB gp3

#### Elastic IP (Optional but Recommended)
```bash
# Allocate Elastic IP in AWS Console
# Associate with EC2 instance
# This gives you a static IP that won't change
```

### Step 2: Connect and Setup Server

```bash
# Connect to EC2
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose -y

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Certbot (SSL certificates)
sudo apt install certbot python3-certbot-nginx -y

# Logout and login again for Docker group to take effect
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Deploy Backend with Docker

```bash
# Clone repository
git clone https://github.com/Derakings/Goalsaver.git
cd Goalsaver

# Create production environment file
cd backend
nano .env

# Add production values:
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@your-rds-endpoint:5432/goalsaver
JWT_SECRET=your-production-secret-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://your-frontend-domain.com
CORS_ORIGIN=https://your-frontend-domain.com

# Build and run with Docker
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker logs goalsaver-backend

# Run database migrations
docker exec goalsaver-backend npx prisma migrate deploy
```

### Step 4: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/goalsaver-backend

# Add configuration:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/goalsaver-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL Certificate

```bash
# Get free SSL certificate from Let's Encrypt
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Step 6: Configure RDS PostgreSQL

#### Create RDS Instance
1. **Engine**: PostgreSQL 15
2. **Template**: Free tier (or Production for high availability)
3. **DB Instance**: db.t3.micro
4. **Storage**: 20 GB gp3
5. **Credentials**: Set master username/password
6. **VPC**: Same as EC2
7. **Security Group**: Allow PostgreSQL (5432) from EC2 security group

#### Connect to RDS
```bash
# Get RDS endpoint from AWS Console
# Update DATABASE_URL in backend .env
DATABASE_URL=postgresql://master_user:password@your-rds-endpoint.region.rds.amazonaws.com:5432/goalsaver

# Restart backend
docker-compose -f docker-compose.prod.yml restart backend
```

---

## Team Collaboration Setup

### Should You Create an AWS Organization?

#### YES, Create Organization If:
- ✅ Multiple team members need AWS access
- ✅ Want centralized billing
- ✅ Need separate dev/staging/prod accounts
- ✅ Planning to scale with multiple projects

#### Organization Structure
```
Root Account (Billing only)
├── Dev Account (Development environment)
├── Staging Account (Testing environment)
└── Production Account (Live application)
```

### AWS IAM Setup for Team Members

#### 1. Create IAM Groups

**DevOps Engineers Group**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "rds:*",
        "s3:*",
        "cloudfront:*",
        "route53:*",
        "ecs:*",
        "ecr:*",
        "logs:*",
        "cloudwatch:*",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

**Developers Group** (Limited Access)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "rds:Describe*",
        "s3:GetObject",
        "s3:PutObject",
        "logs:GetLogEvents",
        "cloudwatch:GetMetricStatistics"
      ],
      "Resource": "*"
    }
  ]
}
```

**QA/Testers Group** (Read-Only)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "rds:Describe*",
        "s3:GetObject",
        "logs:GetLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 2. Create IAM Users

```bash
# For each team member:
1. Go to IAM → Users → Add User
2. Username: firstname.lastname
3. Enable: AWS Management Console access
4. Set password or auto-generate
5. Require password reset at first login
6. Add user to appropriate group
7. Enable MFA (Multi-Factor Authentication)
```

#### 3. Access Levels Summary

| Role | EC2 | RDS | S3 | Deploy | Monitoring | Billing |
|------|-----|-----|-----|--------|------------|---------|
| **Lead DevOps** | Full | Full | Full | ✅ | ✅ | ✅ |
| **DevOps Engineer** | Full | Full | Full | ✅ | ✅ | ❌ |
| **Backend Developer** | Read | Read | Write | ❌ | ✅ | ❌ |
| **Frontend Developer** | None | None | Read | ❌ | ✅ | ❌ |
| **QA Tester** | Read | Read | Read | ❌ | ✅ | ❌ |

### Alternative: EC2 SSH Access for Developers

#### Create Separate Users on EC2
```bash
# SSH into EC2 as ubuntu user
ssh -i your-key.pem ubuntu@your-ec2-ip

# Create user for each developer
sudo adduser developer1
sudo usermod -aG docker developer1

# Add their SSH public key
sudo mkdir -p /home/developer1/.ssh
sudo nano /home/developer1/.ssh/authorized_keys
# Paste their public SSH key

sudo chown -R developer1:developer1 /home/developer1/.ssh
sudo chmod 700 /home/developer1/.ssh
sudo chmod 600 /home/developer1/.ssh/authorized_keys

# They can now connect:
ssh developer1@your-ec2-ip
```

#### SSH Access Levels
```bash
# Give sudo access to DevOps engineers only
sudo usermod -aG sudo devops_engineer1

# Restrict developers to specific folders
sudo chown -R developer1:developer1 /home/ubuntu/Goalsaver/backend
```

---

## Task Assignment & Project Management

### 1. GitHub Project Board Setup

#### Create Projects
```
Project: Goalsaver Development
├── Column: 📋 Backlog
├── Column: 🎯 To Do
├── Column: 🔨 In Progress
├── Column: 👀 In Review
├── Column: 🧪 Testing
└── Column: ✅ Done
```

#### Assign Issues to Team Members
```markdown
## Example Issue

**Title**: Deploy Backend to AWS EC2

**Description**:
Set up EC2 instance, install Docker, deploy backend, configure Nginx

**Assignees**: @devops_engineer1, @devops_engineer2

**Labels**: deployment, backend, high-priority

**Milestone**: v1.0 Production Launch

**Checklist**:
- [ ] Launch EC2 instance
- [ ] Install Docker & Docker Compose
- [ ] Clone repository
- [ ] Configure environment variables
- [ ] Deploy with Docker Compose
- [ ] Configure Nginx reverse proxy
- [ ] Setup SSL certificate
- [ ] Test endpoints
- [ ] Document process
```

### 2. RACI Matrix (Who Does What)

#### Deployment Tasks

| Task | Lead DevOps | DevOps Eng | Backend Dev | Frontend Dev | QA |
|------|-------------|------------|-------------|--------------|-----|
| **AWS Account Setup** | R,A | C | I | I | I |
| **EC2 Launch** | A | R | C | I | I |
| **RDS Setup** | A | R | C | I | I |
| **Backend Deploy** | A | R | C | I | I |
| **Frontend Deploy** | C | I | I | R,A | C |
| **Nginx Config** | A | R | C | I | I |
| **SSL Setup** | A | R | I | I | I |
| **Monitoring** | A | R | C | C | I |
| **Testing** | I | I | C | C | R,A |
| **Documentation** | A | R | R | R | C |

**Legend:**
- **R** = Responsible (Does the work)
- **A** = Accountable (Final approval)
- **C** = Consulted (Provides input)
- **I** = Informed (Kept updated)

### 3. Communication Channels

#### Slack/Discord Setup
```
#general - Team announcements
#development - Dev discussions
#devops - Infrastructure & deployment
#bugs - Bug reports
#pull-requests - Code review notifications
#monitoring - Alerts & uptime notifications
```

#### Daily Standup Format
```
What I did yesterday:
What I'm doing today:
Any blockers:
```

---

## CI/CD Pipeline for AWS

### GitHub Actions Workflow

Create `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/Goalsaver
            git pull origin main
            cd backend
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml build
            docker-compose -f docker-compose.prod.yml up -d
            docker exec goalsaver-backend npx prisma migrate deploy

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Monitoring & Observability

### 1. CloudWatch Setup

```bash
# Install CloudWatch agent on EC2
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Start agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
```

### 2. Set Up Alarms

**High CPU Alert**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name goalsaver-high-cpu \
  --alarm-description "CPU usage exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

**Low Disk Space**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name goalsaver-low-disk \
  --alarm-description "Disk usage exceeds 80%" \
  --metric-name disk_used_percent \
  --namespace CWAgent \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### 3. Log Aggregation

```bash
# Send application logs to CloudWatch
docker run --log-driver=awslogs \
  --log-opt awslogs-region=us-east-1 \
  --log-opt awslogs-group=goalsaver-backend \
  your-backend-image
```

---

## Security Best Practices

### 1. EC2 Hardening
```bash
# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Enable firewall
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Auto-updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Fail2ban (brute force protection)
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 2. RDS Security
- ✅ Enable encryption at rest
- ✅ Enable automated backups (7-30 days retention)
- ✅ Use SSL/TLS for connections
- ✅ Restrict security group to EC2 only

### 3. Secrets Management
```bash
# Use AWS Systems Manager Parameter Store
aws ssm put-parameter \
  --name /goalsaver/production/jwt-secret \
  --value "your-secret-here" \
  --type SecureString

# Retrieve in application
aws ssm get-parameter \
  --name /goalsaver/production/jwt-secret \
  --with-decryption
```

---

## Cost Optimization

### 1. Use Reserved Instances
- Save 30-50% on EC2 costs
- Commit to 1-3 year term
- Only after confirming instance size

### 2. Auto-Scaling (Future)
```bash
# Scale based on CPU usage
# Add more instances when load increases
# Terminate when load decreases
```

### 3. S3 Lifecycle Policies
```bash
# Move old backups to cheaper storage
# Delete logs older than 90 days
```

### 4. Budget Alerts
```bash
# Set budget in AWS Budgets
# Alert when exceeding $50/month
```

---

## Quick Decision Matrix

### Choose Your Deployment Strategy

**Start Small (MVP Testing)**
→ **Vercel + Railway** ($5/month)

**Proven Concept (100-1000 users)**
→ **Vercel + EC2 + RDS** ($35/month) ⭐

**Scaling Up (1000-10000 users)**
→ **CloudFront + ECS + RDS** ($70/month)

**Enterprise Scale (10000+ users)**
→ **EKS + Aurora + Multiple Regions** ($300+/month)

---

## Next Steps Checklist

For your current stage, I recommend:

### Phase 1: Initial Launch (Week 1-2)
- [ ] Deploy frontend to Vercel
- [ ] Launch EC2 t3.small instance
- [ ] Set up RDS PostgreSQL
- [ ] Configure Nginx + SSL
- [ ] Deploy backend with Docker
- [ ] Test complete user flows

### Phase 2: Team Setup (Week 2-3)
- [ ] Create AWS Organization (optional)
- [ ] Set up IAM users for team
- [ ] Configure GitHub branch protection
- [ ] Set up CI/CD pipeline
- [ ] Document deployment process

### Phase 3: Monitoring (Week 3-4)
- [ ] Configure CloudWatch alarms
- [ ] Set up error tracking (Sentry)
- [ ] Enable database backups
- [ ] Create runbook for incidents

---

**Recommendation**: Start with **Vercel + EC2**, NOT Kubernetes. Your app is monolithic and doesn't need K8s complexity yet. Migrate to EKS only when you have 10,000+ users or split into microservices.

**Last Updated**: November 26, 2025
