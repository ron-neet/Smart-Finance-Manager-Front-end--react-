/**
 * Budget Forecasting Algorithm
 * Predicts future income and expenses based on historical data using linear regression
 */

/**
 * Simple Linear Regression implementation
 */
export const linearRegression = (x, y) => {
  const n = x.length;

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate slope (beta1) and intercept (beta0)
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += (x[i] - meanX) ** 2;
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;

  // Calculate R-squared (coefficient of determination)
  let totalSumSquares = 0;
  let residualSumSquares = 0;

  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    totalSumSquares += (y[i] - meanY) ** 2;
    residualSumSquares += (y[i] - predicted) ** 2;
  }

  const rSquared = totalSumSquares !== 0 ? 1 - (residualSumSquares / totalSumSquares) : 1;

  return {
    slope,
    intercept,
    rSquared,
    predict: (xVal) => slope * xVal + intercept
  };
};

/**
 * Filters transactions to only include the most recent 12 months for better accuracy
 */
export const getRecentTwelveMonthsData = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= twelveMonthsAgo;
  });
};

/**
 * Calculates the average amount for a given transaction type over a period
 */
export const calculateAverage = (transactions, type) => {
  if (!transactions || transactions.length === 0) return 0;

  // Filter for recent 12 months
  const recentTransactions = getRecentTwelveMonthsData(transactions);

  const filteredTransactions = recentTransactions.filter(t => t.type === type);
  if (filteredTransactions.length === 0) return 0;

  const total = filteredTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  return total / filteredTransactions.length;
};

/**
 * Calculates trend based on historical data using linear regression
 */
export const calculateTrend = (transactions) => {
  if (!transactions || transactions.length < 3) return { slope: 0, intercept: 0, rSquared: 0, direction: 'stable' };

  // Filter for recent 12 months
  const recentTransactions = getRecentTwelveMonthsData(transactions);
  if (recentTransactions.length < 3) return { slope: 0, intercept: 0, rSquared: 0, direction: 'stable' };

  // Sort transactions by date
  const sortedTransactions = recentTransactions.sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  // Convert dates to numeric values for regression (days since epoch)
  const dataPoints = sortedTransactions.map(t => ({
    x: new Date(t.date).getTime(),
    y: Math.abs(t.amount)
  }));

  // Normalize x values to prevent numerical instability
  const minX = Math.min(...dataPoints.map(p => p.x));
  const xValues = dataPoints.map(p => (p.x - minX) / (24 * 60 * 60 * 1000)); // Convert to days
  const yValues = dataPoints.map(p => p.y);

  // Perform linear regression
  const regression = linearRegression(xValues, yValues);

  const direction = regression.slope > 0.01 ? 'increasing' :
    regression.slope < -0.01 ? 'decreasing' : 'stable';

  return {
    slope: regression.slope,
    intercept: regression.intercept,
    rSquared: regression.rSquared,
    direction
  };
};

/**
 * Predicts future transactions based on historical data using linear regression
 */
export const predictFutureTransactions = (historicalTransactions, monthsAhead = 6) => {
  if (!historicalTransactions || historicalTransactions.length === 0) return [];

  // Filter for recent 12 months
  const recentTransactions = getRecentTwelveMonthsData(historicalTransactions);
  if (recentTransactions.length === 0) return [];

  // Group transactions by type and category
  const incomeTransactions = recentTransactions.filter(t => t.type === 'income');
  const expenseTransactions = recentTransactions.filter(t => t.type === 'expense');

  // Calculate trends using linear regression
  const incomeTrend = calculateTrend(incomeTransactions);
  const expenseTrend = calculateTrend(expenseTransactions);

  // Group by category for more granular predictions
  const incomeByCategory = {};
  const expenseByCategory = {};

  incomeTransactions.forEach(t => {
    const categoryId = t.categoryId || 'uncategorized';
    if (!incomeByCategory[categoryId]) {
      incomeByCategory[categoryId] = [];
    }
    incomeByCategory[categoryId].push(t);
  });

  expenseTransactions.forEach(t => {
    const categoryId = t.categoryId || 'uncategorized';
    if (!expenseByCategory[categoryId]) {
      expenseByCategory[categoryId] = [];
    }
    expenseByCategory[categoryId].push(t);
  });

  // Generate predictions
  const predictions = [];
  const currentDate = new Date();

  // Predict by category
  for (let i = 1; i <= monthsAhead; i++) {
    // Calculate future dates
    const futureDate = new Date(currentDate);
    futureDate.setMonth(futureDate.getMonth() + i);

    // Predict income by category
    Object.keys(incomeByCategory).forEach(categoryId => {
      const categoryTransactions = incomeByCategory[categoryId];
      const categoryTrend = calculateTrend(categoryTransactions);

      // Use the most recent average as baseline
      const recentCategoryTransactions = categoryTransactions.slice(-3); // Last 3 transactions
      const categoryAvg = recentCategoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / recentCategoryTransactions.length;

      // Apply trend to prediction
      const timeIndex = (futureDate.getTime() - new Date(recentTransactions[0].date).getTime()) / (24 * 60 * 60 * 1000);
      const predictedAmount = Math.max(0, categoryTrend.predict(timeIndex) || categoryAvg);

      predictions.push({
        id: `forecast-income-${categoryId}-${i}`,
        name: `Predicted Income`,
        category: categoryId,
        amount: predictedAmount,
        date: futureDate.toISOString().split('T')[0],
        type: 'income',
        trend: categoryTrend.direction,
        confidence: Math.min(1, Math.max(0, categoryTrend.rSquared)) // Confidence based on R-squared
      });
    });

    // Predict expenses by category
    Object.keys(expenseByCategory).forEach(categoryId => {
      const categoryTransactions = expenseByCategory[categoryId];
      const categoryTrend = calculateTrend(categoryTransactions);

      // Use the most recent average as baseline
      const recentCategoryTransactions = categoryTransactions.slice(-3); // Last 3 transactions
      const categoryAvg = recentCategoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / recentCategoryTransactions.length;

      // Apply trend to prediction
      const timeIndex = (futureDate.getTime() - new Date(recentTransactions[0].date).getTime()) / (24 * 60 * 60 * 1000);
      const predictedAmount = Math.max(0, categoryTrend.predict(timeIndex) || categoryAvg);

      predictions.push({
        id: `forecast-expense-${categoryId}-${i}`,
        name: `Predicted Expense`,
        category: categoryId,
        amount: predictedAmount,
        date: futureDate.toISOString().split('T')[0],
        type: 'expense',
        trend: categoryTrend.direction,
        confidence: Math.min(1, Math.max(0, categoryTrend.rSquared)) // Confidence based on R-squared
      });
    });
  }

  return predictions;
};

/**
 * Predicts future spending based on aggregated historical trends (more stable than raw transactions)
 */
export const predictFromHistory = (spendingHistory = [], monthsAhead = 6) => {
  if (!Array.isArray(spendingHistory) || spendingHistory.length < 2) return [];

  // Prepare data for linear regression
  // x = month index (0, 1, 2...), y = spending amount
  const xValues = spendingHistory.map((_, i) => i);
  const yValues = spendingHistory.map(item => Number(item.total) || 0);

  const regression = linearRegression(xValues, yValues);
  const lastIndex = xValues.length - 1;

  const predictions = [];
  const lastMonth = spendingHistory[lastIndex];
  
  // Create future dates starting from after the last month in history
  for (let i = 1; i <= monthsAhead; i++) {
    const predictedAmount = Math.max(0, regression.predict(lastIndex + i));
    
    // Simple projection of confidence based on R-squared and distance from data
    const confidence = Math.max(0.3, Math.min(0.9, regression.rSquared * (1 - (i * 0.1))));

    predictions.push({
      id: `forecast-hist-${i}`,
      name: "Projected Spending",
      amount: predictedAmount,
      monthOffset: i,
      type: 'expense',
      confidence: confidence,
      rSquared: regression.rSquared
    });
  }

  return predictions;
};

/**
 * Calculates projected savings based on income and expense predictions
 */
export const calculateProjectedSavings = (predictions) => {
  if (!predictions || predictions.length === 0) return [];

  // Group by month
  const monthlyData = {};

  predictions.forEach(prediction => {
    const monthKey = prediction.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        income: 0,
        expense: 0,
        incomeConfidence: [],
        expenseConfidence: []
      };
    }

    if (prediction.type === 'income') {
      monthlyData[monthKey].income += prediction.amount;
      monthlyData[monthKey].incomeConfidence.push(prediction.confidence || 0.5);
    } else {
      monthlyData[monthKey].expense += prediction.amount;
      monthlyData[monthKey].expenseConfidence.push(prediction.confidence || 0.5);
    }
  });

  // Calculate savings for each month with confidence intervals
  const savingsProjections = Object.keys(monthlyData).map(month => {
    const income = monthlyData[month].income;
    const expense = monthlyData[month].expense;
    const savings = income - expense;

    // Calculate average confidence
    const avgIncomeConfidence = monthlyData[month].incomeConfidence.length > 0 ?
      monthlyData[month].incomeConfidence.reduce((sum, c) => sum + c, 0) / monthlyData[month].incomeConfidence.length : 0.5;

    const avgExpenseConfidence = monthlyData[month].expenseConfidence.length > 0 ?
      monthlyData[month].expenseConfidence.reduce((sum, c) => sum + c, 0) / monthlyData[month].expenseConfidence.length : 0.5;

    const overallConfidence = (avgIncomeConfidence + avgExpenseConfidence) / 2;

    // Calculate confidence interval (simplified)
    const uncertainty = 1 - overallConfidence;
    const marginOfError = savings * uncertainty * 0.5; // 50% of uncertainty as margin

    return {
      month,
      income: income,
      expense: expense,
      savings: savings,
      savingsRate: income > 0 ? (savings / income) * 100 : 0,
      confidence: overallConfidence,
      savingsMin: savings - marginOfError,
      savingsMax: savings + marginOfError
    };
  });

  return savingsProjections;
};

/**
 * Generates financial health score based on spending patterns and predictions
 * @param {Array} historicalTransactions - Array of past transaction objects
 * @returns {Object} Financial health score and breakdown
 */
export const calculateFinancialHealthScore = (historicalTransactions) => {
  if (!historicalTransactions || historicalTransactions.length === 0) {
    return {
      score: 50,
      breakdown: {
        savingsRate: 0,
        incomeStability: 0,
        expenseManagement: 0,
        debtRatio: 0
      }
    };
  }

  // Filter for recent 12 months
  const recentTransactions = getRecentTwelveMonthsData(historicalTransactions);
  if (recentTransactions.length === 0) {
    return {
      score: 50,
      breakdown: {
        savingsRate: 0,
        incomeStability: 0,
        expenseManagement: 0,
        debtRatio: 0
      }
    };
  }

  // Calculate key metrics
  const incomeTransactions = recentTransactions.filter(t => t.type === 'income');
  const expenseTransactions = recentTransactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Savings rate (40% weight)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const savingsScore = Math.max(0, Math.min(100, Math.abs(savingsRate) * 2)); // Scale to 0-100

  // Income stability (25% weight) - based on consistency of income using standard deviation
  const incomeTrend = calculateTrend(incomeTransactions);
  const incomeStabilityScore = incomeTrend.direction === 'stable' ? 25 :
    incomeTrend.direction === 'increasing' ? 20 : 15;

  // Expense management (25% weight) - lower expenses relative to income is better
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;
  const expenseScore = Math.max(0, 25 - (expenseRatio / 100 * 25));

  // Debt ratio (10% weight) - assuming any negative savings indicates debt-like behavior
  const debtScore = savingsRate >= 0 ? 10 : Math.max(0, 10 - Math.abs(savingsRate) / 10);

  // Calculate final score
  const healthScore = Math.round(
    savingsScore * 0.4 +
    incomeStabilityScore * 0.25 +
    expenseScore * 0.25 +
    debtScore * 0.1
  );

  return {
    score: Math.max(0, Math.min(100, healthScore)), // Clamp between 0-100
    breakdown: {
      savingsRate: savingsScore,
      incomeStability: incomeStabilityScore,
      expenseManagement: expenseScore,
      debtRatio: debtScore
    }
  };
};

export default {
  linearRegression,
  calculateAverage,
  calculateTrend,
  predictFutureTransactions,
  calculateProjectedSavings,
  calculateFinancialHealthScore,
  getRecentTwelveMonthsData
};