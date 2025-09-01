import api from "@/services/api";   

class SubscriptionRepository {
    // Get all subscriptions
    async getAll() {
        const { data } = await api.get("/student/packages/subscription-packages");
        return data;
    }

    // Get single subscription
    async getById(subscriptionId) {
        const { data } = await api.get(`/student/packages/subscription-packages/${subscriptionId}`);
        return data;
    }

      // Cancel subscription
  async cancel(subscriptionId) {
    const { data } = await api.post(`/student/packages/subscription-packages/${subscriptionId}/cancel`);
    return data;
  }

  // Renew subscription
  async renew(subscriptionId) {
    const { data } = await api.post(`/student/packages/subscription-packages/${subscriptionId}/renew`);
    return data;
  }

  // Change group
  async changeGroup(subscriptionId, groupId) {
    const { data } = await api.post(
      `/student/packages/subscription-packages/${subscriptionId}/change-group`,
      { groupId }
    );
    return data;
  }
}

export const subscriptionRepository = new SubscriptionRepository();