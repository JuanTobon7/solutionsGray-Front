import api from './axiosConfig'
import store from '@/store';

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
    store.dispatch('login', user);  
  }
  return response.data;
}

export const getChurchInfo = async()=>{
  const response = await api.get('/church');
  return response.data;
}

export const getSheeps = async()=>{
  console.log('here')
  const response = await api.get('/sheeps');
  return response.data;
}

export const getSheepById = async(id)=>{
  const response = await api.get(`/sheep/${id}`);
  return response.data;
}

export const getMySheeps = async()=>{
  const response = await api.get('/my-sheeps');
  return response.data
}

export const editInfoSheepById = async(id,data)=>{
  const response = await api.put(`/sheep/${id}`);
  return response.data;
}

export const getServants = async()=>{
  const response = await api.get('/servants');
  return response.data;
}

export const getServantById = async(id)=>{
  const response = await api.get(`/servant/${id}`);
  return response.data;
}

export const sendInvitationBoarding = async(data)=>{
  const response = await api.post('/invitation-boarding',{email:data.email});
  return response.data;
}

export const verifyInvitationBoarding = async(data)=>{
  const response = await api.post('/accept-invitation',{emailToken:data.token});
  return response.data;
}

export const refreshToken = async()=>{
  const response = await api.post('/refresh-token');
  return response.data;
}
//try to implement an event listener like before of open the spa i dont know
export const basicUserInfo = async()=>{
  const response = await api.get('/basic-info-user');
  if(response.data.message){
    return
  }
  const user = {
    name: response.data.name,
    email: response.data.email,
    rol: response.data.rol
  }
  store.dispatch('login', user);  
  return user
}