import api from "@/services/api";
import { ENDPOINTS } from "../../../constants/API_ENDPOINTS";

class ComplaintsRepository {
  // Submit a new complaint
  async submitComplaint(complaintData) {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', complaintData.title);
    formData.append('description', complaintData.description);
    formData.append('category', complaintData.category);
    
    // Add files if they exist
    if (complaintData.files && complaintData.files.length > 0) {
      complaintData.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    }
    
    const { data } = await api.post(ENDPOINTS.COMPLAINTS_SUBMIT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  // Get user's complaints
  async getComplaints() {
    const { data } = await api.get(ENDPOINTS.COMPLAINTS_LIST);
    return data;
  }

  // Get single complaint details
  async getComplaintById(complaintId) {
    const { data } = await api.get(`${ENDPOINTS.COMPLAINTS_LIST}/${complaintId}`);
    return data;
  }
}

// Singleton instance
export const complaintsRepository = new ComplaintsRepository();
