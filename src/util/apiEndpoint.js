export const BASE_URL = "http://localhost:8080";

const CLOUDINARY_CLOUD_NAME = "dmuizhnkz";

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  GET_USER_INFO: "/profile",
  GET_ALL_CATEGORIES: "/category",
  ADD_CATEGORIES: "/category",
  UPDATE_CATEGORY: (categoryId) => `/category/${categoryId}`,
  GET_ALL_INCOMES:"/income",
  GET_ALL_EXPENSES:"/expense",
  CATEGORY_BY_TYPE: (type) => `/category?type=${type}`,
  ADD_INCOME: "/income",
  DELETE_INCOME: (incomeId) => `/income/${incomeId}`,
  INCOME_EXCEL_DOWNLOAD: "/income/export",
  ADD_EXPENSE: "/expense",
  DELETE_EXPENSE: (expenseId) => `/expense/${expenseId}`,
  EXPENSE_EXCEL_DOWNLOAD: "/expense/export",
  APPLY_FILTER: "/filter",
  GET_DASHBOARD_DATA: "/dashboard",
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
};
