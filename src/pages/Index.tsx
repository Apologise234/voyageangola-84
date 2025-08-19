import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FilterButtons from "@/components/FilterButtons";
import RestaurantGrid from "@/components/RestaurantGrid";
import StatsSection from "@/components/StatsSection";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <div className="pt-16">
        <HeroSection onSearch={handleSearch} />
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Filter Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Explore por categoria
            </h2>
            <p className="text-lg text-muted-foreground">
              Encontre exatamente o que você está procurando
            </p>
          </div>
          <FilterButtons 
            activeFilter={activeFilter} 
            onFilterChange={handleFilterChange} 
          />
        </section>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold">
              {searchQuery ? `Resultados para "${searchQuery}"` : "Recomendados para você"}
            </h3>
            <p className="text-muted-foreground">
              Ordenar por: Relevância
            </p>
          </div>
          <RestaurantGrid searchQuery={searchQuery} activeFilter={activeFilter} />
        </section>
      </main>

      {/* Stats Section */}
      <StatsSection />
    </div>
  );
};

export default Index;
