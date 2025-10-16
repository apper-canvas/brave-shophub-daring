const COMPARISON_STORAGE_KEY = 'shophub_comparison_items';
const MAX_COMPARE_ITEMS = 3;

/**
 * Get all items in the comparison list
 * @returns {Array} Array of product objects
 */
export const getCompareItems = () => {
  try {
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load comparison items:', error);
    return [];
  }
};

/**
 * Add a product to the comparison list
 * @param {Object} product - Product object to add
 * @returns {Object} Result with success status and message
 */
export const addToCompare = (product) => {
  try {
    const items = getCompareItems();
    
    // Check if product already in comparison
    const existingIndex = items.findIndex(item => item.Id === product.Id);
    if (existingIndex !== -1) {
      return {
        success: false,
        message: 'Product already in comparison'
      };
    }
    
    // Check maximum limit
    if (items.length >= MAX_COMPARE_ITEMS) {
      return {
        success: false,
        message: `Maximum ${MAX_COMPARE_ITEMS} products can be compared`
      };
    }
    
    // Add product
    const updatedItems = [...items, product];
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updatedItems));
    
    return {
      success: true,
      message: 'Product added to comparison',
      items: updatedItems
    };
  } catch (error) {
    console.error('Failed to add to comparison:', error);
    return {
      success: false,
      message: 'Failed to add product to comparison'
    };
  }
};

/**
 * Remove a product from the comparison list
 * @param {number} productId - ID of product to remove
 * @returns {Object} Result with success status
 */
export const removeFromCompare = (productId) => {
  try {
    const items = getCompareItems();
    const updatedItems = items.filter(item => item.Id !== productId);
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updatedItems));
    
    return {
      success: true,
      items: updatedItems
    };
  } catch (error) {
    console.error('Failed to remove from comparison:', error);
    return {
      success: false,
      message: 'Failed to remove product from comparison'
    };
  }
};

/**
 * Clear all items from comparison list
 * @returns {Object} Result with success status
 */
export const clearCompare = () => {
  try {
    localStorage.removeItem(COMPARISON_STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Failed to clear comparison:', error);
    return { success: false };
  }
};

/**
 * Check if a product is in the comparison list
 * @param {number} productId - ID of product to check
 * @returns {boolean} True if product is in comparison
 */
export const isInCompare = (productId) => {
  const items = getCompareItems();
  return items.some(item => item.Id === productId);
};