import api from "@/services/api";

export const fetchProfile = async () => {
  const response = await api.get("/student/info");
  return response.data.data; // because your API returns { success, data }
};
