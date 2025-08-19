import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Buscar restaurantes, pratos ou experiências..." }: SearchBarProps) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          className="search-enhanced pl-14 pr-32"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <MapPin className="h-4 w-4" />
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;