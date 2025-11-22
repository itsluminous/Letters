# Letters

[![CI/CD Pipeline](https://github.com/itsluminous/letters/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/itsluminous/letters/actions/workflows/ci.yml)
[![Security Scanning](https://github.com/itsluminous/letters/workflows/Security%20Scanning/badge.svg)](https://github.com/itsluminous/letters/actions/workflows/security.yml)
[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

A beautiful, responsive web application for exchanging letters between partners with an immersive papyrus scroll interface. Built with Next.js 14, React, TypeScript, and Supabase.

## Overview

This app provides an authentic letter-writing experience with a visually stunning papyrus-themed interface. Exchange letters with your partner, track read/unread status, and enjoy smooth page-turning animations as you browse through your correspondence. The app features robust security with row-level security policies ensuring that only you and your recipient can access your letters.

## Features

### 🔐 Authentication
- **Secure signup and login** with email and password
- **Password reset** functionality via email
- **Session management** with automatic login timestamp tracking
- **Protected routes** with authentication middleware

### 📜 Letter Management
- **Compose letters** in an editable papyrus scroll interface
- **Send letters** to contacts with automatic date/time stamping
- **View letters** with beautiful papyrus styling and typography
- **Navigate letters** using arrow buttons or horizontal swipe gestures
- **Mark as read** automatically when opening unread letters
- **Edit unseen letters** before the recipient reads them
- **Delete unseen letters** with confirmation dialog

### 👥 Contact Management
- **Add contacts** by user ID with custom display names
- **Validate contacts** to ensure user exists before adding
- **Manage contact list** for easy recipient selection

### 🔍 Advanced Filtering
- **Filter by contacts** with multi-select dropdown
- **Filter by date range** with "before" and "after" date pickers
- **Combine filters** to find specific correspondence
- **Clear filters** to view all letters

### 🎨 Papyrus Theme
- **Authentic papyrus styling** throughout the entire app
- **Custom UI components** (buttons, inputs, date pickers, dialogs)
- **Papyrus texture** backgrounds with aged paper appearance
- **Classical typography** with Cinzel, Lora, and Caveat fonts
- **Warm color palette** evoking historical documents

### ✨ Animations
- **Page-turning animations** when navigating between letters
- **3D letter stacking** effect with rotation and depth
- **Smooth transitions** powered by Framer Motion
- **Touch gestures** for mobile devices
- **Trackpad/mouse wheel** support for desktop

### 📱 Responsive Design
- **Mobile-optimized** layout with touch-friendly controls
- **Tablet support** with optimized layouts
- **Desktop experience** with full features
- **Adaptive UI** that works seamlessly across all screen sizes

### 🔒 Security
- **Row Level Security (RLS)** enforced at database level
- **Private letters** accessible only to author and recipient
- **Secure authentication** with Supabase Auth
- **Input validation** and sanitization

## Tech Stack

### Frontend
- **Next.js** 14.2.33 - React framework with App Router
- **React** 18.3.1 - UI library
- **TypeScript** 5.x - Type-safe JavaScript
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **Framer Motion** 12.23.24 - Animation library

### Backend & Database
- **Supabase** 2.84.0 - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Real-time capabilities

### Utilities
- **date-fns** 4.1.0 - Date manipulation
- **clsx** 2.1.1 - Conditional class names
- **tailwind-merge** 3.4.0 - Merge Tailwind classes

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** 4.0.13 - Unit testing
- **Testing Library** - Component testing

## Setup

### Quick Start

```bash
# Clone the repository
git clone https://github.com/itsluminous/Letters/
cd letters

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Complete Setup Guide

For detailed setup instructions including:
- Local development setup
- Supabase project configuration
- Database migrations
- GitHub CI/CD configuration
- Troubleshooting

**See [docs/SETUP.md](docs/SETUP.md)**

## Usage Guide

### Getting Started

1. **Sign Up**: Create a new account with your email and password
2. **Add a Contact**: Click "Add Contact" in the title bar and enter your partner's user ID
3. **Compose a Letter**: Click "Create New Letter" to write your first letter
4. **Send**: Select your contact as the recipient and click "Send"

### Reading Letters

- **Inbox View**: Your home page shows unread letters (oldest first) or read letters (newest first)
- **Letter Stack**: Letters are displayed in a 3D stacked layout
- **Navigation**: Use arrow buttons or swipe horizontally to browse letters
- **Mark as Read**: Letters are automatically marked as read when you open them

### Filtering Letters

Use the filter panel to find specific letters:

- **By Contact**: Select one or more contacts to filter
- **By Date**: Use "before" and "after" date pickers to set a date range
- **Clear Filters**: Click "Clear" to remove all filters

### Managing Sent Letters

1. Click your profile icon in the top right
2. Select "Sent" from the menu
3. View all letters you've sent with read status
4. **Edit/Delete**: If the recipient hasn't read the letter yet, you can edit or delete it

### Editing Unseen Letters

1. Open a sent letter that hasn't been read (no read timestamp)
2. Click the edit icon
3. Make your changes
4. Click "Save"

### Deleting Unseen Letters

1. Open a sent letter that hasn't been read
2. Click the delete icon
3. Confirm deletion in the dialog

## Available Scripts

### Development

```bash
npm run dev
```

Starts the development server on [http://localhost:3000](http://localhost:3000) with hot reload.

### Build

```bash
npm run build
```

Creates an optimized production build.

### Start Production Server

```bash
npm start
```

Starts the production server (requires `npm run build` first).

### Linting

```bash
npm run lint
```

Runs ESLint to check for code quality issues.

### Type Checking

```bash
npm run type-check
```

Runs TypeScript compiler to check for type errors without emitting files.

### Testing

```bash
npm run test
```

Runs all tests once using Vitest.

```bash
npm run test:watch
```

Runs tests in watch mode for development.

## Database Schema

### Tables

#### user_profiles
Extends Supabase auth.users with additional fields.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users(id) |
| last_login_at | TIMESTAMPTZ | Last login timestamp |
| created_at | TIMESTAMPTZ | Profile creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### letters
Stores all letters exchanged between users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| author_id | UUID | References auth.users(id) |
| recipient_id | UUID | References auth.users(id) |
| content | TEXT | Letter content |
| created_at | TIMESTAMPTZ | Letter creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| is_read | BOOLEAN | Read status |
| read_at | TIMESTAMPTZ | When recipient read the letter |

#### contacts
Stores user contact relationships.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users(id) |
| contact_user_id | UUID | References auth.users(id) |
| display_name | TEXT | Custom display name for contact |
| created_at | TIMESTAMPTZ | Contact creation timestamp |

### Row Level Security

All tables have RLS enabled with policies ensuring:

- Users can only read their own data
- Letters are accessible only to author and recipient
- Authors can edit/delete letters only before they're read
- Recipients can only update read status

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications with optimal performance.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itsluminous/Letters&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_APP_URL)

Every push to your main branch will trigger a production deployment. Pull requests will create preview deployments.

### Performance Optimizations

This app includes several production optimizations:

- **Database**: Optimized indexes for fast queries
- **Code Splitting**: Automatic route-based splitting
- **Font Optimization**: Subsetting and preloading
- **Image Optimization**: AVIF/WebP support
- **Minification**: SWC-based minification
- **Compression**: Brotli/Gzip compression
- **Security Headers**: Enhanced security headers
- **CDN**: Vercel Edge Network for global performance

See [PERFORMANCE.md](docs/PERFORMANCE.md) for complete details.

### Alternative Deployment Options

#### Self-Hosted

```bash
npm run build
npm start
```

Run on your own server with Node.js 20.x or higher.

#### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t letters .
docker run -p 3000:3000 letters
```

## Troubleshooting

### Common Issues

#### "Invalid API key" or "Project not found"

**Solution**: Check your `.env.local` file and ensure:
- `NEXT_PUBLIC_SUPABASE_URL` is correct
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- No extra spaces or quotes around the values
- The file is named exactly `.env.local` (not `.env.local.txt`)

#### Database connection errors

**Solution**: 
1. Verify your Supabase project is active
2. Check that all migration scripts have been run
3. Ensure RLS policies are enabled
4. Try running migrations again in the SQL Editor

#### "User not found" when adding contacts

**Solution**: 
- The user ID must correspond to an existing user in your Supabase project
- Have your partner sign up first, then get their user ID from the Supabase dashboard
- User IDs are UUIDs (e.g., `123e4567-e89b-12d3-a456-426614174000`)

#### Letters not appearing

**Solution**:
1. Check browser console for errors
2. Verify RLS policies are correctly set up
3. Ensure you're logged in as the correct user
4. Try refreshing the page
5. Check that letters exist in the database (Supabase Table Editor)

#### Styling issues or missing papyrus theme

**Solution**:
1. Clear your browser cache
2. Ensure Tailwind CSS is properly configured
3. Check that `public/papyrus-texture.svg` exists
4. Verify custom fonts are loading (check Network tab)

#### Build errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### Type errors

**Solution**:
```bash
# Run type check to see all errors
npm run type-check

# Common fixes:
# - Ensure all dependencies are installed
# - Check TypeScript version compatibility
# - Verify tsconfig.json is correct
```

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for error messages
2. Check the Supabase logs in your project dashboard
3. Review the [Next.js documentation](https://nextjs.org/docs)
4. Review the [Supabase documentation](https://supabase.com/docs)
5. Check that all environment variables are set correctly

### Performance Issues

If the app feels slow:

1. **Check network tab**: Slow database queries may indicate missing indexes
2. **Optimize images**: Ensure papyrus textures are compressed
3. **Check bundle size**: Run `npm run build` and review the output
4. **Database indexes**: Verify all indexes from migration scripts are created

## Project Structure

```
letters/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (main)/              # Main app routes
│   │   ├── compose/         # Letter composition
│   │   ├── contacts/        # Contact management
│   │   ├── sent/            # Sent letters view
│   │   └── page.tsx         # Home/inbox
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── layout/             # Layout components
│   ├── letters/            # Letter-related components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utilities and hooks
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── supabase/           # Supabase client setup
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── supabase/              # Database migrations
│   └── migrations/
├── styles/                # Additional styles
└── .env.local            # Environment variables (not in git)
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment.

### Automated Checks

Every push and pull request triggers:
- ✅ Code quality checks (ESLint, TypeScript, Prettier)
- ✅ Security audits (npm audit, CodeQL, secret scanning)
- ✅ Unit tests with coverage reporting
- ✅ Production build verification
- ✅ Bundle size analysis

### GitHub CI/CD Setup

To configure the CI/CD pipeline:
1. Add GitHub Secrets (required for builds)
2. Enable GitHub Actions
3. Set up branch protection

**See [docs/SETUP.md](docs/SETUP.md#github-cicd-setup) for complete instructions.**

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes following our coding standards
4. Commit using conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Open a Pull Request using the PR template

### Conventional Commits

Use conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test updates
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### Development Guidelines

- Follow the existing code style
- Run `npm run lint` before committing
- Run `npm run type-check` to ensure no TypeScript errors
- Write tests for new features
- Update documentation as needed
- Ensure all CI checks pass
- Use the PR template when creating pull requests

### Code Review Process

1. Create a PR with a clear description
2. Ensure all CI checks pass
3. Address reviewer feedback
4. Get at least one approval
5. Squash and merge when ready

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
