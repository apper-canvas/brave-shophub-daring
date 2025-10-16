import React from "react";

const CategoryFilter = ({ categories, selectedCategories, onCategoriesChange }) => {
  const handleCategoryToggle = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      onCategoriesChange(selectedCategories.filter(c => c !== categoryName));
    } else {
      onCategoriesChange([...selectedCategories, categoryName]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <label key={category.Id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.name)}
              onChange={() => handleCategoryToggle(category.name)}
              className="text-primary focus:ring-primary rounded"
            />
            <span className="ml-2 text-sm">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;