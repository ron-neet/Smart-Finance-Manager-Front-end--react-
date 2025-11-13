/**
 * Calculates time to reach savings goals based on variable income
 * @param {number} currentSavings - Current savings amount
 * @param {Array} incomeHistory - Array of recent income amounts
 * @param {Array} expenseHistory - Array of recent expense amounts
 * @param {number} savingsGoal - Target savings amount
 * @param {string} projectionType - 'conservative' | 'average' | 'optimistic'
 * @returns {Object} Time projection and recommendations
 */
export const calculateSavingsProjection = (currentSavings, incomeHistory, expenseHistory, savingsGoal, projectionType = 'average') => {
  if (!incomeHistory || incomeHistory.length === 0) return null;
  
  // Calculate average, minimum, and maximum monthly savings
  const monthlySavingsData = incomeHistory.map((income, index) => {
    const expense = expenseHistory && index < expenseHistory.length ? expenseHistory[index] : 0;
    return income - expense;
  });
  
  const averageSavings = monthlySavingsData.reduce((sum, savings) => sum + savings, 0) / monthlySavingsData.length;
  const minSavings = Math.min(...monthlySavingsData);
  const maxSavings = Math.max(...monthlySavingsData);
  
  // Select savings rate based on projection type
  let monthlySavings;
  switch (projectionType) {
    case 'conservative':
      monthlySavings = minSavings;
      break;
    case 'optimistic':
      monthlySavings = maxSavings;
      break;
    case 'average':
    default:
      monthlySavings = averageSavings;
  }
  
  // If not saving money consistently, provide recommendations
  if (monthlySavings <= 0) {
    const negativeMonths = monthlySavingsData.filter(s => s <= 0).length;
    const consistencyRate = ((monthlySavingsData.length - negativeMonths) / monthlySavingsData.length) * 100;
    
    return {
      monthsToGoal: -1,
      yearsToGoal: -1,
      monthlySavings: monthlySavings,
      averageSavings: averageSavings,
      minSavings: minSavings,
      maxSavings: maxSavings,
      consistencyRate: consistencyRate,
      isAchievable: false,
      projectionType: projectionType,
      recommendations: [
        `Your income is variable with only ${consistencyRate.toFixed(0)}% of months showing positive savings.`,
        "Focus on building an emergency fund to smooth out income fluctuations.",
        "Consider creating multiple income streams to reduce variability.",
        "During high-income months, save more to compensate for low-income months."
      ]
    };
  }
  
  // Calculate time to reach goal
  const remainingAmount = Math.max(0, savingsGoal - currentSavings);
  const monthsToGoal = remainingAmount > 0 ? Math.ceil(remainingAmount / monthlySavings) : 0;
  const yearsToGoal = monthsToGoal > 0 ? (monthsToGoal / 12).toFixed(1) : 0;
  
  return {
    monthsToGoal,
    yearsToGoal,
    monthlySavings,
    averageSavings: averageSavings,
    minSavings: minSavings,
    maxSavings: maxSavings,
    consistencyRate: ((monthlySavingsData.filter(s => s > 0).length) / monthlySavingsData.length) * 100,
    isAchievable: true,
    projectionType: projectionType,
    recommendations: [
      `At your ${projectionType} savings rate of $${monthlySavings.toFixed(2)} per month, you'll reach your goal in ${monthsToGoal} months (${yearsToGoal} years).`,
      "During high-income months, save extra to build a buffer for low-income months.",
      "Consider setting up automatic transfers during predictable income periods.",
      "Build an emergency fund covering 3-6 months of expenses to handle income variability."
    ]
  };
};

/**
 * Calculates required monthly savings to reach goal by target date with variable income
 * @param {number} currentSavings - Current savings amount
 * @param {Array} incomeHistory - Array of recent income amounts
 * @param {Array} expenseHistory - Array of recent expense amounts
 * @param {number} savingsGoal - Target savings amount
 * @param {string} targetDate - Target date to reach goal (YYYY-MM-DD)
 * @returns {Object} Required savings amount and feasibility
 */
export const calculateRequiredSavings = (currentSavings, incomeHistory, expenseHistory, savingsGoal, targetDate) => {
  if (!targetDate || !savingsGoal || !incomeHistory || incomeHistory.length === 0) return null;
  
  const target = new Date(targetDate);
  const today = new Date();
  
  // Calculate months until target date
  const monthsUntilTarget = (target.getFullYear() - today.getFullYear()) * 12 + 
                           (target.getMonth() - today.getMonth());
  
  if (monthsUntilTarget <= 0) {
    return {
      requiredMonthlySavings: 0,
      isFeasible: false,
      message: "Target date has already passed."
    };
  }
  
  // Calculate required monthly savings
  const remainingAmount = Math.max(0, savingsGoal - currentSavings);
  const requiredMonthlySavings = remainingAmount > 0 ? remainingAmount / monthsUntilTarget : 0;
  
  // Analyze income variability
  const avgIncome = incomeHistory.reduce((sum, inc) => sum + inc, 0) / incomeHistory.length;
  const incomeVariance = incomeHistory.reduce((sum, inc) => sum + Math.pow(inc - avgIncome, 2), 0) / incomeHistory.length;
  const incomeVolatility = Math.sqrt(incomeVariance) / avgIncome; // Coefficient of variation
  
  // Adjust required savings based on income volatility
  const volatilityMultiplier = 1 + (incomeVolatility * 0.5); // Add buffer for high volatility
  const adjustedRequiredSavings = requiredMonthlySavings * volatilityMultiplier;
  
  // Determine feasibility based on income history
  const maxHistoricalSavings = Math.max(...incomeHistory.map((inc, i) => {
    const exp = expenseHistory && i < expenseHistory.length ? expenseHistory[i] : 0;
    return inc - exp;
  }));
  
  const isFeasible = adjustedRequiredSavings <= maxHistoricalSavings;
  
  return {
    requiredMonthlySavings: adjustedRequiredSavings,
    rawRequiredSavings: requiredMonthlySavings,
    isFeasible: isFeasible,
    monthsUntilTarget,
    incomeVolatility: incomeVolatility * 100, // Percentage
    maxHistoricalSavings: maxHistoricalSavings,
    message: isFeasible 
      ? `You need to save $${adjustedRequiredSavings.toFixed(2)} per month for ${monthsUntilTarget} months to reach your goal. This accounts for your income variability.`
      : `The required savings of $${adjustedRequiredSavings.toFixed(2)} may be challenging given your income history. Consider adjusting your goal or timeline.`
  };
};

/**
 * Analyzes income stability and provides recommendations for variable income
 * @param {Array} incomeHistory - Array of recent income amounts
 * @param {Array} expenseHistory - Array of recent expense amounts
 * @returns {Object} Income stability analysis
 */
export const analyzeIncomeStability = (incomeHistory, expenseHistory) => {
  if (!incomeHistory || incomeHistory.length === 0) return null;
  
  // Calculate income statistics
  const totalIncome = incomeHistory.reduce((sum, inc) => sum + inc, 0);
  const avgIncome = totalIncome / incomeHistory.length;
  const minIncome = Math.min(...incomeHistory);
  const maxIncome = Math.max(...incomeHistory);
  
  // Calculate income variability
  const variance = incomeHistory.reduce((sum, inc) => sum + Math.pow(inc - avgIncome, 2), 0) / incomeHistory.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = avgIncome > 0 ? (stdDev / avgIncome) : 0;
  
  // Calculate savings consistency
  const savingsData = incomeHistory.map((income, index) => {
    const expense = expenseHistory && index < expenseHistory.length ? expenseHistory[index] : 0;
    return income - expense;
  });
  
  const positiveSavingsMonths = savingsData.filter(s => s > 0).length;
  const savingsConsistency = (positiveSavingsMonths / savingsData.length) * 100;
  
  // Determine stability level
  let stabilityLevel, stabilityDescription;
  if (coefficientOfVariation < 0.2) {
    stabilityLevel = 'stable';
    stabilityDescription = 'Your income is relatively stable with low variability.';
  } else if (coefficientOfVariation < 0.5) {
    stabilityLevel = 'moderate';
    stabilityDescription = 'Your income has moderate variability. Some planning is needed.';
  } else {
    stabilityLevel = 'variable';
    stabilityDescription = 'Your income is highly variable. Special strategies are recommended.';
  }
  
  // Generate recommendations
  const recommendations = [
    stabilityDescription,
    `Average monthly income: $${avgIncome.toFixed(2)}`,
    `Income range: $${minIncome.toFixed(2)} - $${maxIncome.toFixed(2)}`,
    `Savings consistency: ${savingsConsistency.toFixed(0)}% of months`
  ];
  
  if (stabilityLevel === 'variable') {
    recommendations.push(
      "Create a baseline budget based on your lowest typical income month.",
      "Save surplus income during high-earning months for low-earning periods.",
      "Build a larger emergency fund (6+ months of expenses) for income security.",
      "Consider diversifying income sources to reduce reliance on variable income."
    );
  } else if (stabilityLevel === 'moderate') {
    recommendations.push(
      "Maintain 3-4 months of expenses in emergency savings.",
      "During above-average income months, increase savings contributions.",
      "Track income patterns to anticipate leaner months."
    );
  }
  
  return {
    avgIncome,
    minIncome,
    maxIncome,
    incomeVariability: coefficientOfVariation,
    incomeVolatility: coefficientOfVariation * 100, // Percentage
    savingsConsistency,
    stabilityLevel,
    recommendations
  };
};

export default {
  calculateSavingsProjection,
  calculateRequiredSavings,
  analyzeIncomeStability
};