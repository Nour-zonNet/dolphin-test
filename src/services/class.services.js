import api from "@/services/api";
import { ENDPOINTS } from "@/constants/API_ENDPOINTS";

class ClassRepository {
  async getClasses() {
    const { data } = await api.get(ENDPOINTS.CLASSES);
    return data;
  }
}

// ✅ Singleton instance
export const classRepository = new ClassRepository();

// Named helpers used by slices (keeps slices decoupled from repository internals)
