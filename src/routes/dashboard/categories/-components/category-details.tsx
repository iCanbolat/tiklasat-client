"use client";

import * as React from "react";
import { Box, Edit, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ICategory } from "../-types";

interface CategoryDetailsProps {
  category: ICategory | null;
}

export function CategoryDetails({ category }: CategoryDetailsProps) {
  return (
    <Card className="h-full w-full">
      <Tabs defaultValue="details">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{category?.name}</CardTitle>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
          </div>
          <CardDescription>View and edit category information</CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Electronics" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" defaultValue="electronics" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue="Electronic devices and accessories"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  defaultValue="Electronics - Shop Online"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  defaultValue="Shop the latest electronic devices and accessories online."
                  rows={2}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subcategories">
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Subcategories</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subcategory
                </Button>
              </div>
              <Separator />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Computers</TableCell>
                    <TableCell>24</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Smartphones</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">
                  Products in this Category
                </h3>
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
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4" />
                        <span>Wireless Earbuds</span>
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
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4" />
                        <span>Bluetooth Speaker</span>
                      </div>
                    </TableCell>
                    <TableCell>EL-002</TableCell>
                    <TableCell>$79.99</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
}
