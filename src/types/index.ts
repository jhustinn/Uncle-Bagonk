export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'coffee' | 'food' | 'dessert';
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  valid_until: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url?: string;
  author: string;
  published: boolean;
  featured: boolean;
  slug: string;
  created_at?: string;
  updated_at?: string;
  categories?: BlogCategory[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface OpeningHours {
  id: string;
  day_type: 'weekday' | 'weekend';
  hours: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
}

interface Reply {
  id: string;
  author_name: string;
  created_at: string;
  content: string;
}

interface Comment {
  id: string;
  author_name: string;
  created_at: string;
  content: string;
  replies?: Reply[];
}
