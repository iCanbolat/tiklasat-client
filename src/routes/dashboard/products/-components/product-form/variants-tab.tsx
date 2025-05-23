import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Trash, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";
import { useGetProduct } from "../../-api/use-get-product";
import { useParams } from "@tanstack/react-router";
import { AddAttributesDialog } from "../add-attributes/add-attributes-dialog";
import type { IProductAttributes } from "../../-types";
import { useState } from "react";
import { generateSKUFromAttributes } from "@/lib/utils";
import ProductCreateModal from "../product-create-modal";
import { useLayoutStore } from "@/lib/layout-store";

const ProductVariantTab = () => {
  const { getValues } = useFormContext<ProductFormValues>();
  const { openCreateModal } = useLayoutStore();
  const { productId } = useParams({ strict: false });
  const { data } = useGetProduct(productId ?? "");

  const [variants, setVariants] = useState(data?.variants || []);
  console.log("variannts", variants);

  // const handleAddVariant = (attributes: IProductAttributes[]) => {
  //   const newVariant = {
  //     id: crypto.randomUUID(),
  //     attributes,
  //     sku: generateSKUFromAttributes(attributes),
  //     stockQuantity: 10,
  //   };
  //   setVariants([...variants, newVariant]);
  //   // You might also want to update the form values here
  // };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>
            Manage product variations like color, size, etc.
          </CardDescription>
        </div>
        <Button variant={"outline"} type="button" onClick={openCreateModal}>
          <PlusCircleIcon />
          Add Variant
        </Button>
        {/* <AddAttributesDialog
          onSave={handleAddVariant}
          trigger={
            <Button variant="outline" type="button">
              Add Variant
            </Button>
          }
        /> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.length > 0 ? (
                  variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium uppercase">
                        {variant.attributes
                          .map(
                            (attribute) =>
                              attribute.variantType + "-" + attribute.value
                          )
                          .join(", ")}
                      </TableCell>
                      <TableCell>{variant.sku}</TableCell>
                      <TableCell>{variant.stockQuantity}</TableCell>
                      <TableCell>${variant.price}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeVariant(variant.id)}
                          type="button"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="h-24">
                    <TableCell colSpan={5} className="text-center">
                      No variants added yet. Add a variant to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductVariantTab;
