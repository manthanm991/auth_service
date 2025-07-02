import { API_BASE_URL, AUTH_ENDPOINTS, ERROR_MESSAGES } from '../utils/constants';

const makeApiRequest = async (endpoint, data, method = 'POST') => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) { throw new Error( responseData.error || responseData.message || `Request failed with status ${response.status}` ); }

    return responseData;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const data = await makeApiRequest(AUTH_ENDPOINTS.LOGIN, credentials);
    if (!data.token || !data.user) { throw new Error(ERROR_MESSAGES.INVALID_SERVER_RESPONSE); }
    
    return data;
  } catch (error) {
    throw new Error(error.message || ERROR_MESSAGES.LOGIN_FAILED);
  }
};

export const signupUser = async (userData) => {
  try {
    const { confirmPassword, ...signupData } = userData;
    const data = await makeApiRequest(AUTH_ENDPOINTS.SIGNUP, signupData);
    return data;
  } catch (error) {
    throw new Error(error.message || ERROR_MESSAGES.SIGNUP_FAILED);
  }
};

export const forgotPassword = async (email) => {
  try {
    const data = await makeApiRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to send reset email');
  }
};

export const getRedirectPath = (user) => {
  if (!user) return '/';
  return user.isAdmin ? '/dashboard' : '/';
};

export const handleAuthError = (error) => {
  let message = ERROR_MESSAGES.UNEXPECTED_ERROR;

  if (error?.message) { message = error.message; }
  else if (typeof error === 'string') { message = error; }

  return message;
};