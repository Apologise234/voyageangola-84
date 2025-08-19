
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Calendar, TrendingUp, Users } from "lucide-react";
import ReservationModal from "@/components/ReservationModal";
import ReviewsSection from "@/components/ReviewsSection";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  openUntil: string;
  image: string;
  specialOffer?: string;
  availability?: 'high' | 'medium' | 'low' | 'full';
  isOpen: boolean;
}

const RestaurantCard = ({
  id,
  name,
  cuisine,
  rating,
  priceRange,
  distance,
  openUntil,
  image,
  specialOffer,
  isOpen,
  availability = 'medium',
}: RestaurantCardProps) => {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [realTimeAvailability, setRealTimeAvailability] = useState<string>('medium');
  const { user } = useAuth();

  useEffect(() => {
    // Simular verificação de disponibilidade em tempo real
    const checkAvailability = () => {
      const random = Math.random();
      if (random < 0.2) setRealTimeAvailability('full');
      else if (random < 0.4) setRealTimeAvailability('low');
      else if (random < 0.7) setRealTimeAvailability('medium');
      else setRealTimeAvailability('high');
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-orange-500';
      case 'full': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'high': return 'Alta Disponibilidade';
      case 'medium': return 'Disponibilidade Média';
      case 'low': return 'Poucas Vagas';
      case 'full': return 'Lotado';
      default: return 'Verificando...';
    }
  };

  const handleReservationClick = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para reservar no VOYAGEANGOLA",
        variant: "destructive",
        action: (
          <Button asChild variant="outline" size="sm">
            <a href="/auth">Fazer Login</a>
          </Button>
        ),
      });
      return;
    }
    setIsReservationModalOpen(true);
  };

  return (
    <>
      <Card className="restaurant-card cursor-pointer group">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {specialOffer && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {specialOffer}
            </Badge>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          </div>
          
          {/* Indicador de Disponibilidade */}
          <div className="absolute bottom-3 left-3">
            <div className={`flex items-center gap-1 ${getAvailabilityColor(realTimeAvailability)} text-white rounded-full px-2 py-1 text-xs font-medium`}>
              <div className={`w-2 h-2 ${getAvailabilityColor(realTimeAvailability)} rounded-full animate-pulse`}></div>
              <span>{getAvailabilityText(realTimeAvailability)}</span>
            </div>
          </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-muted-foreground text-sm">{cuisine}</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-sm font-semibold text-primary">{priceRange}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className={isOpen ? "text-green-600" : "text-red-600"}>
                {isOpen ? `Aberto até ${openUntil}` : "Fechado"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Disponibilidade:
              </span>
              <span className={`font-medium ${
                realTimeAvailability === 'high' ? 'text-green-600' :
                realTimeAvailability === 'medium' ? 'text-yellow-600' :
                realTimeAvailability === 'low' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {getAvailabilityText(realTimeAvailability)}
              </span>
            </div>
            
            <Button 
              onClick={handleReservationClick}
              className="w-full"
              disabled={!isOpen || realTimeAvailability === 'full'}
              variant={realTimeAvailability === 'full' ? 'outline' : 'default'}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {realTimeAvailability === 'full' ? 'Lista de Espera' : 'Reservar Mesa'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReservationModal
        open={isReservationModalOpen}
        onOpenChange={setIsReservationModalOpen}
        businessId={id}
        businessName={name}
      />
    </>
  );
};

export default RestaurantCard;
