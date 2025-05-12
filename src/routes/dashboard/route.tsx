import { Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { BreadcrumbDemo } from "@/components/breadcrumb";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Trash } from "lucide-react";
import { useLayoutStore } from "@/lib/layout-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
  loader: () => ({
    crumb: "Dashboard",
  }),
});

function DashboardComponent() {
  const matches = useMatches();
  const { deleteFn, formSubmitFn, isPending } = useLayoutStore();

  const isCategoryOrProductEditRoute = matches.some(
    (match) =>
      match.routeId === "/dashboard/categories/$categoryId" ||
      match.routeId === "/dashboard/products/$productId"
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <section className="flex items-center mt-4 pb-2 pl-2 w-full">
          <div className="flex grow items-center">
            <SidebarTrigger />
            <BreadcrumbDemo />
          </div>
          {isCategoryOrProductEditRoute && (
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-destructive"
                    disabled={isPending}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the product and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteFn?.()}
                      className="bg-destructive cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => formSubmitFn?.()} disabled={isPending}>
                {false ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </section>
        <hr />
        <section className="p-3 h-[calc(100vh-3.9rem)] overflow-auto bg-gray-100">
          <Outlet />
        </section>
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
