/**
 * Admin Service
 * Contains all admin-related API calls
 */

import axiosConfig from "./axiosConfig";
import { API_ENDPOINTS } from "./apiEndpoint";

/**
 * Get all users (admin only)
 * @returns {Promise} Axios promise with user data
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosConfig.get(API_ENDPOINTS.ADMIN_GET_ALL_USERS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

/**
 * Promote user to admin
 * @param {number} userId - ID of the user to promote
 * @returns {Promise} Axios promise with result
 */
export const promoteUserToAdmin = async (userId) => {
  try {
    const response = await axiosConfig.put(API_ENDPOINTS.ADMIN_PROMOTE_USER(userId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to promote user");
  }
};

/**
 * Demote admin to user
 * @param {number} userId - ID of the admin to demote
 * @returns {Promise} Axios promise with result
 */
export const demoteAdminToUser = async (userId) => {
  try {
    const response = await axiosConfig.put(API_ENDPOINTS.ADMIN_DEMOTE_USER(userId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to demote admin");
  }
};

/**
 * Suspend user
 * @param {number} userId - ID of the user to suspend
 * @returns {Promise} Axios promise with result
 */
export const suspendUser = async (userId) => {
  try {
    const response = await axiosConfig.put(API_ENDPOINTS.ADMIN_SUSPEND_USER(userId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to suspend user");
  }
};

/**
 * Activate user
 * @param {number} userId - ID of the user to activate
 * @returns {Promise} Axios promise with result
 */
export const activateUser = async (userId) => {
  try {
    const response = await axiosConfig.put(API_ENDPOINTS.ADMIN_ACTIVATE_USER(userId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to activate user");
  }
};

/**
 * Delete user
 * @param {number} userId - ID of the user to delete
 * @returns {Promise} Axios promise with result
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axiosConfig.delete(API_ENDPOINTS.ADMIN_DELETE_USER(userId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export default {
  getAllUsers,
  promoteUserToAdmin,
  demoteAdminToUser,
  suspendUser,
  activateUser,
  deleteUser
};