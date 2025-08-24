import api from "@/services/api";

class LessonsRepository {
  // Get all lessons
  async getAll() {
    const { data } = await api.get("/student/schedule");
    return data;
  }

  // Get single lesson
  async getById(lessonId) {
    const { data } = await api.get(`/lessons/${lessonId}`);
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
