
import apiService from './api';
import { Product, Order, OrderStatus, AdminDashboardSummary, SalesDataPoint, PaginatedResponse, Brand, BestSellingProduct } from '../types';
import { mockProducts, mockOrders, mockBrands } from './mockData';

// --- Product Management ---
export const addProduct = async (token: string, productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'brand'>): Promise<Product> => {
  // MOCK: In a real app, this would hit an API endpoint
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
    image_url: productData.image_url || `https://picsum.photos/seed/new${Date.now()}/400/300`
  };
  mockProducts.push(newProduct);
  console.log('Admin: Adding product', newProduct);
  return new Promise(resolve => setTimeout(() => resolve(newProduct), 500));
  // return apiService<Product>('/admin/products', { method: 'POST', data: productData, token });
};

export const editProduct = async (token: string, productId: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'brand'>>): Promise<Product> => {
  // MOCK
  console.log('Admin: Editing product', productId, productData);
  const productIndex = mockProducts.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return Promise.reject(new Error("Product not found"));
  }
  const updatedProduct = { ...mockProducts[productIndex], ...productData, updated_at: new Date().toISOString() };
  mockProducts[productIndex] = updatedProduct;
  return new Promise(resolve => setTimeout(() => resolve(updatedProduct), 500));
  // return apiService<Product>(`/admin/products/${productId}`, { method: 'PUT', data: productData, token });
};

export const deleteProduct = async (token: string, productId: string): Promise<void> => {
  // MOCK
  console.log('Admin: Deleting product', productId);
  const productIndex = mockProducts.findIndex(p => p.id === productId);
  if (productIndex > -1) {
    mockProducts.splice(productIndex, 1);
  }
  return new Promise(resolve => setTimeout(resolve, 500));
  // return apiService<void>(`/admin/products/${productId}`, { method: 'DELETE', token });
};

// --- Order Management ---
export const getAllAdminOrders = async (token: string, filters?: { status?: OrderStatus; dateFrom?: string; dateTo?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Order>> => {
  // MOCK
  console.log('Admin: Fetching all orders with filters', filters);
  let filteredOrders = [...mockOrders];

  if (filters?.status) {
    filteredOrders = filteredOrders.filter(o => o.order_status === filters.status);
  }

  // NOTE: date filtering not implemented in mock
  const total = filteredOrders.length;
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);
  
  return new Promise(resolve => setTimeout(() => resolve({ items: paginatedOrders, total: total, page: page, limit: limit }), 500));
  // const queryParams = new URLSearchParams(filters as any).toString();
  // return apiService<PaginatedResponse<Order>>(`/admin/orders?${queryParams}`, { method: 'GET', token });
};

export const getAdminOrderById = async (token: string, orderId: string): Promise<Order> => {
  // MOCK
  console.log('Admin: Fetching order by ID', orderId);
  const order = mockOrders.find(o => o.id === orderId);
  return new Promise((resolve, reject) => setTimeout(() => {
    if (order) resolve(order);
    else reject(new Error('Order not found'));
  }, 300));
  // return apiService<Order>(`/admin/orders/${orderId}`, { method: 'GET', token });
};

export const updateOrderStatus = async (token: string, orderId: string, status: OrderStatus): Promise<Order> => {
  // MOCK
  console.log('Admin: Updating order status', orderId, status);
  const orderToUpdate = mockOrders.find(o => o.id === orderId);
  if (orderToUpdate) {
    orderToUpdate.order_status = status;
    orderToUpdate.updated_at = new Date().toISOString();
  }
  return new Promise(resolve => setTimeout(() => resolve(orderToUpdate!), 500));
  // return apiService<Order>(`/admin/orders/${orderId}/status`, { method: 'PUT', data: { status }, token });
};

// --- Reports ---
export const getSalesReports = async (token: string, period?: { dateFrom?: string; dateTo?: string }): Promise<SalesDataPoint[]> => {
    // MOCK: DYNAMICALLY GENERATED FROM MOCK ORDERS
    console.log('Admin: Dynamically generating sales reports for period', period);
    const monthlyData: { [key: string]: { revenue: number; orders: number } } = {};
    const relevantOrders = mockOrders.filter(o => o.order_status !== OrderStatus.CANCELLED);

    relevantOrders.forEach(order => {
        const orderDate = new Date(order.created_at);
        const monthKey = orderDate.toISOString().slice(0, 7); // Format as 'YYYY-MM'
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { revenue: 0, orders: 0 };
        }
        monthlyData[monthKey].revenue += order.total_amount;
        monthlyData[monthKey].orders += 1;
    });
    const reportData = Object.keys(monthlyData).map(key => ({
        date: key,
        revenue: monthlyData[key].revenue,
        orders: monthlyData[key].orders,
    })).sort((a, b) => a.date.localeCompare(b.date));
    return new Promise(resolve => setTimeout(() => resolve(reportData), 700));
};

export const getAdminDashboardSummary = async (token: string): Promise<AdminDashboardSummary> => {
    // MOCK: DYNAMICALLY GENERATED FROM MOCK DATA
    console.log('Admin: Dynamically generating dashboard summary');
    const validOrders = mockOrders.filter(o => o.order_status !== OrderStatus.CANCELLED);

    const totalRevenue = validOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = mockOrders.length;
    const totalProducts = mockProducts.length;
    const lowStockItemsCount = mockProducts.filter(p => p.stock_quantity > 0 && p.stock_quantity < 15).length;

    const salesByProduct: { [productId: string]: number } = {};
    validOrders.forEach(order => {
        order.items.forEach(item => {
            salesByProduct[item.product_id] = (salesByProduct[item.product_id] || 0) + item.quantity;
        });
    });

    const bestSellingProducts: BestSellingProduct[] = Object.entries(salesByProduct)
        .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
        .slice(0, 5)
        .map(([productId, total_sold]) => {
            const product = mockProducts.find(p => p.id === productId);
            return {
                product_id: productId,
                name: product ? product.name : 'Unknown Product',
                total_sold: total_sold
            };
        });

    const summary: AdminDashboardSummary = {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockItemsCount,
        bestSellingProducts,
    };
    return new Promise(resolve => setTimeout(() => resolve(summary), 600));
};


// --- Brand Management (Optional) ---
export const getAdminBrands = async (token: string): Promise<Brand[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockBrands), 200));
};

export const addAdminBrand = async (token: string, brandData: Omit<Brand, 'id'>): Promise<Brand> => {
  const newBrand: Brand = { ...brandData, id: `brand-${Date.now()}` };
  mockBrands.push(newBrand);
  console.log('Admin: Adding brand', newBrand);
  return new Promise(resolve => setTimeout(() => resolve(newBrand), 300));
};