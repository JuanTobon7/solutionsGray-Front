import api from './axiosConfig.js'

export const start = async () => {
  const response = await api.get('/');
  return response.data;
}

export const login = async (data) => {
  console.log('entro a axios login');
  const response = await api.post('/login', { email: data.email, password: data.password });  
  if (response.data.name || response.data.email) {
    const user = {
      name: response.data.name,
      email: response.data.email,
      rol: response.data.rol
    }
    sessionStorage.setItem('user',JSON.stringify(user));
  }
  return response.data;
}

export const getChurchInfo = async()=>{
  const response = await api.get('/church');
  return response.data;
}
