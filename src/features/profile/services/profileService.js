import api from "@/services/api";
import { ENDPOINTS } from "../../../constants/API_ENDPOINTS";

class ProfileRepository {
 
  async addBrother(formData) {
    const response = await api.post(ENDPOINTS.ADD_BROTHER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
  }

  async getClasses() {
    const response = await api.get(ENDPOINTS.CLASSES);
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }

  async getBrothers() {
    const response = await api.get(ENDPOINTS.FETCH_BORTHER);
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }


  async logout() {
    await api.post(ENDPOINTS.LOGOUT);
    return true;
  }
}

// ✅ Singleton instance
export const profileRepository = new ProfileRepository();

// Named helpers used by slices (keeps slices decoupled from repository internals)

