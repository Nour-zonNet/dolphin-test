import api from "@/services/api";

class AuthRepository {
  async login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  }

  async register(userData) {
    const { data } = await api.post("/auth/register", userData);
    return data;
  }

  async getProfile() {
    const { data } = await api.get("/auth/me");
    return data;
  }

  async logout() {
    // if your backend has logout endpoint, call it
    await api.post("/auth/logout");
    return true;
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
