-- Row Level Security policies

-- Profiles: users can read all, update own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles visible to all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Rounds: readable by all, only admins can modify
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rounds visible to all" ON rounds FOR SELECT USING (true);

-- Pending rounds: submitter can see own, admins see all
ALTER TABLE pending_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own pending" ON pending_rounds FOR SELECT USING (auth.uid() = submitter_id);
CREATE POLICY "Anyone can submit" ON pending_rounds FOR INSERT WITH CHECK (true);

-- User stats: users can read all, update own
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stats visible to all" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Users update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User achievements: readable by all, users insert own
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements visible to all" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "Users insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard: readable by all
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboard visible to all" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Users update own leaderboard" ON leaderboard FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own leaderboard" ON leaderboard FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: users see own
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Anyone can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Photos are public" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
