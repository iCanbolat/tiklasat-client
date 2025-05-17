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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";

type InventoryTabProps = {
  form: UseFormReturn<ProductFormValues>;
};

const ProductInventoryTab = ({ form }: InventoryTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
        <CardDescription>
          Manage stock levels and inventory settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="manageStock"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Manage Stock</FormLabel>
                  <FormDescription>
                    Track inventory for this product
                  </FormDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    When enabled, stock will be reduced with each sale and
                    products can go out of stock
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowBackorders"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Allow Backorders</FormLabel>
                  <FormDescription>
                    Allow customers to purchase when out of stock
                  </FormDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    When enabled, customers can still purchase this product when
                    it's out of stock
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockUnderThreshold"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormDescription>
                    Get notified when product stock reaches this amount
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="w-[100px]"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInventoryTab;
