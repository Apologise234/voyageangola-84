import { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Star,
  Filter,
  X,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilters {
  location: string;
  dateRange: [Date?, Date?];
  guests: number;
  priceRange: [number, number];
  rating: number;
  amenities: string[];
  availability: 'all' | 'available' | 'high-demand';
}

interface EnhancedSearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  className?: string;
}

const EnhancedSearchBar = ({ onSearch, className }: EnhancedSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    dateRange: [undefined, undefined],
    guests: 2,
    priceRange: [0, 100000],
    rating: 0,
    amenities: [],
    availability: 'all'
  });

  const popularAmenities = [
    'Wi-Fi Gratuito',
    'Estacionamento',
    'Piscina',
    'Spa',
    'Restaurante',
    'Bar',
    'Academia',
    'Vista Mar',
    'Ar Condicionado',
    'Transfer Aeroporto'
  ];

  const popularLocations = [
    'Luanda - Cidade Alta',
    'Luanda - Ilha do Cabo',
    'Luanda - Bairro Azul',
    'Benguela - Centro',
    'Lobito - Restinga',
    'Huambo - Centro',
    'Lubango - Cidade',
    'Malanje - Centro'
  ];

  const handleSearchSubmit = useCallback(() => {
    onSearch(query, filters);
  }, [query, filters, onSearch]);

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      location: '',
      dateRange: [undefined, undefined],
      guests: 2,
      priceRange: [0, 100000],
      rating: 0,
      amenities: [],
      availability: 'all'
    });
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.dateRange[0]) count++;
    if (filters.guests !== 2) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++;
    if (filters.rating > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.availability !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar hotéis, restaurantes, experiências..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-lg search-enhanced"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
        </div>
        <Button 
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="h-12 px-4"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button onClick={handleSearchSubmit} className="h-12 px-6">
          Buscar
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {popularLocations.slice(0, 4).map((location) => (
          <Button
            key={location}
            variant="outline"
            size="sm"
            onClick={() => updateFilter('location', location)}
            className="h-8"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {location}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilter('availability', 'available')}
          className="h-8"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Disponível Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilter('availability', 'high-demand')}
          className="h-8"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Alta Demanda
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filtros Avançados</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar Tudo
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localização
                </label>
                <Input
                  placeholder="Cidade ou bairro"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {popularLocations.slice(0, 3).map((location) => (
                    <Button
                      key={location}
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter('location', location)}
                      className="h-6 text-xs"
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Hóspedes
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={filters.guests}
                  onChange={(e) => updateFilter('guests', parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Avaliação Mínima
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.rating >= rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('rating', rating)}
                      className="h-8 w-8 p-0"
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Faixa de Preço (AOA)
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  />
                  <span>até</span>
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 100000])}
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Disponibilidade
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'available', label: 'Disponível' },
                    { value: 'high-demand', label: 'Alta Demanda' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.availability === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('availability', option.value)}
                      className="justify-start"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Comodidades</label>
              <div className="flex flex-wrap gap-2">
                {popularAmenities.map((amenity) => (
                  <Button
                    key={amenity}
                    variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAmenity(amenity)}
                    className="h-8"
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSearchSubmit}>
                Aplicar Filtros ({activeFiltersCount})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchBar;