import api from "@/services/api";

class PackagesRepository {
  // Get all packages
  async getAll() {
    const { data } = await api.get("/student/packages");
    return data;
  }

  // Get single package
  async getById(packageId) {
    const { data } = await api.get(`/packages/${packageId}`);
    return data;
  }

  // Create new package
  async create(packageData) {
    const { data } = await api.post("/packages", packageData);
    return data;
  }

  // Update a package
  async update(packageId, packageData) {
    const { data } = await api.put(`/packages/${packageId}`, packageData);
    return data;
  }

  // Delete a package
  async delete(packageId) {
    const { data } = await api.delete(`/packages/${packageId}`);
    return data;
  }
}

// Singleton instance
export const packagesRepository = new PackagesRepository();
