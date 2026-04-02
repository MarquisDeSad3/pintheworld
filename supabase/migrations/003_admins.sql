-- Admin table — replaces hardcoded email list in client code
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: only admins can read the admin table (prevents leaking admin emails)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read admin table" ON admins
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM admins));

-- Seed current admins (run once — update emails as needed)
-- These INSERTs will only work after the users have signed in at least once.
-- Alternative: insert by email after they sign up, using a trigger or manual SQL.
