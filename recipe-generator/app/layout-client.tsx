'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SettingsModal } from '@/components/SettingsModal';
import { storage } from '@/lib/utils/storage';
import { UserPreferences } from '@/lib/types';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveSettings = (apiKey: string, preferences: UserPreferences, aiModel: string) => {
    storage.saveSettings({ openRouterApiKey: apiKey, userPreferences: preferences, aiModel });
    setShowSettings(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('settingsChanged'));
  };

  return (
    <>
      <Navigation onSettingsClick={() => setShowSettings(true)} />
      {children}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
        />
      )}
    </>
  );
}