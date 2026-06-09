const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function fetchAPI(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
  // Get token from Zustand store (stored in localStorage by persist middleware)
  const authStorage = localStorage.getItem('auth-storage');
  let token = null;
  let refreshToken = null;
  
  if (authStorage) {
    try {
      const authData = JSON.parse(authStorage);
      token = authData.state?.accessToken;
      refreshToken = authData.state?.refreshToken;
    } catch (e) {
      console.error('Error parsing auth storage:', e);
    }
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Add any additional headers from options
  if (options.headers) {
    const additionalHeaders = new Headers(options.headers);
    additionalHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401/403 errors by attempting token refresh
  if (!response.ok && (response.status === 401 || response.status === 403) && refreshToken && retryCount === 0) {
    try {
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data.accessToken;
        
        // Update localStorage with new access token
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          authData.state.accessToken = newAccessToken;
          localStorage.setItem('auth-storage', JSON.stringify(authData));
        }

        // Retry the original request with new token
        return fetchAPI(endpoint, options, retryCount + 1);
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // Clear auth storage on refresh failure
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchAPI(endpoint),
  post: (endpoint: string, data: any) => fetchAPI(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any) => fetchAPI(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string) => fetchAPI(endpoint, { method: 'DELETE' }),
};
