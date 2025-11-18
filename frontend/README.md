# Goalsaver Frontend

A production-ready Next.js 14 frontend application for the Goalsaver platform - a community save-up application where groups save together for specific goals.

## 🚀 Features

- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Authentication**: Complete login and registration flows with form validation
- **Dashboard**: Overview of user's savings goals and activities
- **Groups Management**: Create, browse, join, and manage savings groups
- **Real-time Progress**: Visual progress tracking with color-coded indicators
- **Contributions**: Easy contribution flow with validation
- **Notifications**: In-app notification system
- **Profile Management**: User profile and settings management
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Production Ready**: Docker configuration for easy deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Docker (optional, for containerized deployment)

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Context API + hooks
- **API Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Charts**: Recharts

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Goalsaver
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
npm run docker:build
```

Or manually:
```bash
docker build -t goalsaver-frontend .
```

### Run Docker Container

```bash
npm run docker:run
```

Or manually:
```bash
docker run -p 3001:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url \
  goalsaver-frontend
```

### Docker Compose (Example)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3000/api
      - NEXT_PUBLIC_APP_NAME=Goalsaver
      - NEXT_PUBLIC_APP_URL=https://goalsaver.com
    restart: unless-stopped
```

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── groups/
│   │   ├── profile/
│   │   └── notifications/
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   ├── groups/                   # Group-related components
│   ├── layout/                   # Layout components (Navbar, Footer)
│   ├── notifications/            # Notification components
│   ├── shared/                   # Shared components (ProtectedRoute)
│   └── ui/                       # Reusable UI components
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx
│   ├── GroupContext.tsx
│   └── NotificationContext.tsx
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useGroups.ts
│   └── useNotifications.ts
├── lib/                          # Utility functions and configurations
│   ├── api.ts                    # API client setup
│   ├── constants.ts              # App constants
│   └── utils.ts                  # Utility functions
├── types/                        # TypeScript type definitions
│   └── index.ts
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables (gitignored)
├── Dockerfile                    # Docker configuration
├── .dockerignore                 # Docker ignore file
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## 🎨 Key Components

### Pages

- **Landing Page** (`/`): Marketing page with features and call-to-action
- **Login** (`/login`): User authentication
- **Register** (`/register`): New user registration
- **Dashboard** (`/dashboard`): User overview with stats and activities
- **Groups** (`/groups`): Browse and search all groups
- **Create Group** (`/groups/create`): Form to create new savings group
- **Group Detail** (`/groups/[id]`): Individual group page with progress and contributions
- **Profile** (`/profile`): User profile and settings
- **Notifications** (`/notifications`): User notifications

### UI Components

- **Button**: Reusable button with variants and loading states
- **Card**: Container component with header, body, and footer
- **Input**: Form input with label and error handling
- **Modal**: Accessible modal dialog
- **ProgressBar**: Visual progress indicator with color coding
- **Badge**: Status badges for groups
- **Alert**: Alert messages with variants
- **Spinner**: Loading indicator

## 🔐 Authentication Flow

1. User visits `/login` or `/register`
2. Submits credentials/registration form
3. API call is made via AuthContext
4. On success, token is stored in localStorage
5. User is redirected to `/dashboard`
6. All protected routes are wrapped with `ProtectedRoute` component
7. Auth token is automatically included in API requests via axios interceptor

## 🎯 API Integration

The application expects a backend API with the following endpoints:

### Auth Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Groups Endpoints
- `GET /api/groups`
- `GET /api/groups/:id`
- `POST /api/groups`
- `PUT /api/groups/:id`
- `DELETE /api/groups/:id`
- `POST /api/groups/:id/join`
- `POST /api/groups/:id/leave`

### Contributions Endpoints
- `GET /api/contributions`
- `GET /api/contributions/group/:groupId`
- `POST /api/contributions/group/:groupId`

### Notifications Endpoints
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`

### Dashboard Endpoints
- `GET /api/dashboard/stats`
- `GET /api/dashboard/activities`

## 🎨 Theming and Styling

The application uses Tailwind CSS with a custom color scheme:

- **Primary**: Blue (for CTAs and links)
- **Success**: Green (for completed targets)
- **Warning**: Yellow/Orange (for approaching deadlines)
- **Danger**: Red (for errors and destructive actions)

Progress bars use color-coded indicators:
- 0-25%: Red/Orange
- 25-50%: Yellow
- 50-75%: Light Green
- 75-100%: Green

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

### Component Structure
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use Context API for global state
- Props should be typed with TypeScript interfaces

### API Calls
- All API calls should go through the centralized API client
- Handle errors gracefully with user-friendly messages
- Show loading indicators during API calls
- Use toast notifications for user feedback

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t goalsaver-frontend .
```

2. Run the container:
```bash
docker run -p 3001:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com/api \
  goalsaver-frontend
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Goalsaver` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3001` |

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Ensure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`
- Check TypeScript errors: `npm run type-check`

**API Connection Issues**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check if backend API is running
- Look for CORS issues in browser console

**Authentication Issues**
- Clear localStorage: `localStorage.clear()`
- Check token expiration
- Verify API endpoints are correct

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.
