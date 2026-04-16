import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Info, Brain, Target } from "lucide-react";
import CustomLineChart from "./CustomLineChart";
import { predictFutureTransactions, calculateProjectedSavings, calculateFinancialHealthScore, predictFromHistory } from "../util/forecasting";
import { addThousandsSeparator } from "../util/utils";

const BudgetForecast = ({ incomeTransactions, expenseTransactions, spendingHistory = [] }) => {
  const [forecastData, setForecastData] = useState([]);
  const [savingsProjections, setSavingsProjections] = useState([]);
  const [healthScore, setHealthScore] = useState({ score: 0, breakdown: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (incomeTransactions && expenseTransactions) {
      setLoading(true);
      
      // Combine raw transactions for basic analysis
      const allTransactions = [...incomeTransactions, ...expenseTransactions];
      
      // Generate predictions: Use aggregated history if more than 2 months available, 
      // otherwise fallback to raw transaction analysis
      let predictions = [];
      
      if (spendingHistory && spendingHistory.length >= 2) {
        const histPredictions = predictFromHistory(spendingHistory, 6);
        // Map history-based predictions to the generic format
        const today = new Date();
        predictions = histPredictions.map(p => {
          const futureDate = new Date(today);
          futureDate.setMonth(futureDate.getMonth() + p.monthOffset);
          return {
            ...p,
            date: futureDate.toISOString().split('T')[0],
            category: 'Total Distribution'
          };
        });
        
        // Also add basic income predictions from raw transactions
        const rawIncomePreds = predictFutureTransactions(incomeTransactions, 6).filter(p => p.type === 'income');
        predictions = [...predictions, ...rawIncomePreds];
      } else {
        predictions = predictFutureTransactions(allTransactions, 6);
      }
      
      setForecastData(predictions);
      
      // Calculate savings projections
      const savings = calculateProjectedSavings(predictions);
      setSavingsProjections(savings);
      
      // Calculate financial health score
      const score = calculateFinancialHealthScore(allTransactions);
      setHealthScore(score);
      
      setLoading(false);
    }
  }, [incomeTransactions, expenseTransactions, spendingHistory]);

  // Format forecast data for the chart
  const formatChartData = () => {
    if (!forecastData || forecastData.length === 0) return [];
    
    // Group by month and type
    const monthlyData = {};
    
    forecastData.forEach(item => {
      const month = item.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { date: month, income: 0, expense: 0 };
      }
      
      if (item.type === 'income') {
        monthlyData[month].income += item.amount;
      } else {
        monthlyData[month].expense += item.amount;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  const chartData = formatChartData();

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Brain className="text-purple-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Financial Forecast</h2>
          </div>
          <p className="text-gray-600 text-lg mt-2">Predictive analysis based on your financial patterns</p>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Target size={24} className="text-indigo-800" />
          </div>
          <div>
            <span className="text-base font-medium">Health Score:</span>
            <span className="font-bold text-2xl block">{healthScore.score}/100</span>
          </div>
        </div>
      </div>

      {/* Health Score Breakdown */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-5">Financial Health Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-base text-green-700 mb-2 font-bold">Savings Rate</p>
            <p className="text-2xl font-bold text-green-800">{healthScore.breakdown.savingsRate?.toFixed(1) || 0}/25</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-base text-blue-700 mb-2 font-bold">Income Stability</p>
            <p className="text-2xl font-bold text-blue-800">{healthScore.breakdown.incomeStability?.toFixed(1) || 0}/25</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-base text-amber-700 mb-2 font-bold">Expense Mgmt</p>
            <p className="text-2xl font-bold text-amber-800">{healthScore.breakdown.expenseManagement?.toFixed(1) || 0}/25</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-base text-purple-700 mb-2 font-bold">Debt Ratio</p>
            <p className="text-2xl font-bold text-purple-800">{healthScore.breakdown.debtRatio?.toFixed(1) || 0}/10</p>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-800">6-Month Forecast</h3>
          <div className="flex items-center gap-2 text-base text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <Info size={18} />
            <span>Based on linear regression analysis</span>
          </div>
        </div>
        <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 shadow-inner">
          <CustomLineChart data={chartData} />
        </div>
      </div>

      {/* Savings Projections */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-5">Monthly Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savingsProjections.map((projection, index) => {
            const monthName = new Date(projection.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const confidencePercentage = Math.round(projection.confidence * 100);
            
            return (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-5">
                  <div className="text-xl font-bold text-gray-800">{monthName}</div>
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-bold text-gray-700">{confidencePercentage}%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">Income:</span>
                    <span className="font-bold text-green-600 text-lg">${addThousandsSeparator(projection.income.toFixed(0))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">Expenses:</span>
                    <span className="font-bold text-red-600 text-lg">${addThousandsSeparator(projection.expense.toFixed(0))}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-800">Savings:</span>
                    <span className={`font-extrabold text-2xl ${
                      projection.savings >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${addThousandsSeparator(projection.savings.toFixed(0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">Rate:</span>
                    <span className={`text-base font-bold ${
                      projection.savingsRate >= 20 ? 'text-green-600' : 
                      projection.savingsRate >= 0 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {projection.savingsRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="pt-3">
                    <div className="text-sm text-gray-500 mb-2 font-medium">Confidence Interval</div>
                    <div className="text-sm text-gray-700 font-medium">
                      ${addThousandsSeparator(projection.savingsMin.toFixed(0))} - ${addThousandsSeparator(projection.savingsMax.toFixed(0))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-5">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-500" size={24} />
              </div>
              Financial Health
            </h4>
            <p className="text-blue-700 text-base">
              {healthScore.score >= 70 
                ? "Your financial health is strong. Keep up the good work!" 
                : healthScore.score >= 40 
                  ? "Your financial health is moderate. Consider reviewing your expenses." 
                  : "Your financial health needs attention. Focus on increasing income or reducing expenses."}
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  healthScore.score >= 70 ? 'bg-green-500' : 
                  healthScore.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                }`} 
                style={{ width: `${healthScore.score}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-purple-800 text-lg mb-3 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Info className="text-purple-500" size={24} />
              </div>
              Forecast Summary
            </h4>
            <p className="text-purple-700 text-base">
              Based on linear regression analysis of your historical data, you're projected to save 
              <span className="font-bold"> ${savingsProjections.length > 0 ? addThousandsSeparator(savingsProjections[savingsProjections.length - 1].savings.toFixed(0)) : '0'} </span>
              next month with a savings rate of 
              <span className="font-bold"> {savingsProjections.length > 0 ? savingsProjections[savingsProjections.length - 1].savingsRate.toFixed(1) : '0'}%</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetForecast;