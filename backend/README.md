# Goalsaver Backend API

A production-ready backend API for the Goalsaver platform - a community save-up application where groups save together for specific goals, and the app purchases items only when targets are met.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Group Management**: Create and manage savings groups with target goals
- **Contribution Tracking**: Record and track member contributions
- **Automated Purchase Workflow**: Automatic purchase initiation when targets are met
- **Real-time Notifications**: In-app and email notifications for key events
- **Milestone Tracking**: Automatic detection of 25%, 50%, 75%, and 100% milestones
- **Security**: Rate limiting, CORS, Helmet, and input validation

## 🛠️ Technology Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Email**: Nodemailer
- **Logging**: Winston
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm >= 9.0.0

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goalsaver/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens (use a strong random string)
   - `SMTP_*`: Email server configuration (optional for development)

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on `http://localhost:3000` with hot reload enabled.

### Production Mode
```bash
# Build the application
npm run build

# Start the server
npm start
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

The easiest way to run the entire stack with PostgreSQL:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3000

### Using Docker Directly

Build and run using Docker:

```bash
# Build the image
docker build -t goalsaver-backend .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/goalsaver" \
  -e JWT_SECRET="your-secret-key" \
  goalsaver-backend
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

### Group Routes (`/api/groups`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new group | Yes |
| GET | `/` | List all groups | Yes |
| GET | `/:id` | Get group details | Yes |
| PUT | `/:id` | Update group (admin only) | Yes |
| DELETE | `/:id` | Delete group (admin only) | Yes |
| POST | `/:id/join` | Join a group | Yes |
| POST | `/:id/leave` | Leave a group | Yes |
| GET | `/:id/members` | List group members | Yes |

### Contribution Routes (`/api/contributions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Add contribution | Yes |
| GET | `/group/:groupId` | Get group contributions | Yes |
| GET | `/user/:userId` | Get user contributions | Yes |
| GET | `/:id` | Get contribution details | Yes |

### Purchase Routes (`/api/purchases`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/initiate/:groupId` | Initiate purchase | Yes |
| GET | `/:groupId` | Get purchase status | Yes |
| PUT | `/:id/complete` | Mark purchase completed | Yes |
| GET | `/` | Get all purchases | Yes |

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user notifications | Yes |
| PUT | `/:id/read` | Mark notification as read | Yes |
| PUT | `/read-all` | Mark all as read | Yes |

## 🔐 Authentication

Include JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📝 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Create Group
```bash
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Saving for the latest iPhone",
  "targetAmount": 1200,
  "targetItem": "iPhone 15 Pro 256GB",
  "deadline": "2024-12-31T23:59:59Z",
  "isPublic": true
}
```

### Add Contribution
```bash
POST /api/contributions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100,
  "groupId": "uuid-of-group",
  "note": "Monthly contribution"
}
```

## 🗃️ Database Schema

The application uses the following main models:
- **User**: User accounts and authentication
- **Group**: Savings groups with target goals
- **GroupMember**: Group membership and roles
- **Contribution**: Individual contributions to groups
- **Purchase**: Purchase records and status
- **Notification**: In-app notifications

See `prisma/schema.prisma` for the complete schema.

## 🔄 Workflow

1. **User Registration**: Users create accounts
2. **Group Creation**: Admin creates a savings group with a target
3. **Member Joins**: Users join the group
4. **Contributions**: Members make contributions
5. **Milestone Tracking**: System tracks and notifies at 25%, 50%, 75%
6. **Target Reached**: When 100% reached, status changes to TARGET_REACHED
7. **Purchase Initiated**: System creates purchase record
8. **Purchase Completed**: Admin marks purchase as completed

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 10 rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schema validation
- **Rate Limiting**: Prevents abuse
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **SQL Injection Prevention**: Prisma ORM

## 📊 Logging

Application uses Winston for logging:
- **Development**: Console logs with debug level
- **Production**: File logs (error.log, combined.log) with info level

## 🧪 Testing

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   └── server.ts        # Express app setup
├── prisma/
│   └── schema.prisma    # Database schema
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Check firewall settings

### JWT Token Errors
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Bearer token format

### Email Not Sending
- In development, emails are logged instead of sent
- Configure SMTP settings for production
- Check SMTP credentials

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for the Goalsaver community**
