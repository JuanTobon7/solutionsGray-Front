import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_PROXY_HOST,
    withCredentials: true,
    maxContentLength: 25000000,
    maxBodyLength: 25000000
})
//verificamos si la cookie ha expirado
/* const isCookieExpired = (cookieName) => {
    const cookie = Cookies.getJSON(cookieName);
    if (!cookie || !cookie.expires) {
      return true;
    }
    const now = new Date().getTime();
    const expires = new Date(cookie.expires).getTime();
    return now > expires;
  }; */

async function refreshToken() {
  const response = await api.post('/refresh-token');
  return response.data;
}

api.interceptors.response.use (
  function(response){
    // Si la respuesta es exitosa, retornar directamente los datos
    return response
  },
  async function(error){
        const originalRequest = error.config; // Guardamos la petición original
        if (error.response.status === 401 && error.response.data.message === 'Token Expired') {
          try{            
            // El servidor respondió con un código de estado fuera del rango 2xx            
            await refreshToken()
            return await api(originalRequest)
          }catch(refreshError){
            return Promise.reject(refreshError.message);
          }            
       }
        return Promise.reject(error);
    }
)

export default api