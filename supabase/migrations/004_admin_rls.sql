-- Admin policies for rounds and pending_rounds
-- Admins can fully manage rounds (insert, update, delete)
CREATE POLICY "Admins insert rounds" ON rounds
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM admins));

CREATE POLICY "Admins update rounds" ON rounds
  FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM admins));

CREATE POLICY "Admins delete rounds" ON rounds
  FOR DELETE USING (auth.uid() IN (SELECT user_id FROM admins));

-- Admins can see all pending rounds (not just own)
CREATE POLICY "Admins see all pending" ON pending_rounds
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM admins));

-- Admins can update pending rounds (approve/reject)
CREATE POLICY "Admins update pending" ON pending_rounds
  FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM admins));

-- Admins can delete pending rounds
CREATE POLICY "Admins delete pending" ON pending_rounds
  FOR DELETE USING (auth.uid() IN (SELECT user_id FROM admins));
