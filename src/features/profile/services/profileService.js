import api from "@/services/api";

class ProfileRepository {
  // Get profile info
  async getProfile() {
    const { data } = await api.get("/student/info");
    return data.data;
  }

  // Add brother
  async addBrother(payload) {
    const { data } = await api.post("/student/add-brother", payload);
    return data.data;
  }

  // Get classes
  async getClasses() {
    const { data } = await api.get("/student/classes");
    return Array.isArray(data.data) ? data.data : [];
  }

  // Get brothers
  async getBrothers() {
    const { data } = await api.get("/student/brothers");
    return Array.isArray(data.data) ? data.data : [];
  }

  // Switch account
  async switchAccount(studentId) {
    const { data } = await api.post("/student/switch-account", { id: studentId });
    const { token, userData } = data.data;

    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return userData;
  }

  // Update user image
  async updateImage(userId, file) {
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("image", file);
    formData.append("_method", "PATCH");

    const { data } = await api.post("/student/update-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data.userData;
  }

  // Update user grade
  async updateGrade(userId, gradeId) {
    const { data } = await api.put("/student/update-grade", {
      user_id: userId,
      grade_id: gradeId,
    });
    return data.data;
  }

  // Logout
  async logout() {
    try {
      await api.post("/student/logout");
    } catch (err) {
      console.warn("Logout API failed (ignoring):", err?.response?.data || err);
    }

    // always clear client-side
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];

    return true;
  }
}

// Singleton instance
export const profileRepository = new ProfileRepository();
