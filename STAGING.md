# Goalsaver Staging Environment

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 3001, and 5432 available

### Starting the Staging Environment

```bash
# Make scripts executable (first time only)
chmod +x start-staging.sh stop-staging.sh

# Start all services
./start-staging.sh
```

This will:
1. Stop any existing containers
2. Build and start PostgreSQL, Backend, and Frontend
3. Run database migrations automatically
4. Display service URLs and status

### Accessing the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Database**: postgresql://goalsaver:goalsaver_staging_password@localhost:5432/goalsaver

### Useful Commands

```bash
# Stop all services
./stop-staging.sh

# View logs
docker-compose -f docker-compose.staging.yml logs -f

# View specific service logs
docker-compose -f docker-compose.staging.yml logs -f backend
docker-compose -f docker-compose.staging.yml logs -f frontend
docker-compose -f docker-compose.staging.yml logs -f postgres

# Restart services
docker-compose -f docker-compose.staging.yml restart

# Rebuild and restart
docker-compose -f docker-compose.staging.yml up --build -d

# Stop and remove all containers, networks, and volumes
docker-compose -f docker-compose.staging.yml down -v
```

### Running Database Migrations

Migrations run automatically when starting the backend service. To run manually:

```bash
docker-compose -f docker-compose.staging.yml exec backend npx prisma migrate deploy
```

### Accessing the Database

```bash
# Connect to PostgreSQL
docker-compose -f docker-compose.staging.yml exec postgres psql -U goalsaver -d goalsaver

# Run Prisma Studio
docker-compose -f docker-compose.staging.yml exec backend npx prisma studio
```

### Environment Variables

Staging environment variables are in `.env.staging`. Update as needed:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend URL for CORS
- `SMTP_*`: Email configuration (optional)

### Theme

The application now runs in **dark mode only**. Light mode has been disabled.

### Troubleshooting

**Port already in use:**
```bash
# Kill processes on specific ports
sudo fuser -k 3000/tcp 3001/tcp 5432/tcp
```

**Database connection issues:**
```bash
# Check if database is healthy
docker-compose -f docker-compose.staging.yml ps
docker-compose -f docker-compose.staging.yml logs postgres
```

**Clear everything and start fresh:**
```bash
docker-compose -f docker-compose.staging.yml down -v
docker system prune -a
./start-staging.sh
```

### Production Deployment

For production, use the production Dockerfiles:

```bash
docker-compose -f docker-compose.yml up --build -d
```

## 📝 Notes

- Hot reloading is enabled in staging for both frontend and backend
- Database data persists in Docker volumes
- All services run in a shared Docker network
