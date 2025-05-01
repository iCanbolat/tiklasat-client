import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { type CategoryFormValues } from "./validation-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronRight, FolderTree, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCategoriesSuspense } from "../../-api/use-categories";
import type { ICategory } from "../../-types";
import { Badge } from "@/components/ui/badge";

type Props = {
  form: UseFormReturn<CategoryFormValues>;
};
const InfoTabForm = ({ form }: Props) => {
  const { data: categories } = useCategoriesSuspense();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  console.log("parentIdInfotab", form.watch("parentId"));

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    form.setValue("slug", slug);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        form.setValue("image", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderCategoryOption = (category: ICategory, level = 0) => {
    return (
      <React.Fragment key={category.id}>
        <SelectItem
          value={category.id}
          className={cn("flex items-center gap-2", level > 0 && "pl-[20px]")}
        >
          <div className="flex items-center gap-2">
            {level > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
            <span>{category.name}</span>
          </div>
        </SelectItem>
        {category.subcategories.map((child: any) =>
          renderCategoryOption(child, level + 1)
        )}
      </React.Fragment>
    );
  };

  const renderedCategoryOptions = React.useMemo(() => {
    return categories.map((category) => renderCategoryOption(category));
  }, [categories]);

  return (
    <div className="grid gap-6 xl:grid-cols-2 sm:grid-cols-1 relative">
      <div className="space-y-4 xl:order-1 lg:order-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Electronics, Clothing, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="category-slug" {...field} />
                </FormControl>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => generateSlug(form.getValues("name"))}
                  title="Generate slug"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>
                This will be used in the URL: yourstore.com/categories/
                <strong>{form.getValues("slug") || "category-slug"}</strong>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this category..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select value={field.value ?? "none"}>
                <FormControl>
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="None (Top Level Category)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">
                    None (Top Level Category)
                  </SelectItem>
                  {renderedCategoryOptions}
                </SelectContent>
              </Select>
              <FormDescription>
                Select a parent to create a subcategory
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 xl:order-2 lg:order-1">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "group relative flex aspect-[2/1.2] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all hover:bg-muted/50",
                    field.value
                      ? "border-transparent"
                      : "border-muted-foreground/25"
                  )}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {field.value ? (
                    <>
                      <div className="relative h-full w-full overflow-hidden rounded-lg group">
                        <img
                          src={field.value || ""}
                          alt="Category preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button variant="secondary">Change Image</Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-muted p-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">
                        Upload Category Image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag & drop or click to browse
                      </p>
                    </>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Recommended size: 800x800px. Max file size: 2MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Category Preview</h3>
          <div className="flex items-center gap-3 rounded-md border p-3 mb-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
              {form.watch("image") ? (
                <img
                  src={form.watch("image") || "/placeholder.svg"}
                  alt="Category preview"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FolderTree className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">
                {form.watch("name") || "New Category"}
              </span>
              <span className="text-sm text-muted-foreground">
                {form.watch("parentId") ? "Subcategory" : "Top Level Category"}
              </span>
            </div>
            {form.watch("isFeatured") && (
              <Badge variant="secondary" className="ml-auto">
                Featured
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {form.watch("parentId") && (
              <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                <span>Parent:</span>
                <span className="font-medium">
                  {categories.find((c) => c.id === form.watch("parentId"))
                    ?.name ||
                    categories
                      .flatMap((c) => c.subcategories)
                      .find((c) => c.id === form.watch("parentId"))?.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
              <span>Slug:</span>
              <span className="font-medium">
                {form.watch("slug") || "category-slug"}
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
              <span>Status:</span>
              <span
                className={cn(
                  "font-medium",
                  form.watch("isActive") ? "text-green-600" : "text-red-600"
                )}
              >
                {form.watch("isActive") ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoTabForm;
