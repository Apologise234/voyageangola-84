import { Button } from "@/components/ui/button";
import { Utensils, Coffee, Pizza, Wine, Music, Star } from "lucide-react";

interface FilterButtonsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "Todos", icon: Star },
  { id: "restaurant", label: "Restaurantes", icon: Utensils },
  { id: "cafe", label: "Cafés", icon: Coffee },
  { id: "pizza", label: "Pizzarias", icon: Pizza },
  { id: "bar", label: "Bares", icon: Wine },
  { id: "music", label: "Música ao Vivo", icon: Music },
];

const FilterButtons = ({ activeFilter, onFilterChange }: FilterButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        
        return (
          <Button
            key={filter.id}
            variant={isActive ? "filter-active" : "filter"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};

export default FilterButtons;