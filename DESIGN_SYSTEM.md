# Goalsaver Design System

## Overview
This document provides comprehensive design specifications for Goalsaver's UI/UX, enabling designers to understand the current implementation and propose improvements.

---

## Color Palette

### Primary Colors
```css
Blue:    #3B82F6  /* Primary actions, links */
Purple:  #8B5CF6  /* Accents, badges */
Pink:    #EC4899  /* Highlights, gradients */
```

### Secondary Colors
```css
Green:   #10B981  /* Success, positive values */
Orange:  #F59E0B  /* Warnings, pending states */
Red:     #EF4444  /* Errors, danger actions */
Yellow:  #FBBF24  /* Trophy, achievements */
```

### Neutral Colors (Dark Theme)
```css
Gray-50:  #F9FAFB  /* Lightest */
Gray-100: #F3F4F6
Gray-200: #E5E7EB
Gray-300: #D1D5DB
Gray-400: #9CA3AF  /* Text secondary */
Gray-500: #6B7280
Gray-600: #4B5563
Gray-700: #374151  /* Borders */
Gray-800: #1F2937  /* Cards, surfaces */
Gray-900: #111827  /* Backgrounds, darkest */
```

### Gradient Combinations
```css
Primary Gradient:    linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)
Background Gradient: linear-gradient(135deg, #1F2937 0%, #111827 100%)
Success Gradient:    linear-gradient(135deg, #10B981 0%, #059669 100%)
Warning Gradient:    linear-gradient(135deg, #F59E0B 0%, #D97706 100%)
```

---

## Typography

### Font Families
```css
Primary: Arial, Helvetica, sans-serif
Fallback: system-ui, -apple-system, sans-serif
```

### Font Sizes
```css
xs:   0.75rem   /* 12px - Labels, captions */
sm:   0.875rem  /* 14px - Body small, secondary text */
base: 1rem      /* 16px - Body text */
lg:   1.125rem  /* 18px - Subheadings */
xl:   1.25rem   /* 20px - Card titles */
2xl:  1.5rem    /* 24px - Section headers */
3xl:  1.875rem  /* 30px - Page headers */
4xl:  2.25rem   /* 36px - Hero text */
5xl:  3rem      /* 48px - Large displays */
6xl:  3.75rem   /* 60px - Dashboard stats */
7xl:  4.5rem    /* 72px - Progress percentages */
```

### Font Weights
```css
normal:    400
medium:    500
semibold:  600
bold:      700
extrabold: 800
```

### Line Heights
```css
tight:   1.25
normal:  1.5
relaxed: 1.75
loose:   2
```

---

## Spacing System

### Scale (Tailwind-based)
```css
0:   0px
1:   0.25rem   /* 4px */
2:   0.5rem    /* 8px */
3:   0.75rem   /* 12px */
4:   1rem      /* 16px */
5:   1.25rem   /* 20px */
6:   1.5rem    /* 24px */
8:   2rem      /* 32px */
10:  2.5rem    /* 40px */
12:  3rem      /* 48px */
16:  4rem      /* 64px */
20:  5rem      /* 80px */
24:  6rem      /* 96px */
```

### Common Patterns
- **Button padding**: `py-2 px-4` (8px 16px)
- **Card padding**: `p-6` or `p-8` (24px or 32px)
- **Section spacing**: `space-y-8` (32px vertical gap)
- **Grid gaps**: `gap-4` or `gap-6` (16px or 24px)

---

## Components Library

### 1. Buttons

#### Primary Button
```tsx
<Button variant="primary">
  <Icon className="w-5 h-5 mr-2" />
  Button Text
</Button>
```
**Styles:**
- Background: Gradient (Blue → Purple)
- Text: White
- Padding: 8px 16px (small), 12px 24px (large)
- Border radius: 8px
- Hover: Brightness increase + scale(1.02)
- Active: Scale(0.98)

#### Secondary Button
**Styles:**
- Background: Transparent
- Border: 2px solid Gray-700
- Text: Gray-300
- Hover: Background Gray-800

#### Danger Button
**Styles:**
- Background: Red-600
- Text: White
- Hover: Red-700

### 2. Input Fields

#### Text Input
```tsx
<Input
  type="text"
  placeholder="Enter text"
  label="Field Label"
/>
```
**Styles:**
- Background: Gray-800
- Border: 1px solid Gray-700
- Text: White
- Placeholder: Gray-500
- Focus: Blue border + glow
- Height: 40px (small), 48px (default)

### 3. Cards

#### Standard Card
```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>...</CardContent>
</Card>
```
**Styles:**
- Background: Gradient (Gray-800 → Gray-900)
- Border: 1px solid Gray-700
- Border radius: 12px
- Padding: 24px or 32px
- Shadow: 0 10px 15px rgba(0,0,0,0.3)

#### Group Card
**Specific features:**
- Image/Icon at top
- Title (2xl, bold)
- Progress bar with gradient
- Member count badge
- Hover: Transform scale(1.02) + glow effect

### 4. Progress Indicators

#### Circular Progress (Trophy Display)
**Layout:**
```
┌─────────────────────────┐
│     [Trophy Icon]       │
│         72%            │
│       Complete         │
└─────────────────────────┘
```
**Styles:**
- Trophy: Yellow-400 with glow
- Percentage: Gradient text (Blue → Purple → Pink)
- Size: 64px (mobile), 80px (desktop)
- Background: Yellow/Orange gradient circle

#### Linear Progress Bar
**Styles:**
- Height: 8px or 12px
- Background: Gray-700
- Fill: Gradient (Blue → Purple → Pink)
- Border radius: Full
- Animation: 1s ease-out transition

### 5. Badges

#### Status Badge
```tsx
<Badge variant="success">Active</Badge>
```
**Variants:**
- Success: Green-100 bg, Green-800 text
- Warning: Orange-100 bg, Orange-800 text
- Error: Red-100 bg, Red-800 text
- Info: Blue-100 bg, Blue-800 text
- Admin: Purple-100 bg, Purple-800 text

### 6. Modals

#### Modal Structure
```tsx
<Modal isOpen={true} onClose={handleClose}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button>Action</Button>
  </ModalFooter>
</Modal>
```
**Styles:**
- Backdrop: Black with 60% opacity + blur
- Container: Gray-800 background
- Border: Gray-700
- Max width: 500px (small), 768px (medium), 1024px (large)
- Border radius: 16px
- Animation: Fade + scale in

### 7. Navigation

#### Navbar
**Desktop Layout:**
```
┌─────────────────────────────────────────┐
│ [Logo] Dashboard Groups Notifications │ [User] │
└─────────────────────────────────────────┘
```
**Mobile Layout:**
```
┌─────────────────────┐
│ [Logo]    [Menu ☰] │
└─────────────────────┘
```
**Styles:**
- Background: Gray-900
- Border bottom: 1px Gray-800
- Height: 64px
- Sticky positioning

### 8. Forms

#### Registration Form Layout
```
┌────────────────────────┐
│   Welcome to Goalsaver  │
│                        │
│   [First Name]         │
│   [Last Name]          │
│   [Email]              │
│   [Phone]              │
│   [Password]           │
│                        │
│   [Register Button]    │
│                        │
│   Already have account?│
└────────────────────────┘
```

#### OTP Verification
```
┌────────────────────────┐
│   Verify Your Email    │
│                        │
│   Enter 6-digit code   │
│   sent to your email   │
│                        │
│   [_] [_] [_] [_] [_] [_] │
│                        │
│   [Verify Button]      │
│   [Resend Code]        │
└────────────────────────┘
```

---

## Page Layouts

### 1. Dashboard Page
```
┌─────────────────────────────────────────────────┐
│ Navbar                                          │
├─────────────────────────────────────────────────┤
│ Welcome back, [Name]! 👋                        │
├─────────────────────────────────────────────────┤
│ [Total Groups] [Total Contributed] [Active] [Completed] │
├─────────────────────────────────────────────────┤
│ Activity Feed          │ Quick Actions         │
│ ┌─────────────────┐    │ ┌──────────────┐     │
│ │ Recent Activity │    │ │ Create Group │     │
│ │                 │    │ │ Join Group   │     │
│ └─────────────────┘    │ └──────────────┘     │
└─────────────────────────────────────────────────┘
```

### 2. Groups List Page
```
┌─────────────────────────────────────────────────┐
│ My Savings Groups                [Create Group] │
├─────────────────────────────────────────────────┤
│ [All] [Active] [Completed]                      │
├─────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│ │ Group Card │ │ Group Card │ │ Group Card │  │
│ │ [Image]    │ │ [Image]    │ │ [Image]    │  │
│ │ Title      │ │ Title      │ │ Title      │  │
│ │ Progress   │ │ Progress   │ │ Progress   │  │
│ │ 45%        │ │ 78%        │ │ 100%       │  │
│ └────────────┘ └────────────┘ └────────────┘  │
└─────────────────────────────────────────────────┘
```

### 3. Group Detail Page
```
┌─────────────────────────────────────────────────┐
│ ← Back to Groups                                │
├─────────────────────────────────────────────────┤
│ Refrigerator, Generator, etc        [Active]    │
│ Description text here...                        │
│ 👥 3 members  📅 45 days  💰 Created Nov 25    │
│                                  [Add Contribution] │
├─────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐   │
│ │  🏆          Target Item                  │   │
│ │  72%        Refrigerator, Generator       │   │
│ │ Complete    ₦0.00 / ₦5,000,000.00        │   │
│ │             [Progress Bar ████░░░]        │   │
│ └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ Contribution History  │  Members (3)            │
│ ┌──────────────────┐ │  ┌────────────────┐    │
│ │ Recent           │ │  │ CO  Chidera    │    │
│ │ contributions    │ │  │     Admin      │    │
│ └──────────────────┘ │  └────────────────┘    │
└─────────────────────────────────────────────────┘
```

### 4. Mobile Responsive Breakpoints
```css
/* Mobile First */
< 640px:  Single column, stacked layout
640-768px: Small tablets, 2-column grids
768-1024px: Tablets, 3-column grids  
> 1024px: Desktop, full multi-column layouts
```

---

## Animations

### Transitions
```css
Default: transition-all duration-300 ease-in-out
Fast: duration-150
Slow: duration-500
Smooth: cubic-bezier(0.4, 0, 0.2, 1)
```

### Keyframe Animations

#### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
```

#### Bounce (Trophy)
```css
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
/* Duration: 3s, easing: ease-in-out, infinite */
```

#### Slide In (Modals)
```css
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Hover Effects
- **Cards**: `hover:scale-105 transition-transform`
- **Buttons**: `hover:brightness-110 hover:scale-102`
- **Links**: `hover:text-blue-400 transition-colors`

---

## Icons

### Library
**Lucide React** - Clean, consistent icon set

### Common Icons Used
```tsx
import {
  Users,        // Groups, members
  Banknote,     // Money, contributions
  Trophy,       // Achievement, progress
  Bell,         // Notifications
  Calendar,     // Dates, deadlines
  Target,       // Goals
  Plus,         // Add actions
  Trash,        // Delete
  Shield,       // Admin
  ArrowLeft,    // Navigation
  X,            // Close
  Check,        // Success
  AlertCircle,  // Warnings
  LogOut,       // Sign out
} from 'lucide-react';
```

### Icon Sizes
```tsx
w-4 h-4:   16px (small, inline)
w-5 h-5:   20px (buttons, badges)
w-6 h-6:   24px (navigation)
w-8 h-8:   32px (cards)
w-12 h-12: 48px (large displays)
w-20 h-20: 80px (hero sections)
```

---

## States & Feedback

### Loading States
- **Button**: Spinner icon + disabled state
- **Page**: Centered spinner with "Loading..." text
- **Skeleton**: Animated pulse on card placeholders

### Empty States
```
┌────────────────┐
│   [Icon]       │
│   No data yet  │
│   [CTA Button] │
└────────────────┘
```

### Error States
- **Inline**: Red text below input field
- **Toast**: Slide-in notification (top-right)
- **Modal**: Warning icon + error message

### Success States
- **Toast**: Green notification with checkmark
- **Inline**: Green text/border
- **Confetti**: Animation for milestone achievements

---

## Accessibility

### Color Contrast
- Text on dark background: Minimum 4.5:1 ratio
- Interactive elements: Clear focus states
- Error messages: Not solely color-dependent

### Keyboard Navigation
- Tab order: Logical flow
- Focus indicators: Blue glow (2px)
- Escape key: Closes modals
- Enter key: Submits forms

### Screen Readers
- Proper semantic HTML
- ARIA labels on icons
- Alt text on images
- Role attributes on custom components

---

## Responsive Design Strategy

### Mobile First Approach
1. Design for 320px minimum width
2. Add complexity at larger breakpoints
3. Touch targets minimum 44x44px
4. Readable text without zooming

### Breakpoint Usage
```tsx
/* Stack on mobile, grid on desktop */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Images
- Responsive: Use Next.js Image component
- Lazy loading: Enabled by default
- Formats: WebP with PNG/JPG fallback

---

## Design Patterns

### 1. Card-Based Layout
Everything in cards with consistent padding and shadows

### 2. Gradient Accents
Use gradients for:
- Primary buttons
- Progress indicators
- Hero sections
- Hover states (subtle)

### 3. Dark Theme Only
- No light mode toggle
- Optimized for night usage
- Reduced eye strain
- Modern aesthetic

### 4. Minimal Text
- Icons + short labels
- Clear hierarchy
- Scannable content
- Call-to-action focused

---

## Brand Identity

### Personality
- **Professional**: Trust-building for financial app
- **Modern**: Clean, up-to-date design
- **Collaborative**: Emphasis on group features
- **Motivating**: Trophy, progress, achievements

### Voice & Tone
- Encouraging ("Great job!", "You're 75% there!")
- Clear ("Enter 6-digit code")
- Friendly ("Welcome back!")
- Supportive ("Let's start saving together!")

---

## Design Recommendations for Improvement

### UI Enhancements
1. **Add illustrations** for empty states
2. **Micro-interactions** on button clicks
3. **Confetti animation** when goals completed
4. **Avatar uploads** instead of initials
5. **Progress streaks** gamification
6. **Dark/Light mode toggle** (optional)

### UX Improvements
1. **Onboarding flow** improvement (more interactive)
2. **Search/filter** for groups list
3. **Notifications panel** redesign
4. **Mobile app** companion
5. **Shareable progress cards** for social media
6. **Email templates** redesign with brand colors

### New Features to Design
1. **Group chat** within savings groups
2. **Milestones timeline** visualization
3. **Leaderboard** for top savers
4. **Savings calculator** tool
5. **Recurring contributions** scheduler
6. **Savings challenges** feature

---

## Figma Suggestions for Designers

### Screens to Design
1. **Auth Flow**: Login → Register → OTP → Welcome
2. **Dashboard**: Overview with stats and activities
3. **Groups**: List view → Detail view → Create flow
4. **Contributions**: Form → History → Success state
5. **Profile**: Settings → Edit → Notifications preferences
6. **Notifications**: List → Detail view

### Components to Create
- Button variants (primary, secondary, danger)
- Input fields (text, email, password, number)
- Cards (standard, group, member, contribution)
- Modals (small, medium, large)
- Navigation (desktop, mobile)
- Progress indicators (circular, linear)
- Badges and tags
- Empty states
- Error states

### Prototyping Flows
1. New user registration → OTP → Tutorial → Dashboard
2. Create group → Invite members → Make contribution
3. Join group → View progress → Make contribution
4. Complete goal → Celebration animation

---

## Resources for Designers

### Inspiration Sources
- **Dribbble**: Search "fintech dark mode"
- **Behance**: Search "savings app UI"
- **Mobbin**: Financial app patterns
- **UI8**: Dark dashboard templates

### Tools Recommended
- **Figma**: Primary design tool
- **Stark**: Accessibility checker
- **Contrast**: Color contrast checker
- **IconJar**: Icon management

---

**Version**: 1.0  
**Last Updated**: November 26, 2025  
**Maintained By**: Goalsaver Design Team
