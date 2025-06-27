import * as React from "react";
import { FolderTree, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "../../categories/-api/use-categories";
import type { ICategory } from "../../categories/-types";
import type { ProductCategoryValues } from "./product-form/validation-schema";

interface CategoryNodeProps {
  category: ICategory;
  level: number;
  selectedCategory: ProductCategoryValues | null;
  onSelect: (category: ProductCategoryValues) => void;
}

function CategoryNode({
  category,
  level,
  selectedCategory,
  onSelect,
}: CategoryNodeProps) {
  const [expanded, setExpanded] = React.useState(level === 0);
  const hasChildren = category?.subcategories?.length > 0;
  const isSelected = category.name === selectedCategory?.name;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    if (category.name !== selectedCategory?.name) {
      onSelect(category);
    }
  };

  return (
    <div className="category-node">
      <div
        className={cn(
          "group flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50",
          isSelected && "bg-primary/10 font-medium text-primary"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleSelect}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              onClick={handleToggle}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="h-5 w-5" />
          )}

          <div className="flex items-center gap-2">
            <FolderTree
              className={cn(
                "h-4 w-4",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span>{category.name}</span>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {category.subcategories.map((child: any) => (
              <CategoryNode
                key={child.id}
                category={child}
                level={level + 1}
                selectedCategory={selectedCategory || null}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function findCategoryPath(
  categories: ICategory[],
  categoryName: string,
  currentPath: string[] = []
): string[] | null {
  for (const category of categories) {
    if (category.name === categoryName) {
      return [...currentPath, category.name];
    }

    if (category.subcategories && category.subcategories.length > 0) {
      const path = findCategoryPath(category.subcategories, categoryName, [
        ...currentPath,
        category.name,
      ]);
      if (path) {
        return path;
      }
    }
  }

  return null;
}

type ProductCategorySelectorProps = {
  selectedCategory: ProductCategoryValues | null;
  onCategoryChange: (category: ProductCategoryValues) => void;
};

export function ProductCategorySelector({
  selectedCategory,
  onCategoryChange,
}: ProductCategorySelectorProps) {
  const { data: categories, isPending } = useCategories();
  const [open, setOpen] = React.useState(false);
  const [categoryPath, setCategoryPath] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (selectedCategory && categories) {
      const path = findCategoryPath(categories, selectedCategory.name);
      setCategoryPath(path || [selectedCategory.name]);
    } else {
      setCategoryPath([]);
    }
  }, [selectedCategory, categories]);

  const handleCategorySelect = (category: ProductCategoryValues) => {
    onCategoryChange(category);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <FolderTree className="mr-2 h-4 w-4" />
            {selectedCategory ? selectedCategory.name : "Select Category"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-md">
          {!categories?.length && isPending && <div>loading</div>}
          {categories?.length && !isPending && (
            <>
              <DialogHeader>
                <DialogTitle>Select Category</DialogTitle>
                <DialogDescription>
                  Choose a category for your product. Categories help customers
                  find your products more easily.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="h-[50vh] mt-4 pr-4">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <CategoryNode
                      key={category.id}
                      category={category}
                      level={0}
                      selectedCategory={selectedCategory || null}
                      onSelect={handleCategorySelect}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selectedCategory && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <FolderTree className="h-3 w-3" />
            {categoryPath.join(" / ")}
          </Badge>
        </div>
      )}
    </div>
  );
}
