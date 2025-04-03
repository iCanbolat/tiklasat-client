import { CircleCheck } from "lucide-react";

type Props = {
  message?: string;
};

const FormSuccess = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 p-2 rounded-md flex items-center gap-x-2 text-xs text-emerald-500">
      <CircleCheck className="h-3 w-3" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
