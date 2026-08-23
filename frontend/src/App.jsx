import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import DemoScannerPage from './pages/DemoScannerPage';
import SignInPage from './pages/SignInPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#1A0E23] text-[#F8F4E9] flex flex-col font-sans selection:bg-[#935073] selection:text-[#F8F4E9]">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/scan" element={<DemoScannerPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignInPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
