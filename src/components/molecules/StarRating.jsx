import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StarRating = ({ rating = 0, reviewCount = 0, size = 16, showCount = true }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= Math.floor(rating);
    const isHalfFilled = starNumber === Math.ceil(rating) && rating % 1 !== 0;

    return (
      <div key={index} className="relative">
        <ApperIcon
          name="Star"
          size={size}
          className={`${isFilled || isHalfFilled ? "text-yellow-400" : "text-gray-300"} ${
            isFilled || isHalfFilled ? "fill-current" : ""
          }`}
        />
        {isHalfFilled && (
          <ApperIcon
            name="Star"
            size={size}
            className="absolute top-0 left-0 text-yellow-400 fill-current"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        )}
      </div>
    );
  });

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-0.5">{stars}</div>
      {showCount && reviewCount > 0 && (
        <span className="text-sm text-gray-600">({reviewCount})</span>
      )}
    </div>
  );
};

export default StarRating;