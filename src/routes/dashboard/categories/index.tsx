import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { categoryId } = useParams({ strict: false });

  return (
    <>
      {!categoryId ? (
        <Card className="h-[87.5vh] w-full flex items-center justify-center">
          <CardContent className="text-center p-6">
            <h3 className="text-lg font-medium mb-2">No Category Selected</h3>
            <p className="text-muted-foreground">
              Select a category from the tree to view and edit its details.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Outlet />
    </>
  );
}
