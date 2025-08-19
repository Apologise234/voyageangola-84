import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Star, Clock } from "lucide-react";

interface NearbyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const nearbyPlaces = [
  {
    id: 1,
    name: "Restaurante Zambeze",
    type: "Restaurante",
    distance: "0.2 km",
    rating: 4.8,
    time: "15 min",
    image: "/api/placeholder/100/100",
    cuisine: "Angolana"
  },
  {
    id: 2,
    name: "Café da Marginal",
    type: "Café",
    distance: "0.5 km",
    rating: 4.6,
    time: "8 min",
    image: "/api/placeholder/100/100",
    cuisine: "Café"
  },
  {
    id: 3,
    name: "Hotel Tropico",
    type: "Resort",
    distance: "1.2 km",
    rating: 4.9,
    time: "20 min",
    image: "/api/placeholder/100/100",
    cuisine: "Resort"
  },
  {
    id: 4,
    name: "Mercado dos Kwanzas",
    type: "Mercado",
    distance: "0.8 km",
    rating: 4.3,
    time: "12 min",
    image: "/api/placeholder/100/100",
    cuisine: "Tradicional"
  }
];

const NearbyModal = ({ open, onOpenChange }: NearbyModalProps) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    setIsLocating(true);
    // Simular busca por localização
    setTimeout(() => {
      setIsLocating(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Lugares próximos a você
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleLocateMe}
              disabled={isLocating}
              className="flex-1"
              variant="default"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isLocating ? "Localizando..." : "Usar minha localização"}
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {nearbyPlaces.map((place) => (
              <Card key={place.id} className="hover:shadow-md transition-all duration-200 hover-scale">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{place.name}</h3>
                        <Badge variant="secondary">{place.distance}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {place.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {place.time}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {place.cuisine}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{place.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NearbyModal;