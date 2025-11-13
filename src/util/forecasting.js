/**
 * Budget Forecasting Algorithm
 * Predicts future income and expenses based on historical data
 */

/**
 * Filters transactions to only include the most recent 6 months
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Filtered transactions from the last 6 months
 */
export const getRecentSixMonthsData = (transactions) => {
  if (!transactions || transactions.length === 0) return [];
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= sixMonthsAgo;
  });
};

/**
 * Calculates the average amount for a given transaction type over a period
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - 'income' or 'expense'
 * @returns {number} Average amount
 */
export const calculateAverage = (transactions, type) => {
  if (!transactions || transactions.length === 0) return 0;
  
  // Filter for recent 6 months
  const recentTransactions = getRecentSixMonthsData(transactions);
  
  const filteredTransactions = recentTransactions.filter(t => t.type === type);
  if (filteredTransactions.length === 0) return 0;
  
  const total = filteredTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  return total / filteredTransactions.length;
};

/**
 * Calculates trend based on historical data using linear regression
 * @param {Array} transactions - Array of transaction objects with date and amount
 * @returns {Object} Trend information with slope and direction
 */
export const calculateTrend = (transactions) => {
  if (!transactions || transactions.length < 2) return { slope: 0, direction: 'stable' };
  
  // Filter for recent 6 months
  const recentTransactions = getRecentSixMonthsData(transactions);
  if (recentTransactions.length < 2) return { slope: 0, direction: 'stable' };
  
  // Sort transactions by date
  const sortedTransactions = recentTransactions.sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Convert dates to numeric values for regression
  const dataPoints = sortedTransactions.map((t, index) => ({
    x: index,
    y: Math.abs(t.amount)
  }));
  
  // Calculate linear regression
  const n = dataPoints.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (const point of dataPoints) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const direction = slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable';
  
  return { slope, direction };
};

/**
 * Predicts future transactions based on historical data
 * @param {Array} historicalTransactions - Array of past transaction objects
 * @param {number} monthsAhead - Number of months to forecast
 * @returns {Array} Predicted transactions
 */
export const predictFutureTransactions = (historicalTransactions, monthsAhead = 3) => {
  if (!historicalTransactions || historicalTransactions.length === 0) return [];
  
  // Filter for recent 6 months
  const recentTransactions = getRecentSixMonthsData(historicalTransactions);
  if (recentTransactions.length === 0) return [];
  
  // Group transactions by type
  const incomeTransactions = recentTransactions.filter(t => t.type === 'income');
  const expenseTransactions = recentTransactions.filter(t => t.type === 'expense');
  
  // Calculate averages
  const avgIncome = calculateAverage(recentTransactions, 'income');
  const avgExpense = calculateAverage(recentTransactions, 'expense');
  
  // Calculate trends
  const incomeTrend = calculateTrend(incomeTransactions);
  const expenseTrend = calculateTrend(expenseTransactions);
  
  // Generate predictions
  const predictions = [];
  const currentDate = new Date();
  
  for (let i = 1; i <= monthsAhead; i++) {
    // Calculate future dates
    const futureDate = new Date(currentDate);
    futureDate.setMonth(futureDate.getMonth() + i);
    
    // Apply trend to predictions
    const predictedIncome = avgIncome * (1 + (incomeTrend.slope * i * 0.1));
    const predictedExpense = avgExpense * (1 + (expenseTrend.slope * i * 0.1));
    
    predictions.push({
      id: `forecast-income-${i}`,
      name: `Predicted Income - ${futureDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      amount: Math.max(0, predictedIncome), // Ensure non-negative
      date: futureDate.toISOString().split('T')[0],
      type: 'income',
      trend: incomeTrend.direction
    });
    
    predictions.push({
      id: `forecast-expense-${i}`,
      name: `Predicted Expense - ${futureDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      amount: Math.max(0, predictedExpense), // Ensure non-negative
      date: futureDate.toISOString().split('T')[0],
      type: 'expense',
      trend: expenseTrend.direction
    });
  }
  
  return predictions;
};

/**
 * Calculates projected savings based on income and expense predictions
 * @param {Array} predictions - Array of predicted transactions
 * @returns {Array} Monthly savings projections
 */
export const calculateProjectedSavings = (predictions) => {
  if (!predictions || predictions.length === 0) return [];
  
  // Group by month
  const monthlyData = {};
  
  predictions.forEach(prediction => {
    const monthKey = prediction.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }
    
    if (prediction.type === 'income') {
      monthlyData[monthKey].income += prediction.amount;
    } else {
      monthlyData[monthKey].expense += prediction.amount;
    }
  });
  
  // Calculate savings for each month
  const savingsProjections = Object.keys(monthlyData).map(month => {
    const income = monthlyData[month].income;
    const expense = monthlyData[month].expense;
    const savings = income - expense;
    
    return {
      month,
      income: income,
      expense: expense,
      savings: savings,
      savingsRate: income > 0 ? (savings / income) * 100 : 0
    };
  });
  
  return savingsProjections;
};

/**
 * Generates financial health score based on spending patterns
 * @param {Array} historicalTransactions - Array of past transaction objects
 * @returns {number} Financial health score (0-100)
 */
export const calculateFinancialHealthScore = (historicalTransactions) => {
  if (!historicalTransactions || historicalTransactions.length === 0) return 50;
  
  // Filter for recent 6 months
  const recentTransactions = getRecentSixMonthsData(historicalTransactions);
  if (recentTransactions.length === 0) return 50;
  
  // Calculate key metrics
  const incomeTransactions = recentTransactions.filter(t => t.type === 'income');
  const expenseTransactions = recentTransactions.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Savings rate (40% weight)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const savingsScore = Math.max(0, Math.min(100, savingsRate * 2)); // Scale to 0-100
  
  // Income stability (30% weight) - based on consistency of income
  const incomeTrend = calculateTrend(incomeTransactions);
  const incomeStabilityScore = incomeTrend.direction === 'stable' ? 30 : 
                              incomeTrend.direction === 'increasing' ? 25 : 20;
  
  // Expense management (30% weight) - lower expenses relative to income is better
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;
  const expenseScore = Math.max(0, 30 - (expenseRatio / 100 * 30));
  
  // Calculate final score
  const healthScore = Math.round(savingsScore * 0.4 + incomeStabilityScore * 0.3 + expenseScore * 0.3);
  
  return Math.max(0, Math.min(100, healthScore)); // Clamp between 0-100
};

export default {
  calculateAverage,
  calculateTrend,
  predictFutureTransactions,
  calculateProjectedSavings,
  calculateFinancialHealthScore,
  getRecentSixMonthsData
};