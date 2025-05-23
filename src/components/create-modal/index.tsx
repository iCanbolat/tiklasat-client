import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLayoutStore } from "@/lib/layout-store";

interface CreateFormModalProps<T extends Record<string, any>> {
  // isOpen: boolean;
  // onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  form: any;
  isSubmitting: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  submitButtonText: React.ReactNode;
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
    isDisabled?: boolean;
  }[];
  cancelButtonText?: string;
}

export function CreateFormModal<T extends Record<string, any>>({
  // isOpen,
  // onClose,
  onSubmit,
  form,
  isSubmitting,
  title,
  description,
  icon,
  submitButtonText,
  tabs,
  cancelButtonText = "Cancel",
}: CreateFormModalProps<T>) {
  const { closeCreateModal, isCreateModalOpen } = useLayoutStore();
  return (
    <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
      <DialogContent className="max-h-[95vh] max-w-4xl sm:max-w-xl md:max-w-6xl overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue={tabs[0].value} className="px-6">
              <TabsList className="mb-4 w-full justify-start">
                {tabs.map((tab) => (
                  <TabsTrigger
                    disabled={tab.isDisabled}
                    key={tab.value}
                    value={tab.value}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="h-[68vh] overflow-auto">
                <div className="pb-6">
                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="space-y-6"
                    >
                      {tab.content}
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>

            <DialogFooter className="flex items-center justify-between border-t p-3">
              <Button
                variant="outline"
                onClick={closeCreateModal}
                type="button"
              >
                {cancelButtonText}
              </Button>
              <Button type="submit" disabled={isSubmitting} onClick={() => console.log(form.getValues())}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
