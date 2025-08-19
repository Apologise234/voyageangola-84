import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  Building2, 
  Coffee, 
  ShoppingBag, 
  Music, 
  Palmtree,
  Compass,
  Star
} from "lucide-react";

interface CategoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategorySelect: (category: string) => void;
}

const categories = [
  {
    id: "restaurants",
    name: "Restaurantes",
    icon: UtensilsCrossed,
    count: "127+",
    color: "text-red-500",
    bgColor: "bg-red-500/10"
  },
  {
    id: "resorts",
    name: "Resorts",
    icon: Building2,
    count: "43+",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    id: "cafes",
    name: "Cafés",
    icon: Coffee,
    count: "89+",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    id: "markets",
    name: "Mercados",
    icon: ShoppingBag,
    count: "56+",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    id: "entertainment",
    name: "Entretenimento",
    icon: Music,
    count: "34+",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    id: "tourism",
    name: "Turismo",
    icon: Palmtree,
    count: "78+",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10"
  },
  {
    id: "experiences",
    name: "Experiências",
    icon: Compass,
    count: "92+",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10"
  },
  {
    id: "premium",
    name: "Premium",
    icon: Star,
    count: "25+",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  }
];

const CategoriesModal = ({ open, onOpenChange, onCategorySelect }: CategoriesModalProps) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Explorar categorias
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant="outline"
                className="h-auto p-6 flex flex-col gap-3 hover:shadow-md transition-all duration-200 hover-scale"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${category.color}`} />
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {category.count}
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground text-center">
            Selecione uma categoria para explorar os melhores lugares
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesModal;