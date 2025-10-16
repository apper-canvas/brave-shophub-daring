import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBrands, getCategories, getProducts } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import RatingFilter from "@/components/molecules/RatingFilter";
import PriceFilter from "@/components/molecules/PriceFilter";
import AvailabilityFilter from "@/components/molecules/AvailabilityFilter";
import BrandFilter from "@/components/molecules/BrandFilter";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import ProductCard from "@/components/organisms/ProductCard";

const ProductGrid = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [brands, setBrands] = useState([]);
useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Update filters based on URL params
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    if (category) {
      setSelectedCategories([category]);
    }
    setSearchQuery(search);
  }, [searchParams]);

const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, categoriesData, brandsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesRating = minRating === 0 || (product.rating && product.rating >= minRating);
    const matchesAvailability = 
      availabilityFilter === "all" || 
      (availabilityFilter === "inStock" && product.inStock) ||
      (availabilityFilter === "outOfStock" && !product.inStock);
    
    return matchesCategory && matchesPrice && matchesSearch && matchesBrand && matchesRating && matchesAvailability;
  });

const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setSelectedBrands([]);
    setMinRating(0);
    setAvailabilityFilter("all");
    navigate("/");
  };

  if (loading) return <Loading type="products" />;
  if (error) return <Error message={error} onRetry={loadData} />;

const hasActiveFilters = selectedCategories.length > 0 || searchQuery || priceRange[0] > 0 || priceRange[1] < 100000 || selectedBrands.length > 0 || minRating > 0 || availabilityFilter !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border w-full justify-between"
            >
              <span className="flex items-center space-x-2">
                <ApperIcon name="Filter" size={20} />
                <span>Filters</span>
              </span>
              <ApperIcon name={showFilters ? "ChevronUp" : "ChevronDown"} size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
            {hasActiveFilters && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <button
                  onClick={handleClearFilters}
                  className="flex items-center space-x-2 text-primary hover:text-accent transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                  <span className="text-sm font-medium">Clear All Filters</span>
                </button>
              </div>
            )}
            
<CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
            
            <BrandFilter
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
            />
            
            <RatingFilter
              minRating={minRating}
              onRatingChange={setMinRating}
            />
            
            <AvailabilityFilter
              availabilityFilter={availabilityFilter}
              onAvailabilityChange={setAvailabilityFilter}
            />
            
            <PriceFilter
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Header */}
<div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 
                 selectedCategories.length > 0 ? selectedCategories.join(", ") : "All Products"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <Empty
              title="No products found"
              message={hasActiveFilters ? 
                "Try adjusting your filters to see more results" : 
                "No products are currently available"
              }
              actionText="Clear Filters"
              onAction={hasActiveFilters ? handleClearFilters : undefined}
              icon="Package"
            />
) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.Id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;