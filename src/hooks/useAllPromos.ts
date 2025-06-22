import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Promo } from '../types';

export const useAllPromos = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPromos = async () => {
      try {
        const { data, error } = await supabase
          .from('promos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPromos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch promos');
        // Fallback data
        setPromos([
          {
            id: '1',
            title: 'Promo Weekend Special',
            description: 'Beli 2 kopi gratis 1 toast setiap weekend! Nikmati waktu santai Anda dengan penawaran istimewa ini.',
            image_url: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400',
            valid_until: '2024-12-31',
            active: true
          },
          {
            id: '2',
            title: 'Happy Hour Coffee',
            description: 'Diskon 20% untuk semua kopi dari jam 14:00-16:00. Jangan lewatkan kesempatan emas ini!',
            image_url: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=400',
            valid_until: '2024-12-31',
            active: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPromos();
  }, []);

  return { promos, loading, error };
};