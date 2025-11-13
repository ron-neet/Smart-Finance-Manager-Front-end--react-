import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import CustomLineChart from "./CustomLineChart";
import { predictFutureTransactions, calculateProjectedSavings, calculateFinancialHealthScore } from "../util/forecasting";
import { addThousandsSeparator } from "../util/utils";

const BudgetForecast = ({ incomeTransactions, expenseTransactions }) => {
  const [forecastData, setForecastData] = useState([]);
  const [savingsProjections, setSavingsProjections] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (incomeTransactions && expenseTransactions) {
      setLoading(true);
      
      // Combine all transactions for analysis
      const allTransactions = [...incomeTransactions, ...expenseTransactions];
      
      // Generate forecast for 6 months
      const predictions = predictFutureTransactions(allTransactions, 6); // 6 months forecast
      setForecastData(predictions);
      
      // Calculate savings projections
      const savings = calculateProjectedSavings(predictions);
      setSavingsProjections(savings);
      
      // Calculate financial health score
      const score = calculateFinancialHealthScore(allTransactions);
      setHealthScore(score);
      
      setLoading(false);
    }
  }, [incomeTransactions, expenseTransactions]);

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
      <div className="card p-6">
        <div className="flex justify-center items-center h-64">
          <p>Generating financial forecast...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-lg font-semibold">Financial Forecast</h5>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Health Score:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            healthScore >= 70 ? 'bg-green-100 text-green-800' : 
            healthScore >= 40 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {healthScore}/100
          </span>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="mb-8">
        <h6 className="text-md font-medium mb-4">6-Month Forecast</h6>
        <div className="h-64">
          <CustomLineChart data={chartData} />
        </div>
      </div>

      {/* Savings Projections */}
      <div className="mb-8">
        <h6 className="text-md font-medium mb-4">Monthly Projections</h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savingsProjections.map((projection, index) => {
            const monthName = new Date(projection.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-2">{monthName}</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Income:</span>
                    <span className="font-medium">${addThousandsSeparator(projection.income.toFixed(0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expenses:</span>
                    <span className="font-medium">${addThousandsSeparator(projection.expense.toFixed(0))}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm">Savings:</span>
                    <span className={`font-medium ${
                      projection.savings >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${addThousandsSeparator(projection.savings.toFixed(0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rate:</span>
                    <span className={`text-sm ${
                      projection.savingsRate >= 20 ? 'text-green-600' : 
                      projection.savingsRate >= 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {projection.savingsRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div>
        <h6 className="text-md font-medium mb-4">Key Insights</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h6 className="font-medium text-blue-800 mb-2">Financial Health</h6>
            <p className="text-sm text-blue-700">
              {healthScore >= 70 
                ? "Your financial health is strong. Keep up the good work!" 
                : healthScore >= 40 
                  ? "Your financial health is moderate. Consider reviewing your expenses." 
                  : "Your financial health needs attention. Focus on increasing income or reducing expenses."}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h6 className="font-medium text-purple-800 mb-2">Forecast Summary</h6>
            <p className="text-sm text-purple-700">
              Based on your historical data, you're projected to save ${savingsProjections.length > 0 ? addThousandsSeparator(savingsProjections[savingsProjections.length - 1].savings.toFixed(0)) : '0'} 
              in the next month with a savings rate of {savingsProjections.length > 0 ? savingsProjections[savingsProjections.length - 1].savingsRate.toFixed(1) : '0'}%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetForecast;