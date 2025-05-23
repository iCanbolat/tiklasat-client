 import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Trash2 } from "lucide-react";
import { useState } from "react";
import type { IProductAttributes } from "../../-types";
 
interface AddAttributesProps {
  onAdd: (attributes: IProductAttributes[]) => void;
  initialAttributes?: IProductAttributes[];
}

export function AddAttributes({ onAdd, initialAttributes = [] }: AddAttributesProps) {
  const [attributes, setAttributes] = useState<IProductAttributes[]>(initialAttributes);
  const [newAttribute, setNewAttribute] = useState<Omit<IProductAttributes, 'id'>>({
    variantType: "",
    value: "",
  });

  const addAttribute = () => {
    if (!newAttribute.variantType || !newAttribute.value) return;

    const updatedAttributes = [
      ...attributes,
      {
        ...newAttribute,
        id: crypto.randomUUID(),
      },
    ];

    setAttributes(updatedAttributes);
    setNewAttribute({ variantType: "", value: "" });
  };

  const removeAttribute = (id: string) => {
    const updatedAttributes = attributes.filter(attr => attr.id !== id);
    setAttributes(updatedAttributes);
  };

  const handleSubmit = () => {
    onAdd(attributes);
    setAttributes([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Attributes</Label>
        {attributes.length > 0 && (
          <div className="space-y-2">
            {attributes.map((attr) => (
              <div key={attr.id} className="flex items-center gap-2 rounded-md border p-2">
                <div className="flex-1">
                  <span className="font-medium">{attr.variantType}</span>: {attr.value}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttribute(attr.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="attribute-name">Name</Label>
          <Input
            id="attribute-name"
            placeholder="e.g., Color, Size"
            value={newAttribute.variantType}
            onChange={(e) => setNewAttribute({...newAttribute, variantType: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attribute-value">Value</Label>
          <Input
            id="attribute-value"
            placeholder="e.g., Red, Large"
            value={newAttribute.value}
            onChange={(e) => setNewAttribute({...newAttribute, value: e.target.value})}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={addAttribute}
            disabled={!newAttribute.variantType || !newAttribute.value}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setAttributes([]);
            setNewAttribute({ variantType: "", value: "" });
          }}
        >
          <X className="mr-2 h-4 w-4" />
          Clear All
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={attributes.length === 0}
        >
          Save Attributes
        </Button>
      </div>
    </div>
  );
}