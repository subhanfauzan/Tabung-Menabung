import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { BottomNavigation } from "./components/common/BottomNavigation";
import { AddTransactionModal } from "./components/common/AddTransactionModal";
import { PrivateRoute } from "./components/common/PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { AccountsPage } from "./pages/AccountsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LandingPage } from "./pages/LandingPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

/**
 * Layout component for authenticated pages
 */
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen relative w-full sm:flex sm:justify-center">
      {/* Mobile-first centered container on desktop */}
      <div className="w-full sm:max-w-md bg-background-light dark:bg-background-dark min-h-screen relative shadow-none sm:shadow-2xl overflow-x-hidden sm:border-x sm:border-slate-200 dark:sm:border-slate-800">
        <main className="flex-1 w-full relative pb-24">
          {/* Pass refreshKey as key to pages that need re-fetching */}
          <div key={refreshKey}>{children}</div>
        </main>
        <div className="fixed sm:absolute bottom-0 w-full sm:max-w-md z-50">
          <BottomNavigation onAddClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};


/**
 * Main app component
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <DashboardPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <TransactionsPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions/:id"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <TransactionDetailPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <AccountsPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <ProfilePage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <StatisticsPage />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      {/* Root → Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Landing Page (optional) */}
      <Route path="/landing" element={<LandingPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
