import { STORAGE_KEYS, ERROR_MESSAGES } from './constants';
import { toast } from 'react-toastify';

export const storeAuthData = (token, user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Failed to store auth data:', error);
    return false;
  }
};

export const getAuthData = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userStr ? JSON.parse(userStr) : null;
    
    return { token, user };
  } catch (error) {
    console.error('Failed to get auth data:', error);
    clearAuthData();
    return { token: null, user: null };
  }
};

export const clearAuthData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return true;
  } catch (error) {
    console.error('Failed to clear auth data:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  const { token } = getAuthData();
  return !!token;
};

export const getCurrentUser = () => {
  const { user } = getAuthData();
  return user;
};

export const getAuthToken = () => {
  const { token } = getAuthData();
  return token;
};

export const validateStoredAuth = () => {
  try {
    const { token, user } = getAuthData();
    
    if (token && user) { return { token, user }; }
    
    if (token || user) {
      clearAuthData();
      toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
    }
    
    return null;
  } catch (error) {
    clearAuthData();
    toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
    return null;
  }
};