
import React from 'react';
import { useWindows } from '../context/WindowsContext';

interface FolderContentProps {
  type: 'games' | 'utilities';
}

export const FolderContent: React.FC<FolderContentProps> = ({ type }) => {
  const { windows, toggleWindow } = useWindows();
  
  // Filter apps based on folder type
  const apps = windows.filter(app => {
    if (type === 'games') {
      return ['tictactoe', 'snake', 'minesweeper'].includes(app.id);
    } else if (type === 'utilities') {
      return !['about', 'projects', 'skills', 'experience', 'contact', 'tictactoe', 'snake', 'minesweeper',
               'games-folder-window', 'utilities-folder-window'].includes(app.id) &&
             app.showInStartMenu !== false;
    }
    return false;
  });

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4">{type === 'games' ? 'Games' : 'Utilities'}</h2>
      <div className="grid grid-cols-3 gap-4">
        {apps.map(app => (
          <div 
            key={app.id}
            className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
            onClick={() => toggleWindow(app.id)}
          >
            <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
              {React.cloneElement(app.icon as React.ReactElement, { size: 24 })}
            </div>
            <span className="text-sm text-center truncate w-full">{app.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
