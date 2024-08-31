import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onEnterPress?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onEnterPress, ...props }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnterPress) {
        onEnterPress();
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border focus:border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0  focus-visible:ring-offset-0  disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onKeyPress={handleKeyPress}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
