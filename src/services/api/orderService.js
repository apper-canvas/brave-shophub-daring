import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = "order_c";

// Transform database order to UI format
const transformOrder = (dbOrder) => {
  return {
    Id: dbOrder.Id,
    orderDate: dbOrder.order_date_c,
    estimatedDelivery: dbOrder.estimated_delivery_c,
    items: dbOrder.items_c ? JSON.parse(dbOrder.items_c) : [],
    total: dbOrder.total_c,
    deliveryAddress: dbOrder.delivery_address_c ? JSON.parse(dbOrder.delivery_address_c) : {},
    paymentMethod: dbOrder.payment_method_c,
    status: dbOrder.status_c
  };
};

// Transform UI order to database format (only updateable fields)
const transformToDb = (order) => {
  const dbOrder = {
    order_date_c: order.orderDate,
    estimated_delivery_c: order.estimatedDelivery,
    total_c: order.total,
    payment_method_c: order.paymentMethod,
    status_c: order.status
  };
  
  if (order.items) {
    dbOrder.items_c = JSON.stringify(order.items);
  }
  
  if (order.deliveryAddress) {
    dbOrder.delivery_address_c = JSON.stringify(order.deliveryAddress);
  }
  
  return dbOrder;
};

export const getOrders = async () => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return [];
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "order_date_c"}},
        {"field": {"Name": "estimated_delivery_c"}},
        {"field": {"Name": "items_c"}},
        {"field": {"Name": "total_c"}},
        {"field": {"Name": "delivery_address_c"}},
        {"field": {"Name": "payment_method_c"}},
        {"field": {"Name": "status_c"}}
      ],
      orderBy: [{"fieldName": "order_date_c", "sorttype": "DESC"}],
      pagingInfo: { limit: 1000, offset: 0 }
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to fetch orders:", response.message);
      return [];
    }

    return response.data?.map(transformOrder) || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderById = async (id) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return null;
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "order_date_c"}},
        {"field": {"Name": "estimated_delivery_c"}},
        {"field": {"Name": "items_c"}},
        {"field": {"Name": "total_c"}},
        {"field": {"Name": "delivery_address_c"}},
        {"field": {"Name": "payment_method_c"}},
        {"field": {"Name": "status_c"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success || !response.data) {
      return null;
    }

    return transformOrder(response.data);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
};

export const createOrder = async (orderData) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return null;
    }

    const orderWithDefaults = {
      ...orderData,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };

    const params = {
      records: [transformToDb(orderWithDefaults)]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to create order:", response.message);
      return null;
    }

    if (response.results && response.results[0]?.success) {
      return transformOrder(response.results[0].data);
    }

    return null;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export const updateOrder = async (id, updates) => {
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
      console.error("Failed to update order:", response.message);
      return null;
    }

    if (response.results && response.results[0]?.success) {
      return transformOrder(response.results[0].data);
    }

    return null;
  } catch (error) {
    console.error("Error updating order:", error);
    return null;
  }
};

export const deleteOrder = async (id) => {
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
      console.error("Failed to delete order:", response.message);
      return false;
    }

    return response.results?.[0]?.success || false;
  } catch (error) {
    console.error("Error deleting order:", error);
    return false;
  }
};

export const getOrdersByStatus = async (status) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      console.error("ApperClient not initialized");
      return [];
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "order_date_c"}},
        {"field": {"Name": "estimated_delivery_c"}},
        {"field": {"Name": "items_c"}},
        {"field": {"Name": "total_c"}},
        {"field": {"Name": "delivery_address_c"}},
        {"field": {"Name": "payment_method_c"}},
        {"field": {"Name": "status_c"}}
      ],
      where: [
        {
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }
      ],
      orderBy: [{"fieldName": "order_date_c", "sorttype": "DESC"}],
      pagingInfo: { limit: 1000, offset: 0 }
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Failed to fetch orders by status:", response.message);
      return [];
    }

    return response.data?.map(transformOrder) || [];
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return [];
  }
};