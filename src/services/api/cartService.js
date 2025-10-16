// Cart service using localStorage for persistence
const CART_STORAGE_KEY = "shophub_cart";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error reading cart from storage:", error);
    return [];
  }
};

const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

export const getCartItems = async () => {
  await delay(200);
  return getCartFromStorage();
};

export const addToCart = async (product) => {
  await delay(250);
  const cartItems = getCartFromStorage();
  const existingItem = cartItems.find(item => item.Id === product.Id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  
  saveCartToStorage(cartItems);
  return cartItems;
};

export const updateCartItem = async (productId, updates) => {
  await delay(200);
  const cartItems = getCartFromStorage();
  const existingItemIndex = cartItems.findIndex(item => item.Id === productId);
  
  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex] = { ...cartItems[existingItemIndex], ...updates };
  } else {
    // Add new item if it doesn't exist
    cartItems.push(updates);
  }
  
  saveCartToStorage(cartItems);
  return cartItems;
};

export const removeFromCart = async (productId) => {
  await delay(200);
  const cartItems = getCartFromStorage();
  const filteredItems = cartItems.filter(item => item.Id !== productId);
  saveCartToStorage(filteredItems);
  return filteredItems;
};

export const clearCart = async () => {
  await delay(200);
  localStorage.removeItem(CART_STORAGE_KEY);
  return [];
};

export const getCartItemCount = async () => {
  await delay(100);
  const cartItems = getCartFromStorage();
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
};