const API_BASE = '/api';
const AUTH_TOKEN_KEY = 'mychoize_token';
const AUTH_REMEMBER_KEY = 'mychoize_remember';

function getAuthToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
}

function saveAuthToken(token, remember) {
  if (remember) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_REMEMBER_KEY, 'true');
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  } else {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REMEMBER_KEY);
  }
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REMEMBER_KEY);
  localStorage.removeItem('mychoize_logged_in');
  sessionStorage.removeItem('mychoize_logged_in');
  localStorage.removeItem('mychoize_user_email');
  sessionStorage.removeItem('mychoize_user_name');
  sessionStorage.removeItem('mychoize_user');
  sessionStorage.removeItem('mychoize_user_email');
  sessionStorage.removeItem('mychoize_user_name');
  sessionStorage.removeItem('mychoize_user');
}

function getAuthHeaders() {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function apiRequest(endpoint, method = 'GET', body = null, requireAuth = false) {
  const headers = getAuthHeaders();
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const text = await response.text();

  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message = data.message || data.error || text || `${response.status} ${response.statusText}` || 'API request failed';
    console.error('API request failed', {
      endpoint,
      method,
      status: response.status,
      statusText: response.statusText,
      bodyText: text,
      parsedData: data,
    });
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

function setAuthState(user, token, remember) {
  saveAuthToken(token, remember);
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  storage.setItem('mychoize_logged_in', 'true');
  storage.setItem('mychoize_user_email', user.email);
  storage.setItem('mychoize_user_name', `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email);
  storage.setItem('mychoize_user', JSON.stringify(user));
  otherStorage.removeItem('mychoize_logged_in');
  otherStorage.removeItem('mychoize_user_email');
  otherStorage.removeItem('mychoize_user_name');
  otherStorage.removeItem('mychoize_user');
}

function isLoggedIn() {
  return !!getAuthToken();
}

function getLoggedInUser() {
  const userJson = sessionStorage.getItem('mychoize_user') || localStorage.getItem('mychoize_user');
  return userJson ? JSON.parse(userJson) : null;
}

function redirectAfterAuth() {
  const next = localStorage.getItem('mychoize_next') || sessionStorage.getItem('mychoize_next') || 'index.html';
  localStorage.removeItem('mychoize_next');
  sessionStorage.removeItem('mychoize_next');
  window.location.href = next;
}

function saveNextUrl(url) {
  localStorage.setItem('mychoize_next', url);
  sessionStorage.setItem('mychoize_next', url);
}

function handleAuthPrompt(redirectUrl) {
  saveNextUrl(redirectUrl || window.location.href);
  const overlay = document.getElementById('authPrompt');
  if (overlay) overlay.classList.add('open');
}

function closeAuthPrompt() {
  const overlay = document.getElementById('authPrompt');
  if (overlay) overlay.classList.remove('open');
}

async function fetchUserProfile() {
  return apiRequest('/auth/me', 'GET', null, true);
}

async function fetchUserBookings() {
  return apiRequest('/bookings/me', 'GET', null, true);
}

async function fetchAiText(prompt, options = {}) {
  return apiRequest('/ai/generate', 'POST', { prompt, ...options }, true);
}
