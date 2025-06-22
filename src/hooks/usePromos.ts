import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Promo } from '../types';

export const usePromos = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const { data, error } = await supabase
          .from('promos')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPromos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch promos');
        // Fallback data
        setPromos([
          {
            id: '1',
            title: 'Promo Spesial Weekend',
            description: 'Beli 2 kopi gratis 1 toast setiap weekend!',
            image_url: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400',
            valid_until: '2024-12-31',
            active: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  return { promos, loading, error };
};