import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { type CategoryFormValues } from "./create-category-modal/validation-schema";

import { type UseFormReturn } from "react-hook-form";
import InfoTabForm from "./create-category-modal/info-tab-form";

import SeoTabForm from "./create-category-modal/seo-tab-form";
import DisplayTabForm from "./create-category-modal/display-tab-form";

import CategoryProductList from "./category-product-list";
import type { GetCategoryResponse } from "../-types";
import { Route } from "../$categoryId";
import { useNavigate } from "@tanstack/react-router";
import CategorySubcategoriesTab from "./category-subcategories-tab";

type CategoryDetailsProps = {
  data: GetCategoryResponse;
  form: UseFormReturn<CategoryFormValues>;
};

export function CategoryDetails({ data, form }: CategoryDetailsProps) {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const handleTabChange = (newTab: any) => {
    navigate({
      to: "/dashboard/categories/$categoryId",
      params: { categoryId: data.category.id },
      search: (prev) => ({ ...prev, tab: newTab }),
    });
  };

  console.log('catdetail',data);
  

  return (
    <>
      <Tabs onValueChange={handleTabChange} defaultValue="details" value={tab}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{data?.category.name}</CardTitle>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
          </div>
          <CardDescription>View and edit category information</CardDescription>
        </CardHeader>
        <CardContent className="xl:h-[60vh] lg:h-[55vh] my-5 overflow-auto">
          <TabsContent value="details" className="space-y-6 ">
            <InfoTabForm form={form} />
          </TabsContent>

          <TabsContent value="display" className="space-y-6">
            <DisplayTabForm form={form} />
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <SeoTabForm form={form} />
          </TabsContent>

          <TabsContent value="subcategories">
            <CategorySubcategoriesTab categories={data?.subCategories} />
          </TabsContent>

          <TabsContent value="products">
            <CategoryProductList products={data?.products} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </>
  );
}
