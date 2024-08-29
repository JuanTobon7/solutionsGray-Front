import api from './axiosConfig'
import store from '@/store';

export const start = async () => {
  const response = await api.get('/');
  return response.data;
}

export const login = async (data) => {
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
  const response = await api.put(`/sheep/${id}`,data);
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
  return {
    ...response.data,
    status: response.status
  }
  ;
}

export const verifyInvitationBoarding = async(data)=>{
  const response = await api.post('/accept-invitation',{emailToken:data.token});
  return response.data;
}

export const refreshToken = async()=>{
  const response = await api.post('/refresh-token');
  return response.data;
}

export const createWorshipService = async(data)=>{
  const response = await api.post('/create-worship-service',data);
  return response.data;
}

export const getWorshipServices = async()=>{
  const response = await api.get('/worship-services');
  return response.data;
}