import api from "@/services/api";
import { ENDPOINTS } from "../../../constants/API_ENDPOINTS";

class LessonsRepository {
  // Get all lessons
  async getAll() {
    const { data } = await api.get(ENDPOINTS.SCHEDULE_OF_ALLPACKAGES);
    return data;
  }
  async getPackageLessons(packageId) {
    const { data } = await api.get(ENDPOINTS.LESSONS_OF_PACKAGE + packageId);
    return data;
  }

  // Get single lesson
  async getById(lessonId) {
    const { data } = await api.get(`/lessons/${lessonId}`);
    return data;
  }
  async getSessionLink(sessionId) {
    const { data } = await api.get(ENDPOINTS.GET_SESSION + sessionId);
    return data;
  }

  // Create new lesson
  async getContentsBySessionId(sessionId) {
    const {data} = await api.get(
      ENDPOINTS.GET_CONTENTS_BY_SESSION_ID + sessionId
    );
    return data;
  }
  // Create new lesson
  async create(lessonData) {
    const { data } = await api.post("/lessons", lessonData);
    return data;
  }

  // Update a lesson
  async update(lessonId, lessonData) {
    const { data } = await api.put(`/lessons/${lessonId}`, lessonData);
    return data;
  }

  // Delete a lesson
  async delete(lessonId) {
    const { data } = await api.delete(`/lessons/${lessonId}`);
    return data;
  }
}

// Singleton instance
export const lessonsRepository = new LessonsRepository();
