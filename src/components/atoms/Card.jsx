import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, children, hover = false, ...props }, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-sm border border-gray-100";
  const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-200" : "";

  return (
    <div
      ref={ref}
      className={cn(baseStyles, hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;