/*
  # Coffee Shop Database Schema

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer, in rupiah)
      - `image_url` (text)
      - `category` (text, coffee/food/dessert)
      - `featured` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `promos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `valid_until` (date)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `opening_hours`
      - `id` (uuid, primary key)
      - `day_type` (text, weekday/weekend)
      - `hours` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Public read access for website display
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('coffee', 'food', 'dessert')),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create promos table
CREATE TABLE IF NOT EXISTS promos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  valid_until date NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create opening_hours table
CREATE TABLE IF NOT EXISTS opening_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_type text NOT NULL CHECK (day_type IN ('weekday', 'weekend')),
  hours text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read menu items"
  ON menu_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read promos"
  ON promos
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read opening hours"
  ON opening_hours
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated users (admin) to manage content
CREATE POLICY "Authenticated users can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage promos"
  ON promos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage opening hours"
  ON opening_hours
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO menu_items (name, description, price, image_url, category, featured) VALUES
  ('Americano Ice', 'Kopi hitam dingin yang menyegarkan dengan rasa yang kuat', 15000, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', true),
  ('Cappuccino', 'Kopi dengan foam susu yang creamy dan lembut', 18000, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', true),
  ('Chocolate Toast', 'Roti panggang dengan cokelat lezat dan mentega', 12000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', true),
  ('Croissant', 'Pastry Prancis yang renyah dengan isian selai', 15000, 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tiramisu', 'Dessert Italia dengan kopi dan mascarpone', 25000, 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400', 'dessert', false);

INSERT INTO promos (title, description, image_url, valid_until) VALUES
  ('Promo Weekend Special', 'Beli 2 kopi gratis 1 toast setiap weekend!', 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400', '2024-12-31'),
  ('Happy Hour Coffee', 'Diskon 20% untuk semua kopi dari jam 14:00-16:00', 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=400', '2024-12-31');

INSERT INTO opening_hours (day_type, hours) VALUES
  ('weekday', '10:00 - 22:00'),
  ('weekend', '10:00 - 22:30');