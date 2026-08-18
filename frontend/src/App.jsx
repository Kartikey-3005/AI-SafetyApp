import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import DemoScannerPage from './pages/DemoScannerPage';

export default function App() {
  return (
    <div className="min-h-screen bg-[#1A0E23] text-[#F8F4E9] flex flex-col font-sans selection:bg-[#935073] selection:text-[#F8F4E9]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/scan" element={<DemoScannerPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

