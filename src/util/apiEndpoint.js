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
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  // Recurring transactions
  GET_RECURRING_TRANSACTIONS: "/recurring",
  ADD_RECURRING_TRANSACTION: "/recurring",
  UPDATE_RECURRING_TRANSACTION: (id) => `/recurring/${id}`,
  DELETE_RECURRING_TRANSACTION: (id) => `/recurring/${id}`,
  // Budget planning
  GET_BUDGETS: "/budget",
  ADD_BUDGET: "/budget",
  UPDATE_BUDGET: (id) => `/budget/${id}`,
  DELETE_BUDGET: (id) => `/budget/${id}`,
  // Notifications
  GET_NOTIFICATIONS: "/notifications",
  MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/read`,
  // Currency
  GET_EXCHANGE_RATES: "/currency/rates"
};
