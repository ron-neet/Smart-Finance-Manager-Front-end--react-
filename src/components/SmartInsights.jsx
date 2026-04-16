import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calendar, 
  Zap, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Info
} from 'lucide-react';
import { addThousandsSeparator } from '../util/utils';

const SmartInsights = ({ predictiveAlerts = [], trendAnalysis = null }) => {
  if (!trendAnalysis && predictiveAlerts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 animate-fadeIn">
      {/* Predictive Alerts Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-rose-100 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl shadow-xl">
              <Zap className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Predictive Alerts</h3>
              <p className="text-sm text-gray-500 font-medium">Spending rate analysis</p>
            </div>
          </div>
          <AlertCircle className="text-rose-400 animate-pulse" size={24} />
        </div>

        <div className="space-y-4">
          {predictiveAlerts.length > 0 ? (
            predictiveAlerts.map((alert, index) => (
              <div key={index} className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 group hover:bg-rose-50 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-800 text-lg uppercase tracking-tight">{alert.categoryName}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.utilization > 100 ? 'bg-red-100 text-red-600' : 'bg-rose-100 text-rose-600'}`}>
                    {Math.round(alert.utilization)}% Used
                  </span>
                </div>
                <p className="text-gray-600 font-medium mb-4 italic">
                  "At your current spending rate, you will exceed your budget in <span className="text-rose-600 font-bold">{alert.daysUntilExceeded} days</span>."
                </p>
                <div className="w-full bg-rose-200/50 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${alert.utilization > 100 ? 'bg-red-500' : 'bg-rose-500'}`} 
                    style={{ width: `${Math.min(100, alert.utilization)}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Info className="text-gray-300 mb-3" size={40} />
              <p className="text-gray-400 font-medium tracking-tight uppercase text-sm">All budgets are healthy</p>
            </div>
          )}
        </div>
      </div>

      {/* Spending Trend Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-indigo-100 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
              <BarChart3 className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Spending Trends</h3>
              <p className="text-sm text-gray-500 font-medium">Month-over-month comparison</p>
            </div>
          </div>
          <Calendar className="text-indigo-400" size={24} />
        </div>

        {trendAnalysis && (
          <div className="flex flex-col h-[calc(100%-80px)] justify-between">
            <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                {trendAnalysis.trend === 'up' ? <TrendingUp size={120} /> : <TrendingDown size={120} />}
              </div>
              
              <div className="relative z-10 text-center">
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Vs. Previous Average</p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <h4 className={`text-6xl font-extrabold ${trendAnalysis.trend === 'up' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {trendAnalysis.percentChange}%
                  </h4>
                  {trendAnalysis.trend === 'up' ? (
                    <ArrowUpRight className="text-rose-500" size={48} strokeWidth={3} />
                  ) : (
                    <ArrowDownRight className="text-emerald-500" size={48} strokeWidth={3} />
                  )}
                </div>
                <p className="text-gray-600 text-lg font-medium leading-relaxed">
                  Your spending this month is <span className={`font-bold ${trendAnalysis.trend === 'up' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {Math.abs(trendAnalysis.percentChange)}% {trendAnalysis.trend === 'up' ? 'higher' : 'lower'}
                  </span> than your previous monthly average of <span className="text-gray-900 font-bold">${addThousandsSeparator(Math.round(trendAnalysis.averagePrevious))}</span>.
                </p>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 ${trendAnalysis.trend === 'up' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
              <Info size={20} />
              <p className="text-sm font-bold truncate">
                {trendAnalysis.trend === 'up' 
                  ? "Consider reviewing your non-essential expenses this month." 
                  : "Great job! You are staying below your typical spending patterns."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartInsights;
