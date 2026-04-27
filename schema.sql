-- ============================================================
-- NIL Sports Agent - Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ATHLETES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS athletes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Identity
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  graduation_year INTEGER NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  school_name TEXT NOT NULL,
  school_enrollment_size TEXT CHECK (school_enrollment_size IN ('small', 'medium', 'large')) DEFAULT 'medium',

  -- Sport Info
  sport TEXT NOT NULL,
  position TEXT,
  jersey_number INTEGER,

  -- Recruiting
  recruiting_stars INTEGER CHECK (recruiting_stars BETWEEN 0 AND 5) DEFAULT 0,
  recruiting_rank_national INTEGER,
  recruiting_rank_state INTEGER,
  recruiting_rank_position INTEGER,
  committed_school TEXT,

  -- Performance
  gpa DECIMAL(3,2),
  stats JSONB DEFAULT '{}',

  -- Market
  market_size TEXT CHECK (market_size IN ('major', 'mid', 'small')) DEFAULT 'mid',

  -- NIL Status
  nil_active BOOLEAN DEFAULT FALSE,
  nil_state_eligible BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- SOCIAL PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Instagram
  instagram_handle TEXT,
  instagram_followers INTEGER DEFAULT 0,
  instagram_following INTEGER DEFAULT 0,
  instagram_posts INTEGER DEFAULT 0,
  instagram_avg_likes INTEGER DEFAULT 0,
  instagram_avg_comments INTEGER DEFAULT 0,
  instagram_engagement_rate DECIMAL(5,2) DEFAULT 0,

  -- TikTok
  tiktok_handle TEXT,
  tiktok_followers INTEGER DEFAULT 0,
  tiktok_avg_views INTEGER DEFAULT 0,
  tiktok_avg_likes INTEGER DEFAULT 0,
  tiktok_avg_comments INTEGER DEFAULT 0,
  tiktok_engagement_rate DECIMAL(5,2) DEFAULT 0,

  -- Twitter/X
  twitter_handle TEXT,
  twitter_followers INTEGER DEFAULT 0,
  twitter_avg_impressions INTEGER DEFAULT 0,
  twitter_engagement_rate DECIMAL(5,2) DEFAULT 0,

  -- YouTube
  youtube_handle TEXT,
  youtube_subscribers INTEGER DEFAULT 0,
  youtube_avg_views INTEGER DEFAULT 0,

  -- Calculated
  total_reach INTEGER GENERATED ALWAYS AS (
    COALESCE(instagram_followers, 0) +
    COALESCE(tiktok_followers, 0) +
    COALESCE(twitter_followers, 0) +
    COALESCE(youtube_subscribers, 0)
  ) STORED,

  UNIQUE(athlete_id)
);

-- ============================================================
-- VALUATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS valuations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Overall Value
  value_floor INTEGER NOT NULL,
  value_ceiling INTEGER NOT NULL,
  value_midpoint INTEGER NOT NULL,
  tier TEXT CHECK (tier IN ('emerging', 'rising', 'established', 'elite', 'superstar')) NOT NULL,

  -- Score Breakdown (0-100 each)
  sport_score INTEGER,
  recruiting_score INTEGER,
  social_score INTEGER,
  market_score INTEGER,
  performance_score INTEGER,
  overall_score INTEGER,

  -- Deal Type Breakdowns
  local_business_value INTEGER,
  social_post_value INTEGER,
  apparel_value INTEGER,
  camp_appearance_value INTEGER,
  autograph_value INTEGER,

  -- Context
  comparable_athletes JSONB DEFAULT '[]',
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  opportunities JSONB DEFAULT '[]',

  -- Algorithm version
  algorithm_version TEXT DEFAULT 'v1.0'
);

-- ============================================================
-- CHAT HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- DEAL OPPORTUNITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS deal_opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Deal Info
  brand_name TEXT NOT NULL,
  deal_type TEXT CHECK (deal_type IN ('local_business', 'social_post', 'apparel', 'camp', 'autograph', 'ambassador', 'other')) NOT NULL,
  estimated_value INTEGER,
  description TEXT,

  -- Status
  status TEXT CHECK (status IN ('suggested', 'interested', 'reached_out', 'negotiating', 'signed', 'declined')) DEFAULT 'suggested',

  -- Notes
  notes TEXT
);

-- ============================================================
-- STATE NIL RULES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS state_nil_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  state_code TEXT UNIQUE NOT NULL,
  state_name TEXT NOT NULL,
  hs_nil_allowed BOOLEAN DEFAULT FALSE,
  requires_disclosure BOOLEAN DEFAULT FALSE,
  agent_allowed BOOLEAN DEFAULT FALSE,
  caps_deal_value BOOLEAN DEFAULT FALSE,
  max_deal_value INTEGER,
  notes TEXT,
  last_updated DATE
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_athletes_email ON athletes(email);
CREATE INDEX IF NOT EXISTS idx_athletes_sport ON athletes(sport);
CREATE INDEX IF NOT EXISTS idx_athletes_state ON athletes(state);
CREATE INDEX IF NOT EXISTS idx_valuations_athlete ON valuations(athlete_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_athlete ON chat_history(athlete_id);
CREATE INDEX IF NOT EXISTS idx_social_profiles_athlete ON social_profiles(athlete_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_athletes_updated_at
  BEFORE UPDATE ON athletes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_profiles_updated_at
  BEFORE UPDATE ON social_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED STATE NIL RULES (key states)
-- ============================================================
INSERT INTO state_nil_rules (state_code, state_name, hs_nil_allowed, requires_disclosure, agent_allowed, notes, last_updated)
VALUES
  ('CA', 'California', true, true, false, 'SB 206 extended to HS. Disclosure required within 7 days.', '2024-01-01'),
  ('FL', 'Florida', true, false, false, 'HB 7 allows HS NIL. No agent representation.', '2024-01-01'),
  ('TX', 'Texas', true, true, false, 'UIL rules apply. School must be notified.', '2024-01-01'),
  ('OH', 'Ohio', true, false, false, 'OHSAA updated rules to allow NIL.', '2024-01-01'),
  ('GA', 'Georgia', true, false, false, 'GHSA allows NIL with school notification.', '2024-01-01'),
  ('PA', 'Pennsylvania', true, true, false, 'PIAA rules require disclosure to school.', '2024-01-01'),
  ('NY', 'New York', true, false, false, 'NYSPHSAA updated to allow NIL.', '2024-01-01'),
  ('IL', 'Illinois', true, false, false, 'IHSA allows NIL activities.', '2024-01-01'),
  ('NC', 'North Carolina', true, false, false, 'NCHSAA NIL rules in effect.', '2024-01-01'),
  ('MI', 'Michigan', true, false, false, 'MHSAA allows NIL.', '2024-01-01'),
  ('NJ', 'New Jersey', true, true, false, 'NJSIAA requires school notification.', '2024-01-01'),
  ('VA', 'Virginia', true, false, false, 'VHSL NIL policy in effect.', '2024-01-01'),
  ('AZ', 'Arizona', true, false, false, 'AIA allows NIL.', '2024-01-01'),
  ('CO', 'Colorado', true, false, false, 'CHSAA NIL rules updated.', '2024-01-01'),
  ('WA', 'Washington', true, false, false, 'WIAA allows NIL activities.', '2024-01-01')
ON CONFLICT (state_code) DO NOTHING;
