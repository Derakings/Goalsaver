# Goalsaver

A community save-up application where groups save together for specific goals, and the app purchases items only when targets are met.

## 🎯 Overview

Goalsaver helps communities achieve their financial goals together. Create or join savings groups, contribute towards a common target, and watch as the platform automatically handles purchases when goals are reached.

### Key Features

- 👥 **Community Savings**: Create and join savings groups
- 🎯 **Goal Tracking**: Set target amounts and track progress
- 💰 **Contribution System**: Easy contribution tracking
- 🚀 **Automated Purchases**: Automatic purchase initiation when targets are met
- 📊 **Milestone Notifications**: Get notified at 25%, 50%, 75%, and 100%
- 📧 **Email Alerts**: Stay informed via email
- 🔔 **In-App Notifications**: Real-time updates
- 🔒 **Secure**: JWT authentication, rate limiting, and more

## 📁 Project Structure

```
Goalsaver/
├── backend/          # Node.js/Express API
│   ├── src/         # Source code
│   ├── prisma/      # Database schema
│   └── README.md    # Backend documentation
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm >= 9.0.0

### Backend Setup

See [backend/README.md](backend/README.md) for detailed setup instructions.

Quick start:

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npm run prisma:generate
npm run prisma:migrate

# Run development server
npm run dev
```

### Using Docker Compose

The easiest way to run the entire stack:

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3000

Access the API at `http://localhost:3000`

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Email**: Nodemailer
- **Logging**: Winston
- **Language**: TypeScript

## 📚 API Documentation

The backend provides a RESTful API. See [backend/README.md](backend/README.md) for complete API documentation.

### Base URL
```
http://localhost:3000/api
```

### Main Endpoints
- `/api/auth` - Authentication (register, login)
- `/api/groups` - Group management
- `/api/contributions` - Contribution tracking
- `/api/purchases` - Purchase workflow
- `/api/notifications` - Notifications

### Health Check
```
GET /health
```

## 🔐 Security

- JWT token-based authentication
- Password hashing with bcrypt (10+ rounds)
- Input validation with Zod
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- SQL injection prevention via Prisma ORM

## 🎯 Workflow

1. **User Registration**: Create an account
2. **Create/Join Group**: Start a new savings group or join existing ones
3. **Set Goals**: Define target amount and item
4. **Contribute**: Members make contributions
5. **Track Progress**: Monitor milestones (25%, 50%, 75%, 100%)
6. **Automatic Purchase**: System initiates purchase when target is reached
7. **Completion**: Group admin marks purchase as completed

## 📊 Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User accounts and profiles
- **Group**: Savings groups with targets
- **GroupMember**: Membership and roles (ADMIN, MEMBER)
- **Contribution**: Individual contributions
- **Purchase**: Purchase records and status
- **Notification**: In-app notifications

Group statuses: `SAVING` → `TARGET_REACHED` → `PROCESSING_PURCHASE` → `COMPLETED`

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the image
docker build -t goalsaver-backend ./backend

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/goalsaver" \
  -e JWT_SECRET="your-secret-key" \
  goalsaver-backend
```

### Using Docker Compose

```bash
cd backend
docker-compose up -d
```

## 🧪 Development

### Running Tests

```bash
cd backend
npm run lint        # Run linting
npm run lint:fix    # Fix linting issues
npm run build       # Build TypeScript
```

### Database Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:prod

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/goalsaver
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRY=7d
PORT=3000
NODE_ENV=development
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@goalsaver.com
SMTP_PASS=password
FRONTEND_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Chidera Ojimba

## 🙏 Acknowledgments

- Built for communities that save together
- Inspired by the power of collective savings

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for savers everywhere**
