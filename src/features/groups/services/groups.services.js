import api from "@/services/api";
import { ENDPOINTS } from "../../../constants/API_ENDPOINTS";

class GroupsRepository {
  async getByPackageId(packageId) {
    const { data } = await api.post(ENDPOINTS.GROUPS_BY_BACKAGEID, {
      package_id: packageId,
    });
    return data;
  }
}

export const groupsRepository = new GroupsRepository();
