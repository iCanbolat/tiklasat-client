"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderTree,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ICategory } from "../-types";

interface TreeNodeProps {
  category: ICategory;
  level: number;
  onSelect: (category: ICategory) => void;
  selectedId: string | null;
}

function TreeNode({ category, level, onSelect, selectedId }: TreeNodeProps) {
  const [expanded, setExpanded] = React.useState(level === 0);
  const hasChildren = category.subcategories.length > 0;
  const isSelected = category.id === selectedId;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
    console.log("Toggle expanded:", !expanded);
  };

  const handleSelect = () => {
    onSelect(category);
    console.log("Selected category:", category);
  };

  return (
    <div className="tree-node">
      <div
        className={cn(
          "group flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50",
          isSelected && "bg-muted font-medium"
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
            <FolderTree className="h-4 w-4 text-muted-foreground" />
            <span>{category.name}</span>
            <span className="text-xs text-muted-foreground">
              ({category.subcategories.length})
            </span>
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
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Add Subcategory</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            {category.subcategories.map((child) => (
              <TreeNode
                key={child.id}
                category={child}
                level={level + 1}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CategoriesTree({
  categories: categoriesData,
}: {
  categories: ICategory[];
}) {
  const categories = React.useMemo(() => categoriesData, [categoriesData]);
  const [selectedCategory, setSelectedCategory] =
    React.useState<ICategory | null>(null);

  return (
    <div className="h-full">
      <div className="p-2">
        {categories.map((category) => (
          <TreeNode
            key={category.id}
            category={category}
            level={0}
            onSelect={setSelectedCategory}
            selectedId={selectedCategory?.id || null}
          />
        ))}
      </div>
    </div>
  );
}
