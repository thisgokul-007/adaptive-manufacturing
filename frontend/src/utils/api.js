// API Fetcher with automatic fallback to http://localhost:5000 if relative path fails

const BACKEND_URL = 'http://localhost:5000';

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Relative fetch failed, fallback to absolute localhost URL
  }

  // Fallback to absolute backend URL
  try {
    const absoluteUrl = BACKEND_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
    const res = await fetch(absoluteUrl, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error(`API Call failed for ${endpoint}:`, e);
  }

  return null;
}
