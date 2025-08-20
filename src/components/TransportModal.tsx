import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Search, MapPin, Plane, Car, Bus, Ship, 
  Calendar as CalendarIcon, Clock, Users, ArrowLeftRight 
} from "lucide-react";

interface TransportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransportModal = ({ open, onOpenChange }: TransportModalProps) => {
  const [transportType, setTransportType] = useState("flights");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");

  const cities = [
    "Luanda", "Benguela", "Huambo", "Lobito", "Kuito", 
    "Malanje", "Lubango", "Soyo", "Cabinda", "Namibe"
  ];

  const flights = [
    {
      id: 1,
      airline: "TAAG Angola Airlines",
      route: "Luanda → Benguela",
      departure: "08:30",
      arrival: "09:45",
      duration: "1h 15m",
      price: "185.000 Kz",
      stops: "Direto",
      aircraft: "Boeing 737"
    },
    {
      id: 2,
      airline: "Sonair",
      route: "Luanda → Huambo",
      departure: "14:20",
      arrival: "15:35",
      duration: "1h 15m",
      price: "165.000 Kz",
      stops: "Direto",
      aircraft: "Embraer 120"
    },
    {
      id: 3,
      airline: "TAAG Angola Airlines",
      route: "Luanda → Cabinda",
      departure: "11:00",
      arrival: "12:10",
      duration: "1h 10m",
      price: "195.000 Kz",
      stops: "Direto",
      aircraft: "Boeing 737"
    }
  ];

  const buses = [
    {
      id: 1,
      company: "Macon",
      route: "Luanda → Benguela",
      departure: "06:00",
      arrival: "11:30",
      duration: "5h 30m",
      price: "8.500 Kz",
      type: "Executivo",
      amenities: ["Wi-Fi", "AC", "Reclinável"]
    },
    {
      id: 2,
      company: "SGO",
      route: "Luanda → Huambo",
      departure: "07:30",
      arrival: "13:45",
      duration: "6h 15m",
      price: "12.000 Kz",
      type: "Luxo",
      amenities: ["Wi-Fi", "AC", "TV", "Lanche"]
    },
    {
      id: 3,
      company: "Transportes Rocha",
      route: "Benguela → Lobito",
      departure: "09:00",
      arrival: "09:45",
      duration: "45m",
      price: "2.500 Kz",
      type: "Regular",
      amenities: ["AC"]
    }
  ];

  const carRentals = [
    {
      id: 1,
      company: "Avis Angola",
      model: "Toyota Corolla",
      category: "Econômico",
      transmission: "Manual",
      passengers: 5,
      pricePerDay: "15.000 Kz",
      features: ["AC", "Direção hidráulica", "Airbag"]
    },
    {
      id: 2,
      company: "Hertz",
      model: "Toyota Hilux",
      category: "SUV",
      transmission: "Automático",
      passengers: 5,
      pricePerDay: "35.000 Kz",
      features: ["4x4", "AC", "GPS", "Tração integral"]
    },
    {
      id: 3,
      company: "Europcar",
      model: "Nissan Sentra",
      category: "Intermediário",
      transmission: "Automático",
      passengers: 5,
      pricePerDay: "22.000 Kz",
      features: ["AC", "Direção elétrica", "Bluetooth"]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Transporte em Angola
          </DialogTitle>
        </DialogHeader>

        <Tabs value={transportType} onValueChange={setTransportType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Voos
            </TabsTrigger>
            <TabsTrigger value="buses" className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              Ônibus
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Carros
            </TabsTrigger>
            <TabsTrigger value="boats" className="flex items-center gap-2">
              <Ship className="h-4 w-4" />
              Barcos
            </TabsTrigger>
          </TabsList>

          {/* Search Form */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6 mt-6">
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger>
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Destino" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP", { locale: ptBR }) : "Ida"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger>
                <SelectValue placeholder="Passageiros" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num} passageiro{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="flights">
            <div className="space-y-4">
              {flights.map((flight) => (
                <Card key={flight.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Plane className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{flight.airline}</h3>
                        <p className="text-sm text-muted-foreground">{flight.aircraft}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{flight.price}</p>
                      <Badge variant="secondary">{flight.stops}</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-xl font-semibold">{flight.departure}</p>
                        <p className="text-sm text-muted-foreground">{flight.route.split(' → ')[0]}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{flight.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-semibold">{flight.arrival}</p>
                        <p className="text-sm text-muted-foreground">{flight.route.split(' → ')[1]}</p>
                      </div>
                    </div>
                    <Button>Reservar</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buses">
            <div className="space-y-4">
              {buses.map((bus) => (
                <Card key={bus.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Bus className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{bus.company}</h3>
                        <p className="text-sm text-muted-foreground">{bus.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{bus.price}</p>
                      <div className="flex gap-1 mt-1">
                        {bus.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-xl font-semibold">{bus.departure}</p>
                        <p className="text-sm text-muted-foreground">{bus.route.split(' → ')[0]}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{bus.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-semibold">{bus.arrival}</p>
                        <p className="text-sm text-muted-foreground">{bus.route.split(' → ')[1]}</p>
                      </div>
                    </div>
                    <Button>Reservar</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cars">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {carRentals.map((car) => (
                <Card key={car.id} className="restaurant-card">
                  <div className="h-48 bg-gradient-to-br from-muted to-accent rounded-t-lg"></div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{car.model}</span>
                      <Badge>{car.category}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{car.company}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Passageiros:</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {car.passengers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Transmissão:</span>
                        <span>{car.transmission}</span>
                      </div>
                      
                      <div className="mb-4">
                        {car.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2 text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{car.pricePerDay}/dia</span>
                        <Button size="sm">Alugar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="boats">
            <div className="text-center py-8">
              <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Transporte Marítimo</h3>
              <p className="text-muted-foreground">
                Serviços de ferry e barcos para destinos costeiros e ilhas serão adicionados em breve.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TransportModal;