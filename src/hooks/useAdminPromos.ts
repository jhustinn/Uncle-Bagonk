import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Promo } from '../types';

export const useAdminPromos = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promos');
    } finally {
      setLoading(false);
    }
  };

  const addPromo = async (promo: Omit<Promo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('promos')
        .insert([promo])
        .select()
        .single();

      if (error) throw error;
      setPromos(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add promo';
      return { data: null, error };
    }
  };

  const updatePromo = async (id: string, updates: Partial<Promo>) => {
    try {
      const { data, error } = await supabase
        .from('promos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPromos(prev => prev.map(promo => promo.id === id ? data : promo));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update promo';
      return { data: null, error };
    }
  };

  const deletePromo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPromos(prev => prev.filter(promo => promo.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete promo';
      return { error };
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return {
    promos,
    loading,
    error,
    addPromo,
    updatePromo,
    deletePromo,
    refetch: fetchPromos,
  };
};