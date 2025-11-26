# Contributing to Goalsaver

Thank you for your interest in contributing to Goalsaver! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Workflow](#workflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)

---

## Getting Started

### Prerequisites
- Node.js 20+ 
- Docker Desktop
- Git
- VS Code (recommended)
- PostgreSQL client (optional)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Prisma
- GitLens
- Thunder Client (API testing)

---

## Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Derakings/Goalsaver.git
cd Goalsaver
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your credentials:
# - DATABASE_URL
# - JWT_SECRET
# - SMTP credentials (Gmail recommended)

# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Backend should now be running at `http://localhost:3000`

### 3. Frontend Setup
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Update .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Frontend should now be running at `http://localhost:3001`

### 4. Verify Setup
- Visit `http://localhost:3001`
- Register a new account
- Check your email for OTP code
- Complete the onboarding

---

## Workflow

### Branch Strategy
We use **Git Flow** with the following branches:

- `main` - Production-ready code
- `staging` - Pre-production testing
- `development` - Active development
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Emergency production fixes

### Creating a Feature

1. **Pull latest changes**
```bash
git checkout development
git pull origin development
```

2. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
# Example: feature/add-group-chat
# Example: feature/payment-integration
```

3. **Make changes and commit frequently**
```bash
git add .
git commit -m "feat: add feature description"
```

4. **Push branch**
```bash
git push origin feature/your-feature-name
```

5. **Create Pull Request**
- Go to GitHub repository
- Click "Pull Request"
- Select `development` as base branch
- Fill in PR template
- Request review from team lead

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting (no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build config)
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```bash
feat(auth): add OTP email verification
fix(groups): correct progress calculation
docs(readme): update installation instructions
style(dashboard): format with Prettier
refactor(api): extract validation middleware
test(contributions): add unit tests for service
chore(deps): upgrade Next.js to 16.0.3
```

---

## Coding Standards

### TypeScript
- ✅ Use TypeScript strict mode
- ✅ Define types for all props and functions
- ✅ Avoid `any` type - use `unknown` if necessary
- ✅ Export types from `types/index.ts`

**Good:**
```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // ...
}
```

**Bad:**
```typescript
function getUserProfile(userId: any): any {
  // ...
}
```

### React Components

**File naming:**
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatCurrency.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ROUTES.ts`)

**Component structure:**
```tsx
'use client'; // If client component

import React from 'react';
import { ComponentProps } from '@/types';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

### CSS/Tailwind
- ✅ Use Tailwind utility classes
- ✅ Follow mobile-first responsive design
- ✅ Use design tokens from `globals.css`
- ✅ Group related classes logically

**Example:**
```tsx
<button className="
  px-4 py-2 
  bg-blue-600 hover:bg-blue-700 
  text-white font-medium 
  rounded-lg 
  transition-colors
">
  Click Me
</button>
```

### Backend API

**Route structure:**
```typescript
// routes/group.routes.ts
router.post('/groups', auth, validate(createGroupSchema), createGroup);
```

**Controller pattern:**
```typescript
// controllers/group.controller.ts
export class GroupController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await groupService.create(req.body);
      return res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
```

**Service pattern:**
```typescript
// services/group.service.ts
export class GroupService {
  async create(input: CreateGroupInput) {
    const group = await prisma.group.create({ data: input });
    return group;
  }
}
```

### Error Handling

**Frontend:**
```typescript
try {
  const response = await api.createGroup(data);
  toast.success('Group created successfully!');
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
}
```

**Backend:**
```typescript
if (!user) {
  throw new Error('User not found');
}

if (!isAdmin) {
  return res.status(403).json({ 
    success: false, 
    message: 'Insufficient permissions' 
  });
}
```

---

## Testing

### Running Tests

**Backend:**
```bash
cd backend
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage
```

**Frontend:**
```bash
cd frontend
npm test
npm test -- --watch
```

### Writing Tests

**Unit Test Example:**
```typescript
// __tests__/utils/formatCurrency.test.ts
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats Nigerian Naira correctly', () => {
    expect(formatCurrency(1000000)).toBe('₦1,000,000.00');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('₦0.00');
  });
});
```

**Integration Test Example:**
```typescript
// __tests__/api/auth.test.ts
describe('POST /api/auth/register', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

---

## Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project conventions
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No console errors in browser
- [ ] Changes are documented if needed
- [ ] PR description explains what and why
- [ ] Screenshots included for UI changes
- [ ] Related issues are linked

### Pull Request Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Added group chat feature
- Updated API endpoints
- Added tests

## Screenshots (if applicable)
[Include before/after screenshots]

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Code Review Process

1. **Submit PR** to `development` branch
2. **Team lead reviews** within 24-48 hours
3. **Address feedback** and push changes
4. **Get approval** from at least 1 reviewer
5. **Squash and merge** into development
6. **Delete feature branch** after merge

### Deployment Flow

```
feature/x → development → staging → main
    ↓           ↓           ↓         ↓
  local      dev env    staging   production
```

---

## Common Tasks

### Adding a New API Endpoint

1. **Define types** in `types/index.ts`
```typescript
export interface CreateGroupInput {
  name: string;
  description: string;
  targetAmount: number;
  targetItem: string;
}
```

2. **Create validation schema** in `utils/validators.ts`
```typescript
export const createGroupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  targetAmount: z.number().positive(),
  targetItem: z.string().min(3),
});
```

3. **Add service method** in `services/group.service.ts`
```typescript
async create(input: CreateGroupInput, userId: string) {
  const group = await prisma.group.create({
    data: { ...input, createdBy: userId }
  });
  return group;
}
```

4. **Add controller** in `controllers/group.controller.ts`
```typescript
async create(req: Request, res: Response) {
  const group = await groupService.create(req.body, req.user.id);
  res.status(201).json({ success: true, data: group });
}
```

5. **Add route** in `routes/group.routes.ts`
```typescript
router.post('/', auth, validate(createGroupSchema), groupController.create);
```

6. **Update frontend API client** in `lib/api.ts`
```typescript
export const groupApi = {
  create: (data: CreateGroupInput) => 
    axios.post('/groups', data),
};
```

### Database Schema Changes

1. **Update Prisma schema** in `prisma/schema.prisma`
```prisma
model Group {
  id          String   @id @default(cuid())
  name        String
  description String
  // ... add new fields
}
```

2. **Create migration**
```bash
npx prisma migrate dev --name add_field_to_group
```

3. **Generate Prisma client**
```bash
npx prisma generate
```

---

## Getting Help

### Resources
- **Documentation**: `/docs` folder
- **API Docs**: `http://localhost:3000/api-docs` (if implemented)
- **GitHub Discussions**: Ask questions
- **Slack/Discord**: Team communication

### Who to Contact
- **General questions**: Ask in #development channel
- **Backend issues**: @backend-lead
- **Frontend issues**: @frontend-lead
- **DevOps/Deployment**: @devops-lead
- **Urgent blockers**: @project-lead

---

## License
This project is licensed under the MIT License - see LICENSE file.

---

**Thank you for contributing to Goalsaver!** 🎉

Your contributions help make financial goals achievable for everyone.
