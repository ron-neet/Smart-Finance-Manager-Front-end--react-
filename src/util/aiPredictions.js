/**
 * Predict future spending patterns based on historical data
 */
export const predictSpendingPatterns = (transactionHistory) => {

  // Group transactions by category
  const categorySpending = {};
  transactionHistory.forEach(transaction => {
    const categoryId = transaction.categoryId;
    if (!categorySpending[categoryId]) {
      categorySpending[categoryId] = {
        transactions: [],
        total: 0,
        category: transaction.category
      };
    }
    categorySpending[categoryId].transactions.push(transaction);
    categorySpending[categoryId].total += Math.abs(transaction.amount);
  });

  // Calculate average spending per category
  const predictions = {};
  Object.keys(categorySpending).forEach(categoryId => {
    const categoryData = categorySpending[categoryId];
    const transactionCount = categoryData.transactions.length;
    const averageSpending = categoryData.total / transactionCount;

    // Calculate trend (simplified)
    const firstHalf = categoryData.transactions.slice(0, Math.floor(transactionCount / 2));
    const secondHalf = categoryData.transactions.slice(Math.floor(transactionCount / 2));

    const firstHalfAvg = firstHalf.reduce((sum, t) => sum + Math.abs(t.amount), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, t) => sum + Math.abs(t.amount), 0) / secondHalf.length;

    const trend = secondHalfAvg > firstHalfAvg ? 'increasing' :
      secondHalfAvg < firstHalfAvg ? 'decreasing' : 'stable';

    predictions[categoryId] = {
      category: categoryData.category,
      averageMonthly: averageSpending,
      trend: trend,
      confidence: Math.min(95, 70 + (transactionCount * 2)) // Mock confidence score
    };
  });

  return predictions;
};

/**
 * Generate personalized financial recommendations
 */
export const generateFinancialRecommendations = (transactionHistory, budgets, userProfile) => {
  const recommendations = [];

  // Analyze spending patterns
  const expenseTransactions = transactionHistory.filter(t => t.type === 'expense');
  const incomeTransactions = transactionHistory.filter(t => t.type === 'income');

  // Calculate total income and expenses
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Savings rate analysis
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Generate recommendations based on analysis
  if (savingsRate < 10) {
    recommendations.push({
      id: 'savings_low',
      type: 'savings',
      priority: 'high',
      title: 'Increase Your Savings Rate',
      description: 'Your current savings rate is below the recommended 10%. Consider reviewing your expenses to find areas where you can cut back.',
      action: 'Review your spending categories and identify non-essential expenses that can be reduced.'
    });
  } else if (savingsRate < 20) {
    recommendations.push({
      id: 'savings_medium',
      type: 'savings',
      priority: 'medium',
      title: 'Boost Your Savings',
      description: 'You\'re saving between 10-20% of your income. Consider increasing this to build wealth faster.',
      action: 'Set up automatic transfers to your savings account right after each paycheck.'
    });
  }

  // Budget adherence analysis
  budgets.forEach(budget => {
    const categoryExpenses = expenseTransactions
      .filter(t => t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const budgetUtilization = budget.amount > 0 ? (categoryExpenses / budget.amount) * 100 : 0;

    if (budgetUtilization > 100) {
      recommendations.push({
        id: `budget_exceeded_${budget.categoryId}`,
        type: 'budget',
        priority: 'high',
        title: `Budget Exceeded: ${budget.categoryName}`,
        description: `You've exceeded your ${budget.categoryName} budget by ${(budgetUtilization - 100).toFixed(1)}%.`,
        action: 'Review your spending in this category and adjust your budget or spending habits.'
      });
    } else if (budgetUtilization > 80) {
      recommendations.push({
        id: `budget_warning_${budget.categoryId}`,
        type: 'budget',
        priority: 'medium',
        title: `Budget Alert: ${budget.categoryName}`,
        description: `You've used ${budgetUtilization.toFixed(1)}% of your ${budget.categoryName} budget.`,
        action: 'Monitor your spending in this category to avoid exceeding your budget.'
      });
    }
  });

  // Emergency fund recommendation
  const emergencyFundTarget = totalIncome * 3; // 3 months of income
  if (!userProfile.emergencyFund || userProfile.emergencyFund < emergencyFundTarget) {
    recommendations.push({
      id: 'emergency_fund',
      type: 'emergency',
      priority: 'high',
      title: 'Build Your Emergency Fund',
      description: 'Financial experts recommend having 3-6 months of expenses saved for emergencies.',
      action: `Aim to save $${emergencyFundTarget.toFixed(2)} as your emergency fund target.`
    });
  }

  // Investment recommendation
  if (savingsRate > 20) {
    recommendations.push({
      id: 'investment_opportunity',
      type: 'investment',
      priority: 'medium',
      title: 'Consider Investment Opportunities',
      description: 'With a healthy savings rate, you might consider investing to grow your wealth.',
      action: 'Explore low-cost index funds or consult with a financial advisor about investment options.'
    });
  }

  return recommendations;
};

/**
 * Detect unusual spending patterns that might indicate fraud
 */
export const detectUnusualSpending = (transactionHistory) => {
  const alerts = [];

  // Group transactions by category
  const categoryTransactions = {};
  transactionHistory.forEach(transaction => {
    const categoryId = transaction.categoryId;
    if (!categoryTransactions[categoryId]) {
      categoryTransactions[categoryId] = [];
    }
    categoryTransactions[categoryId].push(transaction);
  });

  // Analyze each category for outliers
  Object.keys(categoryTransactions).forEach(categoryId => {
    const transactions = categoryTransactions[categoryId];
    if (transactions.length < 5) return; // Need sufficient data

    // Calculate average and standard deviation
    const amounts = transactions.map(t => Math.abs(t.amount));
    const average = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - average, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Check for transactions that are significantly higher than average
    transactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      if (amount > average + (stdDev * 2)) { // 2 standard deviations above average
        alerts.push({
          id: `unusual_spending_${transaction.id}`,
          type: 'unusual_spending',
          priority: 'medium',
          title: 'Unusual Spending Detected',
          description: `A transaction of $${amount.toFixed(2)} in ${transaction.category} is significantly higher than your average spending in this category ($${average.toFixed(2)}).`,
          transactionId: transaction.id,
          amount: amount,
          category: transaction.category
        });
      }
    });
  });

  return alerts;
};

/**
 * Predict cash flow for the next period
 */
export const predictCashFlow = (recurringTransactions, oneTimeTransactions = []) => {
  // Calculate next 30 days of recurring transactions
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  let predictedIncome = 0;
  let predictedExpenses = 0;

  // Process recurring transactions
  recurringTransactions.forEach(transaction => {
    if (!transaction.isActive) return;

    const startDate = new Date(transaction.startDate);
    const endDate = transaction.endDate ? new Date(transaction.endDate) : next30Days;

    // If the transaction is active within the next 30 days
    if (startDate <= next30Days && endDate >= new Date()) {
      const amount = Math.abs(transaction.amount);

      if (transaction.type === 'income') {
        predictedIncome += amount;
      } else {
        predictedExpenses += amount;
      }
    }
  });

  // Add one-time transactions
  oneTimeTransactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate >= new Date() && transactionDate <= next30Days) {
      const amount = Math.abs(transaction.amount);

      if (transaction.type === 'income') {
        predictedIncome += amount;
      } else {
        predictedExpenses += amount;
      }
    }
  });

  return {
    period: 'Next 30 Days',
    predictedIncome: Math.round(predictedIncome * 100) / 100,
    predictedExpenses: Math.round(predictedExpenses * 100) / 100,
    predictedSavings: Math.round((predictedIncome - predictedExpenses) * 100) / 100,
    confidence: 85 // Mock confidence score
  };
};

/**
 * Calculate predictive alerts based on current spending rate vs budget
 */
export const calculatePredictiveAlerts = (budgetPerformance = []) => {
  if (!Array.isArray(budgetPerformance)) return [];
  
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();

  return budgetPerformance.filter(b => b && b.budgetLimit > 0).map(budget => {
    const dailyRate = (budget.spentSoFar || 0) / currentDay;
    const projectedTotal = dailyRate * daysInMonth;
    const isAtRisk = projectedTotal > budget.budgetLimit;
    const remainingBudget = Math.max(0, budget.budgetLimit - (budget.spentSoFar || 0));
    const daysUntilExceeded = remainingBudget > 0 && dailyRate > 0 ? Math.floor(remainingBudget / dailyRate) : 0;

    return {
      ...budget,
      projectedTotal,
      isAtRisk,
      daysUntilExceeded,
      utilization: ((budget.spentSoFar || 0) / budget.budgetLimit) * 100
    };
  }).filter(b => b.isAtRisk || b.utilization > 80);
};

/**
 * Calculate trend analysis comparing current month to historical average
 */
export const calculateTrendAnalysis = (spendingHistory = []) => {
  if (!Array.isArray(spendingHistory) || spendingHistory.length < 2) return null;

  try {
    const currentMonthData = spendingHistory[spendingHistory.length - 1];
    const currentMonth = currentMonthData?.total || 0;
    
    const previousMonths = spendingHistory.slice(0, -1);
    const averagePrevious = previousMonths.reduce((sum, m) => sum + (m?.total || 0), 0) / previousMonths.length;

    const percentChange = averagePrevious > 0
      ? ((currentMonth - averagePrevious) / averagePrevious) * 100
      : 0;

    return {
      currentMonth,
      averagePrevious,
      percentChange: Math.round(percentChange),
      trend: percentChange > 5 ? 'up' : percentChange < -5 ? 'down' : 'stable'
    };
  } catch (err) {
    console.error("Error calculating trend analysis:", err);
    return null;
  }
};

export default {
  predictSpendingPatterns,
  generateFinancialRecommendations,
  detectUnusualSpending,
  predictCashFlow,
  calculatePredictiveAlerts,
  calculateTrendAnalysis
};