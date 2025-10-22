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
  async reactivate(subscriptionId) {
    const { data } = await api.post(ENDPOINTS.REACTIVE_SUBSCRIPTION, {
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
    const { data } = await api.post(ENDPOINTS.CREATE_TRIAL_SUBSCRIPTION, {
      packageIds: packageIds,
    });
    return data;
  }

  // Create new subscription payment
  async createNewSubscriptionPayment(packageIds) {
    // Convert package IDs to the expected format: [{"id": 89}, {"id": 206}]
    const packages = Array.isArray(packageIds) 
      ? packageIds.map(id => ({ id: parseInt(id) }))
      : [{ id: parseInt(packageIds) }];
    
    console.log('Creating payment for packages:', packageIds);
    console.log('Formatted packages:', packages);
    console.log('Request URL:', '/student/recharge-packages');
    
    try {
      const response = await api.post('/student/recharge-packages', { packages });
      console.log('Full API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Response headers:', response.headers);
      
      return response.data;
    } catch (error) {
      console.error('=== PAYMENT REQUEST ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error status text:', error.response?.statusText);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      console.error('Request config:', error.config);
      console.error('================================');
      throw error;
    }
  }

    async getByGroupsPackageId(packageId) {
      const { data } = await api.post(ENDPOINTS.GROUPS_BY_BACKAGEID, {
        package_id: packageId,
      });
      return data;
    }
}

export const subscriptionRepository = new SubscriptionRepository();
