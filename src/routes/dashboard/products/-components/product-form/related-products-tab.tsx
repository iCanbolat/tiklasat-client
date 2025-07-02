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
import {
  useGetProduct,
  useTempRelatedProducts,
} from "../../-api/use-get-product";
import { useParams } from "@tanstack/react-router";
import AddRelatedProductModal from "./related-product-selector";
import { useEffect } from "react";
import type { IRelatedProduct } from "../../-types";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";

const RelatedProductsTab = () => {
  const { productId } = useParams({ from: "/dashboard/products/$productId" });

  const { data, isLoading } = useGetProduct(productId);
  const [product, setProduct] = useTempRelatedProducts(
    productId,
    data?.relatedProducts ?? []
  );
  const form = useFormContext<ProductFormValues>();

  const removeRelatedProduct = (id: string) => {
    setProduct(product.filter((p) => p.id !== id));

    form.setValue(
      "relatedProducts",
      product.map((p) => p.id).filter((productId) => productId !== id)
    );
  };

  const addRelatedProduct = (relatedProducts: IRelatedProduct[]) => {
    setProduct(relatedProducts);
    console.log(relatedProducts);

    form.setValue(
      "relatedProducts",
      relatedProducts
        .map((i) => i.id)
        .filter((id) => !data?.relatedProducts?.map((p) => p.id).includes(id)),
      {
        shouldDirty: true,
      }
    );
  };
  useEffect(() => {
    if (data && !product.length) {
      setProduct(data.relatedProducts ?? []);
    }
  }, [data, product, setProduct]);

  if (!data) return null;

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
          selectedProducts={product}
          onProductsChange={addRelatedProduct}
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
                {product && !isLoading && product?.length > 0 ? (
                  product.map((relatedProduct) => (
                    <TableRow key={relatedProduct.id}>
                      <TableCell className="font-medium">
                        {relatedProduct.name}
                      </TableCell>
                      <TableCell>${relatedProduct.price}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            removeRelatedProduct(relatedProduct.id)
                          }
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

export default RelatedProductsTab;
