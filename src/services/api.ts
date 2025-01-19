import axios from 'axios';
//import.meta.env.VITE_BACKEND_URL ||
const api = axios.create({
  // baseURL: 'http://localhost:3001/api'
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://examinationsystembackend.vercel.app/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (USN: string, password: string) => 
    api.post('/auth/login', { USN, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData)
};

export const student = {
  addGrades:(studentId: string, grades:{ subjectCode: string; grade: string }[])=>api.put('/student/addgrade',{studentId,grades}),
  getStudents:()=>api.get('/student/allstudents'),
  getSubjects: () => api.get('/student/allsubjects'),
  getSubjectsBySemester: (semester: any) => api.get(`/student/subjects/${semester}`),
  getPaymentHistory: (userId: string) => api.get(`/student/payments/${userId}`),
  getSubjectWithId: (subjectId: string) => api.get(`/student/subject/${subjectId}`),
  registeredsubjects: (userId: string) => api.get(`/student/registeredsubjects?userId=${userId}`),
  deleteStudent:(studentId : string)=>api.delete('/student/deleteStudents',{data: {studentId}}),
  challengingValuation: (data: object) => api.post('/student/challenge-valuation',data),
  rrsubjects: (userId: string) => api.get(`/student/subject/rrSubject/${userId}`),
  getOrder: (price: number) => api.post(`/student/order`,{price}),
  rrSubjectPayment: (data:any) => api.post('/student/rrSubjectpayment', data),

  getProfile: () => api.get('/student/profile'),
  registerSubjects: (subjectIds: string[]) => 
    api.post('/student/register-subjects', { subjectIds }),
  applyChallengeValuation: (subjectId: string) =>
    api.post('/student/challenge-valuation', { subjectId }),
  getPayments: () => api.get('/student/payments'),
  getResults: () => api.get('/student/results'),
  createOrder:(semester:number, price:number)=>api.post('/student/purchase',{semester, price}),
  getApiKey:()=>api.get('/student/getApiKey'),
  verifyPayment:(razorpay_order_id:string, razorpay_payment_id:string, razorpay_signature:string, userId:string, semester:number)=>api.post('/student/verifypayment',{razorpay_order_id, razorpay_payment_id, razorpay_signature, userId,semester})
};

export const admin = {
  addSubject: (subjectData: any) => 
    api.post('/admin/subjects', subjectData),
  login:(email:string,password:string)=>
    api.post('/admin/login',{email,password}),
  assignUSN: (userId: string, USN: string) =>
    api.patch(`/admin/assign-usn/${userId}`, { USN }),
  increaseSem: (userId: string, currentSemester: number) =>
    api.patch(`/admin/increase-sem/${userId}`, { currentSemester }),
  allSubjects:()=>
    api.get('/admin/allSubjects'),
  addGrades: (studentId: string, subjectId: string, grade: string, sem: number) =>
    api.patch('/admin/grades', { studentId, subjectId, grade, sem }),
  DeleteSubject: (subjectId: string) =>
    api.delete('/admin/subject', { data: { subjectId } }),  
  FindSubject: (subjectId: string) =>
    api.get(`/admin/particularSubject?subjectId=${subjectId}`),
  LaunchResult: (data:any) => api.patch('/admin/launch-result', data),
  allchallengevaluations: ()=> api.get('/admin/challengevaluations'),
  updateChallengeEvaluationStatus: (data: any)=> api.patch('/admin/challengevaluations/status',data),
  //allPayments: () => api.get('/admin/payments'),
  fetchPayments: () => api.get('/admin/payments'),
};

export const Faculty={
  register:(name:string,email:string,password:string,department:string)=>
    api.post('/faculty/register',{name,email,password,department}),
  login:(email:string,password:string)=>
    api.post('/Faculty/login',{email,password}),
  getProfile: (facultyId: string)=>api.get(`/Faculty/profile/${facultyId}`),
  updateStatus: (data: any)=>api.patch('/Faculty/updateStatus', data),
  getFaculty:()=>api.get('/Faculty/allFaculty'),
  getFacultyByDept:(dept: String)=>api.get(`/Faculty/allFaculty/${dept}`),
  deleteFaculty:(facultyId : string)=>api.delete('/Faculty/deleteFaculty',{data: {facultyId}}),

}