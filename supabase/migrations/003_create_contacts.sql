-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, contact_user_id),
  CONSTRAINT different_users CHECK (user_id != contact_user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_user ON contacts(contact_user_id);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own contacts
CREATE POLICY "Users can read their own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create their own contacts
CREATE POLICY "Users can create contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own contacts
CREATE POLICY "Users can update their own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own contacts
CREATE POLICY "Users can delete their own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);
