const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api`;

export const fetchSarees = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products${category ? `?category=${encodeURIComponent(category)}` : ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sarees');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sarees:', error);
    throw error;
  }
};

export const fetchSareeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch saree details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching saree details:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.navigation.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch COLLECTION categories
export const fetchCollectionCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header/categories/collection`);
    if (!response.ok) {
      throw new Error('Failed to fetch COLLECTION categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching COLLECTION categories:', error);
    throw error;
  }
};

// Fetch MEN categories
export const fetchMenCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header/categories/men`);
    if (!response.ok) {
      throw new Error('Failed to fetch MEN categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching MEN categories:', error);
    throw error;
  }
};

// Fetch WOMEN categories
export const fetchWomenCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header/categories/women`);
    if (!response.ok) {
      throw new Error('Failed to fetch WOMEN categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching WOMEN categories:', error);
    throw error;
  }
};

// Fetch BOYS categories
export const fetchBoysCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header/categories/boys`);
    if (!response.ok) {
      throw new Error('Failed to fetch BOYS categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching BOYS categories:', error);
    throw error;
  }
};

// Fetch GIRLS categories
export const fetchGirlsCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header/categories/girls`);
    if (!response.ok) {
      throw new Error('Failed to fetch GIRLS categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GIRLS categories:', error);
    throw error;
  }
};

// Fetch SISHU categories
export const fetchSishuCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header/categories/sishu`);
    if (!response.ok) {
      throw new Error('Failed to fetch SISHU categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching SISHU categories:', error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_URL}/header/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

const authHeaders = () => {
  const token = (() => { try { return localStorage.getItem('auth_token'); } catch { return null; } })();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyAddress = async () => {
  const res = await fetch(`${API_URL}/address/me`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch address');
  return res.json();
};

export const saveMyAddress = async (payload) => {
  const res = await fetch(`${API_URL}/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to save address');
  return res.json();
};

export const updateAddressById = async (id, payload) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update address');
  return res.json();
};

export const deleteAddressById = async (id) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res.json();
};

export const createPaymentOrder = async (amount, notes = {}) => {
  const res = await fetch(`${API_URL}/payment/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ amount, currency: 'INR', notes }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create payment order');
  return res.json();
};

export const verifyPayment = async (payload) => {
  const res = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to verify payment');
  return res.json();
};

export const getMyOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};
