-- ================================================================
-- HageHub — Complete Supabase Schema
-- Paste this entire file into:
-- Supabase Dashboard → SQL Editor → New Query → Run (Ctrl+Enter)
-- ================================================================

-- ── 1. PROFILES ─────────────────────────────────────────────────
-- Stores extra user info linked to Supabase Auth users.
-- One row per user, auto-created on signup via trigger below.

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL DEFAULT '',
  role       TEXT        NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor')),
  country    TEXT        NOT NULL DEFAULT '',
  photo_url  TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, name, role, country)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'country', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── 2. QUESTIONS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  lang         TEXT        NOT NULL DEFAULT 'both' CHECK (lang IN ('both', 'so', 'en')),
  title        TEXT        NOT NULL,
  body         TEXT        NOT NULL DEFAULT '',
  tags         TEXT[]      NOT NULL DEFAULT '{}',
  images       TEXT[]      NOT NULL DEFAULT '{}',
  vote_count   INTEGER     NOT NULL DEFAULT 0,
  answer_count INTEGER     NOT NULL DEFAULT 0,
  poster_name  TEXT        NOT NULL,
  poster_init  TEXT        NOT NULL,
  poster_photo TEXT        NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── 3. ANSWERS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS answers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID        NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  poster_name TEXT        NOT NULL,
  poster_init TEXT        NOT NULL,
  body        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── 4. VOTES ────────────────────────────────────────────────────
-- One row per user per question. value: 1=upvote, -1=downvote, 0=removed.

CREATE TABLE IF NOT EXISTS votes (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID    NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id     UUID    REFERENCES profiles(id) ON DELETE CASCADE,
  voter_name  TEXT    NOT NULL DEFAULT '',
  value       INTEGER NOT NULL DEFAULT 0 CHECK (value IN (-1, 0, 1)),
  UNIQUE (question_id, user_id)
);


-- ── 5. INDEXES ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_questions_created_at  ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_id   ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_votes_question_id     ON votes(question_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id         ON votes(user_id);


-- ── 6. ROW LEVEL SECURITY ───────────────────────────────────────
-- Profiles: anyone can read; only the owner can update their own row.
-- Questions / Answers / Votes: public read + write (anon key).
-- Tighten these after full Supabase Auth rollout.

ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes      ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "profiles_read"   ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_read"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Questions, Answers, Votes — open to anon for now
DROP POLICY IF EXISTS "anon_all_questions" ON questions;
DROP POLICY IF EXISTS "anon_all_answers"   ON answers;
DROP POLICY IF EXISTS "anon_all_votes"     ON votes;
CREATE POLICY "anon_all_questions" ON questions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_answers"   ON answers   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_votes"     ON votes     FOR ALL TO anon USING (true) WITH CHECK (true);

-- Authenticated users can also do everything
DROP POLICY IF EXISTS "auth_all_questions" ON questions;
DROP POLICY IF EXISTS "auth_all_answers"   ON answers;
DROP POLICY IF EXISTS "auth_all_votes"     ON votes;
CREATE POLICY "auth_all_questions" ON questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_answers"   ON answers   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_votes"     ON votes     FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── 7. HELPER FUNCTIONS ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_answer_count(qid UUID)
RETURNS VOID LANGUAGE sql AS $$
  UPDATE questions SET answer_count = answer_count + 1 WHERE id = qid;
$$;
