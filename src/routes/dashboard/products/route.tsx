import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/products")({
  component: () => <Outlet />,
  loader: () => ({
    crumb: "Products",
  }),
});
