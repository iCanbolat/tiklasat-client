import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  FolderTree,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ICategory } from "../-types";

interface CategoryItemProps {
  category: ICategory;
  level: number;
  onSelect: (category: ICategory) => void;
  selectedId: string | null;
}

export function CategoryItem({
  category,
  level,
  onSelect,
  selectedId,
}: CategoryItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasChildren = category.subcategories.length > 0;
  const isSelected = category.id === selectedId;

  return (
    <div className="category-item">
      <div
        className={cn(
          "group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50",
          isSelected && "bg-muted"
        )}
        style={{ paddingLeft: `${(level + 1) * 12}px` }}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-5" />
          )}
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => onSelect(category)}
          >
            <FolderTree className="h-4 w-4 text-muted-foreground" />
            <span>{category.name}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Add Subcategory
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {expanded && hasChildren && (
        <div className="category-children">
          {category.subcategories.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
