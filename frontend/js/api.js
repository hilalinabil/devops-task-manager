const API_BASE = '/api';

class ApiClient {
  /**
   * Helper to retrieve request headers with authorization token
   */
  static getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Core request engine
   */
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = this.getHeaders();

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      // Parse JSON body safely
      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        // Automatic log out on HTTP 401 Unauthorized (except on login requests)
        if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.replace('/pages/login.html');
        }
        
        const errorMessage = data.message || 'An unexpected error occurred';
        const errors = data.errors || null;
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.errors = errors;
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Fetch error on endpoint [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * HTTP GET method wrapper
   */
  static get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * HTTP POST method wrapper
   */
  static post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * HTTP PUT method wrapper
   */
  static put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  /**
   * HTTP DELETE method wrapper
   */
  static delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Make globally accessible
window.ApiClient = ApiClient;
