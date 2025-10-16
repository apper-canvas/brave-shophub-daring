import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { getProductById } from "@/services/api/productService";
import { isInCompare } from "@/services/api/comparisonService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/molecules/StarRating";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const { onAddToCart, onAddToCompare } = useOutletContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inCompare, setInCompare] = useState(false);
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const productData = await getProductById(parseInt(id));
      if (productData) {
        setProduct(productData);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    toast.success(`${quantity} × ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleAddToCompare = () => {
    const result = onAddToCompare(product);
    if (result.success) {
      setInCompare(true);
      toast.success("Product added to comparison");
    } else {
      toast.error(result.message);
    }
  };
  if (loading) return <Loading type="product-detail" />;
  if (error) return <Error message={error} onRetry={loadProduct} />;
  if (!product) return <Error message="Product not found" />;

  const isOutOfStock = !product.inStock;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Home
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <button 
          onClick={() => navigate(`/?category=${product.category}`)}
          className="hover:text-primary"
        >
          {product.category}
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={20} />
            {product.reviewCount > 0 && (
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                See all {product.reviewCount} reviews
              </span>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="xl"
            />
            {hasDiscount && (
              <p className="text-sm text-green-600 font-medium">
                You save ₹{(product.originalPrice - product.price).toLocaleString()}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {isOutOfStock ? (
              <Badge variant="error">Out of Stock</Badge>
            ) : (
              <Badge variant="success">In Stock</Badge>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <dt className="text-gray-600 capitalize">{key}:</dt>
                      <dd className="text-gray-900 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4 border-t">
            {!isOutOfStock && (
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </button>
                </div>
              </div>
            )}

<div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  size="lg"
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>
              <Button
                onClick={handleAddToCompare}
                disabled={inCompare}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                <ApperIcon name="Scale" size={20} className="mr-2" />
                {inCompare ? "Added to Compare" : "Add to Compare"}
              </Button>
            </div>

            {isOutOfStock && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                This item is currently out of stock. Check back later for availability.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;