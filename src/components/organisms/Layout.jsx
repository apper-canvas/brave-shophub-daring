import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCartItems, removeFromCart, updateCartItem } from "@/services/api/cartService";
import { addToCompare, getCompareItems, removeFromCompare } from "@/services/api/comparisonService";
import Header from "@/components/organisms/Header";
import CartDrawer from "@/components/organisms/CartDrawer";
const Layout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    loadCartItems();
    loadCompareItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  };

  const loadCompareItems = () => {
    try {
      const items = getCompareItems();
      setCompareItems(items);
    } catch (error) {
      console.error("Failed to load compare items:", error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      await updateCartItem(productId, { quantity: newQuantity });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.Id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems(prevItems => prevItems.filter(item => item.Id !== productId));
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

const handleAddToCart = async (product) => {
    try {
      const existingItem = cartItems.find(item => item.Id === product.Id);
      if (existingItem) {
        await handleUpdateQuantity(product.Id, existingItem.quantity + 1);
      } else {
        const newItem = { ...product, quantity: 1 };
        await updateCartItem(product.Id, newItem);
        setCartItems(prevItems => [...prevItems, newItem]);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleAddToCompare = (product) => {
    const result = addToCompare(product);
    if (result.success) {
      setCompareItems(result.items);
    }
    return result;
  };

  const handleRemoveFromCompare = (productId) => {
    const result = removeFromCompare(productId);
    if (result.success) {
      setCompareItems(result.items);
    }
    return result;
  };

const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const compareCount = compareItems.length;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItemCount} 
        compareCount={compareCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <main>
        <Outlet context={{ 
          cartItems, 
          compareItems,
          onAddToCart: handleAddToCart,
          onUpdateQuantity: handleUpdateQuantity,
          onRemoveItem: handleRemoveItem,
          onOpenCart: () => setIsCartOpen(true),
          onAddToCompare: handleAddToCompare,
          onRemoveFromCompare: handleRemoveFromCompare
        }} />
      </main>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Layout;