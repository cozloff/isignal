import apiClient from "~/api/axios.server";

/**
 * Get all Users
 * GET /api/Users
 */
export const getAllUsers = async () => {
  try {
    const { data } = await apiClient.get("/api/Users");
    return data;
  } catch (error) {
    console.error("Failed to get Users:", error);
    throw error;
  }
};

/**
 * Get one user by ID
 * GET /api/Users/:id
 */
export const getUser = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/api/Users/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to get user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get one user by email
 * GET /api/Users/:email
 */
export const getUserByEmail = async (email: string) => {
  try {
    const { data } = await apiClient.get(`/api/Users/email/${email}`);
    return data;
  } catch (error) {
    console.error(`Failed to get user with email ${email}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 * POST /api/Users
 */
export const addUser = async (user: any) => {
  try {
    const { data } = await apiClient.post("/api/Users", user);
    return data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

/**
 * Update an existing user
 * PUT /api/Users/:id
 */
export const editUser = async (id: string, user: any) => {
  try {
    const { data } = await apiClient.put(`/api/Users/${id}`, user);
    return data;
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 * DELETE /api/Users/:id
 */
export const removeUser = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/api/Users/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 * DELETE /api/Users/:id
 */
export const attestation = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/api/Users/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
};
