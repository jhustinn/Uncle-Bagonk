-- Enable RLS jika belum
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Allow insert hanya untuk user login
CREATE POLICY "Allow insert for authenticated users 2"
ON blog_comments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

