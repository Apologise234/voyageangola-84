import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Utensils, 
  Users, 
  Calendar,
  Search,
  Heart,
  Bed
} from "lucide-react";

interface HotelsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HotelsModal = ({ open, onOpenChange }: HotelsModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const hotels = [
    {
      id: "1",
      name: "Hotel Presidente Luanda",
      location: "Luanda, Ingombota",
      rating: 4.8,
      price: "45.000 Kz",
      category: "luxo",
      image: "/api/placeholder/300/200",
      amenities: ["Wi-Fi", "Piscina", "Restaurante", "Estacionamento"],
      description: "Hotel de luxo no coração de Luanda com vista para a baía"
    },
    {
      id: "2", 
      name: "Pousada Miradouro da Lua",
      location: "Belas, Luanda",
      rating: 4.5,
      price: "28.000 Kz",
      category: "boutique",
      image: "/api/placeholder/300/200",
      amenities: ["Vista Panorâmica", "Ar Condicionado", "Wi-Fi"],
      description: "Pousada única com vista para as formações rochosas"
    },
    {
      id: "3",
      name: "Hotel Baía de Lobito",
      location: "Lobito, Benguela", 
      rating: 4.6,
      price: "38.000 Kz",
      category: "praia",
      image: "/api/placeholder/300/200",
      amenities: ["Praia Privada", "Spa", "Piscina", "Restaurante"],
      description: "Resort à beira-mar com acesso direto à praia"
    },
    {
      id: "4",
      name: "Lodge Serra da Leba",
      location: "Huíla", 
      rating: 4.7,
      price: "32.000 Kz",
      category: "natureza",
      image: "/api/placeholder/300/200",
      amenities: ["Trilhas", "Vista Montanha", "Fogueira"],
      description: "Experiência única na natureza angolana"
    },
    {
      id: "5",
      name: "Hotel Económico Luanda",
      location: "Luanda, Viana",
      rating: 4.0,
      price: "15.000 Kz", 
      category: "economico",
      image: "/api/placeholder/300/200",
      amenities: ["Wi-Fi", "Ar Condicionado", "Café da Manhã"],
      description: "Opção confortável e acessível"
    },
    {
      id: "6",
      name: "Resort Cabo Ledo",
      location: "Cabo Ledo, Bengo",
      rating: 4.9,
      price: "55.000 Kz",
      category: "luxo",
      image: "/api/placeholder/300/200", 
      amenities: ["Praia Privada", "Spa", "Golf", "Marina"],
      description: "Resort de luxo com campo de golf e marina"
    }
  ];

  const categories = [
    { id: "todos", name: "Todos", count: hotels.length },
    { id: "luxo", name: "Luxo", count: hotels.filter(h => h.category === "luxo").length },
    { id: "praia", name: "Praia", count: hotels.filter(h => h.category === "praia").length },
    { id: "boutique", name: "Boutique", count: hotels.filter(h => h.category === "boutique").length },
    { id: "natureza", name: "Natureza", count: hotels.filter(h => h.category === "natureza").length },
    { id: "economico", name: "Econômico", count: hotels.filter(h => h.category === "economico").length }
  ];

  const filteredHotels = hotels.filter(hotel => {
    const matchesCategory = selectedCategory === "todos" || hotel.category === selectedCategory;
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (hotelId: string) => {
    setFavorites(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bed className="h-6 w-6 text-primary" />
            Hotéis em Angola
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar hotéis por nome ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="overflow-y-auto max-h-[60vh]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredHotels.map((hotel) => (
                  <Card key={hotel.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg"></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={() => toggleFavorite(hotel.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${favorites.includes(hotel.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                        />
                      </Button>
                      <Badge className="absolute bottom-2 left-2 bg-white/90 text-foreground">
                        {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="truncate">{hotel.name}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{hotel.rating}</span>
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {hotel.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hotel.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">{hotel.price}</span>
                          <span className="text-sm text-muted-foreground">/noite</span>
                        </div>
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Reservar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredHotels.length === 0 && (
                <div className="text-center py-12">
                  <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Nenhum hotel encontrado
                  </p>
                  <p className="text-muted-foreground">
                    Tente ajustar seus filtros ou termo de busca
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelsModal;