import api from './axiosConfig'
import store from '@/store';

export const start = async () => {
  const response = await api.get('/');
  return response.data;
}

export const login = async (data) => {
  const response = await api.post('/login', { 
    email: data.email, 
    password: data.password,
    client_secret: import.meta.env.VITE_SSR_CLIENT,
    client_id: import.meta.env.VITE_SSR_CLIENT_ID
  });  
  if (response.data.name || response.data.email) {
    const user = {
      id: response.data.id,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      rol: response.data.rol,
      churchName: response.data.churchName,
      avatar: response.data.avatar
    }
    store.dispatch('login', user);  
  }
  return response.data;
}

export const logout = async () => {
  const response = await api.post('/sing-out');
  store.dispatch('logout');
  return response.data;
}

export const sendLead = async (data) => {
  const response = await api.post('/save-leads-church', data);
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

export const getMySheeps  = async()=>{
  const response = await api.get('/my-sheeps');
  return response.data
}

export const getSheepsByServant = async(id)=>{
  const response = await api.get(`/sheeps-by-servant/${id}`);
  return response.data;
}

export const editInfoSheepById = async(id,data)=>{
  const response = await api.put(`/sheep/${id}`,data);
  return response.data;
}

export const getServants = async()=>{
  const response = await api.get('/servants');
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

export const verifyChurchLead = async(data)=>{
  const response = await api.post('/verify-church-lead',{emailToken:data.token});
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

export const getWorshipServices = async(data)=>{
  const response = await api.get(`/worship-services/:${data.minDate}/:${data.maxDate}`);  
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
  const response = await api.get(`/get-states/${idCountry}`);
  return response.data;
}

export const savePeople = async(data)=>{
  const response = await api.post('/save-people',
    {
      ...data,
      client_secret: import.meta.env.VITE_SSR_CLIENT,
      client_id: import.meta.env.VITE_SSR_CLIENT_ID
    });
  return response.data;
}

export const createUsers = async(data)=>{
  const response = await api.post('/create-users', {
    ...data,
    client_secret: import.meta.env.VITE_SSR_CLIENT,
    client_id: import.meta.env.VITE_SSR_CLIENT_ID
  });
  return response.data;
}

export const getCurrencies = async()=>{
  const response = await api.get('/get-currencies');
  return response.data;
}

export const getTypesContributions = async()=>{ 
  const response = await api.get('/get-types-contributions');
  return response.data;
}

export const saveContribution = async(data)=>{
  const response = await api.post('/save-contribution',data);
  return response.data;
}

export const saveAttendance = async(data)=>{
  const response = await api.post('/register-attendance',data);
  return response.data;
}

export const deleteAttendance = async(data)=>{
  const response = await api.delete(`/delete-attendance/${data.personId}/${data.eventId}`);
  return response.data;
}

export const getAttendance = async(eventId)=>{
  const response = await api.get(`/get-attendance/${eventId}`);
  return response.data;
}

export const getOfferings = async(eventId)=>{
  const response = await api.get(`/get-offerings/${eventId}`);
  return response.data;
}

export const registerVisits = async (data)=>{
  const response = await api.post('/register-visits',data);
  return response.data;
}

export const getVisits = async(sheepId)=>{
  const response = await api.get(`/get-visits/${sheepId}`);
  return response.data;
}

export const saveCourses = async(data)=>{
  const response = await api.post('/create-course',data);
  return response.data;
}

export const getCourses = async()=>{
  const response = await api.get('/get-courses');
  return response.data;
}

export const saveChaptersCourse = async(data)=>{
  const response = await api.post('/create-chapters-course',data);
  return response.data;
}

export const getChaptersCourse = async(courseId)=>{
  const response = await api.get(`/get-chapters-courses/${courseId}`);
  return response.data;
}

export const assignCourses = async(data)=>{
  const response = await api.post('/assing-courses',data);
  return response.data;
}

export const getShedulesCourses = async(courseId)=>{
  const response = await api.get(`/get-schedules-courses/${courseId}`);
  return response.data;
}

export const sheduleCourses = async(data)=>{
  const response = await api.post('/shedule-courses',data);
  return response.data;
}

export const saveSheduleCourses = async(data)=>{
  const response = await api.post('/save-shedules-courses',data);
  return response.data;
}

export const getMyCourses = async()=>{
  const response = await api.get('/get-my-courses');
  return response.data;
}

export const getCoursesByPeople = async(personId)=>{
  const response = await api.get(`/get-people-courses/${personId}`);
  return response.data;
}

export const getCoursesInCharge = async()=>{
  const response = await api.get('/get-courses-in-charge');
  return response.data;
}

export const getStudentsCourse = async(courseId)=>{
  const response = await api.get(`/get-students-course/${courseId}`);
  return response.data;
}

export const getAttendanceCourse = async(courseId)=>{
  const response = await api.get(`/get-attendance-course/${courseId}`);
  return response.data;
}

export const registerAttendanceCourse = async(data)=>{
  const response = await api.post('/register-attendance-course',data);
  return response.data;
}

export const deleteAttendanceCourse = async(attendId)=>{
  const response = await api.delete(`/delete-attendance-course/${attendId}`);
  return response.data;
}

export const  enrrollNoUsersInCourse = async(data)=>{
  const response = await api.post('/register-nouser-course',data);
  return response.data;
}

export const stadisticAttendanceCourse = async(courseId)=>{
  const response = await api.get(`/stadistic-attendance-course/${courseId}`);
  return response.data;
}

export const evaluateStudent = async(data)=>{
  const response = await api.put(`/evaluate-student/${data.id}`,data);
  return response.data;
}

export const checkQualifiedRating = async(currentDate)=>{
  const response = await api.get(`/check-qualified/${currentDate}`);
  return response.data;
}

export const getRatingsByService = async(serviceId)=>{
  const response = await api.get(`/average-rating-servants/${serviceId}`);
  console.log('response: ',response)
  return response.data;
}

export const ratingService = async (data) => {
  const response = await api.post('/qualify-service',data)
  return response.data;
}

export const getRatingByServant = async(servantId)=>{
  const response = await api.get(`/get-rating-by-servant/${servantId}`);
  return response.data;
}

export const getStadistcsPeopleChurch = async(data)=>{
  const response = await api.get(`/get-stadistics-people-church/:${data.minDateFormat}/:${data.maxDateFormat}`,data);
  return response.data;
}

export const getStadisticsAssistance = async(data)=>{
  const response = await api.get(`/get-stadistic-assitance-church/:${data.minDateFormat}/:${data.maxDateFormat}`);
  return response.data;
}

export const getStadisticsPeopleCourses = async(data)=>{
  const response = await api.get(`/get-stadistics-people-course/:${data.minDateFormat}/:${data.maxDateFormat}`,);
  return response.data;
}

export const getMyLastServices = async(date)=>{
  const response = await api.get(`/my-services/:${date}`);
  return response.data;
}

export const createGroups = async(data)=>{
  const response = await api.post('/create-groups',data);
  return response.data;
}

export const getGroups = async()=>{
  const response = await api.get('/get-groups');
  return response.data
}

export const getMyGroup = async(id)=>{
  const response = await api.get(`/get-group/${id}`);
  return response.data;
}

export const addPersonStrategy = async(data)=>{
  const response = await api.post('/add-person-strategy',data);
  return response.data;
}

export const getMyInfoGroup = async()=>{
  const response = await api.get('/get-my-info-group');
  return response.data;
}

export const getStrategyById = async(strategyId)=>{
  const response = await api.get(`/get-strategy/${strategyId}`);
  return response.data;
}

export const getAttendanceGroup = async(data)=>{
  const response = await api.get(`/get-attendance-group/${data.groupId}/${data.date}`);
  return response.data;
}

export const getServicesGroup = async(data)=>{
  const response = await api.get(`/get-services-group/${data.groupId}/${data.minDate}/${data.maxDate}`);
  return response.data;
}

export const createWorshipServiceGroup = async(data)=>{
  const response = await api.post('/create-worship-service-group',data);
  console.log('response from back: ',response)
  return response.data;
}

export const getMyprofile = async()=>{
  const response = await api.get('/get-my-profile');
  return response.data;
}

//administrativeApp
export const getLeads = async()=>{
  const response = await api.get('/get-leads');
  return response.data;
}

export const updateLead = async(data)=>{
  const response = await api.put(`/update-lead/${data.leadId}`,data);
  return response.data;
}

export const updatePhoto = async (data) => {
  const response = await api.put('/update-photo', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const deletePhoto = async (fileName) => {
  const response = await api.delete(`/delete-photo/${encodeURIComponent(fileName)}`);
  return response.data;
}

export const getParentsChurches = async()=>{
  const response = await api.get('/get-parents-churches');
  return response.data;
}

export const createChurch = async(data)=>{
  const response = await api.post('/create-church',data);
  return response.data;
}

export const updateRolServant = async(data)=>{
  const response = await api.put(`/update-rol-servant/${data.id}`,data);
  return response.data;
}

export const resetPassword = async (data) => {
  const response = await api.put('/reset-password', {
    ...data,
    client_secret: import.meta.env.VITE_SSR_CLIENT,
    client_id: import.meta.env.VITE_SSR_CLIENT_ID
  });
  return response.data;
}

export const forgetPassword = async (data) => {
  const response = await api.post('/forgot-password', {
    ...data,
    client_secret: import.meta.env.VITE_SSR_CLIENT,
    client_id: import.meta.env.VITE_SSR_CLIENT_ID
  });
  return response.data;
}

export const verifyCode = async (data) => {
  const response = await api.post('/verify-code', {
    ...data,
    client_secret: import.meta.env.VITE_SSR_CLIENT,
    client_id: import.meta.env.VITE_SSR_CLIENT_ID
  });
  return response.data;
}

export const updatePassword = async (data) => {
  const response = await api.put('/update-forget-password', {
    ...data,
    client_secret: import.meta.env.VITE_SSR_CLIENT,
    client_id: import.meta.env.VITE_SSR_CLIENT_ID
  });
  return response.data;
}

export const sendNotificationWorshipService = async(data)=>{
  const response = await api.post('/notification-worship-service',data);
  return response.data;
}

export const cancelStudentCourse = async(data)=>{
  const response = await api.delete(`/cancel-course/${data.courseId}/${data.personId}`);
  return response.data;
}

export const getFinances = async(data)=>{
  const response = await api.get(`/get-finances-year/:${data.minDateFormat}/:${data.maxDateFormat}`);
  return response.data;
}
 
export const getReportOfferings = async(eventId)=>{
  const response = await api.get(`/get-report-offerings/${eventId}`);
  return response.data;
}