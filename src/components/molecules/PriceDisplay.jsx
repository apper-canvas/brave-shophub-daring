import React from "react";
import Badge from "@/components/atoms/Badge";

const PriceDisplay = ({ 
  price, 
  originalPrice, 
  currency = "₹", 
  size = "base",
  showDiscount = true 
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl font-bold"
  };

  return (
    <div className="flex items-center space-x-2 flex-wrap">
      <span className={`font-bold text-primary ${sizeClasses[size]}`}>
        {currency}{price?.toLocaleString()}
      </span>
      {hasDiscount && (
        <>
          <span className="text-gray-500 line-through text-sm">
            {currency}{originalPrice?.toLocaleString()}
          </span>
          {showDiscount && discountPercent > 0 && (
            <Badge variant="discount" className="text-xs">
              {discountPercent}% OFF
            </Badge>
          )}
        </>
      )}
    </div>
  );
};

export default PriceDisplay;