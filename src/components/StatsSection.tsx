import { Users, Star, MapPin, Calendar } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Usuários ativos",
    description: "Descobrindo novos sabores",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Avaliação média",
    description: "Dos restaurantes parceiros",
  },
  {
    icon: MapPin,
    value: "500+",
    label: "Estabelecimentos",
    description: "Em toda a cidade",
  },
  {
    icon: Calendar,
    value: "200+",
    label: "Eventos mensais",
    description: "Experiências gastronômicas",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-muted to-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Conectando pessoas aos
            <span className="text-primary ml-2">melhores sabores</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa plataforma reúne os melhores restaurantes, eventos e experiências
            gastronômicas da cidade em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 bg-background rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;