const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api`;

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const isCookieSession = token === 'cookie' || (token && !token.includes('.'));
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(!isCookieSession && token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const res = await fetch(url, { ...options, headers, credentials: 'include' });
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
    if (!res.ok) throw new Error(data?.message || `Request failed with status ${res.status}`);
    return data;
  } catch (error) {
    // Handle network errors (Failed to fetch)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to server. Please check if the backend is running at ${API_BASE_URL}`);
    }
    throw error;
  }
}

export const api = {
  signin: (payload) => request('/auth/signin', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (payload) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  me: async () => {
    try {
      return await request('/me', { method: 'GET' });
    } catch (e) {
      // Fallback for header-token based auth
      return await request('/auth/me', { method: 'GET' });
    }
  },
  // Cart endpoints
  getCart: () => request('/cart', { method: 'GET' }),
  addToCart: ({ productId, quantity = 1 }) => request('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  removeFromCart: (productId) => request(`/cart/remove/${productId}`, { method: 'DELETE' }),
  // Admin endpoints
  admin: {
    stats: () => request('/admin/stats', { method: 'GET' }),
    createProduct: (payload) => request('/admin/products', { method: 'POST', body: JSON.stringify(payload) }),
    updateProduct: (id, payload) => request(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    listProducts: () => request('/admin/products', { method: 'GET' }),
    deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
    listOrders: () => request('/admin/orders', { method: 'GET' }),
    listAddresses: () => request('/admin/addresses', { method: 'GET' }),
    updateOrderStatus: async (id, status) => {
      const base = `${API_BASE_URL}`;
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const isCookieSession = token === 'cookie' || (token && !token.includes('.'));
      const headers = {
        'Content-Type': 'application/json',
        ...(!isCookieSession && token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const payloadVariants = [ { status }, { orderStatus: status } ];
      const opts = (method, body) => ({ method, headers, body: JSON.stringify(body), credentials: 'include' });
      const tryRoutes = [
        { path: `/admin/orders/${id}/status`, methods: ['PUT','POST','PATCH'] },
        { path: `/admin/orders/${id}`, methods: ['PATCH','PUT'] },
        { path: `/orders/${id}/status`, methods: ['PUT','POST','PATCH'] },
        { path: `/orders/${id}`, methods: ['PATCH','PUT'] },
        { path: `/admin/order-status/${id}`, methods: ['PUT','POST'] },
      ];
      let lastErr;
      for (const route of tryRoutes) {
        for (const method of route.methods) {
          for (const body of payloadVariants) {
            try {
              const url = `${base}${route.path}`;
              const res = await fetch(url, opts(method, body));
              const text = await res.text();
              let data; try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
              if (!res.ok) { lastErr = new Error(`${res.status} ${res.statusText} at ${url}`); continue; }
              return data;
            } catch (e) {
              lastErr = e;
            }
          }
        }
      }
      throw lastErr || new Error('Failed to update order status');
    },
  },
};

export default api;



