import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";
import {
  Card,
  CardContent,
  CardDescription,
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
import { productStatusOptions } from "../../-types";

type GeneralTabProps = {
  form: UseFormReturn<ProductFormValues>;
};

const GeneralTab = ({ form }: GeneralTabProps) => {
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
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Categories</FormLabel>
                <FormControl>
                  <ProductCategorySelector
                    selectedCategory={field.value}
                    onCategoryChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Select categories to assign this product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Status & Visibility Card - Full Width */}
      <Card className="md:col-span-2">
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
    </div>
  );
};

export default GeneralTab;
