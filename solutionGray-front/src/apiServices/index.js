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
  const response = await api.post('/invitation-boarding',data);
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
  console.log('response from back: ',response)
  return response.data;
}

export const getTypesWorship = async()=>{
  const response = await api.get('/types-worship-services');
  return response.data;
}

export const getWorshipServices = async()=>{
  const response = await api.get('/worship-services');
  return response.data;
}

export const getPeople = async () => {
      const response = await api.get('/get-people');
      return response.data
};

export const registerSheep = async(data)=>{
  const response = await api.post('/register-sheeps',data);
  return response.data;
}
//llama los servicios osea los tipos de servicios (ujier, predicador, etc)
export const getRolesServices = async()=>{
  const response = await api.get('/services');
  return response.data;
}

export const assingService = async(data)=>{
  const response = await api.post('/assing-services',data);
  return response.data;
}

export const getServices = async(eventId)=>{
  console.log('eventID: ',eventId);
  const response = await api.get(`/assigned-services/${eventId}`);
  return response.data;
}

export const updateAssingServices = async(data)=>{
  console.log('hehe hehe hehe')
  const response = await api.put('/update-assign-service',data)
  return response.data
}

export const updateWorshipService = async(data)=>{
  console.log('here in update worship',data)
  const response = await api.put('/update-worship-services',data)
  return response.data
}

export const deleteAssingServices = async(serviceId)=>{
  console.log('hehe hehe hehe delete', serviceId)
  const response = await api.delete(`/delete-assign-service/${serviceId}`)
  return response.data
}

export const getTypesPeople = async()=>{
  const response = await api.get('/get-types-people');
  return response.data;  
}

export const getCountries = async()=>{
  const response = await api.get('/get-countries');
  return response.data;
}

export const getStatesByCountry = async(idCountry)=>{
  const response = await api.get(`/get-states-by-country/${idCountry}`);
  return response.data;
}