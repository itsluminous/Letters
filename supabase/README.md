# Supabase Database Setup

This directory contains database migration scripts for the Letters.

## Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Obtain your project credentials:
   - Project URL
   - Anon/Public Key
   - Service Role Key (for admin operations)

## Environment Setup

1. Copy `.env.local.example` to `.env.local` in the project root
2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each migration file in order:
   - `001_create_user_profiles.sql`
   - `002_create_letters.sql`
   - `003_create_contacts.sql`

### Option 2: Using Supabase CLI

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Push migrations:
```bash
supabase db push
```

## Database Schema

### Tables

#### user_profiles
Extends Supabase auth.users with additional profile information.
- `id` (UUID, PK): References auth.users(id)
- `last_login_at` (TIMESTAMPTZ): Last login timestamp
- `created_at` (TIMESTAMPTZ): Profile creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

#### letters
Stores letters exchanged between users.
- `id` (UUID, PK): Unique letter identifier
- `author_id` (UUID, FK): References auth.users(id)
- `recipient_id` (UUID, FK): References auth.users(id)
- `content` (TEXT): Letter content
- `created_at` (TIMESTAMPTZ): Letter creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp
- `is_read` (BOOLEAN): Read status
- `read_at` (TIMESTAMPTZ): When recipient read the letter

#### contacts
Stores user contact relationships.
- `id` (UUID, PK): Unique contact identifier
- `user_id` (UUID, FK): References auth.users(id)
- `contact_user_id` (UUID, FK): References auth.users(id)
- `display_name` (TEXT): Display name for the contact
- `created_at` (TIMESTAMPTZ): Contact creation timestamp

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### user_profiles
- Users can read, update, and insert their own profile

### letters
- Users can read letters they authored or received
- Users can create letters as author
- Recipients can mark letters as read
- Authors can edit unread letters
- Authors can delete unread letters

### contacts
- Users can read, create, update, and delete their own contacts

## Indexes

Performance indexes are created on:
- `letters`: recipient_id, author_id, read_status with created_at
- `contacts`: user_id, contact_user_id
- `user_profiles`: last_login_at

## Verification

After running migrations, verify the setup:

1. Check tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

2. Verify RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

3. Check policies:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```
