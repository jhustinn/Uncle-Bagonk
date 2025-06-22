/*
  # Blog Management System

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `featured_image_url` (text)
      - `author` (text)
      - `published` (boolean)
      - `featured` (boolean)
      - `slug` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `created_at` (timestamp)
    
    - `blog_post_categories`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Public read access for published posts
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image_url text,
  author text NOT NULL DEFAULT 'Admin',
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_post_categories junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  UNIQUE(post_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read blog categories"
  ON blog_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Public can read blog post categories"
  ON blog_post_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated users (admin) to manage content
CREATE POLICY "Authenticated users can manage blog categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage blog post categories"
  ON blog_post_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug) VALUES
  ('Coffee Tips', 'coffee-tips'),
  ('Recipes', 'recipes'),
  ('News & Updates', 'news-updates'),
  ('Behind the Scenes', 'behind-the-scenes');

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, featured_image_url, author, published, featured, slug) VALUES
  (
    'Tips Memilih Biji Kopi Terbaik',
    'Memilih biji kopi yang tepat adalah kunci untuk mendapatkan secangkir kopi yang sempurna. Berikut adalah beberapa tips yang dapat membantu Anda memilih biji kopi terbaik untuk kebutuhan Anda.

## 1. Kenali Asal Biji Kopi

Setiap daerah penghasil kopi memiliki karakteristik rasa yang unik. Kopi dari Ethiopia cenderung memiliki rasa fruity dan floral, sementara kopi dari Brazil lebih nutty dan chocolaty.

## 2. Perhatikan Tanggal Roasting

Biji kopi terbaik adalah yang baru di-roasting. Idealnya, gunakan biji kopi dalam 2-4 minggu setelah tanggal roasting untuk mendapatkan rasa yang optimal.

## 3. Pilih Tingkat Roasting yang Sesuai

- Light roast: Mempertahankan karakter asli biji kopi
- Medium roast: Keseimbangan antara rasa asli dan rasa roasting
- Dark roast: Rasa roasting yang dominan, cocok untuk espresso

## 4. Perhatikan Kemasan

Pilih biji kopi yang dikemas dalam kemasan yang kedap udara dengan valve untuk mengeluarkan CO2. Hindari kemasan transparan yang dapat merusak kualitas biji kopi.

Dengan mengikuti tips ini, Anda akan dapat menikmati secangkir kopi yang luar biasa setiap hari!',
    'Pelajari cara memilih biji kopi terbaik untuk mendapatkan secangkir kopi yang sempurna. Tips dari para ahli kopi Uncle Bagonk.',
    'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Uncle Bagonk Team',
    true,
    true,
    'tips-memilih-biji-kopi-terbaik'
  ),
  (
    'Resep Cold Brew Coffee Rumahan',
    'Cold brew coffee adalah minuman kopi yang sempurna untuk cuaca panas. Berbeda dengan es kopi biasa, cold brew dibuat dengan metode ekstraksi dingin yang menghasilkan rasa yang lebih smooth dan less acidic.

## Bahan yang Dibutuhkan:

- 100g biji kopi (grind kasar)
- 1 liter air dingin
- Saringan atau French press
- Wadah kedap udara

## Cara Membuat:

### 1. Persiapan Biji Kopi
Giling biji kopi dengan tingkat kekasaran seperti garam kasar. Jangan terlalu halus karena akan membuat cold brew menjadi keruh.

### 2. Campurkan dengan Air
Masukkan kopi yang sudah digiling ke dalam wadah, lalu tuangkan air dingin. Aduk rata hingga semua kopi terendam.

### 3. Proses Ekstraksi
Tutup wadah dan diamkan di suhu ruang selama 12-24 jam. Semakin lama, semakin kuat rasanya.

### 4. Saring
Saring cold brew menggunakan saringan halus atau French press. Saring 2-3 kali untuk hasil yang jernih.

### 5. Penyajian
Cold brew concentrate dapat disimpan di kulkas hingga 2 minggu. Untuk penyajian, campurkan dengan air atau susu sesuai selera.

## Tips Tambahan:

- Gunakan air berkualitas baik
- Eksperimen dengan rasio kopi dan air
- Tambahkan es batu dan susu untuk variasi

Selamat mencoba membuat cold brew di rumah!',
    'Belajar membuat cold brew coffee yang sempurna di rumah dengan resep dan tips dari Uncle Bagonk.',
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Uncle Bagonk Team',
    true,
    false,
    'resep-cold-brew-coffee-rumahan'
  );

-- Link blog posts to categories
INSERT INTO blog_post_categories (post_id, category_id)
SELECT 
  bp.id,
  bc.id
FROM blog_posts bp, blog_categories bc
WHERE 
  (bp.slug = 'tips-memilih-biji-kopi-terbaik' AND bc.slug = 'coffee-tips') OR
  (bp.slug = 'resep-cold-brew-coffee-rumahan' AND bc.slug = 'recipes');