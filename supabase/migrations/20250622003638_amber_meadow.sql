/*
  # Comprehensive Menu Items for Uncle Bagonk

  1. New Menu Items
    - Coffee drinks (hot and iced)
    - Milk-based beverages
    - Food items (nasi, indomie, rice bowls)
    - Snacks and appetizers
    - Toast varieties
    - Traditional Indonesian dishes

  2. Categories
    - coffee: All coffee-based drinks
    - milk: Milk-based beverages
    - food: Main dishes and rice meals
    - snacks: Light snacks and appetizers
    - toast: Toast varieties
    - noodles: Noodle dishes
*/

-- Clear existing sample data first
DELETE FROM menu_items;

ALTER TABLE menu_items DROP CONSTRAINT menu_items_category_check;

ALTER TABLE menu_items
  ADD CONSTRAINT menu_items_category_check
  CHECK (category IN ('coffee', 'toast', 'snacks', 'noodles', 'food', 'milk'));


-- Coffee Menu
INSERT INTO menu_items (name, description, price, image_url, category, featured) VALUES
  ('Espresso', 'Kopi espresso murni dengan rasa yang kuat dan aroma yang khas', 10000, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', true),
  ('Americano', 'Kopi hitam klasik yang dapat dinikmati panas atau dingin', 12000, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', true),
  ('Kopi Tubruk', 'Kopi tradisional Indonesia dengan ampas yang mengendap', 10000, 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Kopi Susu Tubruk', 'Kopi tubruk dengan tambahan susu segar', 12000, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Butter Coffee', 'Kopi dengan mentega untuk rasa yang creamy dan energi ekstra', 20000, 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Kopi Milo', 'Perpaduan unik kopi dengan milo untuk rasa yang istimewa', 21000, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Kopi Bagonk', 'Signature coffee Uncle Bagonk dengan resep rahasia', 22000, 'https://images.pexels.com/photos/1002543/pexels-photo-1002543.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', true),
  ('Caramel Macchiato', 'Espresso dengan steamed milk dan caramel sauce', 22000, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', true),
  ('Matchapresso', 'Fusion unik antara matcha dan espresso', 23000, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Coffee Latte', 'Espresso dengan steamed milk yang creamy', 18000, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', true),
  ('Kopi Susu', 'Kopi dengan susu segar, tersedia panas atau dingin', 22000, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Latte Flavour Caramel', 'Latte dengan rasa caramel yang manis', 22000, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Latte Flavour Vanilla', 'Latte dengan aroma vanilla yang lembut', 22000, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),
  ('Latte Flavour Hazelnut', 'Latte dengan rasa hazelnut yang khas', 22000, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'coffee', false),

-- Milk Based Beverages
  ('Milo', 'Minuman cokelat malt yang menyegarkan', 18000, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 'milk', false),
  ('Milo Dino', 'Milo dingin dengan topping milo bubuk extra', 20000, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 'milk', false),
  ('Chocolate', 'Minuman cokelat hangat atau dingin yang creamy', 20000, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 'milk', false),
  ('Green Tea', 'Teh hijau segar dengan antioksidan tinggi', 20000, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400', 'milk', false),
  ('Choco Hazelnut', 'Perpaduan cokelat dan hazelnut yang lezat', 25000, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 'milk', false),
  ('Choco Caramel', 'Minuman cokelat dengan sentuhan caramel', 25000, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 'milk', false),

-- Toast Menu
  ('Toast Kaya', 'Roti panggang dengan selai kaya tradisional', 12000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'toast', false),
  ('Toast Coklat', 'Roti panggang dengan cokelat lezat', 12000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'toast', true),
  ('Toast Coklat Keju', 'Roti panggang dengan cokelat dan keju', 13500, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'toast', false),
  ('Toast Keju Susu', 'Roti panggang dengan keju dan susu', 15000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'toast', false),
  ('Toast Butter Kaya', 'Roti panggang dengan mentega dan kaya', 15000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'toast', false),

-- Snacks Menu
  ('Mendoan', 'Tempe mendoan khas Banyumas yang renyah', 12000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'snacks', false),
  ('Tahu Kemul', 'Tahu goreng dengan bumbu kemul yang gurih', 15000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'snacks', false),
  ('French Fries', 'Kentang goreng renyah dengan bumbu pilihan', 15000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'snacks', false),
  ('Lumpia Udang', 'Lumpia isi udang yang gurih dan renyah', 19000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'snacks', false),
  ('Bagonk Platter', 'Platter campur berbagai snacks Uncle Bagonk', 22000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'snacks', true),
  ('Bakso Goreng', 'Bakso goreng dengan saus sambal', 23000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'snacks', false),

-- Noodles Menu (Indomie & Others)
  ('Indomie Original Goreng', 'Indomie goreng original klasik', 8000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'noodles', false),
  ('Indomie Original Kuah', 'Indomie kuah original yang hangat', 8000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'noodles', false),
  ('Indomie Telur Goreng', 'Indomie goreng dengan telur mata sapi', 13500, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'noodles', false),
  ('Indomie Telur Kuah', 'Indomie kuah dengan telur mata sapi', 13500, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'noodles', false),

-- Main Food Menu
  ('Nasi Tampah Lele Bakar', 'Nasi dengan lele bakar, lalapan, dan sambal', 24000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', true),
  ('Nasi Tampah Nila Bakar', 'Nasi dengan nila bakar, lalapan, dan sambal', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', true),
  ('Nasi Tampah Udang Bakar', 'Nasi dengan udang bakar, lalapan, dan sambal', 32000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Bakmi Kuah', 'Bakmi kuah dengan topping lengkap', 23000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Bakmi Goreng Nusantara', 'Bakmi goreng dengan bumbu nusantara', 23000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Nasi Ayam Geprek', 'Nasi dengan ayam geprek pedas', 22000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Nasi Ayam Kemangi', 'Nasi ayam dengan kemangi yang harum', 24000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Nasi Sapi Mercon', 'Nasi dengan sapi mercon yang pedas', 27000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Ayam Katsu + Nasi', 'Ayam katsu renyah dengan nasi putih', 25000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Ayam Katsu + French Fries', 'Ayam katsu dengan kentang goreng', 28000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Nasi Goreng Bebek Bagonk', 'Nasi goreng spesial dengan bebek', 28000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', true),
  ('Nasi Goreng Spesial Bagonk', 'Nasi goreng spesial Uncle Bagonk', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', true),
  ('Nasi Rawon Bagonk', 'Rawon khas dengan nasi putih', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Ricebowl Chicken Teriyaki', 'Rice bowl dengan ayam teriyaki', 22000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Ricebowl Beef Teriyaki', 'Rice bowl dengan daging sapi teriyaki', 28000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),

-- Tampah Menu Items
  ('Tampah Bebek Bakar', 'Bebek bakar dengan nasi dan lalapan', 36000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Bebek Goreng Bumbu Hitam', 'Bebek goreng bumbu hitam dengan nasi', 35000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Belanak Goreng', 'Ikan belanak goreng dengan nasi', 32000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Empal Manis', 'Empal daging manis dengan nasi', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Empal Gurih', 'Empal daging gurih dengan nasi', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Babat Manis', 'Babat manis dengan nasi dan lalapan', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Babat Gurih', 'Babat gurih dengan nasi dan lalapan', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Paru Manis', 'Paru manis dengan nasi dan lalapan', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Paru Gurih', 'Paru gurih dengan nasi dan lalapan', 30000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Udang Goreng', 'Udang goreng dengan nasi dan lalapan', 28000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Nila/Kakap Goreng', 'Ikan nila/kakap goreng dengan nasi', 28000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Bandeng Presto', 'Bandeng presto dengan nasi dan lalapan', 28000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Ayam Bakar', 'Ayam bakar dengan nasi dan lalapan', 25000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Ayam Goreng Kremes', 'Ayam goreng kremes dengan nasi', 26000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Kulit Goreng', 'Kulit goreng renyah dengan nasi', 22000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Lele Goreng', 'Lele goreng dengan nasi dan lalapan', 22000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Tampah Telur Crispy', 'Telur crispy dengan nasi dan lalapan', 18000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),

-- Additional Items
  ('Telur Dadar', 'Telur dadar sebagai tambahan', 7000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Telur Ceplok', 'Telur ceplok mata sapi', 7000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Sayur Asem', 'Sayur asem segar', 7000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Telur Crispy', 'Telur crispy renyah', 10000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Kulit Crispy', 'Kulit ayam crispy', 18000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Lele Goreng', 'Lele goreng saja', 18000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Ayam Goreng', 'Ayam goreng saja', 20000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Ayam Bakar', 'Ayam bakar saja', 21000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Nila/Kakap', 'Ikan nila atau kakap', 22000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Bebek Goreng Bumbu Hitam', 'Bebek goreng bumbu hitam saja', 26000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Bebek Bakar', 'Bebek bakar saja', 27000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Babat Manis/Gurih', 'Babat dengan pilihan rasa manis atau gurih', 25000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Paru Manis/Gurih', 'Paru dengan pilihan rasa manis atau gurih', 25000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Empal Manis/Gurih', 'Empal dengan pilihan rasa manis atau gurih', 28000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false),
  ('Belanak Goreng', 'Ikan belanak goreng saja', 27000, 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', false);