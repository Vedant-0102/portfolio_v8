
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Volume, Clock, Calculator, FileText, Music, Battery, Palette } from 'lucide-react';

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

interface SettingsAppProps {
  initialSettings: SettingsType;
  onApply: (newSettings: SettingsType) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ initialSettings, onApply }) => {
  const [settings, setSettings] = useState<SettingsType>(initialSettings);
  
  const handleThemeChange = (theme: 'light' | 'dark') => {
    setSettings({ ...settings, theme });
  };
  
  const handleApply = () => {
    onApply(settings);
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette size={16} />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Volume size={16} />
            <span>System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Theme</h3>
            <div className="flex gap-4">
              <button
                className={`border rounded-lg p-4 w-36 h-36 flex flex-col items-center justify-center gap-2 transition-all ${
                  settings.theme === 'light' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handleThemeChange('light')}
              >
                <Sun size={32} className="text-orange-500" />
                <span>Light</span>
                <div className="w-full h-12 bg-gray-100 rounded mt-2"></div>
              </button>
              
              <button
                className={`border rounded-lg p-4 w-36 h-36 flex flex-col items-center justify-center gap-2 transition-all ${
                  settings.theme === 'dark' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handleThemeChange('dark')}
              >
                <Moon size={32} className="text-indigo-500" />
                <span>Dark</span>
                <div className="w-full h-12 bg-gray-800 rounded mt-2"></div>
              </button>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Visual Effects</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Transparency</span>
                </div>
                <div className="w-32">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.transparency || 50}
                    onChange={(e) => setSettings({ ...settings, transparency: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Animations</span>
                </div>
                <Switch
                  checked={settings.animations !== false}
                  onCheckedChange={(checked) => setSettings({ ...settings, animations: checked })}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">System Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <Label htmlFor="show-clock">Show Clock</Label>
                </div>
                <Switch
                  id="show-clock"
                  checked={settings.showClock}
                  onCheckedChange={(checked) => setSettings({ ...settings, showClock: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator size={20} />
                  <Label htmlFor="show-calculator">Show Calculator</Label>
                </div>
                <Switch
                  id="show-calculator"
                  checked={settings.showCalculator}
                  onCheckedChange={(checked) => setSettings({ ...settings, showCalculator: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={20} />
                  <Label htmlFor="show-notepad">Show Notepad</Label>
                </div>
                <Switch
                  id="show-notepad"
                  checked={settings.showNotepad}
                  onCheckedChange={(checked) => setSettings({ ...settings, showNotepad: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume size={20} />
                  <Label htmlFor="show-volume">Show Volume Control</Label>
                </div>
                <Switch
                  id="show-volume"
                  checked={settings.showVolumeControl}
                  onCheckedChange={(checked) => setSettings({ ...settings, showVolumeControl: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music size={20} />
                  <Label htmlFor="show-music">Show Music Player</Label>
                </div>
                <Switch
                  id="show-music"
                  checked={settings.showMusicPlayer}
                  onCheckedChange={(checked) => setSettings({ ...settings, showMusicPlayer: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery size={20} />
                  <Label htmlFor="show-battery">Show Battery</Label>
                </div>
                <Switch
                  id="show-battery"
                  checked={settings.showBattery}
                  onCheckedChange={(checked) => setSettings({ ...settings, showBattery: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume size={20} />
                  <Label htmlFor="sound-effects">Sound Effects</Label>
                </div>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects !== false}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Notifications</span>
                </div>
                <Switch
                  checked={settings.notifications !== false}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleApply}>
              Apply Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
