/**
 * Notification system for bill reminders and financial alerts
 */

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  BILL_REMINDER: 'bill_reminder',
  BUDGET_ALERT: 'budget_alert',
  SAVINGS_MILESTONE: 'savings_milestone',
  SPENDING_ALERT: 'spending_alert',
  INCOME_NOTIFICATION: 'income_notification'
};

/**
 * Notification priorities
 */
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Create a new notification
 * @param {Object} notificationData - The notification details
 * @returns {Object} The created notification object
 */
export const createNotification = (notificationData) => {
  return {
    id: Date.now().toString(),
    ...notificationData,
    createdAt: new Date().toISOString(),
    read: false
  };
};

/**
 * Send email notification (mock implementation)
 * @param {string} email - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @returns {Promise<boolean>} Success status
 */
export const sendEmailNotification = async (email, subject, message) => {
  // Mock implementation - in a real app, this would integrate with an email service
  console.log(`📧 Email sent to ${email}: ${subject}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Send SMS notification (mock implementation)
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - SMS message
 * @returns {Promise<boolean>} Success status
 */
export const sendSMSNotification = async (phoneNumber, message) => {
  // Mock implementation - in a real app, this would integrate with an SMS service
  console.log(`📱 SMS sent to ${phoneNumber}: ${message}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Schedule a notification for future delivery
 * @param {Object} notification - Notification object
 * @param {Date} scheduledTime - When to send the notification
 * @returns {Object} Scheduled notification
 */
export const scheduleNotification = (notification, scheduledTime) => {
  return {
    ...notification,
    scheduledTime: scheduledTime.toISOString(),
    status: 'scheduled'
  };
};

/**
 * Generate bill reminder notification
 * @param {Object} billData - Bill information
 * @param {number} daysBefore - Days before due date to send reminder
 * @returns {Object} Notification object
 */
export const generateBillReminder = (billData, daysBefore = 3) => {
  const dueDate = new Date(billData.dueDate);
  const reminderDate = new Date(dueDate);
  reminderDate.setDate(reminderDate.getDate() - daysBefore);
  
  return createNotification({
    type: NOTIFICATION_TYPES.BILL_REMINDER,
    title: `Upcoming Bill: ${billData.name}`,
    message: `Your ${billData.name} bill of ${billData.amount} is due on ${dueDate.toDateString()}.`,
    priority: dueDate < new Date() ? NOTIFICATION_PRIORITIES.URGENT : NOTIFICATION_PRIORITIES.HIGH,
    data: billData,
    scheduledTime: reminderDate.toISOString()
  });
};

/**
 * Generate budget alert notification
 * @param {Object} budgetData - Budget information
 * @param {number} threshold - Percentage threshold that triggered the alert
 * @returns {Object} Notification object
 */
export const generateBudgetAlert = (budgetData, threshold) => {
  return createNotification({
    type: NOTIFICATION_TYPES.BUDGET_ALERT,
    title: `Budget Alert: ${budgetData.category}`,
    message: `You've used ${threshold}% of your ${budgetData.category} budget. Consider reviewing your spending.`,
    priority: threshold > 90 ? NOTIFICATION_PRIORITIES.URGENT : 
              threshold > 75 ? NOTIFICATION_PRIORITIES.HIGH : 
              NOTIFICATION_PRIORITIES.MEDIUM,
    data: budgetData
  });
};

/**
 * Generate savings milestone notification
 * @param {Object} savingsData - Savings information
 * @param {number} milestone - Milestone amount reached
 * @returns {Object} Notification object
 */
export const generateSavingsMilestone = (savingsData, milestone) => {
  return createNotification({
    type: NOTIFICATION_TYPES.SAVINGS_MILESTONE,
    title: `Savings Milestone Reached!`,
    message: `Congratulations! You've reached your savings goal of ${milestone}.`,
    priority: NOTIFICATION_PRIORITIES.HIGH,
    data: savingsData
  });
};

export default {
  createNotification,
  sendEmailNotification,
  sendSMSNotification,
  scheduleNotification,
  generateBillReminder,
  generateBudgetAlert,
  generateSavingsMilestone,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES
};