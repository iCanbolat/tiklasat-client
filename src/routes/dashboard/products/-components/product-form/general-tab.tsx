import { useFormContext } from "react-hook-form";
import type {
  ProductCategoryValues,
  ProductFormValues,
} from "./validation-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProductCategorySelector } from "../category-selector";
import { productStatusOptions, type IProductAttributes } from "../../-types";

import { Button } from "@/components/ui/button";
import React from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { AddAttributesDialog } from "../add-attributes/add-attributes-dialog";

const GeneralTab = () => {
  const form = useFormContext<ProductFormValues>();
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const attributes = form.watch("attributes");
  const [tempAttribute, setTempAttribute] = React.useState({
    variantType: "",
    value: "",
  });

  const handleAddAttribute = (newAttributes: IProductAttributes[]) => {
    form.setValue("attributes", [...newAttributes], { shouldDirty: true });
    console.log("newattrbs", newAttributes);
  };

  const startEditing = (id: string) => {
    const attributeToEdit = attributes.find((attr) => attr.id === id);
    if (attributeToEdit) {
      setEditingId(id);
      setTempAttribute({
        variantType: attributeToEdit.variantType,
        value: attributeToEdit.value,
      });
    }
  };

  const saveEdit = () => {
    if (!editingId || !tempAttribute.variantType || !tempAttribute.value)
      return;

    const updatedAttributes = attributes.map((attr) =>
      attr.id === editingId ? { ...attr, ...tempAttribute } : attr
    );

    form.setValue("attributes", updatedAttributes);
    setEditingId(null);
    setTempAttribute({ variantType: "", value: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempAttribute({ variantType: "", value: "" });
  };

  const removeAttribute = (id: string) => {
    const updatedAttributes = form
      .getValues("attributes")
      .filter((attr) => attr.id !== id);
    form.setValue("attributes", updatedAttributes);
    if (editingId === id) cancelEdit();
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    form.setValue("slug", slug);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Manage the basic product details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                    <Input placeholder="product-slug" {...field} />
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
                  This will be used in the URL: yourstore.com/products/
                  <strong>{form.getValues("slug") || "product-slug"}</strong>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Pricing & Categories Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Categories</CardTitle>
          <CardDescription>Manage pricing and categorization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              const selected =
                Array.isArray(field.value) && field.value.length > 0
                  ? field.value[0]
                  : null;

              const handleChange = (cat: ProductCategoryValues) => {
                field.onChange([cat]); 
              };
              return (
                <FormItem>
                  <FormLabel>Product Categories</FormLabel>
                  <FormControl>
                    <ProductCategorySelector
                      selectedCategory={selected}
                      onCategoryChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select categories to assign this product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </CardContent>
      </Card>

      {/* Status & Visibility Card - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Visibility</CardTitle>
          <CardDescription>
            Control product visibility and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productStatusOptions.slice(1).map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon && <option.icon className="h-4 w-4" />}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Controls whether the product is visible to customers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Featured Product</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">
                      Display this product in featured sections
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Product URL Preview</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                yourstore.com/products/
              </span>
              <span className="font-medium">{form.watch("slug")}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The product URL is automatically generated from the SKU. Make sure
              your SKU is unique and contains only letters, numbers, and
              hyphens.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Attributes Card  */}
      <Card>
        <CardHeader>
          <CardTitle>Product Attributes</CardTitle>
          <CardDescription>
            Technical details and specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 overflow-y-auto">
          {attributes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm text-muted-foreground ">
                No attributes added yet.
              </p>
            </div>
          )}
          <div className="space-y-2">
            {attributes.map((attr) => (
              <div
                key={attr.id}
                className="flex items-center gap-4 rounded-md border p-3"
              >
                {editingId === attr.id ? (
                  <>
                    <div className="grid flex-1 grid-cols-2 gap-4">
                      <Input
                        value={tempAttribute.variantType}
                        onChange={(e) =>
                          setTempAttribute({
                            ...tempAttribute,
                            variantType: e.target.value,
                          })
                        }
                        placeholder="Attribute name"
                      />
                      <Input
                        value={tempAttribute.value}
                        onChange={(e) =>
                          setTempAttribute({
                            ...tempAttribute,
                            value: e.target.value,
                          })
                        }
                        placeholder="Attribute value"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={saveEdit}
                        disabled={
                          !tempAttribute.variantType || !tempAttribute.value
                        }
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{attr.variantType}</p>
                      <p className="text-sm text-muted-foreground">
                        {attr.value}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(attr.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttribute(attr.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6">
          <p className="text-sm text-muted-foreground">
            {attributes.length} attributes
          </p>
          <AddAttributesDialog
            onSave={handleAddAttribute}
            initialAttributes={attributes}
            trigger={
              <Button variant="outline" type="button">
                Add Attributes
              </Button>
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeneralTab;
