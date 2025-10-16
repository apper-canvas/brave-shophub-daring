import productsData from "@/services/mockData/products.json";
import categoriesData from "@/services/mockData/categories.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async () => {
  await delay(300);
  return [...productsData];
};

export const getBrands = async () => {
  await delay(100);
  const brands = [...new Set(productsData.map(p => p.brand))].filter(Boolean).sort();
  return brands;
};

export const getProductById = async (id) => {
  await delay(250);
  const product = productsData.find(p => p.Id === id);
  return product ? { ...product } : null;
};

export const getCategories = async () => {
  await delay(200);
  return [...categoriesData];
};

export const getCategoryById = async (id) => {
  await delay(200);
  const category = categoriesData.find(c => c.Id === id);
  return category ? { ...category } : null;
};

export const getProductsByCategory = async (categoryName) => {
  await delay(300);
  return productsData.filter(p => p.category === categoryName).map(p => ({ ...p }));
};

export const searchProducts = async (query) => {
  await delay(300);
  const searchTerm = query.toLowerCase();
  return productsData.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.description.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm)
  ).map(p => ({ ...p }));
};

export const createProduct = async (productData) => {
  await delay(400);
  const maxId = Math.max(...productsData.map(p => p.Id));
  const newProduct = {
    Id: maxId + 1,
    ...productData,
    rating: 0,
    reviewCount: 0,
    inStock: true
  };
  productsData.push(newProduct);
  return { ...newProduct };
};

export const updateProduct = async (id, updates) => {
  await delay(350);
  const index = productsData.findIndex(p => p.Id === id);
  if (index === -1) return null;
  
  productsData[index] = { ...productsData[index], ...updates };
  return { ...productsData[index] };
};

export const deleteProduct = async (id) => {
  await delay(300);
  const index = productsData.findIndex(p => p.Id === id);
  if (index === -1) return false;
  
  productsData.splice(index, 1);
  return true;
};