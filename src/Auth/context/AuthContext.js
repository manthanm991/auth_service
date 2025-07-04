import React, { createContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

import { AUTH_ACTIONS, SUCCESS_MESSAGES } from '../utils/constants';
import { storeAuthData, clearAuthData, validateStoredAuth } from '../utils/storage';
import { loginUser, signupUser, getRedirectPath, handleAuthError } from '../services/authService';

const initialState = { user: null, token: null, isAuthenticated: false, loading: false, error: null };

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return { ...state, loading: true, error: null };

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, user: action.payload.user, token: action.payload.token, error: null };

    case AUTH_ACTIONS.AUTH_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, user: null, token: null, error: action.payload };

    case AUTH_ACTIONS.LOGOUT:
      return { ...state, loading: false, isAuthenticated: false, user: null, token: null, error: null };

    case AUTH_ACTIONS.LOAD_USER:
      return { ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const authData = validateStoredAuth();
    if (authData) { dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: authData }); }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });

    try {
      const data = await loginUser(credentials);

      if (data.token && data.user) {
        storeAuthData(data.token, data.user);
        dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: { token: data.token, user: data.user } });

        toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS(data.user.name));
        return { success: true, user: data.user };
      }
    } catch (error) {
      const errorMessage = handleAuthError(error);
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });

    try {
      const data = await signupUser(userData);

      if (data.token && data.user) {
        storeAuthData(data.token, data.user);
        dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: { token: data.token, user: data.user } });

        toast.success(SUCCESS_MESSAGES.SIGNUP_SUCCESS(data.user.name));
        return { success: true, user: data.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: null });
        toast.success(SUCCESS_MESSAGES.SIGNUP_LOGIN_REQUIRED);
        return { success: true, requiresLogin: true };
      }
    } catch (error) {
      const errorMessage = handleAuthError(error);
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const setAuthData = (user, token) => {
    if (user && token) {
      storeAuthData(token, user);
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: { token, user } });
    }
  };

  const logout = () => {
    clearAuthData();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.info(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  };

  const clearError = () => { dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR }); };
  const value = { ...state, login, signup, logout, clearError, getRedirectPath, setAuthData };

  return ( <AuthContext.Provider value={value}> {children} </AuthContext.Provider> );
};

export default AuthContext;