 import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
//  import { toast } from 'sonner';

// type Props = {
//   setOptimisticItem: (action: {
//     action: OptimisticUpdateTypes;
//     newCategory: Category;
//   }) => void;
//   category: Category;
// };

const CategoryDropdown = () => {
  //   const [isPending, startTransition] = useTransition();

  const handleDelete = (
    // event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // event.stopPropagation();
    // startTransition(() => {
    //   setOptimisticItem({
    //     action: OptimisticUpdateTypes.DELETE,
    //     newCategory: category,
    //   });
    //   toast.success(category.name + ' category deleted!');
    //   deleteCategory(category.id).then((res) => {
    //     console.log(res);
    //     if (res?.success && !res.success) {
    //       toast.error(res?.message);
    //     }
    //   });
    // });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            className="hover:bg-white/40 rounded-full w-7 h-7 cursor-pointer"
            variant={"ghost"}
          >
            <DotsHorizontalIcon color="#FFF" className="w-6 h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="space-x-1 cursor-pointer">
            <Pencil color="black" size={16} />
            <h1>Edit</h1>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="space-x-1 cursor-pointer"
          >
            <Trash2 color="#b91c1c" size={16} />
            <h1 className="text-red-700 font-semibold ">Delete</h1>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CategoryDropdown;
