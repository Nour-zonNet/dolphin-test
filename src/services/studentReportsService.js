
import api from './api';

export const studentReportsService = {
  getStudentReports: async (filter = 'monthly') => {
    try {
      const response = await api.get(`/student/review?filter=${filter}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};