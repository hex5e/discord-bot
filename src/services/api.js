import logger from '../utils/logger.js';

const DEFAULT_TIMEOUT = 10000;

export async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    logger.debug('API request successful', { url });
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      logger.error('API request timed out', { url });
      throw new Error('Request timed out');
    }
    logger.error('API request failed', { url, error: err.message });
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function postJson(url, body, options = {}) {
  return fetchJson(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export default {
  fetchJson,
  postJson,
};
