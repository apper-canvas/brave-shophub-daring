import React from "react";
import ApperIcon from "@/components/ApperIcon";

const RatingFilter = ({ minRating, onRatingChange }) => {
  const ratings = [0, 1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
      <div className="space-y-2">
        {ratings.map((rating) => (
          <label key={rating} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === rating}
              onChange={() => onRatingChange(rating)}
              className="text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm flex items-center">
              {rating === 0 ? (
                "All Ratings"
              ) : (
                <>
                  {rating}
                  <ApperIcon name="Star" size={14} className="ml-1 text-primary fill-primary" />
                  & Up
                </>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;