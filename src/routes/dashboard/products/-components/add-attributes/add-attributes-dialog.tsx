import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { IProductAttributes } from "../../-types";
import { AddAttributes } from ".";

interface AddAttributesDialogProps {
  onSave: (attributes: IProductAttributes[]) => void;
  trigger: React.ReactNode;
  initialAttributes?: IProductAttributes[];
}

export function AddAttributesDialog({
  onSave,
  trigger,
  initialAttributes,
}: AddAttributesDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Variant Attributes</DialogTitle>
        </DialogHeader>
        <AddAttributes
          onAdd={(attributes) => {
            onSave(attributes);
            setOpen(false);
          }}
          initialAttributes={initialAttributes}
        />
      </DialogContent>
    </Dialog>
  );
}
