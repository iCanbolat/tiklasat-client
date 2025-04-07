import { createFileRoute } from "@tanstack/react-router";
import { getCategoriesFn, useCategories } from "./-api/use-categories";
import { categoryQueryKeys, type ICategory } from "./-types";
// import CategoryDropdown from "./-components/category-dropdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { CategoryItem } from "./-components/category-tree-item";
import { CategoryDetails } from "./-components/category-details";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CategoriesTree } from "./-components/categories-tree";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      crumb: "Categories",
    };
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: [categoryQueryKeys.all],
      queryFn: getCategoriesFn,
    }),
});

function RouteComponent() {
  const {
    data: categories,
    isPending,
    error,
  } = useSuspenseQuery(useCategories);

  const [selectedCategory, setSelectedCategory] =
    React.useState<ICategory | null>(categories[0] || null);

  if (isPending) return <div>Loading...</div>;
  if (!categories) return <div>No Category...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-1 mt-4 gap-2">
        <Card className="h-full w-1/2">
          <CardHeader >
            <CardTitle>Category Hierarchy</CardTitle>
            <CardDescription>
              Manage your product categories and subcategories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoriesTree categories={categories} />
          </CardContent>
        </Card>
        <CategoryDetails category={selectedCategory} />
      </div>
    </div>
  );
}
