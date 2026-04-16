import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  BarChart4, 
  ArrowRight, 
  CheckCircle2, 
  Wallet,
  TrendingUp,
  LineChart,
  PieChart
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Auto-redirect if already logged in
    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-white overflow-hidden selection:bg-purple-100 selection:text-purple-900">
            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Smart Finance
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/login')}
                            className="text-gray-600 font-semibold hover:text-purple-600 transition-colors"
                        >
                            Log in
                        </button>
                        <button 
                            onClick={() => navigate('/signup')}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Start for free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="animate-slideInLeft">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-bold mb-6 border border-purple-100 ring-4 ring-purple-50/50">
                            <Zap size={14} fill="currentColor" />
                            <span>Powered by Predictive AI</span>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
                            Master your money with <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Intelligence.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                            The all-in-one financial manager that predicts your spending trends, alerts you before you exceed budgets, and simplifies your tracking experience. 
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button 
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-200 hover:shadow-purple-300 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Get Started Now
                                <ArrowRight size={20} />
                            </button>
                            <button 
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all flex items-center justify-center gap-2"
                            >
                                Live Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                            <div className="flex items-center gap-2 font-bold text-gray-400">
                                <ShieldCheck size={20} />
                                <span>Bank-Level Security</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-gray-400">
                                <CheckCircle2 size={20} />
                                <span>No Credit Card Req.</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-fadeIn scale-110 lg:scale-125">
                        {/* Decorative blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-200/40 to-indigo-200/40 blur-3xl -z-10 rounded-full animate-pulse"></div>
                        <img 
                            src="/src/assets/landing_hero.png" 
                            alt="Financial Management"
                            className="w-full h-auto drop-shadow-3xl"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Designed for modern financial clarity</h2>
                        <p className="text-lg text-gray-600 font-medium">Stop guessing where your money goes. Our smart tools do the heavy lifting for you.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl w-fit mb-8 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-lg">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Predictive Insights</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">Our AI analyzes your spending velocity and alerts you when you're likely to exceed your monthly budget.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl w-fit mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-lg">
                                <BarChart4 size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Visual Analytics</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">Beautiful interactive charts give you a bird's-eye view of your income, expenses, and net cash flow instantly.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl w-fit mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-lg">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Secure & Private</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">Your data is encrypted and secure. We focus on ownership verification so only you can access your records.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
                            <Wallet className="text-white" size={20} />
                        </div>
                        <span className="text-lg font-bold text-gray-900">Smart Finance Manager</span>
                    </div>
                    <p className="text-gray-500 font-medium mb-12">Built for those who value intelligence in their everyday finances.</p>
                    <div className="flex justify-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                        <span>Support</span>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-slideInLeft { animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .drop-shadow-3xl { filter: drop-shadow(0 25px 35px rgba(124, 58, 237, 0.25)); }
            `}} />
        </div>
    );
};

export default Landing;
