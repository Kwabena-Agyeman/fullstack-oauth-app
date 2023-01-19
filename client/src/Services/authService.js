import jwtDecode from 'jwt-decode';

export const saveAcessToken = (token) => {
  localStorage.setItem('accessToken', token);
};

export const removeAccessToken = (token) => {
  localStorage.removeItem('accessToken');
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const saveRefreshToken = (refreshToken) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const removeRefreshToken = () => {
  localStorage.removeItem('refreshToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const parseToken = (token) => {
  return jwtDecode(token);
};

export const cleanLocalStorage = () => {
  localStorage.clear();
};
