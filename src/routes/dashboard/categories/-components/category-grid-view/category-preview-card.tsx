import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryActions } from "./actions";

interface CategoryPreviewCardProps {
  category: any;
}

export function CategoryPreviewCard({ category }: CategoryPreviewCardProps) {
  console.log("prevcard", category);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div
        className={cn(
          "relative h-32 w-full overflow-hidden",
          category.image ? "" : "bg-gradient-to-r"
        )}
      >
        {category.image ? (
          <img
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            className="object-cover"
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
            {category.status && (
              <Badge
                variant="outline"
                className={
                  category.status === "Active"
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {category.status}
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
