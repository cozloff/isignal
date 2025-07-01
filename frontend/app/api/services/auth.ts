import apiClient from "~/api/axios.server";
import { type Registration } from "~/types/Auth/Registration";

/**
 * Login a user
 * POST /api/Auth/login
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const { data } = await apiClient.post("/api/Auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Register a user
 * POST /api/Auth/register
 */
export const registerUser = async (register: Registration) => {
  try {
    console.log("Register: ", register);
    const { data } = await apiClient.post("/api/Auth/register", register);
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
