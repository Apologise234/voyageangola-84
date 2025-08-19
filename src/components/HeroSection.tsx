import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { MapPin, Compass, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-angolan-market.jpg";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Traditional Angolan market scene"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Descubra
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent ml-4">
            Angola
          </span>
          <br />
          como nunca antes
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Restaurantes, resorts, experiências gastronômicas e destinos únicos em Angola
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="hero" size="lg" className="gap-2">
            <MapPin className="h-5 w-5" />
            Próximos a mim
          </Button>
          <Button variant="outline" size="lg" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
            <Compass className="h-5 w-5" />
            Explorar categorias
          </Button>
          <Button variant="outline" size="lg" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
            <Calendar className="h-5 w-5" />
            Eventos hoje
          </Button>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute bottom-8 left-8 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">127 restaurantes</p>
              <p className="text-sm text-muted-foreground">Em um raio de 2km</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">15 eventos</p>
              <p className="text-sm text-muted-foreground">Acontecendo hoje</p>
            </div>
          </div>
        </div>
      </div>

      {/* AngolaExperience Link */}
      <div className="absolute top-8 right-8 hidden lg:block">
        <a 
          href="https://angolaexperience.com/passeios-por-angola/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Conectar com</p>
              <p className="text-sm text-primary font-medium">AngolaExperience</p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;