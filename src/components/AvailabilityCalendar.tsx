import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';
import { useAvailability } from '@/hooks/useAvailability';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvailabilityCalendarProps {
  businessId: string;
  onDateSelect: (date: Date, availability: any) => void;
}

const AvailabilityCalendar = ({ businessId, onDateSelect }: AvailabilityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  // Generate next 30 days for availability check
  const dateRange = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));
  const { availability, loading } = useAvailability(businessId, dateRange);

  const getDateAvailability = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availability.find(a => a.date === dateStr);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const dateAvailability = getDateAvailability(date);
    if (dateAvailability) {
      onDateSelect(date, dateAvailability);
    }
  };

  const isDayDisabled = (date: Date) => {
    const dateAvailability = getDateAvailability(date);
    return !dateAvailability?.available;
  };

  const getDayModifiers = (date: Date) => {
    const dateAvailability = getDateAvailability(date);
    if (!dateAvailability) return {};
    
    return {
      available: dateAvailability.available,
      almostFull: dateAvailability.bookedSlots / dateAvailability.totalSlots > 0.8,
      highDemand: dateAvailability.dynamicPrice > dateAvailability.basePrice * 1.3
    };
  };

  const selectedAvailability = selectedDate ? getDateAvailability(selectedDate) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Disponibilidade em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Quase Lotado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Indisponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Alta Demanda</span>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDayDisabled}
              locale={ptBR}
              className="rounded-md border"
              modifiers={dateRange.reduce((acc, date) => {
                const modifiers = getDayModifiers(date);
                Object.entries(modifiers).forEach(([key, value]) => {
                  if (value) {
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(date);
                  }
                });
                return acc;
              }, {} as any)}
              modifiersStyles={{
                available: { backgroundColor: 'hsl(var(--green))' },
                almostFull: { backgroundColor: 'hsl(var(--yellow))' },
                highDemand: { backgroundColor: 'hsl(var(--purple))' }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedAvailability && (
        <Card>
          <CardHeader>
            <CardTitle>
              {format(selectedDate!, 'EEEE, dd MMMM yyyy', { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {selectedAvailability.bookedSlots}/{selectedAvailability.totalSlots} ocupado
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Badge variant={selectedAvailability.available ? "default" : "destructive"}>
                  {selectedAvailability.available ? "Disponível" : "Lotado"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Preço base:</span>
                <span className="text-sm">AOA {selectedAvailability.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Preço dinâmico:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">AOA {selectedAvailability.dynamicPrice.toLocaleString()}</span>
                  {selectedAvailability.dynamicPrice > selectedAvailability.basePrice ? (
                    <TrendingUp className="h-3 w-3 text-red-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            {selectedAvailability.waitingList > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {selectedAvailability.waitingList} pessoas na lista de espera
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityCalendar;