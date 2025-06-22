import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('featured', true)
          .order('name');

        if (error) throw error;
        setMenuItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu');
        // Fallback data
        setMenuItems([
          {
            id: '1',
            name: 'Americano Ice',
            description: 'Kopi hitam dingin yang menyegarkan',
            price: 15000,
            image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'coffee',
            featured: true
          },
          {
            id: '2',
            name: 'Chocolate Toast',
            description: 'Roti panggang dengan cokelat lezat',
            price: 12000,
            image_url: 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'food',
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menuItems, loading, error };
};