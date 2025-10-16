import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = "product_c";
const CATEGORY_TABLE = "category_c";

// Transform database product to UI format
const transformProduct = (dbProduct) => {
  return {
    Id: dbProduct.Id,
    name: dbProduct.name_c,
    brand: dbProduct.brand_c,
    category: dbProduct.category_c,
    description: dbProduct.description_c,
    price: dbProduct.price_c,
    originalPrice: dbProduct.original_price_c,
    rating: dbProduct.rating_c,
    reviewCount: dbProduct.review_count_c,
    inStock: dbProduct.in_stock_c,
    specifications: dbProduct.specifications_c ? JSON.parse(dbProduct.specifications_c) : {},
    images: dbProduct.images_c ? JSON.parse(dbProduct.images_c) : []
  };
};

// Transform UI product to database format (only updateable fields)
const transformToDb = (product) => {
  const dbProduct = {
    name_c: product.name,
    brand_c: product.brand,
    category_c: product.category,
    description_c: product.description,
    price_c: product.price,
    original_price_c: product.originalPrice,
    rating_c: product.rating,
    review_count_c: product.reviewCount,
    in_stock_c: product.inStock
  };
  
  if (product.specifications) {
    dbProduct.specifications_c = JSON.stringify(product.specifications);
  }
  
  if (product.images) {
    dbProduct.images_c = JSON.stringify(product.images);
  }
  
  return dbProduct;
};

export const getProducts = async () => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return [];
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "brand_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "price_c"}},
        {"field": {"Name": "original_price_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "review_count_c"}},
        {"field": {"Name": "in_stock_c"}},
        {"field": {"Name": "specifications_c"}},
        {"field": {"Name": "images_c"}}
      ],
      pagingInfo: { limit: 1000, offset: 0 }
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to fetch products:", response.message);
      return [];
    }

    return response.data?.map(transformProduct) || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getBrands = async () => {
  try {
    const products = await getProducts();
    const brands = [...new Set(products.map(p => p.brand))].filter(Boolean).sort();
    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return null;
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "brand_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "price_c"}},
        {"field": {"Name": "original_price_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "review_count_c"}},
        {"field": {"Name": "in_stock_c"}},
        {"field": {"Name": "specifications_c"}},
        {"field": {"Name": "images_c"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success || !response.data) {
      return null;
    }

    return transformProduct(response.data);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return [];
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "icon_c"}}
      ],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords(CATEGORY_TABLE, params);
    
    if (!response.success) {
      console.error("Failed to fetch categories:", response.message);
      return [];
    }

    return response.data?.map(cat => ({
      Id: cat.Id,
      name: cat.name_c,
      icon: cat.icon_c
    })) || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategoryById = async (id) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return null;
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "icon_c"}}
      ]
    };

    const response = await apperClient.getRecordById(CATEGORY_TABLE, parseInt(id), params);
    
    if (!response.success || !response.data) {
      return null;
    }

    return {
      Id: response.data.Id,
      name: response.data.name_c,
      icon: response.data.icon_c
    };
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
};

export const getProductsByCategory = async (categoryName) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return [];
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "brand_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "price_c"}},
        {"field": {"Name": "original_price_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "review_count_c"}},
        {"field": {"Name": "in_stock_c"}},
        {"field": {"Name": "specifications_c"}},
        {"field": {"Name": "images_c"}}
      ],
      where: [
        {
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [categoryName]
        }
      ],
      pagingInfo: { limit: 1000, offset: 0 }
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to fetch products by category:", response.message);
      return [];
    }

    return response.data?.map(transformProduct) || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const searchProducts = async (query) => {
  try {
    const products = await getProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const createProduct = async (productData) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return null;
    }

    const params = {
      records: [transformToDb(productData)]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to create product:", response.message);
      return null;
    }

    if (response.results && response.results[0]?.success) {
      return transformProduct(response.results[0].data);
    }

    return null;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};

export const updateProduct = async (id, updates) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return null;
    }

    const params = {
      records: [{
        Id: parseInt(id),
        ...transformToDb(updates)
      }]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to update product:", response.message);
      return null;
    }

    if (response.results && response.results[0]?.success) {
      return transformProduct(response.results[0].data);
    }

    return null;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};

export const deleteProduct = async (id) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return false;
    }

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to delete product:", response.message);
      return false;
    }

    return response.results?.[0]?.success || false;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};