import React, { useState } from 'react';
import { MachineProvider } from './context/MachineContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DemoBanner } from './components/DemoBanner';
import { ToastNotification } from './components/ToastNotification';

import { Overview } from './pages/Overview';
import { HardwareWorkbench } from './pages/HardwareWorkbench';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { VirtualESP32 } from './pages/VirtualESP32';
import { AIPrediction } from './pages/AIPrediction';
import { AdaptiveControl } from './pages/AdaptiveControl';
import { SimulationLab } from './pages/SimulationLab';
import { IncidentTimeline } from './pages/IncidentTimeline';
import { HistoryDatabase } from './pages/HistoryDatabase';
import { SystemSettings } from './pages/Settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'workbench':
        return <HardwareWorkbench />;
      case 'monitoring':
        return <LiveMonitoring />;
      case 'esp32':
        return <VirtualESP32 />;
      case 'prediction':
        return <AIPrediction />;
      case 'adaptive':
        return <AdaptiveControl />;
      case 'simulation':
        return <SimulationLab />;
      case 'timeline':
        return <IncidentTimeline />;
      case 'database':
        return <HistoryDatabase />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-bgPrimary text-textPrimary overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header activeTab={activeTab} />
        <DemoBanner />
        <ToastNotification />
        <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MachineProvider>
      <AppContent />
    </MachineProvider>
  );
}
