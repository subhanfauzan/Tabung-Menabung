import React from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="layout-container flex h-full grow flex-col">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 py-4 lg:px-20">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">account_balance_wallet</span>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-100">MoneyFlow</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Features</a>
            <a href="#security" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Security</a>
            <a href="#reviews" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Reviews</a>
            <a href="#pricing" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/login")}
              className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all">
              Login
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Get Started
            </button>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-20 lg:py-20">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
              <div className="flex flex-1 flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">Smart Finance Management</span>
                  <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-slate-100 md:text-6xl">
                    Master Your Money with <span className="text-primary">MoneyFlow</span>
                  </h1>
                  <p className="max-w-[540px] text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    Take control of your personal finances with our intuitive tracking tools. Monitor spending, set budgets, and achieve your financial goals in one secure place.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button 
                    onClick={() => navigate("/register")}
                    className="flex h-14 min-w-[180px] cursor-pointer items-center justify-center rounded-xl bg-primary px-6 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90">
                    Start Free Trial
                  </button>
                  <button className="flex h-14 min-w-[180px] cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 px-6 text-lg font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900">
                    Watch Demo
                  </button>
                </div>
              </div>
              <div className="group relative flex-1">
                <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20"></div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-200 shadow-2xl dark:bg-slate-800">
                  <img className="h-full w-full object-cover" alt="Modern finance dashboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi6F775pSmldPMK1z1pZ_2OMiPmWpLQjjwx2sXJu0p9-aPNRHUNFrldgQdq-BFbREc4yPmZYGv8050GQNI8jd7J5c2vsCjGUx3T8dKYhOm-QeFraZ0pxr5gzu0YBzlqx-9H4NyKjt4IkmnMg8qr7zUvAdWDOhkr-DpMSwSi4b9mpecaIqKtda-DMIYsffJkOLAE2vHEX9-4-2b7k8BRmFZBfk9PKT9G_Hzzllw4xuV2N__9o9JT-71nZue6ZrNyQLuC88RuXuXjg" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <section id="features" className="bg-white py-20 dark:bg-slate-900/50">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-20">
              <div className="mb-16 flex flex-col items-center gap-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                  Powerful Features for Smart Tracking
                </h2>
                <p className="max-w-[720px] text-lg text-slate-600 dark:text-slate-400">
                  Everything you need to manage your money effectively and gain complete financial clarity.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-background-light p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-background-dark">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Multi-Account Support</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Connect and monitor all your bank accounts and wallets in one unified dashboard.</p>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-background-light p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-background-dark">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">pie_chart</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Visual Statistics</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Understand your spending habits with beautiful, interactive charts and detailed reports.</p>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-background-light p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-background-dark">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">sell</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Smart Categories</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Automatically organize every penny into smart categories for better budget management.</p>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-background-light p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-background-dark">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Bank-Grade Security</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Your data is protected with 256-bit encryption and multi-factor authentication protocols.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section id="reviews" className="bg-primary py-16">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-20">
              <div className="grid grid-cols-1 gap-8 text-white md:grid-cols-3">
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm">
                  <p className="text-lg font-medium text-white/80">Active Users</p>
                  <p className="text-4xl font-black">50,000+</p>
                  <div className="flex items-center gap-1 font-bold text-emerald-400">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+12% monthly</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm">
                  <p className="text-lg font-medium text-white/80">User Rating</p>
                  <p className="text-4xl font-black">4.9/5</p>
                  <div className="flex text-yellow-400">
                    <span className="material-symbols-outlined material-symbols-fill">star</span>
                    <span className="material-symbols-outlined material-symbols-fill">star</span>
                    <span className="material-symbols-outlined material-symbols-fill">star</span>
                    <span className="material-symbols-outlined material-symbols-fill">star</span>
                    <span className="material-symbols-outlined material-symbols-fill">star</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm">
                  <p className="text-lg font-medium text-white/80">Monthly Transactions</p>
                  <p className="text-4xl font-black">10M+</p>
                  <div className="flex items-center gap-1 font-bold text-emerald-400">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+25% increase</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-24">
            <div className="mx-auto max-w-[960px] px-6 text-center">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-background-dark p-12 dark:bg-slate-800 md:p-20">
                <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col items-center gap-8">
                  <h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
                    Start Tracking Your Money Today
                  </h2>
                  <p className="max-w-[600px] text-lg text-slate-400">
                    Join over 50,000 users who are already saving more and spending smarter. Your first 30 days are on us.
                  </p>
                  <div className="flex w-full justify-center gap-4 sm:flex-row flex-col">
                    <button 
                      onClick={() => navigate("/register")}
                      className="h-14 rounded-xl bg-primary px-10 text-lg font-bold text-white shadow-lg shadow-primary/40 transition-transform hover:scale-105">
                      Create Free Account
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">No credit card required. Cancel anytime.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 bg-white pb-8 pt-16 dark:border-slate-800 dark:bg-background-dark">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-20">
            <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
              <div className="col-span-1 flex flex-col gap-4 md:col-span-1">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-2xl font-bold">account_balance_wallet</span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">MoneyFlow</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Empowering individuals to take control of their financial destiny with smart tools and better insights.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">Product</h4>
                <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><a href="#" className="transition-colors hover:text-primary">Features</a></li>
                  <li><a href="#" className="transition-colors hover:text-primary">Pricing</a></li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">Resources</h4>
                <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><a href="#" className="transition-colors hover:text-primary">Help Center</a></li>
                  <li><a href="#" className="transition-colors hover:text-primary">Blog</a></li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">Company</h4>
                <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><a href="#" className="transition-colors hover:text-primary">About Us</a></li>
                  <li><a href="#" className="transition-colors hover:text-primary">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 dark:border-slate-800 md:flex-row">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                © 2024 MoneyFlow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
