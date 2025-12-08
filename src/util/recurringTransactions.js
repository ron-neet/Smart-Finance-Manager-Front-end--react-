/**
 * Recurring transactions management utilities
 */

/**
 * Recurrence frequencies
 */
export const RECURRENCE_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  BIMONTHLY: 'bimonthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

/**
 * Create a recurring transaction template
 * @param {Object} transactionData - Base transaction data
 * @param {string} frequency - How often the transaction recurs
 * @param {Date} startDate - When the recurrence starts
 * @param {Date} endDate - When the recurrence ends (optional)
 * @returns {Object} Recurring transaction template
 */
export const createRecurringTransaction = (transactionData, frequency, startDate, endDate = null) => {
  return {
    id: Date.now().toString(),
    ...transactionData,
    frequency,
    startDate: startDate.toISOString(),
    endDate: endDate ? endDate.toISOString() : null,
    nextOccurrence: startDate.toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Calculate next occurrence date based on frequency
 * @param {Date} currentDate - Current occurrence date
 * @param {string} frequency - Recurrence frequency
 * @returns {Date} Next occurrence date
 */
export const calculateNextOccurrence = (currentDate, frequency) => {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case RECURRENCE_FREQUENCIES.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case RECURRENCE_FREQUENCIES.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case RECURRENCE_FREQUENCIES.BIWEEKLY:
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case RECURRENCE_FREQUENCIES.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case RECURRENCE_FREQUENCIES.BIMONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 2);
      break;
    case RECURRENCE_FREQUENCIES.QUARTERLY:
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case RECURRENCE_FREQUENCIES.YEARLY:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      throw new Error('Invalid recurrence frequency');
  }
  
  return nextDate;
};

/**
 * Generate actual transaction from recurring template
 * @param {Object} recurringTemplate - Recurring transaction template
 * @returns {Object} Actual transaction
 */
export const generateTransactionFromTemplate = (recurringTemplate) => {
  return {
    id: Date.now().toString(),
    ...recurringTemplate,
    date: recurringTemplate.nextOccurrence,
    isRecurring: true,
    parentId: recurringTemplate.id
  };
};

/**
 * Update recurring transaction template after generating a transaction
 * @param {Object} recurringTemplate - Recurring transaction template
 * @returns {Object} Updated template
 */
export const updateRecurringTemplate = (recurringTemplate) => {
  const nextOccurrence = calculateNextOccurrence(
    new Date(recurringTemplate.nextOccurrence),
    recurringTemplate.frequency
  );
  
  // Check if we've reached the end date
  const shouldContinue = !recurringTemplate.endDate || 
    nextOccurrence <= new Date(recurringTemplate.endDate);
  
  return {
    ...recurringTemplate,
    nextOccurrence: nextOccurrence.toISOString(),
    isActive: shouldContinue,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Get all occurrences within a date range
 * @param {Object} recurringTemplate - Recurring transaction template
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @returns {Array} Array of occurrence dates
 */
export const getOccurrencesInRange = (recurringTemplate, startDate, endDate) => {
  const occurrences = [];
  let currentDate = new Date(recurringTemplate.startDate);
  
  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      occurrences.push(new Date(currentDate));
    }
    
    currentDate = calculateNextOccurrence(currentDate, recurringTemplate.frequency);
    
    // Safety check to prevent infinite loops
    if (recurringTemplate.endDate && currentDate > new Date(recurringTemplate.endDate)) {
      break;
    }
    
    // Additional safety check
    if (occurrences.length > 1000) {
      break;
    }
  }
  
  return occurrences;
};

export default {
  createRecurringTransaction,
  calculateNextOccurrence,
  generateTransactionFromTemplate,
  updateRecurringTemplate,
  getOccurrencesInRange,
  RECURRENCE_FREQUENCIES
};