import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, onUpdateQuantity, onRemoveItem } = useOutletContext();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Empty
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet. Start shopping to find great deals!"
          actionText="Start Shopping"
          onAction={() => navigate("/")}
          icon="ShoppingCart"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.Id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex space-x-4">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => navigate(`/product/${item.Id}`)}
                />
                
                <div className="flex-1">
                  <h3 
                    className="font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${item.Id}`)}
                  >
                    {item.name}
                  </h3>
                  
                  {item.brand && (
                    <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                  )}
                  
                  <div className="mt-2">
                    <PriceDisplay 
                      price={item.price} 
                      originalPrice={item.originalPrice} 
                      size="base" 
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.Id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <ApperIcon name="Minus" size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.Id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <ApperIcon name="Plus" size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item.Id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors text-sm"
                    >
                      <ApperIcon name="Trash2" size={16} />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Item total:</span>
                      <span className="font-semibold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              
              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              
              <hr />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full mb-4" size="lg">
              Proceed to Checkout
            </Button>

            <Button 
              variant="secondary" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;