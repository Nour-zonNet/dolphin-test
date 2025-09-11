import api from "@/services/api";

export const fetchProfile = async () => {
  const response = await api.get("/student/info");
  return response.data.data; 
};

// export const addBrother = async (payload) => {
//   const response = await api.post("/student/add-brother", payload);
//   return response.data.data; 
// };

export const addBrother = async (formData) => {
  const response = await api.post("/student/add-brother", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

export const updateUserImageApi = async (userId, file) => {
  const formData = new FormData();
  formData.append("id", userId);
  formData.append("image", file);
  formData.append("_method", "PATCH");

  const response = await api.post("/student/update-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data.userData; 
};

export const updateUserGradeApi = async (userId, gradeId) => {
  const response = await api.put(`/student/update-grade`, {
    user_id: userId,
    grade_id: gradeId,
  });
  return response.data.data;
};

export const logoutApi = async () => {
  try {
    await api.post("/student/logout");
  } catch (err) {
    console.warn("Logout API failed (ignoring):", err?.response?.data || err);
  }

  // always clear client-side
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];

  return true;
};

// Update Profile
export const updateProfileApi = async (payload) => {
  const body = {
    ...payload,
    _method: "PATCH",
  }
  const { data } = await api.post("student/update-profile", body);
  return data;
}

