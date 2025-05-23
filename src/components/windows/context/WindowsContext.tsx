import React, { createContext, useState, useContext, useEffect } from 'react';
import { WindowType } from '../types/WindowTypes';
import { Settings as SettingsIcon, User, Folder, Code, Briefcase, Mail, Clock, Calculator, FileText, Volume, Music, Battery, Settings, Globe, Timer, Terminal, StickyNote, Gamepad, Brush, PaintBucket } from 'lucide-react';
import { Clock as ClockApp } from '../features/Clock';
import { Calculator as CalculatorApp } from '../features/Calculator';
import { Notepad } from '../features/Notepad';
import { VolumeControl } from '../features/VolumeControl';
import { MusicPlayer } from '../features/MusicPlayer';
import { BatteryLevel } from '../features/BatteryLevel';
import { ProjectFolder } from '../features/ProjectFolder';
import { UnifiedClock } from '../features/UnifiedClock';
import { StickyNotes } from '../features/StickyNotes';
import { TaskManager } from '../features/TaskManager';
import { CommandTerminal } from '../features/CommandTerminal';
import { TicTacToe } from '../features/TicTacToe';
import { SnakeGame } from '../features/SnakeGame';
import { Whiteboard } from '../features/Whiteboard';
import { SettingsApp } from '../Settings';
import { Minesweeper } from '../features/Minesweeper';
import { FolderContent } from '../features/FolderContent';
import AboutMe from '../features/AboutMe';
import Skills from '../features/Skills';
import Projects from '../features/Projects';
import ContactMe from '../features/ContactMe';
import Experience from '../features/Experience';

const BASE_ZINDEX = 1000;
const FOLDER_ZINDEX = BASE_ZINDEX;
const APP_ZINDEX = BASE_ZINDEX + 100;
const ZINDEX_INCREMENT = 10;

export type SettingsType = {
  theme: 'light' | 'dark';
  showClock: boolean;
  showCalculator: boolean;
  showNotepad: boolean;
  showVolumeControl: boolean;
  showMusicPlayer: boolean;
  showBattery: boolean;
  wallpaperUrl?: string;
  soundEffects?: boolean;
  notifications?: boolean;
  animations?: boolean;
  transparency?: number;
};

interface WindowsContextType {
  windows: WindowType[];
  highestZIndex: number;
  toggleWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  minimizedWindows: string[];
  setWallpaper: (url: string) => void;
  wallpaper: string;
  isShuttingDown: boolean;
  handleShutdown: () => void;
}

const WindowsContext = createContext<WindowsContextType>({
  windows: [],
  highestZIndex: 100,
  toggleWindow: () => {},
  minimizeWindow: () => {},
  bringToFront: () => {},
  settings: {
    theme: 'light',
    showClock: true,
    showCalculator: true,
    showNotepad: true,
    showVolumeControl: true,
    showMusicPlayer: true,
    showBattery: true,
  },
  setSettings: () => {},
  minimizedWindows: [],
  setWallpaper: () => {},
  wallpaper: '',
  isShuttingDown: false,
  handleShutdown: () => {},
});

export const useWindows = () => useContext(WindowsContext);

export const WindowsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [wallpaper, setWallpaper] = useState('');
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const [settings, setSettings] = useState<SettingsType>({
    theme: 'light',
    showClock: true,
    showCalculator: true,
    showNotepad: true,
    showVolumeControl: true,
    showMusicPlayer: true,
    showBattery: true,
  });

  useEffect(() => {
    const isShutdown = localStorage.getItem('win11-is-shutdown') === 'true';
    if (isShutdown) {
      const shutdownScreen = document.createElement('div');
      shutdownScreen.id = 'shutdown-screen';
      shutdownScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        z-index: 99999;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.3);
        font-family: 'Segoe UI', sans-serif;
        font-size: 20px;
      `;
      shutdownScreen.innerHTML = '<p>Click anywhere to power on</p>';

      shutdownScreen.addEventListener('click', () => {
        shutdownScreen.style.background = '#0078D7';
        shutdownScreen.innerHTML = `<div class="windows-loader"></div>`;
        const style = document.createElement('style');
        style.textContent = `
          .windows-loader {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.body.appendChild(style);

        localStorage.removeItem('win11-is-shutdown');

        setTimeout(() => {
          shutdownScreen.remove();
          window.location.reload();
        }, 2000);
      });

      document.body.appendChild(shutdownScreen);
      setIsShuttingDown(false);
    }
  }, []);

  useEffect(() => {
    const loadSavedState = () => {
      const savedSettings = localStorage.getItem('win11-settings');
      const savedWallpaper = localStorage.getItem('win11-wallpaper');
      const savedOpenWindows = localStorage.getItem('win11-open-windows');
      const savedMinimizedWindows = localStorage.getItem('win11-minimized-windows');
      const savedTheme = localStorage.getItem('win11-theme');

      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          if (parsedSettings.theme === 'dark') {
            document.documentElement.classList.add('dark');
          }
        } catch (error) {
          console.error("Error parsing saved settings:", error);
        }
      }

      if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        setSettings(prev => ({ ...prev, theme: savedTheme === 'dark' ? 'dark' : 'light' }));
      }

      if (savedWallpaper) {
        setWallpaper(savedWallpaper);
      }

      initializeWindows(
        savedOpenWindows ? JSON.parse(savedOpenWindows) : [],
        savedMinimizedWindows ? JSON.parse(savedMinimizedWindows) : []
      );
    };

    loadSavedState();
  }, []);

  const initializeWindows = (openWindowIds: string[], minimizedWindowIds: string[]) => {
    const portfolioWindows: WindowType[] = [
      {
        id: 'about',
        title: 'About Me',
        content: <AboutMe />,
        isOpen: openWindowIds.includes('about'),
        isMinimized: minimizedWindowIds.includes('about'),
        icon: <User className="h-5 w-5" />,
        zIndex: 100,
      },
      {
        id: 'projects',
        title: 'Projects',
        content: <Projects />,
        isOpen: openWindowIds.includes('projects'),
        isMinimized: minimizedWindowIds.includes('projects'),
        icon: <Folder className="h-5 w-5" />,
        zIndex: 100,
      },
      {
        id: 'skills',
        title: 'Skills',
        content: <Skills />,
        isOpen: openWindowIds.includes('skills'),
        isMinimized: minimizedWindowIds.includes('skills'),
        icon: <Code className="h-5 w-5" />,
        zIndex: 100,
      },
      {
        id: 'experience',
        title: 'Experience',
        content: <Experience />,
        isOpen: openWindowIds.includes('experience'),
        isMinimized: minimizedWindowIds.includes('experience'),
        icon: <Briefcase className="h-5 w-5" />,
        zIndex: 100,
      },
      {
        id: 'contact',
        title: 'Contact',
        content: <ContactMe />,
        isOpen: openWindowIds.includes('contact'),
        isMinimized: minimizedWindowIds.includes('contact'),
        icon: <Mail className="h-5 w-5" />,
        zIndex: 100,
      }
    ];

    const utilityWindows: WindowType[] = [
      {
        id: 'settings',
        title: 'Settings',
        content: <SettingsApp initialSettings={settings} onApply={setSettings} />,
        isOpen: openWindowIds.includes('settings'),
        isMinimized: minimizedWindowIds.includes('settings'),
        icon: <SettingsIcon className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: true,
      },
      {
        id: 'unifiedClock',
        title: 'Clock',
        content: <UnifiedClock />,
        isOpen: openWindowIds.includes('unifiedClock'),
        isMinimized: minimizedWindowIds.includes('unifiedClock'),
        icon: <Clock className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      },
      {
        id: 'taskManager',
        title: 'Task Manager',
        content: <TaskManager />,
        isOpen: openWindowIds.includes('taskManager'),
        isMinimized: minimizedWindowIds.includes('taskManager'),
        icon: <Timer className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      },
      {
        id: 'stickyNotes',
        title: 'Sticky Notes',
        content: <StickyNotes />,
        isOpen: openWindowIds.includes('stickyNotes'),
        isMinimized: minimizedWindowIds.includes('stickyNotes'),
        icon: <StickyNote className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      },
      {
        id: 'terminal',
        title: 'Terminal',
        content: <CommandTerminal />,
        isOpen: openWindowIds.includes('terminal'),
        isMinimized: minimizedWindowIds.includes('terminal'),
        icon: <Terminal className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      },
      {
        id: 'tictactoe',
        title: 'Tic Tac Toe',
        content: <TicTacToe />,
        isOpen: openWindowIds.includes('tictactoe'),
        isMinimized: minimizedWindowIds.includes('tictactoe'),
        icon: <Gamepad className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      },
      {
        id: 'snake',
        title: 'Snake Game',
        content: <SnakeGame />,
        isOpen: openWindowIds.includes('snake'),
        isMinimized: minimizedWindowIds.includes('snake'),
        icon: <Gamepad className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      },
      {
        id: 'minesweeper',
        title: 'Minesweeper',
        content: <Minesweeper />,
        isOpen: openWindowIds.includes('minesweeper'),
        isMinimized: minimizedWindowIds.includes('minesweeper'),
        icon: <Gamepad className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      },
      {
        id: 'whiteboard',
        title: 'Paint',
        content: <Whiteboard />,
        isOpen: openWindowIds.includes('whiteboard'),
        isMinimized: minimizedWindowIds.includes('whiteboard'),
        icon: <PaintBucket className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
        defaultSize: { width: 800, height: 600 },
        isResizable: true,
        isMaximizable: true
      }
    ];

    if (settings.showCalculator) {
      utilityWindows.push({
        id: 'calculator',
        title: 'Calculator',
        content: <CalculatorApp />,
        isOpen: openWindowIds.includes('calculator'),
        isMinimized: minimizedWindowIds.includes('calculator'),
        icon: <Calculator className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      });
    }

    if (settings.showNotepad) {
      utilityWindows.push({
        id: 'notepad',
        title: 'Notepad',
        content: <Notepad />,
        isOpen: openWindowIds.includes('notepad'),
        isMinimized: minimizedWindowIds.includes('notepad'),
        icon: <FileText className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      });
    }

    if (settings.showVolumeControl) {
      utilityWindows.push({
        id: 'volume',
        title: 'Volume Control',
        content: <VolumeControl />,
        isOpen: openWindowIds.includes('volume'),
        isMinimized: minimizedWindowIds.includes('volume'),
        icon: <Volume className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      });
    }

    if (settings.showMusicPlayer) {
      utilityWindows.push({
        id: 'music',
        title: 'Music Player',
        content: <MusicPlayer />,
        isOpen: openWindowIds.includes('music'),
        isMinimized: minimizedWindowIds.includes('music'),
        icon: <Music className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      });
    }

    if (settings.showBattery) {
      utilityWindows.push({
        id: 'battery',
        title: 'Battery',
        content: <BatteryLevel />,
        isOpen: openWindowIds.includes('battery'),
        isMinimized: minimizedWindowIds.includes('battery'),
        icon: <Battery className="h-5 w-5" />,
        zIndex: 100,
        showInStartMenu: true,
        showInTaskbar: false,
      });
    }

    const gameApps = utilityWindows.filter(w =>
      ['tictactoe', 'snake', 'minesweeper'].includes(w.id)
    );

    const gamesFolderWindow: WindowType = {
      id: 'games-folder-window',
      title: 'Games',
      content: <FolderContent type="games" />,
      isOpen: openWindowIds.includes('games-folder-window'),
      isMinimized: minimizedWindowIds.includes('games-folder-window'),
      icon: <Gamepad className="h-5 w-5 text-amber-500" />,
      zIndex: 100,
      defaultSize: { width: 700, height: 500 },
      showInStartMenu: false,
      showInTaskbar: true,
    };

    const utilitiesFolderWindow: WindowType = {
      id: 'utilities-folder-window',
      title: 'Utilities',
      content: <FolderContent type="utilities" />,
      isOpen: openWindowIds.includes('utilities-folder-window'),
      isMinimized: minimizedWindowIds.includes('utilities-folder-window'),
      icon: <Folder className="h-5 w-5 text-blue-500" />,
      zIndex: 100,
      defaultSize: { width: 700, height: 500 },
      showInStartMenu: false,
      showInTaskbar: true,
    };

    setWindows([
      ...portfolioWindows,
      ...utilityWindows,
      gamesFolderWindow,
      utilitiesFolderWindow
    ]);
  };

  useEffect(() => {
    localStorage.setItem('win11-settings', JSON.stringify(settings));
    localStorage.setItem('win11-theme', settings.theme);
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('win11-wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    const openWindows = windows.filter(w => w.isOpen).map(w => w.id);
    localStorage.setItem('win11-open-windows', JSON.stringify(openWindows));
  }, [windows]);

  useEffect(() => {
    localStorage.setItem('win11-minimized-windows', JSON.stringify(minimizedWindows));
  }, [minimizedWindows]);

  const toggleWindow = (id: string) => {
    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.id === id);
      const newZIndex = Math.max(...prevWindows.map(w => w.zIndex || 0), APP_ZINDEX) + ZINDEX_INCREMENT;

      if (existingWindow) {
        const isMinimized = minimizedWindows.includes(id);

        if (!existingWindow.isOpen || isMinimized) {
          const isGameOrUtility = id !== 'games-folder-window' && id !== 'utilities-folder-window';

          return prevWindows.map(window => ({
            ...window,
            isOpen: window.id === id ? true : window.isOpen,
            isMinimized: window.id === id ? false : window.isMinimized,
            zIndex: window.id === id
              ? (isGameOrUtility ? newZIndex : FOLDER_ZINDEX)
              : window.zIndex
          }));
        } else {
          return prevWindows.map(window => ({
            ...window,
            isOpen: window.id === id ? false : window.isOpen,
            isMinimized: window.id === id ? false : window.isMinimized
          }));
        }
      }
      return prevWindows;
    });

    setMinimizedWindows(prev => prev.filter(winId => winId !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(window => ({
        ...window,
        isMinimized: window.id === id ? true : window.isMinimized,
        isOpen: window.id === id ? true : window.isOpen
      }))
    );

    if (!minimizedWindows.includes(id)) {
      setMinimizedWindows(prev => [...prev, id]);
    }
  };

  const bringToFront = (id: string) => {
    setWindows(prevWindows => {
      const newZIndex = Math.max(...prevWindows.map(w => w.zIndex || 0), APP_ZINDEX) + ZINDEX_INCREMENT;
      const isGameOrUtility = id !== 'games-folder-window' && id !== 'utilities-folder-window';

      return prevWindows.map(window => ({
        ...window,
        zIndex: window.id === id
          ? (isGameOrUtility ? newZIndex : FOLDER_ZINDEX)
          : window.zIndex,
        isMinimized: window.id === id ? false : window.isMinimized,
        isOpen: window.id === id ? true : window.isOpen
      }));
    });

    setMinimizedWindows(prev => prev.filter(winId => winId !== id));
  };

  const handleShutdown = () => {
    setIsShuttingDown(true);

    setWindows(prevWindows =>
      prevWindows.map(window => ({
        ...window,
        isOpen: false,
        isMinimized: false
      }))
    );
    setMinimizedWindows([]);

    const shutdownContainer = document.createElement('div');
    shutdownContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #0078D7;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
    `;

    shutdownContainer.innerHTML = `<div class="shutdown-loader"></div>`;

    const style = document.createElement('style');
    style.textContent = `
      .shutdown-loader {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top: 4px solid white;
        width: 40px;
        height: 40px;
        animation: shutdownSpin 1s linear infinite;
      }
      @keyframes shutdownSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    document.body.appendChild(style);
    document.body.appendChild(shutdownContainer);

    setTimeout(() => {
      shutdownContainer.style.transition = 'background 0.5s ease-in-out';
      shutdownContainer.style.background = 'black';
      shutdownContainer.innerHTML = '';
      document.body.style.cursor = 'none';
      localStorage.setItem('win11-is-shutdown', 'true');
    }, 6000);
  };

  return (
    <WindowsContext.Provider
      value={{
        windows,
        highestZIndex,
        toggleWindow,
        minimizeWindow,
        bringToFront,
        settings,
        setSettings,
        minimizedWindows,
        setWallpaper,
        wallpaper,
        isShuttingDown,
        handleShutdown
      }}
    >
      {children}
    </WindowsContext.Provider>
  );
};
