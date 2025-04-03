import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type Props = {
  message?: string;
};

const FormError = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-2 rounded-md flex items-center gap-x-2 text-xs text-destructive">
      <ExclamationTriangleIcon className="h-3 w-3" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
