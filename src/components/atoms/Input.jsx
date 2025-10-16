import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  placeholder, 
  className, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary";
  const errorStyles = error ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : "border-gray-300";

  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;