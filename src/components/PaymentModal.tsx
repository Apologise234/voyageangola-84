import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Building2, QrCode, Smartphone, Banknote } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationData: {
    id: string;
    total: number;
    description: string;
  };
  onPaymentSuccess: () => void;
}

const PaymentModal = ({ open, onOpenChange, reservationData, onPaymentSuccess }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card' | 'mobile' | 'multicaixa'>('multicaixa');
  const [formData, setFormData] = useState({
    bank: '',
    accountNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    mobileNumber: '',
    multicaixaReference: '',
    unitelPhone: '',
    iban: ''
  });

  const angolanBanks = [
    { id: 'bai', name: 'Banco Angolano de Investimentos (BAI)', code: '0040' },
    { id: 'bic', name: 'Banco BIC', code: '0006' },
    { id: 'bpc', name: 'Banco de Poupança e Crédito (BPC)', code: '0010' },
    { id: 'bfa', name: 'Banco de Fomento Angola (BFA)', code: '0007' },
    { id: 'standard', name: 'Standard Bank Angola', code: '0009' },
    { id: 'millennium', name: 'Millennium Atlântico', code: '0008' },
    { id: 'sol', name: 'Banco Sol', code: '0025' },
    { id: 'besa', name: 'Banco Espírito Santo Angola (BESA)', code: '0016' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Pagamento Processado!",
        description: "Seu pagamento foi processado com sucesso.",
      });

      onPaymentSuccess();
    } catch (error: any) {
      toast({
        title: "Erro no pagamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'multicaixa':
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Multicaixa Express</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                Pague com segurança usando Multicaixa Express
              </p>
              <div className="text-sm space-y-1">
                <p><strong>Entidade:</strong> 11604</p>
                <p><strong>Referência:</strong> 999 999 999</p>
                <p><strong>Valor:</strong> AOA {(reservationData.total * 825).toLocaleString('pt-AO')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="multicaixaReference">Referência Multicaixa (opcional)</Label>
              <Input
                id="multicaixaReference"
                value={formData.multicaixaReference}
                onChange={(e) => setFormData({...formData, multicaixaReference: e.target.value})}
                placeholder="Digite a referência se já pagou"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitelPhone">Telefone Unitel Money</Label>
              <Input
                id="unitelPhone"
                value={formData.unitelPhone}
                onChange={(e) => setFormData({...formData, unitelPhone: e.target.value})}
                placeholder="+244 912 345 678"
              />
              <p className="text-xs text-muted-foreground">
                Para pagamento via Unitel Money
              </p>
            </div>

            <div className="flex justify-center">
              <QrCode className="h-32 w-32 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              QR Code para Multicaixa Express
            </p>
          </div>
        );

      case 'transfer':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Banco</Label>
              <Select value={formData.bank} onValueChange={(value) => setFormData({...formData, bank: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu banco" />
                </SelectTrigger>
                <SelectContent>
                  {angolanBanks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name} ({bank.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Número da Conta</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                placeholder="Ex: 0000.0000.0000.0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN (opcional)</Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) => setFormData({...formData, iban: e.target.value})}
                placeholder="AO06 0040 0000 0012 3456 7890 1"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Dados para Transferência</h4>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p><strong>Beneficiário:</strong> Resort Paradise Ltd</p>
                <p><strong>IBAN:</strong> AO06 0040 0000 0012 3456 7890 1</p>
                <p><strong>Swift:</strong> BAIAAOLU</p>
                <p><strong>Valor:</strong> AOA {(reservationData.total * 825).toLocaleString('pt-AO')}</p>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Nome no Cartão</Label>
              <Input
                id="cardHolder"
                value={formData.cardHolder}
                onChange={(e) => setFormData({...formData, cardHolder: e.target.value})}
                placeholder="Nome conforme no cartão"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Validade</Label>
                <Input
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  placeholder="MM/AA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'mobile':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Número de Telemóvel</Label>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                placeholder="+244 912 345 678"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-center">
                <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Unitel Money</h5>
                <p className="text-xs text-blue-800 dark:text-blue-200">*144#</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg text-center">
                <h5 className="font-semibold text-green-900 dark:text-green-100 text-sm">BAI Directo</h5>
                <p className="text-xs text-green-800 dark:text-green-200">*177#</p>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Pagamento Móvel</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Você receberá um SMS com instruções para completar o pagamento via USSD ou app do banco.
              </p>
            </div>

            <div className="flex justify-center">
              <QrCode className="h-32 w-32 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Escaneie com o app do seu banco
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processando Pagamento</h3>
            <p className="text-muted-foreground">
              Aguarde enquanto processamos seu pagamento...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pagamento da Reserva</DialogTitle>
          <DialogDescription>
            {reservationData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total (BRL)</span>
                <span className="font-semibold">R$ {reservationData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="text-muted-foreground">Total (AOA)</span>
                <span className="text-lg font-bold text-primary">
                  AOA {(reservationData.total * 825).toLocaleString('pt-AO')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Métodos de Pagamento */}
          <div className="space-y-4">
            <Label>Método de Pagamento</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                type="button"
                variant={paymentMethod === 'multicaixa' ? 'default' : 'outline'}
                className="flex flex-col gap-2 h-16"
                onClick={() => setPaymentMethod('multicaixa')}
              >
                <Banknote className="h-4 w-4" />
                <span className="text-xs">Multicaixa</span>
              </Button>
              
              <Button
                type="button"
                variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                className="flex flex-col gap-2 h-16"
                onClick={() => setPaymentMethod('transfer')}
              >
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Transferência</span>
              </Button>
              
              <Button
                type="button"
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="flex flex-col gap-2 h-16"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-xs">Cartão</span>
              </Button>
              
              <Button
                type="button"
                variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
                className="flex flex-col gap-2 h-16"
                onClick={() => setPaymentMethod('mobile')}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-xs">Móvel</span>
              </Button>
            </div>
          </div>

          {/* Formulário de Pagamento */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderPaymentForm()}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Processando...' : `Pagar AOA ${(reservationData.total * 825).toLocaleString('pt-AO')}`}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;