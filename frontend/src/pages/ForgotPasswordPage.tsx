import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validateRequired } from "../utils/validators";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateRequired(email)) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    setIsLoading(true);
    // Simulate API call for requesting password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // In a real app we'd navigate to reset page or show a success message
      // and wait for user to click link in email. Since we have the reset UI template,
      // we can simulate moving to the "Reset Password" screen here.
      setTimeout(() => navigate('/reset-password'), 2000);
    }, 1500);
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto shadow-none sm:shadow-xl sm:border sm:border-slate-200 dark:sm:border-slate-800 bg-background-light dark:bg-background-dark overflow-x-hidden">
        
        {/* Header */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6">
          <div className="mt-8 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
            </div>
            <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-[32px] font-bold leading-tight text-left">
              Lupa Kata Sandi
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed mt-3">
              Masukkan email Anda untuk menerima instruksi reset kata sandi akun pencatatan keuangan Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            {isSubmitted && (
              <div className="p-3 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm rounded-lg text-center">
                Instruksi reset telah dikirim ke email Anda. Mengalihkan...
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com" 
                  className="block w-full pl-10 pr-4 py-4 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 placeholder:text-slate-400 text-base font-normal transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || isSubmitted}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Memproses..." : "Kirim Instruksi"}</span>
              {!isLoading && <span className="material-symbols-outlined text-xl">send</span>}
            </button>
          </form>

          <div className="mt-auto pb-12 pt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Ingat kata sandi Anda?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
