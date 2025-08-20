import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Star, Clock, Camera, Mountain, Waves, Building, Landmark } from "lucide-react";

interface AttractionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AttractionsModal = ({ open, onOpenChange }: AttractionsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Todos", icon: Landmark },
    { id: "natureza", name: "Natureza", icon: Mountain },
    { id: "praias", name: "Praias", icon: Waves },
    { id: "cultura", name: "Cultura", icon: Building },
    { id: "aventura", name: "Aventura", icon: Camera }
  ];

  const attractions = [
    {
      id: 1,
      name: "Fortaleza de São Miguel",
      category: "cultura",
      location: "Luanda",
      rating: 4.8,
      duration: "2-3 horas",
      price: "Gratuito",
      image: "/placeholder.svg",
      description: "Fortaleza histórica com vista para a Baía de Luanda",
      highlights: ["Museu Nacional", "Vista panorâmica", "Arquitetura colonial"]
    },
    {
      id: 2,
      name: "Cataratas de Kalandula",
      category: "natureza",
      location: "Malanje",
      rating: 4.9,
      duration: "Dia inteiro",
      price: "15.000 Kz",
      image: "/placeholder.svg",
      description: "Uma das maiores quedas d'água da África",
      highlights: ["105m de altura", "Trilhas ecológicas", "Fotografia"]
    },
    {
      id: 3,
      name: "Praia de Mussulo",
      category: "praias",
      location: "Luanda",
      rating: 4.7,
      duration: "Dia inteiro",
      price: "8.000 Kz",
      image: "/placeholder.svg",
      description: "Península paradisíaca com águas cristalinas",
      highlights: ["Esportes aquáticos", "Restaurantes", "Resort"]
    },
    {
      id: 4,
      name: "Serra da Leba",
      category: "aventura",
      location: "Huíla",
      rating: 4.6,
      duration: "Meio dia",
      price: "12.000 Kz",
      image: "/placeholder.svg",
      description: "Curvas espetaculares na estrada da montanha",
      highlights: ["Vista panorâmica", "Trilhas", "Clima ameno"]
    },
    {
      id: 5,
      name: "Museu da Escravatura",
      category: "cultura",
      location: "Luanda",
      rating: 4.5,
      duration: "1-2 horas",
      price: "5.000 Kz",
      image: "/placeholder.svg",
      description: "Memorial histórico importante",
      highlights: ["História de Angola", "Exposições", "Educativo"]
    },
    {
      id: 6,
      name: "Parque Nacional da Kissama",
      category: "natureza",
      location: "Kissama",
      rating: 4.8,
      duration: "Dia inteiro",
      price: "25.000 Kz",
      image: "/placeholder.svg",
      description: "Safari africano com vida selvagem diversa",
      highlights: ["Elefantes", "Safari", "Observação de aves"]
    }
  ];

  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attraction.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Atrações Turísticas de Angola
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar atrações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAttractions.map((attraction) => (
                  <Card key={attraction.id} className="restaurant-card">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-muted to-accent rounded-t-lg"></div>
                      <Badge className="absolute top-3 right-3 bg-primary">
                        {attraction.price}
                      </Badge>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{attraction.rating}</span>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg">{attraction.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{attraction.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{attraction.duration}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {attraction.description}
                      </p>
                      
                      <div className="mb-4">
                        {attraction.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2 text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredAttractions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma atração encontrada.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttractionsModal;