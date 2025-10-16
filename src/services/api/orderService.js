import ordersData from "@/services/mockData/orders.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getOrders = async () => {
  await delay(300);
  return [...ordersData];
};

export const getOrderById = async (id) => {
  await delay(250);
  const order = ordersData.find(o => o.Id === id);
  return order ? { ...order } : null;
};

export const createOrder = async (orderData) => {
  await delay(500);
  const maxId = Math.max(...ordersData.map(o => o.Id), 0);
  const newOrder = {
    Id: maxId + 1,
    ...orderData,
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
  };
  ordersData.push(newOrder);
  return { ...newOrder };
};

export const updateOrder = async (id, updates) => {
  await delay(350);
  const index = ordersData.findIndex(o => o.Id === id);
  if (index === -1) return null;
  
  ordersData[index] = { ...ordersData[index], ...updates };
  return { ...ordersData[index] };
};

export const deleteOrder = async (id) => {
  await delay(300);
  const index = ordersData.findIndex(o => o.Id === id);
  if (index === -1) return false;
  
  ordersData.splice(index, 1);
  return true;
};

export const getOrdersByStatus = async (status) => {
  await delay(300);
  return ordersData.filter(o => o.status === status).map(o => ({ ...o }));
};