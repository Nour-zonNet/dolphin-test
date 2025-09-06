import api from "@/services/api";

export const fetchProfile = async () => {
  const response = await api.get("/student/info");
  return response.data.data; 
};

export const addBrother = async (payload) => {
  const response = await api.post("/student/add-brother", payload);
  return response.data.data; 
};

export const fetchClasses = async () => {
  const response = await api.get("/student/classes");
  return Array.isArray(response.data.data) ? response.data.data : []; 
};

export const fetchBrothers = async () => {
  const response = await api.get("/student/brothers");
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const switchAccount = async (studentId) => {
  const response = await api.post("/student/switch-account", {
    id: studentId, 
  });

  const { token, userData } = response.data.data;

  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return userData; 
};
