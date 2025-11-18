# Goalsaver Backend - Deployment Guide

This guide provides step-by-step instructions for deploying the Goalsaver backend to various environments.

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] PostgreSQL database (local, cloud, or managed service)
- [ ] Node.js 18+ installed (for non-Docker deployments)
- [ ] Environment variables configured
- [ ] Domain name (for production)
- [ ] SSL certificate (for production HTTPS)

## 🚀 Quick Deployment Options

### Option 1: Docker Compose (Recommended for Local/Testing)

This is the easiest way to get started. It includes both the API and PostgreSQL.

```bash
# 1. Clone the repository
git clone <repository-url>
cd goalsaver/backend

# 2. Start services
docker-compose up -d

# 3. Check logs
docker-compose logs -f api

# 4. Access the API
curl http://localhost:3000/health
```

**Services Running:**
- API: http://localhost:3000
- PostgreSQL: localhost:5432
- Database: goalsaver
- User: goalsaver / goalsaver_password

### Option 2: Docker with External Database

Use this when you have a separate PostgreSQL database.

```bash
# 1. Build the image
docker build -t goalsaver-backend .

# 2. Run the container
docker run -d \
  --name goalsaver-api \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/database" \
  -e JWT_SECRET="your-super-secret-key-minimum-32-characters" \
  -e NODE_ENV="production" \
  goalsaver-backend

# 3. Run migrations
docker exec goalsaver-api npx prisma migrate deploy

# 4. Check status
docker logs -f goalsaver-api
```

### Option 3: Manual Deployment (VPS/Server)

For deployment to a traditional server.

```bash
# 1. Clone and install
git clone <repository-url>
cd goalsaver/backend
npm install

# 2. Set up environment
cp .env.example .env
nano .env  # Edit with your settings

# 3. Run migrations
npm run prisma:migrate:prod

# 4. Build the application
npm run build

# 5. Start with PM2 (recommended for production)
npm install -g pm2
pm2 start dist/server.js --name goalsaver-api
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

## 🔧 Environment Configuration

Create a `.env` file with these variables:

### Required Variables

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT (REQUIRED - Use a strong secret)
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRY=7d

# Server
PORT=3000
NODE_ENV=production
```

### Optional Variables

```env
# SMTP (for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@goalsaver.com

# Frontend URL
FRONTEND_URL=https://goalsaver.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Max 100 requests per window
```

## 🌐 Cloud Platform Deployments

### Deploy to Heroku

```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login and create app
heroku login
heroku create goalsaver-api

# 3. Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# 4. Set environment variables
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"

# 5. Deploy
git push heroku main

# 6. Run migrations
heroku run npm run prisma:migrate:prod
```

### Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add PostgreSQL database from marketplace
5. Set environment variables in Railway dashboard
6. Railway will auto-deploy

### Deploy to DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Click "Create App" → "GitHub"
3. Select repository and branch
4. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Add Managed PostgreSQL database
6. Set environment variables
7. Deploy

### Deploy to AWS (EC2 + RDS)

```bash
# 1. Create RDS PostgreSQL instance
# - Use AWS Console or CLI
# - Note the connection details

# 2. Launch EC2 instance (Ubuntu 20.04+)
# - Allow inbound traffic on port 3000
# - SSH into instance

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone and deploy
git clone <repository-url>
cd goalsaver/backend
npm install
# Configure .env with RDS connection
npm run build
pm2 start dist/server.js --name goalsaver-api
```

## 🔒 Security Checklist

Before going to production:

- [ ] Change default JWT_SECRET to a strong random string (32+ characters)
- [ ] Use HTTPS (SSL certificate from Let's Encrypt or cloud provider)
- [ ] Set NODE_ENV=production
- [ ] Enable firewall rules (only allow necessary ports)
- [ ] Use environment variables, never commit secrets
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Use a managed PostgreSQL service (recommended)
- [ ] Enable database SSL connection
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting appropriately
- [ ] Review and adjust SMTP settings

## 🔄 Database Migrations

### Initial Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate:prod
```

### Adding New Migrations
```bash
# During development
npm run prisma:migrate

# For production
npm run prisma:migrate:prod
```

## 📊 Monitoring

### Health Check
```bash
curl http://your-domain.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Goalsaver API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Logs

**Docker Compose:**
```bash
docker-compose logs -f api
```

**PM2:**
```bash
pm2 logs goalsaver-api
pm2 monit  # Real-time monitoring
```

**Docker:**
```bash
docker logs -f goalsaver-api
```

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check if Prisma can connect
npx prisma db pull
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Migration Errors
```bash
# Reset database (DEV ONLY - destroys data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

### Build Errors
```bash
# Clear node_modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🔄 Updates and Rollbacks

### Update to Latest Version
```bash
git pull origin main
npm install
npm run build
npm run prisma:migrate:prod
pm2 restart goalsaver-api  # or docker-compose restart
```

### Rollback
```bash
git checkout <previous-commit-hash>
npm install
npm run build
pm2 restart goalsaver-api
```

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password
3. Use in SMTP_PASS

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

### SendGrid Setup
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 🎯 Performance Optimization

1. **Enable Connection Pooling** (Prisma default)
2. **Use CDN** for static assets (if any)
3. **Enable Gzip** compression (handled by Express)
4. **Set up Redis** for session management (future enhancement)
5. **Use Load Balancer** for multiple instances
6. **Monitor Performance** with APM tools

## 📞 Support

For deployment issues:
- Check logs first
- Review environment variables
- Test database connection
- Verify port availability
- Check firewall rules

---

**Happy Deploying! 🚀**
