import api from './axiosConfig'

export const get = async () => {
  const response = await api.get('/');
  return response.data;
}

export const login = async (data) => {
  console.log('entro a axios login');
  const response = await api.post('/login', { email: data.email, password: data.password });
  return response.data;
}
