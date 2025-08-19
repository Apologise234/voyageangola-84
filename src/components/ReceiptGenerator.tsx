
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, QrCode, FileText, Calendar, User, MapPin, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateModernReceiptPDF } from '@/utils/modernReceiptGenerator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceiptData {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerBI: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  reservationDetails: {
    type: string; // 'hotel' | 'restaurant' | 'experience'
    name: string;
    checkIn?: string;
    checkOut?: string;
    guests: number;
    location: string;
  };
  costs: {
    subtotal: number;
    taxes: number;
    fees: number;
    discounts: number;
    total: number;
  };
  paymentMethod: string;
  paymentDate: string;
  status: 'paid' | 'pending' | 'cancelled';
  qrCode?: string;
}

interface ReceiptGeneratorProps {
  receiptData: ReceiptData;
  onSaveReceipt?: (receiptData: ReceiptData) => void;
}

const ReceiptGenerator = ({ receiptData, onSaveReceipt }: ReceiptGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generateModernReceiptPDF(receiptData);
      
      // Salvar recibo no histórico do usuário
      if (onSaveReceipt) {
        onSaveReceipt(receiptData);
      }

      toast({
        title: "Recibo Gerado!",
        description: "O recibo em PDF foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Houve um erro ao gerar o recibo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const getReservationIcon = () => {
    switch (receiptData.reservationDetails.type) {
      case 'hotel':
        return <MapPin className="h-4 w-4" />;
      case 'restaurant':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Recibo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Recibo #{receiptData.receiptNumber}</CardTitle>
                <CardDescription>
                  Gerado em {format(new Date(receiptData.paymentDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </div>
            </div>
            <Badge variant={receiptData.status === 'paid' ? 'default' : 'secondary'}>
              {receiptData.status === 'paid' ? 'Pago' : 'Pendente'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Dados do Cliente */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados do Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <p className="font-medium">{receiptData.customerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">BI:</span>
                <p className="font-medium">{receiptData.customerBI}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{receiptData.customerEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Telefone:</span>
                <p className="font-medium">{receiptData.customerPhone}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Endereço:</span>
                <p className="font-medium">{receiptData.customerAddress}</p>
              </div>
            </div>
          </div>

          {/* Detalhes da Reserva */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              {getReservationIcon()}
              Detalhes da Reserva
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Serviço:</span>
                <p className="font-medium">{receiptData.reservationDetails.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Localização:</span>
                <p className="font-medium">{receiptData.reservationDetails.location}</p>
              </div>
              {receiptData.reservationDetails.checkIn && (
                <div>
                  <span className="text-muted-foreground">Check-in:</span>
                  <p className="font-medium">
                    {format(new Date(receiptData.reservationDetails.checkIn), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
              {receiptData.reservationDetails.checkOut && (
                <div>
                  <span className="text-muted-foreground">Check-out:</span>
                  <p className="font-medium">
                    {format(new Date(receiptData.reservationDetails.checkOut), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Pessoas:</span>
                <p className="font-medium">{receiptData.reservationDetails.guests}</p>
              </div>
            </div>
          </div>

          {/* Breakdown de Custos */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Resumo Financeiro
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>AOA {receiptData.costs.subtotal.toLocaleString('pt-AO')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxas e Impostos:</span>
                <span>AOA {receiptData.costs.taxes.toLocaleString('pt-AO')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxas de Serviço:</span>
                <span>AOA {receiptData.costs.fees.toLocaleString('pt-AO')}</span>
              </div>
              {receiptData.costs.discounts > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto:</span>
                  <span>-AOA {receiptData.costs.discounts.toLocaleString('pt-AO')}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total Pago:</span>
                <span>AOA {receiptData.costs.total.toLocaleString('pt-AO')}</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleGeneratePDF} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>Gerando...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePreview}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>

            <Button 
              variant="outline" 
              size="icon"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview do Recibo */}
      {isPreviewOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização do Recibo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white text-black p-8 rounded-lg border-2 border-dashed border-muted-foreground/20 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">Resort Paradise</h1>
                <p className="text-gray-600">Seu refúgio perfeito</p>
                <div className="w-24 h-24 mx-auto mt-4 bg-gray-200 rounded flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">RECIBO DE PAGAMENTO</h2>
                <p className="text-lg font-mono">#{receiptData.receiptNumber}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Cliente:</strong> {receiptData.customerName}<br/>
                    <strong>BI:</strong> {receiptData.customerBI}<br/>
                    <strong>Email:</strong> {receiptData.customerEmail}
                  </div>
                  <div>
                    <strong>Data:</strong> {format(new Date(receiptData.paymentDate), "dd/MM/yyyy", { locale: ptBR })}<br/>
                    <strong>Método:</strong> {receiptData.paymentMethod}<br/>
                    <strong>Status:</strong> <span className="text-green-600 font-bold">PAGO</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <strong>Serviço:</strong> {receiptData.reservationDetails.name}<br/>
                  <strong>Localização:</strong> {receiptData.reservationDetails.location}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>TOTAL PAGO:</span>
                    <span>AOA {receiptData.costs.total.toLocaleString('pt-AO')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReceiptGenerator;
