import { Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type CategoryFormValues } from "./create-category-modal/validation-schema";

import { type UseFormReturn } from "react-hook-form";
import InfoTabForm from "./create-category-modal/info-tab-form";

import SeoTabForm from "./create-category-modal/seo-tab-form";
import DisplayTabForm from "./create-category-modal/display-tab-form";

import CategoryProductList from "./category-product-list";
import type { GetCategoryResponse } from "../-types";
import { Route } from "../$categoryId";
import { useNavigate } from "@tanstack/react-router";

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
        <CardContent className="xl:h-[65vh] lg:h-[60vh] my-5 overflow-auto">
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
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Subcategories</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subcategory
                </Button>
              </div>
              <Separator />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Computers</TableCell>
                    <TableCell>24</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Smartphones</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <CategoryProductList />
          </TabsContent>
        </CardContent>
      </Tabs>
    </>
  );
}
