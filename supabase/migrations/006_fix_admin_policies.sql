-- Fix admin RLS: ensure is_admin() exists with SECURITY DEFINER
-- and all admin policies use it (not direct subqueries on admins table)

-- Recreate is_admin() with SECURITY DEFINER to bypass admins table RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER;

-- Also fix the admins table policy to use SECURITY DEFINER function
DROP POLICY IF EXISTS "Admins can read admin table" ON admins;
CREATE POLICY "Admins can read admin table" ON admins
  FOR SELECT USING (is_admin());

-- Drop and recreate all admin policies on rounds
DROP POLICY IF EXISTS "Admins insert rounds" ON rounds;
DROP POLICY IF EXISTS "Admins update rounds" ON rounds;
DROP POLICY IF EXISTS "Admins delete rounds" ON rounds;

CREATE POLICY "Admins insert rounds" ON rounds
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins update rounds" ON rounds
  FOR UPDATE USING (is_admin());
CREATE POLICY "Admins delete rounds" ON rounds
  FOR DELETE USING (is_admin());

-- Drop and recreate all admin policies on pending_rounds
DROP POLICY IF EXISTS "Admins see all pending" ON pending_rounds;
DROP POLICY IF EXISTS "Admins update pending" ON pending_rounds;
DROP POLICY IF EXISTS "Admins delete pending" ON pending_rounds;

CREATE POLICY "Admins see all pending" ON pending_rounds
  FOR SELECT USING (is_admin());
CREATE POLICY "Admins update pending" ON pending_rounds
  FOR UPDATE USING (is_admin());
CREATE POLICY "Admins delete pending" ON pending_rounds
  FOR DELETE USING (is_admin());
