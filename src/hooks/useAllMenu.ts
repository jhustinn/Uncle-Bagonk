import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

export const useAllMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMenu = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('featured', { ascending: false })
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
            description: 'Kopi hitam dingin yang menyegarkan dengan rasa yang kuat dan aroma yang menggugah selera',
            price: 15000,
            image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'coffee',
            featured: true
          },
          {
            id: '2',
            name: 'Cappuccino',
            description: 'Kopi dengan foam susu yang creamy dan lembut, perpaduan sempurna antara espresso dan susu',
            price: 18000,
            image_url: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'coffee',
            featured: true
          },
          {
            id: '3',
            name: 'Chocolate Toast',
            description: 'Roti panggang dengan cokelat lezat dan mentega, cocok untuk menemani kopi Anda',
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

    fetchAllMenu();
  }, []);

  return { menuItems, loading, error };
};