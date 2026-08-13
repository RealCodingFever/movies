const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export class ApiClient {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const base = this.baseURL.endsWith('/')
      ? this.baseURL.slice(0, -1)
      : this.baseURL;

    const apiPath = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;

    let url = `${base}${apiPath}`;

    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    // Only send Content-Type when there's a request body to describe. Sending
    // it on bodyless GETs forces a CORS preflight, which AniZip (and some
    // other public APIs) reject because they don't allow Content-Type in
    // Access-Control-Allow-Headers.
    const headers = {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      next: options.next || {
        revalidate: options.revalidate || 86400, // default 24h cache
      },
    };

    if (options.cache) config.cache = options.cache;

    let attempts = 0;
    const maxAttempts = 3;
    const baseDelay = 1000;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          // Retry on server errors (5xx)
          if (response.status >= 500) {
            attempts++;
            if (attempts < maxAttempts) {
              const delay = baseDelay * Math.pow(2, attempts - 1);
              console.warn(`API Error ${response.status}. Retrying in ${delay}ms... (Attempt ${attempts}/${maxAttempts})`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
          }
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.message || `API Error: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await response.json();
        }

        return null;
      } catch (error) {
        attempts++;
        const isNetworkError = error.message === 'fetch failed' || error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('API Error: 525');

        if (attempts < maxAttempts && (isNetworkError || error.message.includes('50'))) {
          const delay = baseDelay * Math.pow(2, attempts - 1);
          console.warn(`Request failed: ${error.message}. Retrying in ${delay}ms... (Attempt ${attempts}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // console.error('API Request Failed:', error);
        throw error;
      }
    }
  }

  get(endpoint, params = {}, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      params,
      ...options,
    });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

export const apiClient = new ApiClient();
