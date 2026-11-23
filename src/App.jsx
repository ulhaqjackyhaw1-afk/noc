import React, { useState } from 'react';
import FullSiteMap from './components/FullSiteMap';
import NetworkTopologyMap from './components/NetworkTopologyMap';

export function App() {
  // Navigation State: 'full_map' atau 'office'
  const [currentView, setCurrentView] = useState('full_map');
  const [currentFloor, setCurrentFloor] = useState('l2');

  const handleSelectBuildingFloor = (buildingId, floorId) => {
    if (buildingId === 'office') {
      setCurrentFloor(floorId);
      setCurrentView('office');
    }
  };

  const handleBackToFullMap = () => {
    setCurrentView('full_map');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Top Navbar */}
      <nav className="h-14 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-xs">
            PSI
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm tracking-wide">
              PT Indoseiki IoT Network Monitor
            </span>

            {/* Breadcrumb pills */}
            <span className="text-slate-500 text-xs">/</span>
            <button
              type="button"
              onClick={handleBackToFullMap}
              className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                currentView === 'full_map'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Full Site Map
            </button>

            {currentView === 'office' && (
              <>
                <span className="text-slate-500 text-xs">/</span>
                <span className="text-slate-300 text-xs font-semibold">Gedung Office</span>
                <span className="text-slate-500 text-xs">/</span>
                <span className="text-indigo-400 text-xs font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {currentFloor === 'l1' ? 'Lantai 1' : 'Lantai 2'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top Right Navigation & Status */}
        <div className="flex items-center gap-3 text-xs">
          {/* Quick Nav Button */}
          {currentView === 'full_map' ? (
            <button
              type="button"
              onClick={() => {
                setCurrentFloor('l2');
                setCurrentView('office');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Masuk ke Gedung Office
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBackToFullMap}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
              </svg>
              Kembali ke Full Map
            </button>
          )}

          <div className="h-4 w-[1px] bg-slate-800"></div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Monitoring Server Online
          </div>
        </div>
      </nav>

      {/* Main View Area */}
      <main className="flex-1 p-4 flex flex-col">
        {currentView === 'full_map' ? (
          <FullSiteMap onSelectBuildingFloor={handleSelectBuildingFloor} />
        ) : (
          <NetworkTopologyMap
            floorId={currentFloor}
            buildingName="Gedung Office"
            onBackToFullMap={handleBackToFullMap}
            onSwitchFloor={floor => setCurrentFloor(floor)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
