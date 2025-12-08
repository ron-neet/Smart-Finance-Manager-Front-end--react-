/**
 * Budget planning and management utilities
 */

/**
 * Create a new budget
 * @param {Object} budgetData - Budget information
 * @returns {Object} Created budget object
 */
export const createBudget = (budgetData) => {
  return {
    id: Date.now().toString(),
    ...budgetData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };
};

/**
 * Calculate budget progress
 * @param {number} spent - Amount spent in category
 * @param {number} budgeted - Amount budgeted for category
 * @returns {Object} Progress information
 */
export const calculateBudgetProgress = (spent, budgeted) => {
  const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
  const remaining = budgeted - spent;
  const status = percentage >= 100 ? 'exceeded' : 
                 percentage >= 90 ? 'warning' : 
                 percentage >= 75 ? 'caution' : 'good';
  
  return {
    percentage: Math.round(percentage * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    status
  };
};

/**
 * Generate budget alerts based on spending patterns
 * @param {Array} budgets - Array of budget objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of alert objects
 */
export const generateBudgetAlerts = (budgets, transactions) => {
  const alerts = [];
  
  budgets.forEach(budget => {
    if (!budget.isActive) return;
    
    // Calculate total spent in this budget category
    const spent = transactions
      .filter(t => t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const progress = calculateBudgetProgress(spent, budget.amount);
    
    // Generate alerts for different thresholds
    if (progress.percentage >= 100) {
      alerts.push({
        type: 'budget_exceeded',
        severity: 'high',
        message: `Budget exceeded for ${budget.category}: ${progress.percentage}% used`,
        budgetId: budget.id,
        spent,
        budgeted: budget.amount
      });
    } else if (progress.percentage >= 90) {
      alerts.push({
        type: 'budget_warning',
        severity: 'medium',
        message: `Budget warning for ${budget.category}: ${progress.percentage}% used`,
        budgetId: budget.id,
        spent,
        budgeted: budget.amount
      });
    } else if (progress.percentage >= 75) {
      alerts.push({
        type: 'budget_caution',
        severity: 'low',
        message: `Budget approaching limit for ${budget.category}: ${progress.percentage}% used`,
        budgetId: budget.id,
        spent,
        budgeted: budget.amount
      });
    }
  });
  
  return alerts;
};

/**
 * Suggest budget adjustments based on historical spending
 * @param {Array} historicalTransactions - Past transaction data
 * @param {Array} currentBudgets - Current budget allocations
 * @returns {Array} Array of budget suggestions
 */
export const suggestBudgetAdjustments = (historicalTransactions, currentBudgets) => {
  const suggestions = [];
  
  // Group transactions by category
  const categorySpending = {};
  historicalTransactions.forEach(transaction => {
    const categoryId = transaction.categoryId;
    if (!categorySpending[categoryId]) {
      categorySpending[categoryId] = {
        total: 0,
        count: 0,
        category: transaction.category
      };
    }
    categorySpending[categoryId].total += Math.abs(transaction.amount);
    categorySpending[categoryId].count += 1;
  });
  
  // Calculate average spending per category
  Object.keys(categorySpending).forEach(categoryId => {
    const spending = categorySpending[categoryId];
    const average = spending.total / spending.count;
    
    // Find current budget for this category
    const currentBudget = currentBudgets.find(b => b.categoryId === categoryId);
    
    if (currentBudget) {
      const difference = average - currentBudget.amount;
      const percentageChange = (difference / currentBudget.amount) * 100;
      
      if (Math.abs(percentageChange) > 20) {
        suggestions.push({
          categoryId,
          categoryName: spending.category,
          currentBudget: currentBudget.amount,
          suggestedBudget: Math.round(average * 100) / 100,
          difference: Math.round(difference * 100) / 100,
          percentageChange: Math.round(percentageChange * 100) / 100,
          action: difference > 0 ? 'increase' : 'decrease'
        });
      }
    } else {
      // No budget exists for this category, suggest creating one
      suggestions.push({
        categoryId,
        categoryName: spending.category,
        currentBudget: 0,
        suggestedBudget: Math.round(average * 100) / 100,
        difference: Math.round(average * 100) / 100,
        percentageChange: 100,
        action: 'create'
      });
    }
  });
  
  return suggestions;
};

/**
 * Calculate overall budget health score
 * @param {Array} budgets - Array of budget objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Health score and breakdown
 */
export const calculateBudgetHealth = (budgets, transactions) => {
  let totalBudgeted = 0;
  let totalSpent = 0;
  let onTrackBudgets = 0;
  let totalBudgets = 0;
  
  budgets.forEach(budget => {
    if (!budget.isActive) return;
    
    totalBudgets++;
    totalBudgeted += budget.amount;
    
    const spent = transactions
      .filter(t => t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    totalSpent += spent;
    
    const progress = calculateBudgetProgress(spent, budget.amount);
    if (progress.status !== 'exceeded') {
      onTrackBudgets++;
    }
  });
  
  // Calculate health score (0-100)
  const budgetAdherence = totalBudgets > 0 ? (onTrackBudgets / totalBudgets) * 100 : 0;
  const spendingEfficiency = totalBudgeted > 0 ? Math.max(0, 100 - Math.abs((totalSpent / totalBudgeted - 1) * 100)) : 0;
  
  const healthScore = Math.round((budgetAdherence * 0.6 + spendingEfficiency * 0.4) * 100) / 100;
  
  return {
    score: healthScore,
    budgetAdherence: Math.round(budgetAdherence * 100) / 100,
    spendingEfficiency: Math.round(spendingEfficiency * 100) / 100,
    totalBudgeted,
    totalSpent,
    onTrackBudgets,
    totalBudgets
  };
};

export default {
  createBudget,
  calculateBudgetProgress,
  generateBudgetAlerts,
  suggestBudgetAdjustments,
  calculateBudgetHealth
};