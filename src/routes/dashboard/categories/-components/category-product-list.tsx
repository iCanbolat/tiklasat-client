import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Box, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { IProduct } from "../-types";

type Props = {
  products: IProduct[];
};

const CategoryProductList = ({ products }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Products in this Category</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  <span>{product.name}</span>
                </div>
              </TableCell>
              <TableCell>EL-001</TableCell>
              <TableCell>$49.99</TableCell>
              <TableCell>24</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryProductList;
