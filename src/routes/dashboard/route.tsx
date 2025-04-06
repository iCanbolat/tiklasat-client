import {
  Outlet,
  createFileRoute,
} from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { BreadcrumbDemo } from "@/components/breadcrumb";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
  //   loader: () => ({
  //     crumb: "Dashboard",
  //   }),
});

function DashboardComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <section className="flex items-center mt-4 pb-2 pl-2">
          <SidebarTrigger />
          <BreadcrumbDemo />
        </section>
        <hr />
        <section className="p-3 h-[calc(100vh-4rem)] bg-red-600">
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
}
