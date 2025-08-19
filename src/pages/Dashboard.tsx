import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, MapPin, FileText, Download, Star, User2, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

interface Reservation {
  id: string;
  businessName: string;
  type: 'restaurant' | 'hotel' | 'experience';
  date: string;
  time?: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  location: string;
  total?: number;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  businessName: string;
  date: string;
  total: number;
  status: 'paid' | 'pending';
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, loading, navigate]);

  const loadUserData = async () => {
    // Simular dados do usuário
    setUserProfile({
      fullName: user?.user_metadata?.full_name || 'Usuário',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      bi: user?.user_metadata?.bi || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
    });

    // Simular reservas
    const mockReservations: Reservation[] = [
      {
        id: '1',
        businessName: 'Restaurante Sunset',
        type: 'restaurant',
        date: '2024-02-15',
        time: '19:30',
        guests: 2,
        status: 'confirmed',
        location: 'Luanda Bay',
        total: 26000
      },
      {
        id: '2',
        businessName: 'Hotel Paradise',
        type: 'hotel',
        date: '2024-02-20',
        guests: 2,
        status: 'pending',
        location: 'Mussulo Island',
        total: 215200
      }
    ];

    // Simular recibos
    const mockReceipts: Receipt[] = [
      {
        id: '1',
        receiptNumber: 'REC-2024-001',
        businessName: 'Restaurante Sunset',
        date: '2024-01-15',
        total: 26000,
        status: 'paid'
      }
    ];

    setReservations(mockReservations);
    setReceipts(mockReceipts);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      case 'paid': return 'Pago';
      default: return status;
    }
  };

  const downloadReceipt = (receiptId: string) => {
    toast({
      title: "Download iniciado",
      description: "O recibo está sendo baixado...",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
              <User2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Bem-vindo, {userProfile?.fullName}</h1>
              <p className="text-muted-foreground">Gerencie suas reservas e recibos</p>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{reservations.length}</div>
                <div className="text-sm text-muted-foreground">Reservas</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmadas</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{receipts.length}</div>
                <div className="text-sm text-muted-foreground">Recibos</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(receipts.reduce((sum, r) => sum + r.total, 0) / 1000)}K
                </div>
                <div className="text-sm text-muted-foreground">AOA Gastos</div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <Tabs defaultValue="reservations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Minhas Reservas
              </TabsTrigger>
              <TabsTrigger value="receipts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Meus Recibos
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservations" className="space-y-4">
              <div className="grid gap-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{reservation.businessName}</h3>
                          <p className="text-sm text-muted-foreground">{reservation.location}</p>
                        </div>
                        <Badge className={getStatusColor(reservation.status)}>
                          {getStatusText(reservation.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {reservation.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}</span>
                        </div>
                        {reservation.total && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">AOA {reservation.total.toLocaleString('pt-AO')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="receipts" className="space-y-4">
              <div className="grid gap-4">
                {receipts.map((receipt) => (
                  <Card key={receipt.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{receipt.receiptNumber}</h3>
                          <p className="text-sm text-muted-foreground">{receipt.businessName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(receipt.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold">AOA {receipt.total.toLocaleString('pt-AO')}</div>
                            <Badge className={getStatusColor(receipt.status)}>
                              {getStatusText(receipt.status)}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadReceipt(receipt.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Seus dados cadastrais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Completo</label>
                      <p className="text-sm text-muted-foreground">{userProfile?.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">BI (Bilhete de Identidade)</label>
                      <p className="text-sm text-muted-foreground">{userProfile?.bi || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefone</label>
                      <p className="text-sm text-muted-foreground">{userProfile?.phone || 'Não informado'}</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;