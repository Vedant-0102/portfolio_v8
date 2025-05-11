import React from 'react';
import { DesktopIcon } from '../DesktopIcon';
import { useWindows } from '../context/WindowsContext';
import { Gamepad, Folder } from 'lucide-react';

export const DesktopIcons: React.FC = () => {
  const { windows = [], toggleWindow } = useWindows();

  // Portfolio apps (first row)
  const portfolioApps = windows.filter(w =>
    ['about', 'projects', 'skills', 'experience', 'contact'].includes(w.id)
  );

  // Assign positions: first row for portfolio, second row for folders
  const getPosition = (row: number, col: number) => ({
    x: 40 + col * 90,
    y: 40 + row * 90,
  });

  // Function to handle folder opening
  const openFolderAsWindow = (folderId: string) => {
    if (folderId === 'games-folder') {
      toggleWindow('games-folder-window');
    } else if (folderId === 'utilities-folder') {
      toggleWindow('utilities-folder-window');
    }
  };

  // Function to handle portfolio app opening
  const openPortfolioApp = (appId: string) => {
    console.log(`Opening portfolio app: ${appId}`);
    toggleWindow(appId);
  };

  // Render portfolio apps in first row
  const portfolioIcons = portfolioApps.map((app, idx) => {
    const pos = getPosition(0, idx);
    const handleClick = () => openPortfolioApp(app.id);
    
    return (
      <div
        key={app.id}
        style={{
          position: 'absolute',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          zIndex: 1,
        }}
        className="desktop-icon"
        onClick={handleClick}
        onDoubleClick={handleClick}
      >
        <DesktopIcon
          id={app.id}
          label={app.title}
          icon={app.icon}
        />
      </div>
    );
  });

  // Games folder icon (second row, first column)
  const gamesFolderPos = getPosition(1, 0);
  const handleGamesClick = () => openFolderAsWindow('games-folder');
  
  const gamesFolderIcon = (
    <div
      key="games-folder"
      style={{
        position: 'absolute',
        left: `${gamesFolderPos.x}px`,
        top: `${gamesFolderPos.y}px`,
        zIndex: 1,
      }}
      className="desktop-icon"  
      onClick={handleGamesClick}
      onDoubleClick={handleGamesClick}
    >
      <DesktopIcon
        id="games-folder"
        label="Games"
        icon={<Gamepad />}
      />
    </div>
  );

  // Utilities folder icon (second row, second column)
  const utilitiesFolderPos = getPosition(1, 1);
  const handleUtilitiesClick = () => openFolderAsWindow('utilities-folder');

  const utilitiesFolderIcon = (
    <div
      key="utilities-folder" 
      style={{
        position: 'absolute',
        left: `${utilitiesFolderPos.x}px`,
        top: `${utilitiesFolderPos.y}px`,
        zIndex: 1,
      }}
      className="desktop-icon"
      onClick={handleUtilitiesClick}
      onDoubleClick={handleUtilitiesClick}
    >
      <DesktopIcon
        id="utilities-folder"
        label="Utilities" 
        icon={<Folder />}
      />
    </div>
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {portfolioIcons}
      {gamesFolderIcon}
      {utilitiesFolderIcon}
    </div>
  );
};