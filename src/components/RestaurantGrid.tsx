
import { useState } from "react";
import RestaurantCard from "./RestaurantCard";
import restaurant1 from "@/assets/restaurant-angolan-1.jpg";
import restaurant2 from "@/assets/restaurant-angolan-2.jpg";
import restaurant3 from "@/assets/restaurant-angolan-3.jpg";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  openUntil: string;
  image: string;
  specialOffer?: string;
  isOpen: boolean;
  category: string;
  tags?: string[];
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Restaurante Kilamba",
    cuisine: "Angolana Tradicional",
    rating: 4.8,
    priceRange: "15 000 Kz - 25 000 Kz",
    distance: "0.5 km",
    openUntil: "23:00",
    image: restaurant1,
    specialOffer: "20% OFF",
    isOpen: true,
    category: "restaurant",
    tags: ["angolana", "tradicional", "kilamba", "local"],
  },
  {
    id: "2",
    name: "Casa do Mussulo",
    cuisine: "Frutos do Mar Angolanos",
    rating: 4.6,
    priceRange: "12 000 Kz - 18 000 Kz",
    distance: "0.8 km",
    openUntil: "22:30",
    image: restaurant2,
    isOpen: true,
    category: "restaurant",
    tags: ["frutos do mar", "mussulo", "peixe", "angolana", "costa"],
  },
  {
    id: "3",
    name: "Sabores de Luanda",
    cuisine: "Angolana Tradicional",
    rating: 4.9,
    priceRange: "8 000 Kz - 15 000 Kz",
    distance: "1.2 km",
    openUntil: "22:00",
    image: restaurant3,
    specialOffer: "Muamba de Galinha Especial",
    isOpen: true,
    category: "restaurant",
    tags: ["angolana", "tradicional", "muamba", "calulu", "funge", "local"],
  },
  {
    id: "4",
    name: "Café da Marginal",
    cuisine: "Café & Lanches Angolanos",
    rating: 4.4,
    priceRange: "3 000 Kz - 8 000 Kz",
    distance: "0.3 km",
    openUntil: "18:00",
    image: restaurant1,
    isOpen: true,
    category: "cafe",
    tags: ["café", "marginal", "lanches", "angolano"],
  },
  {
    id: "5",
    name: "Quintal do Mussulo",
    cuisine: "Angolana & Frutos do Mar",
    rating: 4.7,
    priceRange: "18 000 Kz - 28 000 Kz",
    distance: "1.5 km",
    openUntil: "23:30",
    image: restaurant2,
    specialOffer: "Caldeirada do Chef",
    isOpen: true,
    category: "restaurant",
    tags: ["angolana", "frutos do mar", "caldeirada", "peixe", "camarão", "local"],
  },
  {
    id: "6",
    name: "Miradouro da Fortaleza",
    cuisine: "Vista Panorâmica & Cocktails",
    rating: 4.5,
    priceRange: "12 000 Kz - 22 000 Kz",
    distance: "2.1 km",
    openUntil: "01:00",
    image: restaurant3,
    isOpen: true,
    category: "bar",
    tags: ["cocktails", "bar", "fortaleza", "vista", "miradouro"],
  },
  {
    id: "7",
    name: "Tamarineiros",
    cuisine: "Fusão Luso-Angolana",
    rating: 4.6,
    priceRange: "14 000 Kz - 24 000 Kz",
    distance: "0.9 km",
    openUntil: "22:00",
    image: restaurant1,
    isOpen: true,
    category: "restaurant",
    tags: ["fusão", "luso-angolana", "tamarineiros", "contemporânea"],
  },
  {
    id: "8",
    name: "Mama África",
    cuisine: "Culinária Angolana Caseira",
    rating: 4.8,
    priceRange: "6 000 Kz - 12 000 Kz",
    distance: "0.7 km",
    openUntil: "21:00",
    image: restaurant2,
    specialOffer: "Funge com Calulu",
    isOpen: true,
    category: "restaurant",
    tags: ["angolana", "caseira", "funge", "calulu", "muamba", "tradicional", "local", "africana"],
  },
];

interface RestaurantGridProps {
  searchQuery: string;
  activeFilter: string;
}

const RestaurantGrid = ({ searchQuery, activeFilter }: RestaurantGridProps) => {
  // Termos relacionados à culinária angolana
  const angolanTerms = [
    'angolan', 'angolana', 'angolano', 'angola',
    'muamba', 'calulu', 'funge', 'cachupa', 'mufete',
    'caldeirada', 'tradicional angolana', 'caseira angolana',
    'local', 'africana', 'culinária angolana', 'sabores de angola',
    'mama áfrica', 'sabores africanos', 'comida local'
  ];

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const searchLower = searchQuery.toLowerCase().trim();
    
    // Se não há busca, aplicar apenas filtro de categoria
    if (!searchLower) {
      return activeFilter === "all" || restaurant.category === activeFilter;
    }

    // Verificar se a busca é por restaurantes angolanos
    const isSearchingAngolan = angolanTerms.some(term => 
      searchLower.includes(term.toLowerCase())
    );

    let matchesSearch = false;

    if (isSearchingAngolan) {
      // Busca específica por culinária angolana
      matchesSearch = 
        restaurant.cuisine.toLowerCase().includes('angolan') ||
        restaurant.name.toLowerCase().includes('angola') ||
        restaurant.name.toLowerCase().includes('mama') ||
        restaurant.name.toLowerCase().includes('sabores') ||
        (restaurant.tags && restaurant.tags.some(tag => 
          angolanTerms.some(term => tag.toLowerCase().includes(term.toLowerCase()))
        ));
    } else {
      // Busca geral por nome, culinária e tags
      matchesSearch = 
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower) ||
        (restaurant.tags && restaurant.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ));
    }
    
    const matchesFilter = activeFilter === "all" || restaurant.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground text-lg">
            Nenhum restaurante encontrado para "{searchQuery}"
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tente buscar por "restaurantes angolanos" ou outros termos
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantGrid;
