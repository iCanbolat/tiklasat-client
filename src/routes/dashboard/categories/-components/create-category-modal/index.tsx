import React from "react";
import { useCategoryStore } from "@/lib/category-store";
import { Check, FolderTree, ImageIcon, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import BasicInfoForm from "./basic-info-form";
import { Form } from "@/components/ui/form";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "./validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function CreateCategoryModal() {
  const { isCreateModalOpen, closeCreateModal } = useCategoryStore();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: null,
      isActive: true,
      isFeatured: false,
      image: null,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      displayOrder: 0,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      // Update store with final form data
      // updateNewCategoryForm(data);
      // await createCategory();
      // router.refresh();
      console.log("submit");
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <Dialog
      open={isCreateModalOpen}
      onOpenChange={(open) => !open && closeCreateModal()}
    >
      <DialogContent className="max-h-[90vh] max-w-4xl sm:max-w-xl md:max-w-6xl overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FolderTree className="h-6 w-6" />
            Create New Category
          </DialogTitle>
          <DialogDescription>
            Add a new product category to your store
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="basic" className="px-6">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <div className="h-[64vh] overflow-auto">
                <div className="pb-6">
                  <TabsContent value="basic" className="space-y-6">
                    <BasicInfoForm form={form} />
                  </TabsContent>

                  <TabsContent value="display" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="active">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                              Category will be visible to customers
                            </p>
                          </div>
                          <Switch
                            id="active"
                            // checked={newCategoryForm.isActive}
                            // onCheckedChange={(checked) =>
                            //   updateNewCategoryForm({ isActive: checked })
                            // }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="featured">Featured Category</Label>
                            <p className="text-sm text-muted-foreground">
                              Display prominently on homepage and category
                              listings
                            </p>
                          </div>
                          <Switch
                            id="featured"
                            // checked={newCategoryForm.isFeatured}
                            // onCheckedChange={(checked) =>
                            //   updateNewCategoryForm({ isFeatured: checked })
                            // }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="display-order">Display Order</Label>
                          <Input
                            id="display-order"
                            type="number"
                            // value={newCategoryForm.displayOrder.toString()}
                            // onChange={(e) =>
                            //   updateNewCategoryForm({
                            //     displayOrder: Number.parseInt(e.target.value) || 0,
                            //   })
                            // }
                          />
                          <p className="text-xs text-muted-foreground">
                            Categories with lower numbers appear first
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="icon">Category Icon</Label>
                          <Select defaultValue="folder-tree">
                            <SelectTrigger id="icon" className="w-full">
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="folder-tree">
                                <div className="flex items-center gap-2">
                                  <FolderTree className="h-4 w-4" />
                                  <span>Folder Tree</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="shopping-bag">
                                <div className="flex items-center gap-2">
                                  <FolderTree className="h-4 w-4" />
                                  <span>Shopping Bag</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="tag">
                                <div className="flex items-center gap-2">
                                  <FolderTree className="h-4 w-4" />
                                  <span>Tag</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="banner">Category Banner</Label>
                          <div className="flex aspect-[3/1] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50">
                            <div className="flex flex-col items-center gap-1">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm">
                                Upload Banner Image
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Recommended size: 1200x400px. Will be displayed at
                            the top of the category page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="meta-title">Meta Title</Label>
                        <Input
                          id="meta-title"
                          placeholder="Category meta title for SEO"
                          //   value={newCategoryForm.metaTitle || newCategoryForm.name}
                          //   onChange={(e) =>
                          //     updateNewCategoryForm({ metaTitle: e.target.value })
                          //   }
                        />
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Recommended length: 50-60 characters
                          </span>
                          <span
                            className={cn(
                              //   (newCategoryForm.metaTitle || newCategoryForm.name)
                              //     .length > 60
                              //     ? "text-red-500"
                              "text-muted-foreground"
                            )}
                          >
                            {/* {
                          (newCategoryForm.metaTitle || newCategoryForm.name)
                            .length
                        } */}
                            /60
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta-description">
                          Meta Description
                        </Label>
                        <Textarea
                          id="meta-description"
                          placeholder="Brief description for search engine results"
                          rows={3}
                          //   value={newCategoryForm.metaDescription}
                          //   onChange={(e) =>
                          //     updateNewCategoryForm({
                          //       metaDescription: e.target.value,
                          //     })
                          //   }
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Recommended length: 150-160 characters</span>
                          {/* <span>{newCategoryForm.metaDescription.length}/160</span> */}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta-keywords">Meta Keywords</Label>
                        <Input
                          id="meta-keywords"
                          placeholder="keyword1, keyword2, keyword3"
                          //   value={newCategoryForm.metaKeywords}
                          //   onChange={(e) =>
                          //     updateNewCategoryForm({ metaKeywords: e.target.value })
                          //   }
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate keywords with commas
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Search Preview</h3>
                        <div className="space-y-1">
                          {/* <div className="text-sm text-blue-600 hover:underline">
                        {newCategoryForm.name || "New Category"} | Your Store
                        Name
                      </div>
                      <div className="text-xs text-green-700">
                        yourstore.com/categories/
                        {newCategoryForm.slug || "category-slug"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {newCategoryForm.metaDescription ||
                          `Browse our selection of ${(newCategoryForm.name || "products").toLowerCase()} at Your Store. Find the best deals on ${(newCategoryForm.name || "items").toLowerCase()} with fast shipping and excellent customer service.`}
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>

            <DialogFooter className="flex items-center justify-between border-t p-6">
              <Button variant="outline" onClick={closeCreateModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
