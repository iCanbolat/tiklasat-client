import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategoryStore } from "@/lib/category-store";
import { useNavigate } from "@tanstack/react-router";
import { useCategoryDelete } from "../../-api/use-delete-category";

interface CategoryActionsProps {
  categoryId: string;
  categoryName: string;
}

export function CategoryActions({
  categoryId,
  categoryName,
}: CategoryActionsProps) {
  const { openCreateModal, setActiveTab } = useCategoryStore();
  const { mutate: deleteCategory } = useCategoryDelete();
  const navigate = useNavigate();

  const handleAddSubcategory = () => {
    navigate({
      to: "/dashboard/categories/$categoryId",
      params: { categoryId },
    });
    openCreateModal();
  };

  const handleEdit = () => {
    setActiveTab("tree");
    navigate({
      to: "/dashboard/categories/$categoryId",
      params: { categoryId },
    });
  };

  const handleDelete = () => {
    deleteCategory({ id: categoryId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions for {categoryName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Category
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddSubcategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete Category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
