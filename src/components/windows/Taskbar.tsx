
import React, { useState, useEffect } from 'react';
import { WindowType } from './types/WindowTypes';
import { Home, Search, Settings, Clock, Battery, Wifi, Bluetooth, Calendar, RefreshCw } from 'lucide-react';
import { SettingsType } from './Settings';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface TaskbarProps {
  windows: WindowType[];
  onItemClick: (id: string) => void;
  onStartClick: () => void;
  onSearchClick: () => void;
  onRefreshClick?: () => void;
  isStartMenuOpen: boolean;
  isSearchOpen: boolean;
  settings: SettingsType;
  minimizedWindows: string[];
}

export const Taskbar = ({ 
  windows, 
  onItemClick, 
  onStartClick, 
  onSearchClick,
  onRefreshClick,
  isStartMenuOpen,
  isSearchOpen,
  settings,
  minimizedWindows
}: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(75);
  const [isCharging, setIsCharging] = useState(false);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeWindows, setActiveWindows] = useState<WindowType[]>([]);

  useEffect(() => {
    const openWindows = windows.filter(w => 
      w.isOpen && 
      w.id !== 'settings' &&  
      w.showInTaskbar !== false
    );
    setActiveWindows(openWindows);
  }, [windows]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          
          setBatteryLevel(Math.floor(battery.level * 100));
          setIsCharging(battery.charging);
          
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.floor(battery.level * 100));
            
            if (battery.level <= 0.2 && !battery.charging) {
              new Notification('Battery Low', {
                body: `Battery level is at ${Math.floor(battery.level * 100)}%. Please connect charger.`,
                icon: '/favicon.ico'
              });
            }
          });
          
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
            
            if (battery.charging) {
              new Notification('Charging', {
                body: 'Your device is now charging.',
                icon: '/favicon.ico'
              });
            }
          });
        } else {
          setBatteryLevel(Math.floor(Math.random() * 30) + 70);
        }
      } catch (error) {
        console.error("Error accessing battery info:", error);
        setBatteryLevel(Math.floor(Math.random() * 30) + 70);
      }
    };
    
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    getBatteryInfo();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-win-taskbar backdrop-blur-win border-t border-white/20 shadow-win flex items-center justify-between">
      <div className="flex items-center gap-1 px-2">
        {}
        <button 
          className={`p-2 rounded-md transition-colors ${isStartMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
          onClick={(e) => { e.stopPropagation(); onStartClick(); }}
          aria-label="Start Menu"
        >
          <div className="w-6 h-6 rounded-md bg-win-blue flex items-center justify-center">
            <Home size={16} className="text-white" />
          </div>
        </button>
        
        {}
        <button 
          className={`p-2 rounded-md transition-colors ${isSearchOpen ? 'bg-white/20' : 'hover:bg-white/10'}`} 
          onClick={(e) => { e.stopPropagation(); onSearchClick(); }}
          aria-label="Search"
        >
          <Search size={18} className="text-gray-600" />
        </button>
        
        {}
        <button 
          className={`p-2 rounded-md transition-colors ${
            windows.find(w => w.id === 'settings')?.isOpen ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
          onClick={(e) => { e.stopPropagation(); onItemClick('settings'); }}
          aria-label="Settings"
        >
          <Settings size={18} className="text-gray-700" />
        </button>
        
        {}
        <button 
          className="p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={(e) => { e.stopPropagation(); if (onRefreshClick) onRefreshClick(); }}
          aria-label="Refresh"
        >
          <RefreshCw size={18} className="text-gray-600" />
        </button>
        
        {}
        {activeWindows.length > 0 && (
          <div className="h-6 w-px bg-gray-300/30 mx-1"></div>
        )}
        
        {}
        <div className="flex items-center gap-1">
          {activeWindows.map(window => (
            <button
              key={window.id}
              className={`p-2 rounded-md transition-colors relative ${
                window.isOpen ? (window.isMinimized ? 'bg-white/10' : 'bg-white/20') : 'hover:bg-white/10'
              }`}
              onClick={(e) => { e.stopPropagation(); onItemClick(window.id); }}
              aria-label={window.title}
            >
              {React.cloneElement(window.icon as React.ReactElement, { 
                size: 20,
                className: "text-gray-700"
              })}
              {window.isOpen && !window.isMinimized && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-win-blue"></div>
              )}
              {window.isOpen && window.isMinimized && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gray-400"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {}
      {minimizedWindows.length > 0 && (
        <div className="mx-auto flex items-center space-x-1">
          {minimizedWindows.map(id => {
            const window = windows.find(w => w.id === id);
            if (!window) return null;
            
            return (
              <button 
                key={id}
                className="px-3 py-1 bg-white/10 rounded-md hover:bg-white/20 flex items-center text-xs"
                onClick={(e) => { e.stopPropagation(); onItemClick(id); }}
              >
                {React.cloneElement(window.icon as React.ReactElement, { 
                  size: 14,
                  className: "mr-1"
                })}
                {window.title}
              </button>
            );
          })}
        </div>
      )}

      {}
      <div className="flex items-center px-2 space-x-3 text-sm text-gray-700">
        {}
        <Popover>
          <PopoverTrigger asChild>
            <button className={`p-1 rounded-full ${isWifiOn ? 'text-gray-700' : 'text-gray-400'}`}>
              <Wifi size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 bg-white/90 backdrop-blur-md">
            <h3 className="text-sm font-medium mb-2">WiFi</h3>
            <div className="flex items-center justify-between">
              <span>Connected</span>
              <button 
                className={`w-10 h-5 rounded-full relative ${isWifiOn ? 'bg-win-blue' : 'bg-gray-300'}`}
                onClick={() => setIsWifiOn(!isWifiOn)}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${isWifiOn ? 'right-0.5' : 'left-0.5'}`}></div>
              </button>
            </div>
            <p className="text-xs mt-2">{isWifiOn ? 'Connected to Home WiFi' : 'WiFi is off'}</p>
          </PopoverContent>
        </Popover>
        
        {}
        <Popover>
          <PopoverTrigger asChild>
            <button className={`p-1 rounded-full ${isBluetoothOn ? 'text-gray-700' : 'text-gray-400'}`}>
              <Bluetooth size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 bg-white/90 backdrop-blur-md">
            <h3 className="text-sm font-medium mb-2">Bluetooth</h3>
            <div className="flex items-center justify-between">
              <span>Enabled</span>
              <button 
                className={`w-10 h-5 rounded-full relative ${isBluetoothOn ? 'bg-win-blue' : 'bg-gray-300'}`}
                onClick={() => setIsBluetoothOn(!isBluetoothOn)}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${isBluetoothOn ? 'right-0.5' : 'left-0.5'}`}></div>
              </button>
            </div>
            <p className="text-xs mt-2">{isBluetoothOn ? 'Looking for devices...' : 'Bluetooth is off'}</p>
          </PopoverContent>
        </Popover>
        
        {settings && settings.showBattery && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1">
                <Battery size={16} className={isCharging ? "animate-pulse text-green-600" : ""} />
                <span>{batteryLevel}%</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 bg-white/90 backdrop-blur-md">
              <h3 className="text-sm font-medium mb-2">Battery</h3>
              <div className="w-full h-4 bg-gray-200 rounded-full">
                <div 
                  className={`h-full rounded-full ${
                    batteryLevel > 50 ? 'bg-green-500' : 
                    batteryLevel > 20 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${batteryLevel}%` }}
                ></div>
              </div>
              <p className="text-xs mt-2">
                {batteryLevel}% {isCharging ? '(Charging)' : 'remaining'}
              </p>
            </PopoverContent>
          </Popover>
        )}
        
        {}
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-2" aria-label="Open calendar">
              <Calendar size={16} className="inline-block mr-1" />
              {currentTime.toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-md">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {settings && settings.showClock && (
          <div className="px-2">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};
