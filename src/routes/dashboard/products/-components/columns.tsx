import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { ProductStatusEnum, type ProductServiceResponse } from "../-types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Edit,
  Loader2,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteProduct } from "../-api/use-delete-product";
import { useState } from "react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case ProductStatusEnum.ACTIVE:
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 hover:bg-green-50"
        >
          Active
        </Badge>
      );
    case ProductStatusEnum.LOW_STOCK:
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
        >
          Low Stock
        </Badge>
      );
    case ProductStatusEnum.OUT_OF_STOCK:
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 hover:bg-red-50"
        >
          Out of Stock
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const columns: ColumnDef<ProductServiceResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative h-12 w-8">
        <img
          src={row?.original?.images?.[0]?.url || "/placeholder.svg"}
          alt={row.original.product.name}
          className="rounded-md object-cover"
        />
        {row.original.product.isFeatured && (
          <div
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary"
            title="Featured Product"
          />
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "productName",
    accessorFn: (row) => row.product.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("productName")}</div>
    ),
  },
  {
    id: "sku",
    accessorFn: (row) => row.product.sku,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("sku")}</div>,
  },
  {
    id: "price",
    accessorFn: (row) => row.product.price,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>${row.getValue("price")}</div>,
  },
  {
    id: "stock",
    accessorFn: (row) => row.product.stockQuantity,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("stock")}</div>,
  },
  {
    id: "category",
    accessorFn: (row) => row?.category?.[0]?.name,
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span>{row.getValue("category")}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "status",
    accessorFn: (row) => row.product.status,
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      const navigate = useNavigate();
      const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

      const [open, setOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await deleteProduct([data.product.id]);
          setOpen(false);
        } catch (error) {
          console.error("Deletion failed:", error);
        }
      };

      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: "/dashboard/products/$productId",
                  params: { productId: data.product.id },
                })
              }
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <>
                  <Trash className="mr-1 h-4 w-4 text-destructive" />
                  <h5 className="text-destructive text-sm">Delete Product</h5>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
