import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface LoyaltyData {
  points: number;
  tier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  nextTierPoints: number;
  totalSpent: number;
  benefits: string[];
  cashbackRate: number;
}

export const useLoyaltyProgram = () => {
  const { user } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateTier = (totalSpent: number): LoyaltyData['tier'] => {
    if (totalSpent >= 50000) return 'Diamante';
    if (totalSpent >= 25000) return 'Ouro';
    if (totalSpent >= 10000) return 'Prata';
    return 'Bronze';
  };

  const getTierBenefits = (tier: LoyaltyData['tier']): string[] => {
    const benefits = {
      Bronze: ['5% cashback', 'Promoções exclusivas'],
      Prata: ['7% cashback', 'Check-in prioritário', 'Upgrade gratuito'],
      Ouro: ['10% cashback', 'Concierge pessoal', 'Cancelamento flexível'],
      Diamante: ['15% cashback', 'Acesso VIP', 'Transfer gratuito']
    };
    return benefits[tier];
  };

  const getCashbackRate = (tier: LoyaltyData['tier']): number => {
    const rates = { Bronze: 0.05, Prata: 0.07, Ouro: 0.10, Diamante: 0.15 };
    return rates[tier];
  };

  useEffect(() => {
    if (!user) return;

    const fetchLoyaltyData = async () => {
      setLoading(true);

      try {
        // Get user's total spending
        const { data: reservations, error } = await supabase
          .from('reservations')
          .select('total_amount')
          .eq('user_id', user.id)
          .eq('status', 'confirmed');

        if (error) throw error;

        const totalSpent = reservations?.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0;
        const points = Math.floor(totalSpent / 10); // 1 point per 10 AOA spent
        const tier = calculateTier(totalSpent);
        
        const tierThresholds = { Bronze: 10000, Prata: 25000, Ouro: 50000, Diamante: Infinity };
        const nextTierPoints = tierThresholds[tier] === Infinity ? 0 : Math.floor((tierThresholds[tier] - totalSpent) / 10);

        setLoyaltyData({
          points,
          tier,
          nextTierPoints,
          totalSpent,
          benefits: getTierBenefits(tier),
          cashbackRate: getCashbackRate(tier)
        });
      } catch (err) {
        console.error('Erro ao carregar dados de fidelidade:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [user]);

  return { loyaltyData, loading };
};