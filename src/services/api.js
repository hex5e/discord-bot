class ApiService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API request failed (${response.status}): ${text}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) return response.json();
    return response.text();
  }

  async get(path) {
    return this.request(path);
  }
}

const api = new ApiService();
export default api;
