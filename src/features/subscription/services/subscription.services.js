import api from "@/services/api";
import { ENDPOINTS } from "@/constants/API_ENDPOINTS";

class SubscriptionRepository {
  // Get all subscriptions
  async getAll() {
    const { data } = await api.get(ENDPOINTS.GET_MY_SUBSCRIPTIONS);
    return data;
  }

  // Get single subscription
  async getById(subscriptionId) {
    const { data } = await api.get(
      `/student/packages/subscription-packages/${subscriptionId}`
    );
    return data;
  }

  // Cancel subscription
  async cancel(subscriptionId) {
    const { data } = await api.post(ENDPOINTS.CANCEL_SUBSCRIPTION, {
      subscription_id: subscriptionId,
    });
    return data;
  }

  // Renew subscription
  async renew(subscriptionId) {
    const { data } = await api.post(
      `/student/packages/subscription-packages/${subscriptionId}/renew`
    );
    return data;
  }

  // Change group
  async changeGroup(subscriptionId, groupId) {
    const { data } = await api.post(`/student/change-student-group`, {
      subscription_id: subscriptionId,
      new_group_id: groupId,
    });
    return data;
  }

  // Get available groups for a package id
  async getGroupsByPackageId(packageId) {
    const { data } = await api.get(
      `${ENDPOINTS.GROUPS_BY_BACKAGEID}/${packageId}`
    );
    return data;
  }

  // Create trial subscription
  async createTrialSubscription(packageIds) {
    console.log({
      packageIds: packageIds,
    });
    const { data } = await api.post(ENDPOINTS.CREATE_TRIAL_SUBSCRIPTION, {
      packageIds: packageIds,
    });
    return data;
  }
}

export const subscriptionRepository = new SubscriptionRepository();
