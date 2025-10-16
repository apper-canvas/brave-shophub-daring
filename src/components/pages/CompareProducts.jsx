import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCompareItems } from "@/services/api/comparisonService";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StarRating from "@/components/molecules/StarRating";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CompareProducts = () => {
  const navigate = useNavigate();
  const { onRemoveFromCompare, onAddToCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompareItems();
  }, []);

  const loadCompareItems = async () => {
    try {
      setLoading(true);
      const items = getCompareItems();
      setProducts(items);
    } catch (error) {
      console.error("Failed to load comparison items:", error);
      toast.error("Failed to load comparison items");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId) => {
    onRemoveFromCompare(productId);
    setProducts(prev => prev.filter(p => p.Id !== productId));
    toast.success("Product removed from comparison");
  };

  const handleAddToCart = (product) => {
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Get all unique specification keys from all products
  const getAllSpecKeys = () => {
    const keys = new Set();
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => keys.add(key));
      }
    });
    return Array.from(keys).sort();
  };

  if (loading) {
    return <Loading />;
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Empty
          icon="Scale"
          title="No Products to Compare"
          description="Add products to comparison from product pages to see them here."
        >
          <Button onClick={() => navigate("/")} className="mt-6">
            <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
            Browse Products
          </Button>
        </Empty>
      </div>
    );
  }

  const specKeys = getAllSpecKeys();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compare Products
          </h1>
          <p className="text-gray-600">
            Comparing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add More Products
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isOutOfStock = !product.inStock;
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;

          return (
            <Card key={product.Id} className="relative">
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product.Id)}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Remove from comparison"
              >
                <ApperIcon name="X" size={16} className="text-gray-600" />
              </button>

              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="discount" className="text-xs font-bold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="error">Out of Stock</Badge>
                  </div>
                )}
              </div>

              <div className="p-4">
                {/* Brand */}
                {product.brand && (
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.brand}
                  </p>
                )}

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="mb-3">
                  <StarRating 
                    rating={product.rating} 
                    reviewCount={product.reviewCount} 
                    size={14} 
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <PriceDisplay
                    price={product.price}
                    originalPrice={product.originalPrice}
                    size="lg"
                  />
                </div>

                {/* Specifications */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Specifications
                  </h4>
                  {specKeys.map(key => {
                    const value = product.specifications?.[key];
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{key}:</span>
                        <span className="text-gray-900 text-right">
                          {value || '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2">
                  <Button
                    onClick={() => handleViewProduct(product.Id)}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <ApperIcon name="Eye" size={16} className="mr-2" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    size="sm"
                    className="w-full"
                  >
                    <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Empty slots for visual balance */}
        {[...Array(3 - products.length)].map((_, index) => (
          <Card 
            key={`empty-${index}`} 
            className="border-2 border-dashed border-gray-300 bg-gray-50"
          >
            <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-t-lg">
              <div className="text-center p-6">
                <ApperIcon name="Plus" size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Add product to compare</p>
              </div>
            </div>
            <div className="p-4">
              <Button
                onClick={() => navigate("/")}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                Browse Products
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Table for Desktop */}
      <div className="hidden lg:block mt-12">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Specification
                  </th>
                  {products.map(product => (
                    <th key={product.Id} className="text-left p-4 font-semibold text-gray-900">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Price</td>
                  {products.map(product => (
                    <td key={product.Id} className="p-4">
                      <PriceDisplay
                        price={product.price}
                        originalPrice={product.originalPrice}
                        size="base"
                      />
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Rating</td>
                  {products.map(product => (
                    <td key={product.Id} className="p-4">
                      <StarRating 
                        rating={product.rating} 
                        reviewCount={product.reviewCount} 
                        size={14} 
                      />
                    </td>
                  ))}
                </tr>

                {/* Availability Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Availability</td>
                  {products.map(product => (
                    <td key={product.Id} className="p-4">
                      <Badge variant={product.inStock ? "success" : "error"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Specification Rows */}
                {specKeys.map(key => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-700">{key}</td>
                    {products.map(product => {
                      const value = product.specifications?.[key];
                      return (
                        <td key={product.Id} className="p-4 text-gray-900">
                          {value || '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompareProducts;