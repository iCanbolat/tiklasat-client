import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { CategoryPreviewCard } from "./category-preview-card";
import { useCategoriesSuspense } from "../../-api/use-categories";
import type { ICategory } from "../../-types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useLayoutStore } from "@/lib/layout-store";

export function CategoriesGridView() {
  const { data: categories } = useCategoriesSuspense();
  const { openCreateModal } = useLayoutStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  console.log("gridviewCate", categories);

  const handleCreateCategoryModal = () => {
    navigate({ to: "/dashboard/categories", replace: true });
    openCreateModal();
  };

  const flattenCategories = (cats: ICategory[], parentPath = "") => {
    let result: (ICategory & { path: string; depth: number })[] = [];

    cats.forEach((cat) => {
      const currentPath = parentPath ? `${parentPath} > ${cat.name}` : cat.name;
      result.push({
        ...cat,
        path: currentPath,
        depth: parentPath.split(">").length,
      });

      if (cat.subcategories && cat.subcategories.length > 0) {
        result = [
          ...result,
          ...flattenCategories(cat.subcategories, currentPath),
        ];
      }
    });

    return result;
  };

  const allCategories = flattenCategories(categories);

  const filteredCategories = searchQuery
    ? allCategories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCategories;

  const featuredCategories = filteredCategories.filter((cat) => cat.isFeatured);
  const otherCategories = filteredCategories.filter((cat) => !cat.isFeatured);

  return (
    <div className="space-y-6">
      <div className="flex justify-between  ">
        <div className="relative w-full max-w-sm mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="w-full pl-8 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateCategoryModal} size={"sm"}>
          <Plus />
          Create new category
        </Button>
      </div>

      {featuredCategories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Featured Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryPreviewCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {otherCategories.map((category) => (
            <CategoryPreviewCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No categories found</p>
          <p className="text-muted-foreground">
            Try adjusting your search or create a new category
          </p>
        </div>
      )}
    </div>
  );
}
