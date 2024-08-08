import api from './axiosConfig'

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