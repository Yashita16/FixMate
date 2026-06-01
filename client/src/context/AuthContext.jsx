import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

const initialState = { user: null, token: null, loading: true, isAuthenticated: false };

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('fixmate_token');
    if (!token) { dispatch({ type: 'SET_LOADING', payload: false }); return; }
    api.get('/auth/me')
      .then((res) => dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.data, token } }))
      .catch(() => { localStorage.removeItem('fixmate_token'); dispatch({ type: 'SET_LOADING', payload: false }); });
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('fixmate_token', res.data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('fixmate_token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
