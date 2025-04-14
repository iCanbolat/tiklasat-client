import { Box, Edit, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategoryStore } from "@/lib/category-store";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "./create-category-modal/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InfoTabForm from "./create-category-modal/info-tab-form";
import { Form } from "@/components/ui/form";

export function CategoryDetails() {
  const { selectedCategory } = useCategoryStore();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: selectedCategory?.name,
      slug: selectedCategory?.slug,
      description: selectedCategory?.description || "",
      parentId: selectedCategory?.parentId,
      isActive: selectedCategory?.isActive,
      isFeatured: selectedCategory?.isFeatured,
      image: selectedCategory?.imageUrl,
      metaTitle: selectedCategory?.metaTitle || "",
      metaDescription: selectedCategory?.metaDescription || "",
      metaKeywords: selectedCategory?.metaKeywords || "",
      displayOrder: selectedCategory?.displayOrder || 0,
      banner: selectedCategory?.banner,
    },
  });

  if (!selectedCategory) {
    return (
      <Card className="h-full w-full flex items-center justify-center">
        <CardContent className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">No Category Selected</h3>
          <p className="text-muted-foreground">
            Select a category from the tree to view and edit its details.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="h-full w-full pb-0">
      <Tabs defaultValue="details">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{selectedCategory?.name}</CardTitle>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
          </div>
          <CardDescription>View and edit category information</CardDescription>
        </CardHeader>
        <CardContent className="xl:h-[69vh] lg:h-[60vh] overflow-auto">
          <Form {...form}>
            <form onSubmit={() => console.log()}>
              <TabsContent value="details" className="space-y-6">
                <InfoTabForm form={form} />
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
                        <TableCell className="font-medium">
                          Smartphones
                        </TableCell>
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
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">
                      Products in this Category
                    </h3>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                  <Separator />
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4" />
                            <span>Wireless Earbuds</span>
                          </div>
                        </TableCell>
                        <TableCell>EL-001</TableCell>
                        <TableCell>$49.99</TableCell>
                        <TableCell>24</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4" />
                            <span>Bluetooth Speaker</span>
                          </div>
                        </TableCell>
                        <TableCell>EL-002</TableCell>
                        <TableCell>$79.99</TableCell>
                        <TableCell>18</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between mt-auto border-t p-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
}
