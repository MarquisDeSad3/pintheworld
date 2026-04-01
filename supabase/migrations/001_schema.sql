-- PinTheWorld — Database Schema

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rounds (active game rounds)
CREATE TABLE IF NOT EXISTS rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id TEXT NOT NULL,
  subdivision_id TEXT NOT NULL,
  subdivision_name TEXT,
  country_name TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('places', 'people')),
  photo_url TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  active BOOLEAN DEFAULT true,
  is_promo BOOLEAN DEFAULT false,
  promo_data JSONB,
  submitter_name TEXT,
  submitter_id UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pending rounds (awaiting approval)
CREATE TABLE IF NOT EXISTS pending_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id TEXT NOT NULL,
  subdivision_id TEXT NOT NULL,
  subdivision_name TEXT,
  country_name TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('places', 'people')),
  photo_url TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  is_promo BOOLEAN DEFAULT false,
  promo_data JSONB,
  submitter_name TEXT,
  submitter_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'pending_payment')),
  stripe_session_id TEXT,
  paid BOOLEAN DEFAULT false,
  amount_paid INTEGER,
  currency TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User stats (global)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_games INTEGER DEFAULT 0,
  total_score BIGINT DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  perfect_guesses INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  last_play_date DATE,
  duels_won INTEGER DEFAULT 0,
  multi_games INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  countries_played TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Leaderboard (materialized for fast reads)
CREATE TABLE IF NOT EXISTS leaderboard (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  total_score BIGINT DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  perfect_guesses INTEGER DEFAULT 0,
  countries_count INTEGER DEFAULT 0,
  xp BIGINT DEFAULT 0,
  level_name TEXT DEFAULT 'Tourist',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions (promo payments)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  round_id UUID REFERENCES pending_rounds(id),
  country_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rounds_country_mode ON rounds(country_id, mode) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_rounds_active ON rounds(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_rounds(status);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_score ON user_stats(total_score DESC);
