import axios from 'axios'
import Cookies from 'js-cookie'

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

api.interceptors.request.use ((config)=>{
   /*  if(isCookieExpired){
        const response  = await api.post('')
    } */
    
    const access_token = Cookies.get('access_token')
    const refresh_token = Cookies.get('refresh_token')
    console.log('access_token', access_token)
    console.log('refresh_token', refresh_token)
    if(access_token){
        config.headers['Authorization'] = `Bearer ${access_token}`
        config.headers['x-access-token'] = true
    }
    if(refresh_token){
        config.headers['x-refresh-token'] = refresh_token
    }

    return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

export default api