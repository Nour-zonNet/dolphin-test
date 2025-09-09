import api from "@/services/api";
import { ENDPOINTS } from "../../../constants/API_ENDPOINTS";

class AuthRepository {
  async checkPhone(credentials) {
    const { data } = await api.post(ENDPOINTS.CHECK_PHONE, credentials);

    return data;
  }
  async login(credentials) {
    const { data } = await api.post(ENDPOINTS.LOGIN, credentials);

    return data;
  }

  async register(userData) {
    const { data } = await api.post(ENDPOINTS.REGISTER, userData);

    return data;
  }
  async verifyOtp(credentials) {
    const { data } = await api.post(ENDPOINTS.VERIFY_OTP, credentials);
    return data;
  }
  async getProfile() {
    const { data } = await api.get(ENDPOINTS.GET_PROFILE);
    return data;
  }

  async logout() {
    await api.post(ENDPOINTS.LOGOUT);
    return true;
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
