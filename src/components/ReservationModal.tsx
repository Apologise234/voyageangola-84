import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, Phone, Mail, User, TrendingUp, AlertTriangle, CreditCard } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';
import { useAuth } from '@/components/AuthProvider';

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  businessName: string;
}

const ReservationModal = ({ open, onOpenChange, businessId, businessName }: ReservationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [showAvailabilityCalendar, setShowAvailabilityCalendar] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  });

  const { user } = useAuth();
  const { loyaltyData } = useLoyaltyProgram();

  const handleDateSelect = (selectedDate: Date, availability: any) => {
    setFormData({ ...formData, date: format(selectedDate, 'yyyy-MM-dd') });
    setSelectedAvailability(availability);
    setShowAvailabilityCalendar(false);
  };

  const calculateFinalPrice = () => {
    if (!selectedAvailability) return 0;
    
    const basePrice = selectedAvailability.dynamicPrice * parseInt(formData.guests);
    const loyaltyDiscount = loyaltyData ? basePrice * loyaltyData.cashbackRate : 0;
    return Math.max(0, basePrice - loyaltyDiscount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalPrice = calculateFinalPrice();
      
      const reservationData = {
        business_id: businessId,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        special_requests: formData.specialRequests || null,
        total_amount: finalPrice,
        status: 'pending',
        ...(user ? {
          user_id: user.id
        } : {
          guest_name: formData.guestName,
          guest_email: formData.guestEmail,
          guest_phone: formData.guestPhone
        })
      };

      const { error } = await supabase
        .from('reservations')
        .insert([reservationData]);

      if (error) throw error;

      toast({
        title: "Reserva realizada!",
        description: `Sua reserva no ${businessName} foi enviada com sucesso. Total: AOA ${finalPrice.toLocaleString()}`,
      });

      onOpenChange(false);
      setFormData({
        date: '',
        time: '',
        guests: '2',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        specialRequests: ''
      });
      setSelectedAvailability(null);
    } catch (error: any) {
      toast({
        title: "Erro na reserva",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, "dd 'de' MMMM", { locale: ptBR })
      });
    }
    return dates;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Fazer Reserva</DialogTitle>
          <DialogDescription>
            Reserve sua mesa no {businessName} com preços dinâmicos e benefícios de fidelidade
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date Selection Section */}
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Selecionar Data e Horário
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data da Reserva</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAvailabilityCalendar(!showAvailabilityCalendar)}
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.date ? format(new Date(formData.date), "PPP", { locale: ptBR }) : "Verificar disponibilidade"}
                </Button>
                
                {showAvailabilityCalendar && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <AvailabilityCalendar
                      businessId={businessId}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                )}
                
                {selectedAvailability && formData.date && (
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3 border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status da Data:</span>
                      <Badge variant={selectedAvailability.available ? "default" : "destructive"}>
                        {selectedAvailability.available ? "Disponível" : "Lotado"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Ocupação:</span>
                      <span className="font-medium">{selectedAvailability.bookedSlots}/{selectedAvailability.totalSlots} mesas</span>
                    </div>
                    {selectedAvailability.dynamicPrice > selectedAvailability.basePrice && (
                      <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-2 rounded">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Preço dinâmico ativo - Alta demanda</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                      <SelectTrigger className="pl-10 h-12">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeSlots().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Número de Pessoas</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select value={formData.guests} onValueChange={(value) => setFormData({...formData, guests: value})}>
                      <SelectTrigger className="pl-10 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'pessoa' : 'pessoas'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information Section */}
          {!user && (
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações do Hóspede
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                      className="pl-10 h-12"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="guestEmail"
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                        className="pl-10 h-12"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestPhone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="guestPhone"
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                        className="pl-10 h-12"
                        placeholder="+244 123 456 789"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Special Requests Section */}
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">Pedidos Especiais</h3>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Observações (opcional)</Label>
              <Textarea
                id="specialRequests"
                placeholder="Ex: Aniversário, restrições alimentares, mesa na varanda..."
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Price Summary Section */}
          {selectedAvailability && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Resumo do Pagamento
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-muted">
                  <span className="text-muted-foreground">Preço base (por pessoa):</span>
                  <span className="font-medium">AOA {selectedAvailability.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-muted">
                  <span className="text-muted-foreground">Preço dinâmico atual:</span>
                  <span className="font-medium">AOA {selectedAvailability.dynamicPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-muted">
                  <span className="text-muted-foreground">Hóspedes ({formData.guests}):</span>
                  <span className="font-medium">AOA {(selectedAvailability.dynamicPrice * parseInt(formData.guests)).toLocaleString()}</span>
                </div>
                {loyaltyData && loyaltyData.cashbackRate > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-muted text-green-600">
                    <span>Desconto {loyaltyData.tier} ({(loyaltyData.cashbackRate * 100).toFixed(0)}%):</span>
                    <span className="font-medium">-AOA {((selectedAvailability.dynamicPrice * parseInt(formData.guests)) * loyaltyData.cashbackRate).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-primary/20">
                  <span className="text-lg font-semibold">Total Final:</span>
                  <span className="text-xl font-bold text-primary">AOA {calculateFinalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {!selectedAvailability?.available && selectedAvailability && (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Esta data está lotada. Você pode entrar na lista de espera.</span>
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedAvailability?.available || !formData.date || !formData.time}
              className="flex items-center gap-2 flex-1"
            >
              <CreditCard className="h-4 w-4" />
              {loading ? 'Processando...' : 'Reservar e Pagar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;