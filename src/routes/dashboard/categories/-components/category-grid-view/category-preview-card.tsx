import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryActions } from "./actions";
import type { ICategory } from "../../-types";

interface CategoryPreviewCardProps {
  category: ICategory & { path: string };
}

export function CategoryPreviewCard({ category }: CategoryPreviewCardProps) {
  console.log("prevcard", category);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div
        className={cn(
          "relative h-40 w-full overflow-hidden",
          category.imageUrl ? "" : "bg-gradient-to-r"
        )}
      >
        {category.imageUrl ? (
          <img
            src={category.imageUrl || "/placeholder.svg"}
            alt={category.name}
            className="absolute h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FolderTree className="h-16 w-16 opacity-20" />
          </div>
        )}

        <div className="absolute right-2 top-2">
          <CategoryActions
            categoryId={category.id}
            categoryName={category.name}
          />
        </div>

        {category.isFeatured && (
          <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{category.name}</h3>
            {category.isActive && (
              <Badge
                variant="outline"
                className={
                  category.isActive ? "text-green-600" : "text-gray-500"
                }
              >
                {category.isActive ? "Active" : "Not Active"}
              </Badge>
            )}
          </div>

          {category.path && (
            <p className="text-xs text-muted-foreground truncate">
              {category.path}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Products:</span>
            <span>{category.productsCount || 0}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Subcategories:</span>
            <span>{category.subcategories?.length || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
