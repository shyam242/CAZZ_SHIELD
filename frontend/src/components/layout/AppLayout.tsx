import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EmergencyBanner } from './EmergencyBanner';
import { useEmergencyStore } from '../../store/emergencyStore';

export const AppLayout: React.FC = () => {
  const { isEmergencyActive } = useEmergencyStore();

  return (
    <div className={`min-h-screen flex bg-slate-950 text-slate-100 ${isEmergencyActive ? 'emergency-active' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <EmergencyBanner />
        <Header />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
