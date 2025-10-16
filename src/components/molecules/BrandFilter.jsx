import React from "react";

const BrandFilter = ({ brands, selectedBrands, onBrandsChange }) => {
  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {brands.map((brand) => (
          <label key={brand} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandToggle(brand)}
              className="text-primary focus:ring-primary rounded"
            />
            <span className="ml-2 text-sm">{brand}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;