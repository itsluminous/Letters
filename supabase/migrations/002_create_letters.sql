-- Create letters table
CREATE TABLE IF NOT EXISTS letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  CONSTRAINT different_users CHECK (author_id != recipient_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_letters_recipient ON letters(recipient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_letters_author ON letters(author_id, created_at);
CREATE INDEX IF NOT EXISTS idx_letters_read_status ON letters(recipient_id, is_read, created_at);

-- Enable Row Level Security
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read letters they authored or received
CREATE POLICY "Users can read their own letters"
  ON letters FOR SELECT
  USING (auth.uid() = author_id OR auth.uid() = recipient_id);

-- RLS Policy: Users can create letters as author
CREATE POLICY "Users can create letters"
  ON letters FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- RLS Policy: Recipients can mark letters as read
CREATE POLICY "Recipients can mark letters as read"
  ON letters FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- RLS Policy: Authors can edit unread letters
CREATE POLICY "Authors can edit unread letters"
  ON letters FOR UPDATE
  USING (auth.uid() = author_id AND is_read = FALSE)
  WITH CHECK (auth.uid() = author_id AND is_read = FALSE);

-- RLS Policy: Authors can delete unread letters
CREATE POLICY "Authors can delete unread letters"
  ON letters FOR DELETE
  USING (auth.uid() = author_id AND is_read = FALSE);

-- Trigger to update updated_at on letters
CREATE TRIGGER update_letters_updated_at
  BEFORE UPDATE ON letters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
