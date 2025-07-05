import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NotificationType } from "../-types";

interface NotificationsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypes: NotificationType[];
  onToggleType: (type: NotificationType) => void;
}

export function NotificationsFilters({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onToggleType,
}: NotificationsFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notifications..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedTypes.includes("order")}
            onCheckedChange={() => onToggleType("order")}
          >
            Orders
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedTypes.includes("inventory")}
            onCheckedChange={() => onToggleType("inventory")}
          >
            Inventory
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedTypes.includes("customer")}
            onCheckedChange={() => onToggleType("customer")}
          >
            Customers
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedTypes.includes("payment")}
            onCheckedChange={() => onToggleType("payment")}
          >
            Payments
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedTypes.includes("system")}
            onCheckedChange={() => onToggleType("system")}
          >
            System
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
