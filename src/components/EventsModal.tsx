import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Music, UtensilsCrossed } from "lucide-react";

interface EventsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const todayEvents = [
  {
    id: 1,
    title: "Festival de Comida Angolana",
    time: "18:00 - 23:00",
    location: "Marginal de Luanda",
    attendees: "250+",
    type: "Gastronomia",
    icon: UtensilsCrossed,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    status: "Confirmado"
  },
  {
    id: 2,
    title: "Live Music no Café Central",
    time: "20:00 - 02:00",
    location: "Café Central",
    attendees: "80+",
    type: "Música",
    icon: Music,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    status: "Vagas limitadas"
  },
  {
    id: 3,
    title: "Noite de Degustação",
    time: "19:30 - 22:30",
    location: "Restaurante Zambeze",
    attendees: "45+",
    type: "Degustação",
    icon: UtensilsCrossed,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    status: "Confirmado"
  },
  {
    id: 4,
    title: "Workshop de Culinária",
    time: "16:00 - 18:00",
    location: "Centro Gastronômico",
    attendees: "20+",
    type: "Workshop",
    icon: UtensilsCrossed,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    status: "Últimas vagas"
  }
];

const EventsModal = ({ open, onOpenChange }: EventsModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-500/10 text-green-700";
      case "Vagas limitadas":
        return "bg-yellow-500/10 text-yellow-700";
      case "Últimas vagas":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Eventos de hoje
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {todayEvents.length} eventos acontecendo hoje
            </p>
            <Badge variant="secondary">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </Badge>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {todayEvents.map((event) => {
              const Icon = event.icon;
              return (
                <Card key={event.id} className="hover:shadow-md transition-all duration-200 hover-scale">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`w-16 h-16 ${event.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${event.color}`} />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees} pessoas
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{event.type}</Badge>
                          <Button size="sm" className="ml-auto">
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="border-t pt-4 text-center">
            <Button variant="outline" className="w-full">
              Ver todos os eventos da semana
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventsModal;