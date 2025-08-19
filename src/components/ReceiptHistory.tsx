
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  Filter, 
  Eye,
  SortAsc,
  SortDesc 
} from 'lucide-react';
import { format, parseISO, isWithinInterval, subDays, subMonths, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateModernReceiptPDF } from '@/utils/modernReceiptGenerator';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface ReceiptHistoryProps {
  receipts: ReceiptData[];
  onReceiptSelect?: (receipt: ReceiptData) => void;
}

const ReceiptHistory = ({ receipts, onReceiptSelect }: ReceiptHistoryProps) => {
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptData[]>(receipts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    let filtered = [...receipts];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(receipt =>
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.reservationDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(receipt => receipt.status === statusFilter);
    }

    // Filtro por data
    if (dateFilter !== 'all') {
      const now = new Date();
      let dateRange: { start: Date; end: Date };

      switch (dateFilter) {
        case 'week':
          dateRange = { start: subDays(now, 7), end: now };
          break;
        case 'month':
          dateRange = { start: subMonths(now, 1), end: now };
          break;
        case 'quarter':
          dateRange = { start: subMonths(now, 3), end: now };
          break;
        case 'year':
          dateRange = { start: subYears(now, 1), end: now };
          break;
        default:
          dateRange = { start: new Date(0), end: now };
      }

      filtered = filtered.filter(receipt =>
        isWithinInterval(parseISO(receipt.paymentDate), dateRange)
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      const dateA = new Date(a.paymentDate);
      const dateB = new Date(b.paymentDate);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    setFilteredReceipts(filtered);
  }, [receipts, searchTerm, statusFilter, dateFilter, sortOrder]);

  const handleDownloadReceipt = async (receipt: ReceiptData) => {
    setIsDownloading(receipt.id);
    try {
      await generateModernReceiptPDF(receipt);
      toast({
        title: "Download Concluído",
        description: `Recibo ${receipt.receiptNumber} foi baixado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no Download",
        description: "Houve um problema ao gerar o PDF.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pago</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return '🏨';
      case 'restaurant':
        return '🍽️';
      case 'experience':
        return '🎯';
      default:
        return '📋';
    }
  };

  const totalValue = filteredReceipts
    .filter(r => r.status === 'paid')
    .reduce((sum, receipt) => sum + receipt.costs.total, 0);

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histórico de Recibos
              </CardTitle>
              <CardDescription>
                Gerencie e baixe seus recibos de pagamento
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {filteredReceipts.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Recibos encontrados
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                AOA {totalValue.toLocaleString('pt-AO')}
              </div>
              <div className="text-sm text-muted-foreground">Total Arrecadado</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {filteredReceipts.filter(r => r.status === 'paid').length}
              </div>
              <div className="text-sm text-muted-foreground">Pagamentos Confirmados</div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                {filteredReceipts.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pagamentos Pendentes</div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="quarter">Último Trimestre</SelectItem>
                <SelectItem value="year">Último Ano</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Recibos */}
      <div className="space-y-4">
        {filteredReceipts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum recibo encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou termos de busca.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReceipts.map((receipt) => (
            <Card key={receipt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{getServiceIcon(receipt.reservationDetails.type)}</div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Recibo #{receipt.receiptNumber}
                        </h3>
                        <p className="text-muted-foreground">
                          {receipt.customerName} • {receipt.reservationDetails.name}
                        </p>
                      </div>
                      {getStatusBadge(receipt.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Data:</span>
                        <p className="font-medium">
                          {format(parseISO(receipt.paymentDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <p className="font-bold text-primary">
                          AOA {receipt.costs.total.toLocaleString('pt-AO')}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pagamento:</span>
                        <p className="font-medium">{receipt.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReceiptSelect?.(receipt)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(receipt)}
                      disabled={isDownloading === receipt.id}
                    >
                      {isDownloading === receipt.id ? (
                        <>Baixando...</>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReceiptHistory;
