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
import { useGetProduct } from "../../-api/use-get-product";
import { useParams } from "@tanstack/react-router";
import AddRelatedProductModal from "./related-product-selector";
import { useEffect } from "react";
import type { IRelatedProduct } from "../../-types";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";
import { queryClient } from "@/main";

export function useTempRelatedProducts(
  productId: string,
  initial: IRelatedProduct[]
) {
  const key = ["tempRelated", productId];

  const data = queryClient.getQueryData<IRelatedProduct[]>(key);

  useEffect(() => {
    if (data === undefined) {
      queryClient.setQueryData(key, initial);
    }
  }, [data, initial, key]);

  const setTemp = (newList: IRelatedProduct[]) =>
    queryClient.setQueryData(key, newList);

  return [data ?? initial, setTemp] as const;
}

const RelatedProductsTab = () => {
  const { productId } = useParams({
    strict: false,
  });

  const { data, isLoading } = useGetProduct(productId ?? "");
  const [product, setProduct] = useTempRelatedProducts(
    productId ?? "",
    data?.relatedProducts ?? []
  );
  const form = useFormContext<ProductFormValues>();

  const removeRelatedProduct = (id: string) => {
    setProduct(product.filter((p) => p.id !== id));

    form.setValue(
      "relatedProducts",
      product.map((p) => p.id).filter((productId) => productId !== id),
      {
        shouldDirty: true,
      }
    );
  };

  const addRelatedProduct = (relatedProducts: IRelatedProduct[]) => {
    setProduct(relatedProducts);

    form.setValue(
      "relatedProducts",
      relatedProducts.map((i) => i.id),
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
