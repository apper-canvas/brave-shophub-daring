import React from "react";

const AvailabilityFilter = ({ availabilityFilter, onAvailabilityChange }) => {
  const options = [
    { value: "all", label: "All Products" },
    { value: "inStock", label: "In Stock Only" },
    { value: "outOfStock", label: "Out of Stock" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="availability"
              checked={availabilityFilter === option.value}
              onChange={() => onAvailabilityChange(option.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityFilter;