import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../utils/validators";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateRequired(name)) {
      setError("Nama Lengkap wajib diisi");
      return;
    }
    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }
    if (!validatePassword(password).isValid) {
      setError("Kata sandi minimal 8 karakter dengan huruf besar, huruf kecil, dan angka");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      return;
    }
    if (!termsAccepted) {
      setError("Anda harus menyetujui Syarat & Ketentuan");
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-none sm:shadow-xl sm:border sm:border-slate-200 dark:sm:border-slate-800 overflow-x-hidden">
        
        {/* Top App Bar */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
          <div 
            onClick={() => navigate(-1)}
            className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight flex-1 text-center pr-12">
            Daftar Akun
          </h2>
        </div>

        {/* Hero Illustration */}
        <div className="px-4 py-3">
          <div 
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-primary/10 rounded-xl min-h-[180px] relative" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8n6c7fCPLAorRKe1iam6V4jZB-H1TpDl1n6VdYeMlTori8AarrXCzbov2QU2igVzVx-TsSynuWTVXrwmiG21LtSVovO6bweL-LQd28RCVyPhhqUi6gn3IsAgoHEHViFyziQ0wgmHLOFJCznKcVm-jMkO2ccqkVNd7faP8VH7Mt4OlDJlZeUbf0awseWNTVxCJQNXkCWx8fs4aguNlOvGYNhhU9oOg51m1Ea9dZE6_AOHbdPnFAfAjHnGA1CQEkhY8vrOfbXPMsQ")' }}
          ></div>
        </div>

        {/* Header Section */}
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-[32px] font-bold leading-tight">Buat Akun Baru</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal pt-1">Mulai kelola keuangan Anda dengan lebih bijak hari ini.</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-3">
          {error && (
            <div className="p-3 bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Full Name */}
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-medium pb-2">Nama Lengkap</p>
            <div className="relative">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso" 
                className="w-full rounded-xl text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-0 focus:ring-2 focus:ring-primary h-14 placeholder:text-slate-400 px-4 text-base transition-all"
              />
            </div>
          </label>

          {/* Email */}
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-medium pb-2">Alamat Email</p>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com" 
                className="w-full rounded-xl text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-0 focus:ring-2 focus:ring-primary h-14 placeholder:text-slate-400 px-4 text-base transition-all"
              />
            </div>
          </label>

          {/* Password */}
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-medium pb-2">Kata Sandi</p>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter" 
                className="w-full rounded-xl text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-0 focus:ring-2 focus:ring-primary h-14 placeholder:text-slate-400 px-4 pr-12 text-base transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>

          {/* Confirm Password */}
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-medium pb-2">Konfirmasi Kata Sandi</p>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi" 
                className="w-full rounded-xl text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-0 focus:ring-2 focus:ring-primary h-14 placeholder:text-slate-400 px-4 pr-12 text-base transition-all"
              />
            </div>
          </label>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 py-2">
            <input 
              type="checkbox" 
              id="terms" 
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-tight cursor-pointer">
              Saya menyetujui <a href="#" className="text-primary font-semibold hover:underline">Syarat & Ketentuan</a> serta <a href="#" className="text-primary font-semibold hover:underline">Kebijakan Privasi</a> yang berlaku.
            </label>
          </div>

          {/* Register Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base h-14 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>

          {/* Login Link */}
          <div className="flex justify-center items-center py-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sudah punya akun? 
              <Link to="/login" className="text-primary font-bold ml-1 hover:underline decoration-2">
                Masuk di sini
              </Link>
            </p>
          </div>
        </form>

        <div className="h-8 bg-background-light dark:bg-background-dark"></div>
      </div>
    </div>
  );
};
