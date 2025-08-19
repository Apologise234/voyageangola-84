import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Star, Users, Wifi, Car, Utensils, Waves, Camera, Play, Clock, Phone } from "lucide-react";
import ResortReservationModal from "@/components/ResortReservationModal";
import resortHeroImage from "@/assets/resort-angolan-hero.jpg";

const Resort = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedRoomData, setSelectedRoomData] = useState<any>(null);

  const rooms = [
    {
      id: "1",
      name: "Suite Presidencial",
      type: "Suite Luxo",
      price: "85.000 Kz",
      guests: 4,
      size: "85m²",
      amenities: ["Vista para o mar", "Banheira de hidromassagem", "Varanda privativa"],
      images: 8,
      available: true
    },
    {
      id: "2", 
      name: "Quarto Família",
      type: "Apartamento",
      price: "42.000 Kz",
      guests: 6,
      size: "65m²",
      amenities: ["Cozinha completa", "Sala de estar", "2 quartos"],
      images: 12,
      available: true
    },
    {
      id: "3",
      name: "Chalé Romântico", 
      type: "Chalé",
      price: "68.000 Kz",
      guests: 2,
      size: "45m²",
      amenities: ["Lareira", "Deck privativo", "Vista para a montanha"],
      images: 6,
      available: false
    }
  ];

  const facilities = [
    { icon: Waves, name: "Piscina Aquecida", description: "3 piscinas com diferentes temperaturas" },
    { icon: Utensils, name: "Restaurante Gourmet", description: "Culinária internacional e local" },
    { icon: Car, name: "Estacionamento", description: "Gratuito e coberto" },
    { icon: Wifi, name: "Wi-Fi Grátis", description: "Internet de alta velocidade" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={resortHeroImage}
            alt="Luxury Angolan beach resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            Resort
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent ml-4">
              Angola
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experimente o luxo e conforto em um ambiente paradisíaco angolano
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => {
                setSelectedRoomData(rooms[0]); // Suite Presidencial como padrão
                setShowReservationModal(true);
              }}
            >
              <Calendar className="h-5 w-5" />
              Fazer Reserva
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Camera className="h-5 w-5" />
              Ver Galeria
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <MapPin className="h-5 w-5" />
              Agendar Visita
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12">
        <Tabs defaultValue="accommodations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="accommodations">Acomodações</TabsTrigger>
            <TabsTrigger value="facilities">Facilidades</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="accommodations" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Card key={room.id} className="restaurant-card cursor-pointer">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-muted to-accent rounded-t-lg"></div>
                    <Badge className={`absolute top-3 right-3 ${room.available ? 'bg-green-500' : 'bg-red-500'}`}>
                      {room.available ? 'Disponível' : 'Ocupado'}
                    </Badge>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">{room.images} fotos</span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{room.name}</span>
                      <span className="text-primary font-bold">{room.price}/noite</span>
                    </CardTitle>
                    <p className="text-muted-foreground">{room.type}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{room.guests} pessoas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{room.size}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={!room.available}
                      onClick={() => {
                        setSelectedRoomData(room);
                        setShowReservationModal(true);
                      }}
                    >
                      {room.available ? 'Reservar Agora' : 'Indisponível'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              {facilities.map((facility, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <facility.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
                      <p className="text-muted-foreground">{facility.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="relative overflow-hidden group cursor-pointer">
                  <div className="h-64 bg-gradient-to-br from-muted to-accent"></div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-semibold">Área da Piscina</p>
                    <p className="text-sm opacity-90">12 fotos • 3 vídeos</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">(11) 9999-8888</p>
                      <p className="text-sm text-muted-foreground">WhatsApp e Ligações</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Estrada do Paradise, 1000</p>
                      <p className="text-sm text-muted-foreground">São Paulo - SP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">24 horas</p>
                      <p className="text-sm text-muted-foreground">Recepção sempre disponível</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Agendar Visita</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Conheça nossas instalações antes de fazer sua reserva
                  </p>
                  <Button className="w-full mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Escolher Data e Horário
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Visitas de Segunda a Domingo das 9h às 18h
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ResortReservationModal
        open={showReservationModal}
        onOpenChange={setShowReservationModal}
        room={selectedRoomData}
      />
    </div>
  );
};

export default Resort;