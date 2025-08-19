import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Calendar, Users, Phone, Mail, User, CreditCard, MapPin, Bed } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PaymentModal from './PaymentModal';
import { generateReservationPDF } from '@/utils/pdfGenerator';

interface Room {
  id: string;
  name: string;
  type: string;
  price: string;
  guests: number;
  size: string;
  amenities: string[];
}

interface ResortReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
}

const formSchema = z.object({
  checkIn: z.string().min(1, "Data de check-in é obrigatória"),
  checkOut: z.string().min(1, "Data de check-out é obrigatória"),
  guests: z.string().min(1, "Número de hóspedes é obrigatório"),
  guestName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  guestEmail: z.string().email("Email inválido"),
  guestPhone: z.string().min(8, "Telefone deve ter pelo menos 8 dígitos"),
  guestBI: z.string().min(8, "BI deve ter pelo menos 8 caracteres").max(15, "BI inválido"),
  guestAddress: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  guestCity: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  emergencyContact: z.string().min(2, "Nome do contato de emergência é obrigatório"),
  emergencyPhone: z.string().min(8, "Telefone de emergência deve ter pelo menos 8 dígitos"),
  specialRequests: z.string().optional()
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  }
  return true;
}, {
  message: "Data de check-out deve ser posterior ao check-in",
  path: ["checkOut"]
});

type FormData = z.infer<typeof formSchema>;

const ResortReservationModal = ({ open, onOpenChange, room }: ResortReservationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reservationStatus, setReservationStatus] = useState<'form' | 'processing' | 'payment' | 'completed'>('form');
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkIn: '',
      checkOut: '',
      guests: '2',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestBI: '',
      guestAddress: '',
      guestCity: '',
      specialRequests: '',
      emergencyContact: '',
      emergencyPhone: ''
    }
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  const calculateNights = () => {
    const formValues = form.getValues();
    if (!formValues.checkIn || !formValues.checkOut) return 0;
    const checkIn = new Date(formValues.checkIn);
    const checkOut = new Date(formValues.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = parseFloat(room?.price?.replace('R$ ', '').replace(',', '.') || '0');
    return nights * pricePerNight;
  };

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    setReservationStatus('processing');

    try {
      const reservationData = {
        business_id: '00000000-0000-0000-0000-000000000001',
        date: data.checkIn,
        time: '15:00',
        guests: parseInt(data.guests),
        special_requests: `
Check-in: ${format(new Date(data.checkIn), "dd/MM/yyyy", { locale: ptBR })}
Check-out: ${format(new Date(data.checkOut), "dd/MM/yyyy", { locale: ptBR })}
Quarto: ${room?.name}
Tipo: ${room?.type}
Endereço: ${data.guestAddress}, ${data.guestCity}
BI: ${data.guestBI}
Contato de emergência: ${data.emergencyContact} - ${data.emergencyPhone}
Observações: ${data.specialRequests || ''}
        `.trim(),
        total_amount: calculateTotal(),
        ...(user ? {
          user_id: user.id
        } : {
          guest_name: data.guestName,
          guest_email: data.guestEmail,
          guest_phone: data.guestPhone
        })
      };

      const { data: reservationResult, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select()
        .single();

      if (error) throw error;

      setReservationId(reservationResult.id);
      
      setTimeout(() => {
        setReservationStatus('payment');
        setShowPayment(true);
        toast({
          title: "Reserva Processada!",
          description: "Sua reserva foi processada. Agora proceda com o pagamento.",
        });
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Erro na reserva",
        description: error.message,
        variant: "destructive",
      });
      setReservationStatus('form');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setReservationStatus('completed');
    setShowPayment(false);
    
    const formValues = form.getValues();
    
    // Criar dados do recibo moderno
    const receiptData = {
      id: reservationId || 'RES-' + Date.now(),
      receiptNumber: `REC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      customerName: formValues.guestName,
      customerBI: formValues.guestBI,
      customerEmail: formValues.guestEmail,
      customerPhone: formValues.guestPhone,
      customerAddress: `${formValues.guestAddress}, ${formValues.guestCity}`,
      reservationDetails: {
        type: 'hotel',
        name: room?.name || '',
        checkIn: formValues.checkIn,
        checkOut: formValues.checkOut,
        guests: parseInt(formValues.guests),
        location: 'Resort Paradise Luanda'
      },
      costs: {
        subtotal: Math.round(calculateTotal() * 0.85),
        taxes: Math.round(calculateTotal() * 0.14),
        fees: Math.round(calculateTotal() * 0.01),
        discounts: 0,
        total: calculateTotal()
      },
      paymentMethod: 'Pagamento Digital',
      paymentDate: new Date().toISOString(),
      status: 'paid' as const,
      qrCode: `RES-${reservationId?.substring(0, 8).toUpperCase()}`
    };
    
    // Usar o novo gerador de PDF moderno
    import('@/utils/modernReceiptGenerator').then(({ generateModernReceiptPDF }) => {
      generateModernReceiptPDF(receiptData);
    });
    
    toast({
      title: "Reserva Confirmada!",
      description: "Sua reserva foi confirmada com sucesso. O recibo moderno foi baixado automaticamente.",
    });

    setTimeout(() => {
      onOpenChange(false);
      setReservationStatus('form');
      form.reset();
    }, 2000);
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 365; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, "dd 'de' MMMM", { locale: ptBR })
      });
    }
    return dates;
  };

  const watchedValues = form.watch();

  if (reservationStatus === 'processing') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processando Reserva</h3>
            <p className="text-muted-foreground">
              Estamos verificando a disponibilidade e processando sua reserva...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (reservationStatus === 'completed') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-600">Reserva Confirmada!</h3>
            <p className="text-muted-foreground">
              Sua reserva foi confirmada com sucesso. O comprovante PDF foi baixado.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Reservar {room?.name}
            </DialogTitle>
            <DialogDescription>
              {room?.type} • {room?.size} • Até {room?.guests} pessoas
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in</FormLabel>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Data de entrada" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {generateDateOptions().map((date) => (
                              <SelectItem key={date.value} value={date.value}>
                                {date.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out</FormLabel>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Data de saída" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {generateDateOptions().map((date) => (
                              <SelectItem key={date.value} value={date.value}>
                                {date.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hóspedes */}
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Hóspedes</FormLabel>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="pl-10">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({length: room?.guests || 4}, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'pessoa' : 'pessoas'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!user && (
                <>
                  {/* Dados Pessoais */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input {...field} className="pl-10" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestBI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BI</FormLabel>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input {...field} className="pl-10" placeholder="000000000LA000" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="guestEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input {...field} type="email" className="pl-10" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input {...field} type="tel" className="pl-10" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Endereço */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="guestAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                                <Input {...field} className="pl-10" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="guestCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contato de Emergência */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contato de Emergência</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome do contato" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone de Emergência</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Observações */}
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Especiais (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ex: Cama extra, berço, aniversário, restrições alimentares..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resumo */}
              {watchedValues.checkIn && watchedValues.checkOut && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Resumo da Reserva</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Quarto:</strong> {room?.name}</p>
                    <p><strong>Período:</strong> {calculateNights()} noites</p>
                    <p><strong>Valor por noite:</strong> {room?.price}</p>
                    <p className="text-lg font-bold text-primary">
                      <strong>Total: R$ {calculateTotal().toFixed(2).replace('.', ',')}</strong>
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || !watchedValues.checkIn || !watchedValues.checkOut}>
                  {loading ? 'Processando...' : 'Confirmar Reserva'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        reservationData={{
          id: reservationId || '',
          total: calculateTotal(),
          description: `Reserva ${room?.name} - ${calculateNights()} noites`
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default ResortReservationModal;
