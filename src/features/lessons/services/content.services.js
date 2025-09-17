// services/content.services.js
import api from "@/services/api";

class ContentRepository {
  async getByLessonId(lessonId) {
    // dynamic id (no hardcoding)
    const { data } = await api.get(`/lessons/${lessonId}`);
    return data; // -> { success, message, data }
  }
}

export const contentRepository = new ContentRepository();

export const contentService = {
  getByLessonId: (lessonId) => contentRepository.getByLessonId(lessonId),
};
