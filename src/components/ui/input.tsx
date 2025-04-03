import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.ComponentProps<"input"> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, left, right, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex-row gap-2 flex h-9 w-full items-center px-3 rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring disabled:opacity-50",
          className
        )}
      >
        {left && (
          <div className="flex h-full items-center text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
            {left}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "h-full flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
          )}
          type={type}
          {...props}
        />
        {right && (
          <div className="h-full flex items-center text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
            {right}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
