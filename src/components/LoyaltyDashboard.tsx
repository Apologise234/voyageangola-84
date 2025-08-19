import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, Gift, TrendingUp, Star, Zap } from 'lucide-react';
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';

const LoyaltyDashboard = () => {
  const { loyaltyData, loading } = useLoyaltyProgram();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Faça sua primeira reserva para ativar o programa de fidelidade!</p>
        </CardContent>
      </Card>
    );
  }

  const getTierColor = (tier: string) => {
    const colors = {
      Bronze: 'bg-yellow-600',
      Prata: 'bg-gray-400',
      Ouro: 'bg-yellow-500',
      Diamante: 'bg-blue-600'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-400';
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Diamante': return <Crown className="h-5 w-5" />;
      case 'Ouro': return <Star className="h-5 w-5" />;
      case 'Prata': return <Zap className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  const progressToNextTier = loyaltyData.nextTierPoints > 0 
    ? ((loyaltyData.points / (loyaltyData.points + loyaltyData.nextTierPoints)) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Main Loyalty Card */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 opacity-10 ${getTierColor(loyaltyData.tier)}`}></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getTierIcon(loyaltyData.tier)}
              Programa VOYAGEANGOLA Elite
            </CardTitle>
            <Badge 
              variant="secondary" 
              className={`${getTierColor(loyaltyData.tier)} text-white`}
            >
              {loyaltyData.tier}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Pontos Totais</p>
              <p className="text-2xl font-bold">{loyaltyData.points.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gasto Total</p>
              <p className="text-2xl font-bold">AOA {loyaltyData.totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {loyaltyData.nextTierPoints > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Próximo nível: {loyaltyData.nextTierPoints} pontos</span>
                <span>{progressToNextTier.toFixed(0)}%</span>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">
              Cashback atual: {(loyaltyData.cashbackRate * 100).toFixed(0)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Benefícios Exclusivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loyaltyData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Gift className="h-4 w-4 mr-2" />
            Resgatar Pontos
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            Histórico de Pontos
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Crown className="h-4 w-4 mr-2" />
            Programa Amigo Angolano
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyDashboard;