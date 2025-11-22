# Letters - Complete Setup Guide

This comprehensive guide covers everything you need to set up the Letters app locally and configure CI/CD for GitHub.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [GitHub CI/CD Setup](#github-cicd-setup)
3. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- Node.js 20+ and npm
- A Supabase account (free tier works fine)
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd letters
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `letters` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to you
4. Wait for the project to be created (takes ~2 minutes)

### Step 3: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### Step 4: Configure Environment Variables

1. In the project root, copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 5: Run Database Migrations

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/001_create_user_profiles.sql`
4. Click "Run" to execute the migration
5. Repeat steps 2-4 for:
   - `supabase/migrations/002_create_letters.sql`
   - `supabase/migrations/003_create_contacts.sql`

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ref from dashboard URL)
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 6: Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see three tables:
   - `user_profiles`
   - `letters`
   - `contacts`
3. Go to **Authentication** → **Policies** to verify RLS policies are active

### Step 7: Install Dependencies

```bash
npm install
```

### Step 8: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 9: Create Your First User

1. Navigate to the signup page
2. Create an account with your email and password
3. You'll be automatically logged in and redirected to the home page

---

## GitHub CI/CD Setup

The project uses GitHub Actions for automated testing, building, and deployment. Follow these steps to configure CI/CD.

### Prerequisites

- GitHub repository created
- Supabase project set up (from Local Development Setup above)

### Step 1: Configure GitHub Secrets (REQUIRED)

**⚠️ The CI/CD pipeline will fail without these secrets!**

The CI/CD workflows need your Supabase credentials to build the application.

#### Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Click **Settings** → **API**
4. Copy these two values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (very long JWT token starting with `eyJ...`)

#### Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the first secret:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - Click **"Add secret"**
5. Add the second secret:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key (the very long JWT token)
   - Click **"Add secret"**

#### Verify Secrets

After adding both secrets, you should see them listed:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

**Note**: You won't be able to view the secret values after adding them (for security).

### Step 2: Update GitHub Username

Replace `itsluminous` with your actual GitHub username in these files:

1. **README.md** (2 places):
   - CI/CD Pipeline badge URL
   - Security Scanning badge URL

2. **.github/dependabot.yml** (2 places):
   - reviewers
   - assignees

3. **.github/ISSUE_TEMPLATE/config.yml** (3 places):
   - Documentation link
   - Deployment guide link
   - Security advisory link

**Quick command** (macOS/Linux):
```bash
# Replace 'itsluminous' with your username
sed -i '' 's/itsluminous/YOUR_GITHUB_USERNAME/g' README.md
sed -i '' 's/your-github-username/YOUR_GITHUB_USERNAME/g' .github/dependabot.yml
sed -i '' 's/itsluminous/YOUR_GITHUB_USERNAME/g' .github/ISSUE_TEMPLATE/config.yml
```

### Step 3: Enable GitHub Actions

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Actions permissions":
   - Select **"Allow all actions and reusable workflows"**
3. Under "Workflow permissions":
   - Select **"Read and write permissions"**
   - Check **"Allow GitHub Actions to create and approve pull requests"**
4. Click **Save**

### Step 4: Set Up Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Click **"Add branch protection rule"**
3. Branch name pattern: `main`
4. Enable these settings:
   - ✅ **Require a pull request before merging**
     - Required approvals: 1
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - Select these required checks:
       - Code Quality
       - Security Audit
       - Tests
       - Build Application
5. Click **Create**

### Step 5: Test the CI/CD Pipeline

1. Create a test branch:
   ```bash
   git checkout -b test/verify-ci-pipeline
   ```

2. Make a small change:
   ```bash
   echo "# CI/CD Test" >> test.md
   git add test.md
   git commit -m "test: verify CI/CD pipeline"
   ```

3. Push to GitHub:
   ```bash
   git push origin test/verify-ci-pipeline
   ```

4. Create a Pull Request on GitHub

5. Check the **Actions** tab:
   - Verify all workflows run
   - Check that all jobs pass (green checkmarks)
   - If any fail, check the logs

6. Expected workflows to run:
   - ✅ CI/CD Pipeline
   - ✅ Pull Request Checks

### Step 6: Configure Dependabot (Optional)

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**
3. Dependabot version updates are already configured in `.github/dependabot.yml`

---

## CI/CD Workflows

### Automated Checks

Every push and pull request triggers:
- ✅ Code quality checks (ESLint, TypeScript, Prettier)
- ✅ Security audits (npm audit, CodeQL, secret scanning)
- ✅ Unit tests with coverage reporting
- ✅ Production build verification
- ✅ Bundle size analysis

### Workflows

1. **CI/CD Pipeline** (`ci.yml`)
   - Runs on every push and PR
   - Code quality, security, tests, build
   - Deployment readiness checks

2. **Pull Request Checks** (`pr-checks.yml`)
   - PR title validation (conventional commits)
   - Breaking changes detection
   - Review checklist generation
   - File size checks

3. **Security Scanning** (`security.yml`)
   - Weekly security audits
   - Dependency vulnerability scanning
   - CodeQL static analysis
   - Secret scanning

4. **Dependabot** (`dependabot.yml`)
   - Automated dependency updates
   - Weekly npm and GitHub Actions updates

### Conventional Commits

Use conventional commit format for all commits:

```
<type>: <subject>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test updates
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples**:
```bash
feat: add letter filtering by date range
fix: resolve navigation bug on mobile
docs: update setup guide
test: add navigation tests
```

---

## Troubleshooting

### Local Development Issues

#### "Invalid API key" error
- Double-check your `.env.local` file has the correct credentials
- Make sure you copied the full keys without any extra spaces
- Restart the dev server after changing environment variables

#### Database connection errors
- Verify your Supabase project is active (not paused)
- Check that all migrations ran successfully
- Ensure RLS policies are enabled on all tables

#### Authentication issues
- Clear your browser cookies and try again
- Check the Supabase dashboard → Authentication → Users to see if users are being created
- Verify the `user_profiles` table has the correct RLS policies

#### Build fails locally
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### CI/CD Issues

#### Build fails with "Invalid API key"

**Cause**: GitHub Secrets not configured or incorrect

**Solution**:
1. Verify secrets are added: Settings → Secrets and variables → Actions
2. Check secret names match exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Verify values are complete (anon key is very long)
4. Re-run the workflow after fixing

#### Workflows don't run

**Cause**: GitHub Actions not enabled

**Solution**:
1. Go to Settings → Actions → General
2. Enable "Allow all actions and reusable workflows"
3. Enable "Read and write permissions"

#### Can't merge PR even though checks pass

**Cause**: Branch protection not configured correctly

**Solution**:
1. Go to Settings → Branches
2. Edit the branch protection rule for `main`
3. Verify required status checks are selected
4. Save changes

#### Tests fail in CI but pass locally

**Solution**:
1. Check Node.js version matches (20.x)
2. Ensure environment variables are set in GitHub Secrets
3. Review CI logs for specific errors
4. Run `npm run test` locally to reproduce

#### Security audit fails

**Solution**:
1. Run `npm audit` locally
2. Review vulnerability details
3. Update vulnerable packages: `npm audit fix`
4. For unfixable vulnerabilities, assess risk and document

### GitHub CLI Method (Alternative)

If you have the GitHub CLI installed, you can add secrets via command line:

```bash
# Set secrets
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://your-project.supabase.co"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "your-anon-key-here"

# Verify secrets are set
gh secret list
```

---

## Quick Reference

### Local Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Required Environment Variables

**Local Development** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**GitHub Secrets** (for CI/CD):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Where to Get Supabase Credentials

```
Supabase Dashboard → Settings → API
- Project URL
- anon public key
```

### Where to Add GitHub Secrets

```
GitHub Repository → Settings → Secrets and variables → Actions → New repository secret
```

---

## Next Steps

Once setup is complete:

### For Local Development
1. Add a contact by clicking "Add Contact" in the title bar
2. Compose a letter by clicking "Create New Letter"
3. View sent letters from the profile menu
4. Filter letters by contact and date range

### For CI/CD
1. Create feature branches for new work
2. Use conventional commits
3. Create pull requests
4. Wait for CI checks to pass
5. Get code review
6. Merge to main

---

## Additional Resources

- **Performance Guide**: [docs/PERFORMANCE.md](PERFORMANCE.md)
- **Error Handling**: [docs/ERROR_HANDLING.md](ERROR_HANDLING.md)
- **Deployment Guide**: [DEPLOYMENT.md](../DEPLOYMENT.md)
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Supabase Docs**: https://supabase.com/docs

---

## Support

If you encounter issues:

1. Check this setup guide thoroughly
2. Review error messages carefully
3. Check GitHub Actions logs for CI/CD issues
4. Check Supabase logs for database issues
5. Review browser console for frontend issues

---

**Last Updated**: November 22, 2025
**Maintained By**: Development Team
