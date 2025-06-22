import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PromoClaim } from './usePromoClaims';

export const useAdminPromoClaims = () => {
  const [claims, setClaims] = useState<PromoClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_claims')
        .select(`
          *,
          promo:promos(title, description, image_url, valid_until)
        `)
        .order('claimed_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promo claims');
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (id: string, status: 'claimed' | 'used' | 'expired', notes?: string) => {
    try {
      const updateData: any = { status };
      
      if (status === 'used') {
        updateData.used_at = new Date().toISOString();
      }
      
      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('promo_claims')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          promo:promos(title, description, image_url, valid_until)
        `)
        .single();

      if (error) throw error;
      
      setClaims(prev => prev.map(claim => claim.id === id ? data : claim));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update claim status';
      return { data: null, error };
    }
  };

  const deleteClaim = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promo_claims')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClaims(prev => prev.filter(claim => claim.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete claim';
      return { error };
    }
  };

  const getClaimStats = () => {
    const total = claims.length;
    const claimed = claims.filter(c => c.status === 'claimed').length;
    const used = claims.filter(c => c.status === 'used').length;
    const expired = claims.filter(c => c.status === 'expired').length;

    return { total, claimed, used, expired };
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return {
    claims,
    loading,
    error,
    updateClaimStatus,
    deleteClaim,
    getClaimStats,
    refetch: fetchClaims,
  };
};