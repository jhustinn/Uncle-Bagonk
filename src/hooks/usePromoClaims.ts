import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface PromoClaim {
  id: string;
  promo_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  claimed_at: string;
  used_at?: string;
  status: 'claimed' | 'used' | 'expired';
  claim_code: string;
  notes?: string;
  promo?: {
    title: string;
    description: string;
    image_url: string;
    valid_until: string;
  };
}

export interface ClaimPromoData {
  promo_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
}

export const usePromoClaims = () => {
  const [claims, setClaims] = useState<PromoClaim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimPromo = async (data: ClaimPromoData) => {
    try {
      setLoading(true);
      setError(null);

      // Check if promo is still valid and active
      const { data: promo, error: promoError } = await supabase
        .from('promos')
        .select('*')
        .eq('id', data.promo_id)
        .eq('active', true)
        .single();

      if (promoError || !promo) {
        throw new Error('Promo tidak ditemukan atau sudah tidak aktif');
      }

      if (new Date(promo.valid_until) < new Date()) {
        throw new Error('Promo sudah expired');
      }

      // Check if customer already claimed this promo
      const { data: existingClaim, error: existingError } = await supabase
        .from('promo_claims')
        .select('*')
        .eq('promo_id', data.promo_id)
        .eq('customer_phone', data.customer_phone)
        .eq('status', 'claimed')
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      if (existingClaim) {
        throw new Error('Anda sudah mengklaim promo ini sebelumnya');
      }

      // Create the claim
      const { data: newClaim, error: claimError } = await supabase
        .from('promo_claims')
        .insert([data])
        .select(`
          *,
          promo:promos(title, description, image_url, valid_until)
        `)
        .single();

      if (claimError) throw claimError;

      return { data: newClaim, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengklaim promo';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getClaimsByPhone = async (phone: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_claims')
        .select(`
          *,
          promo:promos(title, description, image_url, valid_until)
        `)
        .eq('customer_phone', phone)
        .order('claimed_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
      return { data: data || [], error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data klaim';
      setError(errorMessage);
      return { data: [], error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getClaimByCode = async (claimCode: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_claims')
        .select(`
          *,
          promo:promos(title, description, image_url, valid_until)
        `)
        .eq('claim_code', claimCode.toUpperCase())
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kode klaim tidak ditemukan';
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const usePromo = async (claimCode: string, notes?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_claims')
        .update({ 
          status: 'used', 
          used_at: new Date().toISOString(),
          notes: notes || null
        })
        .eq('claim_code', claimCode.toUpperCase())
        .eq('status', 'claimed')
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menggunakan promo';
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    claims,
    loading,
    error,
    claimPromo,
    getClaimsByPhone,
    getClaimByCode,
    usePromo,
  };
};