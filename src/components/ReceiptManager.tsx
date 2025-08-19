
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { FileText, Plus, History, Download, TrendingUp } from 'lucide-react';
import ReceiptGenerator from './ReceiptGenerator';
import ReceiptHistory from './ReceiptHistory';

interface ReceiptData {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerBI: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  reservationDetails: {
    type: string;
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
}

const ReceiptManager = () => {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('history');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadReceipts();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const loadReceipts = async () => {
    setLoading(true);
    try {
      // Simular carregamento de recibos do Supabase
      // Em um cenário real, você faria uma query para buscar os recibos do usuário
      const mockReceipts: ReceiptData[] = [
        {
          id: '1',
          receiptNumber: 'REC-2024-001',
          customerName: 'João Silva Santos',
          customerBI: '004567890BA041',
          customerEmail: 'joao.silva@email.com',
          customerPhone: '+244 912 345 678',
          customerAddress: 'Rua da Liberdade, 123, Luanda',
          reservationDetails: {
            type: 'hotel',
            name: 'Suíte Premium Ocean View',
            checkIn: '2024-01-15',
            checkOut: '2024-01-18',
            guests: 2,
            location: 'Resort Paradise Luanda'
          },
          costs: {
            subtotal: 180000,
            taxes: 25200,
            fees: 10000,
            discounts: 0,
            total: 215200
          },
          paymentMethod: 'Transferência Bancária - BAI',
          paymentDate: '2024-01-10T14:30:00Z',
          status: 'paid'
        },
        {
          id: '2',
          receiptNumber: 'REC-2024-002',
          customerName: 'Maria Fernandes',
          customerBI: '005678901BA042',
          customerEmail: 'maria.fernandes@email.com',
          customerPhone: '+244 923 456 789',
          customerAddress: 'Av. 4 de Fevereiro, 456, Luanda',
          reservationDetails: {
            type: 'restaurant',
            name: 'Jantar Romântico - Restaurante Sunset',
            guests: 2,
            location: 'Resort Paradise Restaurant'
          },
          costs: {
            subtotal: 25000,
            taxes: 3500,
            fees: 2500,
            discounts: 5000,
            total: 26000
          },
          paymentMethod: 'Cartão de Crédito',
          paymentDate: '2024-01-12T19:45:00Z',
          status: 'paid'
        },
        {
          id: '3',
          receiptNumber: 'REC-2024-003',
          customerName: 'Carlos Mendes',
          customerBI: '006789012BA043',
          customerEmail: 'carlos.mendes@email.com',
          customerPhone: '+244 934 567 890',
          customerAddress: 'Bairro Maianga, Casa 789, Luanda',
          reservationDetails: {
            type: 'experience',
            name: 'Passeio de Barco ao Pôr do Sol',
            guests: 4,
            location: 'Marina do Resort Paradise'
          },
          costs: {
            subtotal: 40000,
            taxes: 5600,
            fees: 3000,
            discounts: 0,
            total: 48600
          },
          paymentMethod: 'Pagamento Móvel',
          paymentDate: '2024-01-14T16:20:00Z',
          status: 'pending'
        }
      ];

      setReceipts(mockReceipts);
    } catch (error) {
      toast({
        title: "Erro ao carregar recibos",
        description: "Não foi possível carregar o histórico de recibos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReceipt = async (receiptData: ReceiptData) => {
    try {
      // Em um cenário real, você salvaria no Supabase
      // await supabase.from('receipts').insert([receiptData]);
      
      setReceipts(prev => [receiptData, ...prev]);
      
      toast({
        title: "Recibo Salvo",
        description: "O recibo foi salvo no seu histórico com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o recibo no histórico.",
        variant: "destructive",
      });
    }
  };

  const stats = {
    total: receipts.length,
    paid: receipts.filter(r => r.status === 'paid').length,
    pending: receipts.filter(r => r.status === 'pending').length,
    totalValue: receipts
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.costs.total, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Recibos</h1>
          <p className="text-muted-foreground">
            Gerencie e gere recibos modernos para suas reservas
          </p>
        </div>
        
        <Button 
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Recibo
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total de Recibos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <div className="text-sm text-muted-foreground">Pagos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 text-sm font-bold">⏳</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">
              {(stats.totalValue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-muted-foreground">AOA Arrecadados</div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico de Recibos
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Gerar Novo Recibo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <ReceiptHistory
            receipts={receipts}
            onReceiptSelect={setSelectedReceipt}
          />
        </TabsContent>

        <TabsContent value="generator">
          {selectedReceipt ? (
            <ReceiptGenerator
              receiptData={selectedReceipt}
              onSaveReceipt={handleSaveReceipt}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecione um Recibo</h3>
                <p className="text-muted-foreground mb-4">
                  Escolha um recibo do histórico para visualizar ou regenerar o PDF.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('history')}
                >
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal/Preview do Recibo Selecionado */}
      {selectedReceipt && activeTab === 'generator' && (
        <ReceiptGenerator
          receiptData={selectedReceipt}
          onSaveReceipt={handleSaveReceipt}
        />
      )}
    </div>
  );
};

export default ReceiptManager;
