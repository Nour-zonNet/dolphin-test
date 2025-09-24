
import api from "@/services/api";

class ContentRepository {
  async getByLessonId(lessonId, axiosConfig = {}) {
    const { data } = await api.get(`/student/lessons/${lessonId}`, axiosConfig);
    return data; 
  }
}

export const contentRepository = new ContentRepository();

export const contentService = {
  getByLessonId: (lessonId, axiosConfig) =>
    contentRepository.getByLessonId(lessonId, axiosConfig),
};
