import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderTree,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ICategory } from "../-types";
 import { useCategoriesSuspense } from "../-api/use-categories";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useLayoutStore } from "@/lib/layout-store";

interface TreeNodeProps {
  category: ICategory;
  level: number;
}

function TreeNode({ category, level }: TreeNodeProps) {
  const [expanded, setExpanded] = React.useState(level === 0);
  const { categoryId } = useParams({ strict: false });

  const hasChildren = category.subcategories.length > 0;
  const isSelected = category.id === categoryId;

  const navigate = useNavigate();

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({
      to: "/dashboard/categories/$categoryId",
      params: { categoryId: category.id },
      search: { tab: "details" },
      reloadDocument: false,
    });
    setExpanded(!expanded);
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
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
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
                // onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CategoriesTree() {
  const { data: categories } = useCategoriesSuspense();
  const { openCreateModal } = useLayoutStore();

  return (
    <Card className="h-fit w-1/3">
      <CardHeader className="flex flex-row justify-between w-full">
        <div className="space-y-2">
          <CardTitle>Category Hierarchy</CardTitle>
          <CardDescription>
            Manage your product categories and subcategories
          </CardDescription>
        </div>
        <Button onClick={() => openCreateModal()} variant="outline" size="icon">
          <Plus />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-full">
          <div className="p-2">
            {categories.map((category) => (
              <TreeNode key={category.id} category={category} level={0} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
