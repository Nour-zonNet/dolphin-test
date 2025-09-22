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

  async sendOtpResetPassword(credentials) {
    const { data } = await api.post(ENDPOINTS.SEND_OTP_CODE, credentials);
    return data;
  }
  async verifyOtpResetPassword(credentials) {
    const { data } = await api.post(
      ENDPOINTS.VERIFY_OTP_RESET_PASSWORD,
      credentials
    );
    return data;
  }
  async resetPassword(credentials) {
    const { data } = await api.post(ENDPOINTS.RESET_PASSWORD, credentials);
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

  async switchAccount(studentId) {
    const { data } = await api.post(ENDPOINTS.SWITCH_ACCOUNT, {
      id: studentId,
    });
    return data?.data; // { token, userData }
  }
  async updateUser(payload) {
    const body = { ...payload, _method: "PATCH" };
    const { data } = await api.post(ENDPOINTS.UPDATE_PROFILE, body);
    return data?.data;
  }

  async updateUserImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("_method", "PATCH");

    const response = await api.post(ENDPOINTS.UPDATE_IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data?.data?.userData;
  }

  async addBrother(formData) {
    const response = await api.post(ENDPOINTS.ADD_BROTHER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
  }
  async getBrothers() {
    const response = await api.get(ENDPOINTS.FETCH_BORTHER);
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }
  async disActiveAccount() {
    const response = await api.delete(ENDPOINTS.DIS_ACTIVE_ACCOUNT);
    return response.data?.data;
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
