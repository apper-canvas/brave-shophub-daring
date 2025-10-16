import React from "react";

const PriceFilter = ({ priceRange, onPriceRangeChange, maxPrice = 100000 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Min Price: ₹{priceRange[0].toLocaleString()}</label>
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="1000"
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([parseInt(e.target.value), priceRange[1]])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Max Price: ₹{priceRange[1].toLocaleString()}</label>
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="1000"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;