import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, Clock, Users, MapPin, Plane, Calendar,
  Mountain, Waves, Camera, Utensils, Bed, Car 
} from "lucide-react";

interface TravelPackagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TravelPackagesModal = ({ open, onOpenChange }: TravelPackagesModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const packages = [
    {
      id: 1,
      name: "Angola Clássica - 7 Dias",
      category: "cultural",
      duration: "7 dias / 6 noites",
      price: "850.000 Kz",
      originalPrice: "950.000 Kz",
      rating: 4.8,
      reviews: 124,
      destinations: ["Luanda", "Benguela", "Lobito"],
      highlights: ["Fortaleza São Miguel", "Centro histórico", "Praias paradisíacas"],
      includes: ["Voos domésticos", "Hotéis 4★", "Todas as refeições", "Guia especializado"],
      image: "/placeholder.svg",
      difficulty: "Fácil",
      groupSize: "2-15 pessoas"
    },
    {
      id: 2,
      name: "Safari & Aventura - 10 Dias",
      category: "aventura",
      duration: "10 dias / 9 noites",
      price: "1.250.000 Kz",
      originalPrice: "1.400.000 Kz",
      rating: 4.9,
      reviews: 89,
      destinations: ["Kissama", "Huíla", "Namibe"],
      highlights: ["Safari no Kissama", "Serra da Leba", "Deserto do Namibe"],
      includes: ["Transporte 4x4", "Acampamentos", "Guias especializados", "Equipamentos"],
      image: "/placeholder.svg",
      difficulty: "Moderado",
      groupSize: "4-12 pessoas"
    },
    {
      id: 3,
      name: "Costa Angolana - 5 Dias",
      category: "praia",
      duration: "5 dias / 4 noites",
      price: "485.000 Kz",
      originalPrice: "550.000 Kz",
      rating: 4.7,
      reviews: 156,
      destinations: ["Mussulo", "Cabo Ledo", "Lobito"],
      highlights: ["Praias virgem", "Esportes aquáticos", "Gastronomia local"],
      includes: ["Resort beachfront", "Atividades aquáticas", "Transfer", "Café da manhã"],
      image: "/placeholder.svg",
      difficulty: "Fácil",
      groupSize: "2-20 pessoas"
    },
    {
      id: 4,
      name: "Descobrindo Angola - 14 Dias",
      category: "completo",
      duration: "14 dias / 13 noites",
      price: "1.850.000 Kz",
      originalPrice: "2.100.000 Kz",
      rating: 4.9,
      reviews: 67,
      destinations: ["Luanda", "Huambo", "Malanje", "Benguela", "Huíla"],
      highlights: ["Cataratas Kalandula", "Planalto Central", "Cultura local", "Paisagens únicas"],
      includes: ["Todos os transportes", "Hotéis selecionados", "Pensão completa", "Seguro viagem"],
      image: "/placeholder.svg",
      difficulty: "Moderado",
      groupSize: "6-16 pessoas"
    },
    {
      id: 5,
      name: "Angola Gastronômica - 6 Dias",
      category: "gastronomia",
      duration: "6 dias / 5 noites",
      price: "625.000 Kz",
      originalPrice: "695.000 Kz",
      rating: 4.6,
      reviews: 98,
      destinations: ["Luanda", "Benguela", "Huambo"],
      highlights: ["Aulas de culinária", "Mercados locais", "Degustações", "Chefs renomados"],
      includes: ["Workshops culinários", "Hotéis boutique", "Experiências gastronômicas", "Receitas"],
      image: "/placeholder.svg",
      difficulty: "Fácil",
      groupSize: "4-12 pessoas"
    },
    {
      id: 6,
      name: "Ecoturismo Angola - 8 Dias",
      category: "natureza",
      duration: "8 dias / 7 noites",
      price: "945.000 Kz",
      originalPrice: "1.050.000 Kz",
      rating: 4.8,
      reviews: 73,
      destinations: ["Kissama", "Malanje", "Uíge"],
      highlights: ["Observação de aves", "Trilhas ecológicas", "Vida selvagem", "Sustentabilidade"],
      includes: ["Eco-lodges", "Guias naturalistas", "Equipamentos", "Contribuição conservação"],
      image: "/placeholder.svg",
      difficulty: "Moderado",
      groupSize: "4-10 pessoas"
    }
  ];

  const categories = [
    { id: "all", name: "Todos", icon: MapPin },
    { id: "cultural", name: "Cultural", icon: Mountain },
    { id: "aventura", name: "Aventura", icon: Camera },
    { id: "praia", name: "Praia", icon: Waves },
    { id: "gastronomia", name: "Gastronomia", icon: Utensils },
    { id: "natureza", name: "Natureza", icon: Mountain },
    { id: "completo", name: "Completo", icon: Star }
  ];

  const filteredPackages = selectedCategory === "all" 
    ? packages 
    : packages.filter(pkg => pkg.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-500";
      case "Moderado": return "bg-yellow-500";
      case "Difícil": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Pacotes de Viagem Angola
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-7">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <category.icon className="h-4 w-4" />
                <span className="hidden md:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="restaurant-card overflow-hidden">
                  <div className="relative">
                    <div className="h-64 bg-gradient-to-br from-muted to-accent"></div>
                    <Badge className="absolute top-3 left-3 bg-red-500">
                      Desconto {Math.round((1 - parseInt(pkg.price.replace(/[^\d]/g, '')) / parseInt(pkg.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
                    </Badge>
                    <Badge className={`absolute top-3 right-3 ${getDifficultyColor(pkg.difficulty)}`}>
                      {pkg.difficulty}
                    </Badge>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                      <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{pkg.groupSize}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {pkg.destinations.map((destination, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {destination}
                        </Badge>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Destaques:</h4>
                      <div className="flex flex-wrap gap-1">
                        {pkg.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Inclui:</h4>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        {pkg.includes.map((item, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                            <span className="text-xs">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground line-through">{pkg.originalPrice}</p>
                        <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                        <p className="text-xs text-muted-foreground">por pessoa</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button>
                          Reservar Agora
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredPackages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum pacote encontrado nesta categoria.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TravelPackagesModal;