/*
  # Blog Interactions System

  1. New Tables
    - `blog_likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key, nullable for anonymous)
      - `ip_address` (text, for anonymous tracking)
      - `created_at` (timestamp)
    
    - `blog_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key, nullable for anonymous)
      - `author_name` (text)
      - `author_email` (text)
      - `content` (text)
      - `approved` (boolean)
      - `parent_id` (uuid, foreign key for replies)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_views`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key, nullable for anonymous)
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamp)
    
    - `blog_shares`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `platform` (text, facebook/twitter/whatsapp/copy)
      - `user_id` (uuid, foreign key, nullable for anonymous)
      - `ip_address` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public interaction
    - Admin policies for comment moderation
*/

-- Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id),
  UNIQUE(post_id, ip_address)
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  approved boolean DEFAULT false,
  parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_views table
CREATE OR REPLACE FUNCTION set_created_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_date := DATE(NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS blog_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  created_date date,
  UNIQUE(post_id, ip_address, created_date)
);

CREATE TRIGGER set_created_date_trigger
BEFORE INSERT ON blog_views
FOR EACH ROW
EXECUTE FUNCTION set_created_date();


-- Create blog_shares table
CREATE TABLE IF NOT EXISTS blog_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL CHECK (platform IN ('facebook', 'twitter', 'whatsapp', 'copy', 'email')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;

-- Policies for blog_likes
CREATE POLICY "Anyone can read likes"
  ON blog_likes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON blog_likes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete their own likes"
  ON blog_likes
  FOR DELETE
  TO anon, authenticated
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND ip_address = inet_client_addr()::text)
  );

-- Policies for blog_comments
CREATE POLICY "Anyone can read approved comments"
  ON blog_comments
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Authenticated users can read all comments"
  ON blog_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON blog_comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage comments"
  ON blog_comments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for blog_views
CREATE POLICY "Anyone can read views"
  ON blog_views
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert views"
  ON blog_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policies for blog_shares
CREATE POLICY "Anyone can read shares"
  ON blog_shares
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert shares"
  ON blog_shares
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(approved);
CREATE INDEX IF NOT EXISTS idx_blog_views_post_id ON blog_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_shares_post_id ON blog_shares(post_id);

-- Create functions to get interaction counts
CREATE OR REPLACE FUNCTION get_blog_post_stats(post_uuid uuid)
RETURNS TABLE(
  likes_count bigint,
  comments_count bigint,
  views_count bigint,
  shares_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM blog_likes WHERE post_id = post_uuid),
    (SELECT COUNT(*) FROM blog_comments WHERE post_id = post_uuid AND approved = true),
    (SELECT COUNT(*) FROM blog_views WHERE post_id = post_uuid),
    (SELECT COUNT(*) FROM blog_shares WHERE post_id = post_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample comments for existing blog posts
DO $$
DECLARE
  post_record RECORD;
BEGIN
  FOR post_record IN SELECT id FROM blog_posts LIMIT 2 LOOP
    INSERT INTO blog_comments (post_id, author_name, author_email, content, approved) VALUES
      (post_record.id, 'Sarah Johnson', 'sarah@example.com', 'Artikel yang sangat bermanfaat! Terima kasih atas tips-tipsnya.', true),
      (post_record.id, 'Ahmad Rizki', 'ahmad@example.com', 'Saya sudah mencoba tips ini dan hasilnya luar biasa. Recommended!', true),
      (post_record.id, 'Maria Santos', 'maria@example.com', 'Penjelasannya sangat detail dan mudah dipahami. Sukses terus Uncle Bagonk!', true);
  END LOOP;
END $$;