import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const submitReport = (formData) => API.post('/reports', formData);
export const getReportPdf = (id) => API.get(`/reports/${id}/pdf`, { responseType: 'blob' });
export const getReport = (id) => API.get(`/reports/${id}`);
