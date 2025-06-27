import { Badge } from "@/components/ui/badge";
import { ProductStatusEnum, type ProductStatusType } from "../../../-types";

export const getStatusBadge = (status: ProductStatusType) => {
  switch (status) {
    case ProductStatusEnum.ACTIVE:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
          Active
        </Badge>
      );
    case ProductStatusEnum.LOW_STOCK:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
          Low Stock
        </Badge>
      );
    case ProductStatusEnum.OUT_OF_STOCK:
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
          Out of Stock
        </Badge>
      );
    case ProductStatusEnum.ARCHIVED:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">
          Archived
        </Badge>
      );
  }
};

export const getStatusDisplayName = (status: ProductStatusEnum) => {
  switch (status) {
    case ProductStatusEnum.ACTIVE:
      return "Active";
    case ProductStatusEnum.LOW_STOCK:
      return "Low Stock";
    case ProductStatusEnum.OUT_OF_STOCK:
      return "Out of Stock";
    case ProductStatusEnum.ARCHIVED:
      return "Archived";
    default:
      return status;
  }
};
