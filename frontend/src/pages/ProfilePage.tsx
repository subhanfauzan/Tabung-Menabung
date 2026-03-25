import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { useTheme } from "../context/ThemeContext";

type ModalType = "editProfile" | "changePassword" | "salaryDate" | null;

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Edit Profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Salary Date state
  const [tempSalaryDate, setTempSalaryDate] = useState("");
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [salarySuccess, setSalarySuccess] = useState("");
  const [salaryError, setSalaryError] = useState("");

  const openModal = (modal: ModalType) => {
    // Reset state when opening
    setProfileError(""); setProfileSuccess("");
    setPwError(""); setPwSuccess("");
    setSalaryError(""); setSalarySuccess("");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    if (modal === "editProfile") {
      setName(user?.name || "");
      setEmail(user?.email || "");
    }
    if (modal === "salaryDate") {
      setTempSalaryDate(user?.salaryDate ? String(user.salaryDate) : "");
    }
    setActiveModal(modal);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError("Nama tidak boleh kosong");
      return;
    }
    setProfileLoading(true);
    setProfileError("");
    try {
      const updated = await authService.updateProfile({ name: name.trim(), email: email.trim() });
      updateUser(updated); // update global auth state
      setProfileSuccess("Profil berhasil diperbarui!");
      setTimeout(() => { setActiveModal(null); setProfileSuccess(""); }, 1500);
    } catch (err: any) {
      setProfileError(err.response?.data?.error || "Gagal memperbarui profil");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("Semua kolom harus diisi");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Kata sandi baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Konfirmasi kata sandi tidak cocok");
      return;
    }
    setPwLoading(true);
    setPwError("");
    try {
      await authService.changePassword(currentPassword, newPassword);
      setPwSuccess("Kata sandi berhasil diubah! Anda akan dialihkan...");
      setTimeout(() => { 
        setActiveModal(null); 
        setPwSuccess(""); 
        logout();
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setPwError(err.response?.data?.error || "Gagal mengubah kata sandi");
    } finally {
      setPwLoading(false);
    }
  };

  const handleSaveSalaryDate = async (e: React.FormEvent) => {
    e.preventDefault();
    const day = parseInt(tempSalaryDate);
    if (!tempSalaryDate || isNaN(day) || day < 1 || day > 31) {
      setSalaryError("Masukkan tanggal antara 1 – 31");
      return;
    }
    setSalaryLoading(true);
    setSalaryError("");
    try {
      const updated = await authService.updateProfile({ salaryDate: day });
      updateUser(updated);
      setSalarySuccess("Tanggal gajian berhasil disimpan!");
      setTimeout(() => { setActiveModal(null); setSalarySuccess(""); }, 1500);
    } catch (err: any) {
      setSalaryError(err.response?.data?.error || "Gagal menyimpan tanggal gajian");
    } finally {
      setSalaryLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      logout();
      navigate("/login");
    }
  };

  const MenuItem: React.FC<{
    icon: string;
    label: string;
    iconBg: string;
    onClick: () => void;
  }> = ({ icon, label, iconBg, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{label}</span>
      </div>
      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
    </button>
  );

  return (
    <div className="w-full relative pb-8 font-display antialiased">
      {/* Header Profile Area */}
      <header className="bg-primary/5 dark:bg-slate-900 border-b border-primary/10 dark:border-slate-800 pt-16 pb-8 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="flex flex-col items-center relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-slate-100 flex items-center justify-center shadow-lg mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=5247e6&color=fff&size=100`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-1">{user?.name || "Pengguna"}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{user?.email || "email@example.com"}</p>
        </div>
      </header>

      <div className="px-6 mt-8 space-y-6">
        {/* Akun Saya */}
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">Akun Saya</h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-sm border border-slate-100 dark:border-slate-800">
            <MenuItem
              icon="person"
              label="Ubah Profil"
              iconBg="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
              onClick={() => openModal("editProfile")}
            />
            <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4 my-0.5"></div>
            <MenuItem
              icon="lock"
              label="Ganti Kata Sandi"
              iconBg="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
              onClick={() => openModal("changePassword")}
            />
            <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4 my-0.5"></div>
            <button
              onClick={() => openModal("salaryDate")}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Tanggal Gajian</span>
                  {user?.salaryDate ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Setiap tanggal {user.salaryDate}</span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Belum diatur</span>
                  )}
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Tampilan */}
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">Tampilan</h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <span className="material-symbols-outlined text-xl">
                    {theme === 'dark' ? 'dark_mode' : theme === 'light' ? 'light_mode' : 'brightness_auto'}
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Tema Aplikasi</span>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Terang
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Gelap
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Sistem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bantuan */}
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">Bantuan & Dukungan</h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-sm border border-slate-100 dark:border-slate-800">
            <MenuItem
              icon="description"
              label="Syarat & Ketentuan"
              iconBg="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              onClick={() => {}}
            />
            <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4 my-0.5"></div>
            <MenuItem
              icon="help"
              label="Bantuan"
              iconBg="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Keluar */}
        <button
          onClick={handleLogout}
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-bold shadow-sm"
        >
          <span className="material-symbols-outlined">logout</span>
          Keluar
        </button>
      </div>

      {/* ---- MODALS ---- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center font-display">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {activeModal === "editProfile" ? "Ubah Profil" : activeModal === "salaryDate" ? "Tanggal Gajian" : "Ganti Kata Sandi"}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Edit Profile Form */}
            {activeModal === "editProfile" && (
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                {profileError && (
                  <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">{profileError}</div>
                )}
                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {profileSuccess}
                  </div>
                )}

                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-4 border-primary/20">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=5247e6&color=fff&size=80`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-xl">person</span>
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-xl">mail</span>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading || !!profileSuccess}
                  className="w-full py-4 rounded-2xl font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60"
                >
                  {profileLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
                      Menyimpan...
                    </span>
                  ) : "Simpan Perubahan"}
                </button>
              </form>
            )}

            {/* Salary Date Form */}
            {activeModal === "salaryDate" && (
              <form onSubmit={handleSaveSalaryDate} className="p-6 space-y-5">
                {salaryError && (
                  <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">{salaryError}</div>
                )}
                {salarySuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {salarySuccess}
                  </div>
                )}

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Atur tanggal gajian Anda. Sistem akan menghitung periode keuangan dari tanggal ini hingga sehari sebelum tanggal yang sama di bulan berikutnya.
                </p>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setTempSalaryDate(String(day))}
                      className={`aspect-square rounded-xl text-sm font-bold transition-all ${
                        tempSalaryDate === String(day)
                          ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {tempSalaryDate && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                    <span className="material-symbols-outlined text-emerald-500 text-xl">event_available</span>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      Periode: setiap tanggal <strong>{tempSalaryDate}</strong> hingga tanggal <strong>{parseInt(tempSalaryDate) - 1 || 31}</strong> bulan berikutnya
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={salaryLoading || !!salarySuccess || !tempSalaryDate}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-primary/30 disabled:opacity-60"
                  >
                    {salaryLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                        Menyimpan...
                      </span>
                    ) : "Simpan"}
                  </button>
                </div>
              </form>
            )}

            {/* Change Password Form */}
            {activeModal === "changePassword" && (
              <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                {pwError && (
                  <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">{pwError}</div>
                )}
                {pwSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {pwSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi Saat Ini</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-xl">lock</span>
                    </span>
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan kata sandi lama"
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                      <span className="material-symbols-outlined text-xl">{showCurrentPw ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi Baru</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-xl">lock_open</span>
                    </span>
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                      <span className="material-symbols-outlined text-xl">{showNewPw ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          newPassword.length >= (i + 1) * 2
                            ? newPassword.length >= 8 ? "bg-emerald-400" : "bg-amber-400"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-xl">lock_outline</span>
                    </span>
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100 ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-300 dark:border-red-500/40"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-500 mt-1">Kata sandi tidak cocok</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pwLoading || !!pwSuccess}
                  className="w-full py-4 rounded-2xl font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60"
                >
                  {pwLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
                      Menyimpan...
                    </span>
                  ) : "Simpan Kata Sandi"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
