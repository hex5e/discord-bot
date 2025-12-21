import logger from '../utils/logger.js';

/**
 * External API service placeholder
 * Use this for external API calls (e.g., weather, gaming stats, etc.)
 */

const DEFAULT_TIMEOUT = 10000;

export async function get(url, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, headers = {} } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`API GET request failed: ${url}`, error);
    throw error;
  }
}

export async function post(url, data, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, headers = {} } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`API POST request failed: ${url}`, error);
    throw error;
  }
}

export default { get, post };
