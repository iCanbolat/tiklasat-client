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
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";
import { useGetProduct } from "../../-api/use-get-product";
import { useParams } from "@tanstack/react-router";
import AddRelatedProductModal from "./related-product-selector";
// import { ProductDetailRoute } from "../../$productId";

type Props = {};

const RetaledProductsTab = (props: Props) => {
  const form = useFormContext<ProductFormValues>();
  const { productId } = useParams({ from: "/dashboard/products/$productId" });

  const { data: product, isLoading } = useGetProduct(productId);
  console.log("Relatedp tab", productId, product);

  if(!product) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Related Products</CardTitle>
          <CardDescription>
            Manage related and recommended products
          </CardDescription>
        </div>
        <AddRelatedProductModal
          selectedProducts={product.relatedProducts || []}
          // onProductsChange={setRelatedProducts}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Products loading...
                    </TableCell>
                  </TableRow>
                )}
                {product?.relatedProducts &&
                !isLoading &&
                product?.relatedProducts.length > 0 ? (
                  product.relatedProducts.map((relatedProduct) => (
                    <TableRow key={relatedProduct.id}>
                      <TableCell className="font-medium">
                        {relatedProduct.name}
                      </TableCell>
                      <TableCell>${relatedProduct.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          // onClick={() =>
                          //   removeRelatedProduct(relatedProduct.id)
                          // }
                          type="button"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No related products added yet.
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

export default RetaledProductsTab;
