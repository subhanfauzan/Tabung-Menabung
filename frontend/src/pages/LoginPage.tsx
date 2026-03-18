import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validateRequired } from "../utils/validators";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
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
    if (!validateRequired(password)) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-50 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">
              payments
            </span>
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-tight px-4 text-center">
            Masuk ke Akun
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Kelola keuangan Anda lebih baik
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {error && (
            <div className="p-3 bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                Kata Sandi
              </label>
              <Link to="/forgot-password" className="text-primary text-xs font-semibold hover:underline decoration-2">
                Lupa Kata Sandi?
              </Link>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 pr-12 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-primary transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400">
              Ingat saya di perangkat ini
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
            {!isLoading && (
              <span className="material-symbols-outlined text-lg">login</span>
            )}
          </button>
        </form>

        <div className="px-6 py-4 flex items-center gap-4">
          <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
          <span className="text-xs text-slate-400 uppercase font-medium">
            Atau
          </span>
          <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            className="w-full h-12 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-3 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpG2a_wf0lK8girJbFNyoqSbjfUHOCECvALN57RbDxI0U7exjMWDf6d2fMX5SiPOf-ZWvRaykTe5xf4J5X3qzT-ksgT2eQIRlXOs6CTxWnu4-tF6MX5DJRNwEfjNyylvL7zFXi14wBMnHIzfO0Kx3dA9v4B5iOE9IPRwh4fZN3cGqGkySqvzZ6ccV9o8v_zdXb5cLnRDjnm2qx7SSIWogDePl4iBwfzUD-x4ur1WTq4FOtnbsHtkJVwN2nHBcfI0yChZCTrK8mXw"
              alt="Google icon"
              className="w-5 h-5"
            />
            Masuk dengan Google
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline decoration-2"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
