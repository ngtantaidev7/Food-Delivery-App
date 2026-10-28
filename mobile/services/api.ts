import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
const BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  (hostUri ? `http://${hostUri}:5000/api` : 'http://localhost:5000/api');

type ApiResponse<T> = { success: true; data: T; count?: number } | { success: false; message: string };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error((json as any).message ?? `Request failed: ${res.status}`);
  }
  return (json as any).data as T;
}

// ── Banners ────────────────────────────────────────────────────────────────────
export const getBanners = (placement: 'home' | 'category') =>
  request(`/banners?placement=${placement}`);

// ── Categories ─────────────────────────────────────────────────────────────────
export const getCategories = () => request('/categories');

// ── Restaurants ────────────────────────────────────────────────────────────────
export const getRestaurants = (params?: {
  tag?: string;
  categoryId?: string;
  search?: string;
  sortBy?: 'rating' | 'reviews';
  limit?: number;
}) => {
  const qs = new URLSearchParams();
  if (params?.tag) qs.set('tag', params.tag);
  if (params?.categoryId) qs.set('categoryId', params.categoryId);
  if (params?.search) qs.set('search', params.search);
  if (params?.sortBy) qs.set('sortBy', params.sortBy);
  if (params?.limit) qs.set('limit', String(params.limit));
  return request(`/restaurants?${qs.toString()}`);
};

export const getRestaurantById = (id: string) => request(`/restaurants/${id}`);
export const getRestaurantMenu = (id: string) => request(`/restaurants/${id}/menu`);
export const getRestaurantReviews = (id: string) => request(`/restaurants/${id}/reviews`);

// ── Foods ──────────────────────────────────────────────────────────────────────
export const searchFoods = (q: string, tag?: string) => {
  const qs = new URLSearchParams({ q });
  if (tag) qs.set('tag', tag);
  return request(`/foods/search?${qs.toString()}`);
};
export const getFoodById = (id: string) => request(`/foods/${id}`);

// ── Vouchers ───────────────────────────────────────────────────────────────────
export const getVouchers = () => request('/vouchers');
export const applyVoucher = (body: {
  voucherId: string;
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
}) =>
  request('/vouchers/apply', {
    method: 'POST',
    body: JSON.stringify(body),
  });

// ── Orders ─────────────────────────────────────────────────────────────────────
export const createOrder = (body: Record<string, any>) =>
  request('/orders', { method: 'POST', body: JSON.stringify(body) });

export const getOrderById = (id: string) => request(`/orders/${id}`);
export const getUserOrders = (customerId = 'current') =>
  request(`/orders/user/${customerId}`);
export const updateOrderStatus = (id: string, status: string, driverId?: string) =>
  request(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, driverId }),
  });
export const cancelOrder = (id: string) =>
  request(`/orders/${id}/cancel`, { method: 'POST' });

// ── Messages ───────────────────────────────────────────────────────────────────
export const getOrderMessages = (orderId: string) =>
  request(`/messages/${orderId}`);
export const sendMessage = (body: {
  orderId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  attachmentUrl?: string;
}) => request('/messages', { method: 'POST', body: JSON.stringify(body) });

// ── Reviews ────────────────────────────────────────────────────────────────────
export const submitDriverReview = (body: {
  orderId: string;
  customerId: string;
  driverId: string;
  ratingStars: number;
  tags: string[];
  comment?: string;
}) => request('/reviews/driver', { method: 'POST', body: JSON.stringify(body) });

export const submitRestaurantReview = (body: {
  restaurantId: string;
  customerId: string;
  ratingStars: number;
  comment: string;
}) => request('/reviews/restaurant', { method: 'POST', body: JSON.stringify(body) });

// ── Users ──────────────────────────────────────────────────────────────────────
export const getUserProfile = (id = 'current') => request(`/users/profile/${id}`);
export const getDriverInfo = (id?: string) =>
  request(`/users/driver${id ? `/${id}` : ''}`);
export const updateUserAddress = (body: {
  userId?: string;
  label: string;
  addressLine: string;
  coordinates: [number, number];
  isDefault?: boolean;
}) => request('/users/address', { method: 'POST', body: JSON.stringify(body) });

// ── Upload ─────────────────────────────────────────────────────────────────────
export const uploadImage = async (
  uri: string,
  folder = 'food-delivery/chat'
): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append('image', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);
  formData.append('folder', folder);

  const res = await fetch(`${BASE_URL}/upload/single`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? 'Upload failed');
  return json.data;
};

// ── AI ─────────────────────────────────────────────────────────────────────────
export const sendAIMessage = (body: {
  message: string;
  userId?: string;
  history?: { role: 'user' | 'model'; text: string }[];
}) => request<{ reply: string; role: string }>('/ai/chat', { method: 'POST', body: JSON.stringify(body) });

export const getOptimizedRoute = (body: {
  driverLocation: { latitude: number; longitude: number };
  restaurantLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
}) =>
  request<{
    polylineCoords: { latitude: number; longitude: number }[];
    distanceKm: number;
    durationMin: number;
    etaText: string;
    waypoints: {
      driver: { latitude: number; longitude: number };
      restaurant: { latitude: number; longitude: number };
      customer: { latitude: number; longitude: number };
    };
  }>('/ai/route', { method: 'POST', body: JSON.stringify(body) });
