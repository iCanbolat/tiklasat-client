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
import { PlusCircleIcon, Trash2 } from "lucide-react";
import { useGetProduct } from "../../-api/use-get-product";
import { useParams } from "@tanstack/react-router";

import ProductCreateModal from "../product-create-modal";
import { useLayoutStore } from "@/lib/layout-store";
import { useDeleteProduct } from "../../-api/use-delete-product";

const ProductVariantTab = () => {
  const { openCreateModal } = useLayoutStore();
  const { productId } = useParams({ strict: false });
  const { data } = useGetProduct(productId ?? "");
  const { mutateAsync: deleteProduct } = useDeleteProduct(productId ?? "");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>
            Manage product variations like color, size, etc.
          </CardDescription>
        </div>

        <ProductCreateModal />

        <Button variant={"outline"} type="button" onClick={openCreateModal}>
          <PlusCircleIcon />
          Add Variant
        </Button>
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
                {data?.variants && data.variants.length > 0 ? (
                  data.variants.map((variant) => (
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
                          onClick={() => deleteProduct([variant.id])}
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
