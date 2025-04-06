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

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: [categoryQueryKeys.all],
      queryFn: getCategoriesFn,
    }),
});

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] =
    React.useState<ICategory | null>(null);

  const {
    data: categories,
    isPending,
    error,
  } = useSuspenseQuery(useCategories);

  if (isPending) return <div>Loading...</div>;
  if (!categories) return <div>No Category...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-1 mt-4 gap-2">
        <Card className="h-full w-1/2">
          <CardHeader>
            <CardTitle>Category Structure</CardTitle>
            <CardDescription>
              Manage your product categories and subcategories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  level={0}
                  onSelect={setSelectedCategory}
                  selectedId={selectedCategory?.id || null}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <CategoryDetails />
      </div>
    </div>
  );
}
