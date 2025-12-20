ALTER TABLE user_stats
ADD COLUMN winning INTEGER DEFAULT 0 CHECK (winning >= 0);
