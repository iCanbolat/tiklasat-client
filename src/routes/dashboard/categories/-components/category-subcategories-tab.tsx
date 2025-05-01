import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash } from "lucide-react";
import type { ICategory } from "../-types";
import { useCategoryDelete } from "../-api/use-delete-category";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useCategoryStore } from "@/lib/category-store";

type Props = {
  categories: ICategory[];
};

const CategorySubcategoriesTab = ({ categories }: Props) => {
  const [checkValue, setCheckValue] = useState(false);
  const { mutate: deleteCategory, isPending } = useCategoryDelete();
  const { openCreateModal } = useCategoryStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Subcategories</h3>
        <Button type="button" onClick={openCreateModal} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
        </Button>
      </div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                {category.isActive ? "Active" : "Not Active"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  {/* <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button> */}

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="ghost" size="icon">
                        <Trash className="h-4 w-4 mr-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="space-y-3">
                      <p className="text-sm font-medium">
                        Are you sure you want to delete this category?
                      </p>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={checkValue}
                          onCheckedChange={(checked) =>
                            setCheckValue(Boolean(checked))
                          }
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Delete associated products as well
                        </label>
                      </div>
                      <Separator />
                      <Button
                        type="button"
                        className="w-full"
                        variant="destructive"
                        onClick={() =>
                          deleteCategory({
                            id: category.id,
                            deleteProducts: checkValue,
                          })
                        }
                      >
                        {isPending && <Loader2 className="animate-spin mr-2" />}
                        Delete
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategorySubcategoriesTab;
