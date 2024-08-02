import api from './axiosConfig'

export const get = async () => {
  const response = await api.get('/');
  return response.data;
}

export const login = async (data) => {
  console.log('entro a axios login');
  const response = await api.post('/login', { email: data.email, password: data.password });  
  if (response.data.name || response.data.email) {
    const user = {
      name: response.data.name,
      email: response.data.email
    }
    sessionStorage.setItem('user',JSON.stringify(user));
  }
  return response.data;
}
