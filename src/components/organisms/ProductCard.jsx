import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/molecules/StarRating";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProductCard = ({ product, onAddToCart, onAddToCompare }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

const handleAddToCompare = (e) => {
    e.stopPropagation();
    if (typeof onAddToCompare === 'function') {
      const result = onAddToCompare(product);
      if (result?.success) {
        toast.success("Product added to comparison");
      } else {
        toast.error(result?.message || "Failed to add product to comparison");
      }
    } else {
      toast.error("Comparison feature not available");
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };
  const isOutOfStock = !product.inStock;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Card hover className="cursor-pointer overflow-hidden group" onClick={handleCardClick}>
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {hasDiscount && (
            <Badge variant="discount" className="text-xs font-bold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="error" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size={14} />
        </div>

        {/* Price */}
        <div className="mb-4">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="base"
          />
        </div>

        {/* Add to Cart Button */}
<div className="space-y-2">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
            size="sm"
          >
            <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
          <Button
            onClick={handleAddToCompare}
            variant="secondary"
            className="w-full"
            size="sm"
          >
            <ApperIcon name="Scale" size={16} className="mr-2" />
            Compare
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;