import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilityData {
  date: string;
  available: boolean;
  totalSlots: number;
  bookedSlots: number;
  waitingList: number;
  dynamicPrice: number;
  basePrice: number;
}

export const useAvailability = (businessId: string, dateRange: Date[]) => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId || dateRange.length === 0) return;

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const startDate = dateRange[0].toISOString().split('T')[0];
        const endDate = dateRange[dateRange.length - 1].toISOString().split('T')[0];

        // Fetch reservations for the date range
        const { data: reservations, error: reservationError } = await supabase
          .from('reservations')
          .select('date, guests, status')
          .eq('business_id', businessId)
          .gte('date', startDate)
          .lte('date', endDate)
          .in('status', ['confirmed', 'pending']);

        if (reservationError) throw reservationError;

        // Get business info for capacity calculation
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();

        if (businessError) throw businessError;

        // Calculate availability for each date
        const availabilityData = dateRange.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const dayReservations = reservations?.filter(r => r.date === dateStr) || [];
          
          const totalBooked = dayReservations.reduce((sum, r) => sum + (r.guests || 0), 0);
          const totalSlots = 50; // Default capacity - should come from business data
          const available = totalBooked < totalSlots;
          
          // Dynamic pricing calculation
          const occupancyRate = totalBooked / totalSlots;
          const basePrice = 500; // Base price in AOA
          const priceMultiplier = 1 + (occupancyRate * 0.5); // Up to 50% increase
          const dynamicPrice = Math.round(basePrice * priceMultiplier);

          return {
            date: dateStr,
            available,
            totalSlots,
            bookedSlots: totalBooked,
            waitingList: 0,
            dynamicPrice,
            basePrice
          };
        });

        setAvailability(availabilityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao verificar disponibilidade');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [businessId, dateRange]);

  return { availability, loading, error };
};