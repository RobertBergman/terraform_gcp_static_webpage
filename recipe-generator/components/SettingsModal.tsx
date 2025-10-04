'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { X, Settings } from 'lucide-react';
import { DietType, Store, UserPreferences } from '@/lib/types';
import { storage } from '@/lib/utils/storage';

interface SettingsModalProps {
  onClose: () => void;
  onSave: (apiKey: string, preferences: UserPreferences, aiModel: string) => void;
}

const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'carnivore', label: 'Carnivore' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'whole30', label: 'Whole30' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'low-carb', label: 'Low-Carb' },
];

const STORES: { value: Store; label: string }[] = [
  { value: 'yokes', label: 'Yokes' },
  { value: 'safeway', label: 'Safeway' },
  { value: 'walmart', label: 'Walmart' },
  { value: 'target', label: 'Target' },
  { value: 'costco', label: 'Costco' },
];

export function SettingsModal({ onClose, onSave }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAiModel] = useState('z-ai/glm-4.6');
  const [dietType, setDietType] = useState<DietType>('balanced');
  const [location, setLocation] = useState('');
  const [servingSize, setServingSize] = useState('4');
  const [selectedStores, setSelectedStores] = useState<Store[]>(['walmart']);
  const [restrictions, setRestrictions] = useState('');

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings?.openRouterApiKey) setApiKey(settings.openRouterApiKey);
    if (settings?.aiModel) setAiModel(settings.aiModel);
    if (settings?.userPreferences) {
      const prefs = settings.userPreferences;
      setDietType(prefs.dietType);
      setLocation(prefs.location);
      setServingSize(prefs.servingSize.toString());
      setSelectedStores(prefs.preferredStores);
      setRestrictions(prefs.restrictions?.join(', ') || '');
    }
  }, []);

  const handleStoreToggle = (store: Store) => {
    setSelectedStores((prev) =>
      prev.includes(store)
        ? prev.filter((s) => s !== store)
        : [...prev, store]
    );
  };

  const handleSave = () => {
    const preferences: UserPreferences = {
      dietType,
      location,
      servingSize: parseInt(servingSize),
      preferredStores: selectedStores,
      restrictions: restrictions ? restrictions.split(',').map((r) => r.trim()) : [],
    };

    onSave(apiKey, preferences, aiModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Settings
          </CardTitle>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-4">API Configuration</h4>
              <Input
                label="OpenRouter API Key (Optional)"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-... (leave blank to use default)"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Leave blank to use the default API key, or provide your own from{' '}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  openrouter.ai/keys
                </a>
              </p>

              <div className="mt-4">
                <Input
                  label="AI Model"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  placeholder="z-ai/glm-4.6"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Browse models at{' '}
                  <a
                    href="https://openrouter.ai/models"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    openrouter.ai/models
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Meal Preferences</h4>
              <div className="space-y-4">
                <Select
                  label="Diet Type"
                  options={DIET_TYPES}
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value as DietType)}
                />

                <Input
                  label="Location (City, State)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Spokane, WA"
                />

                <Input
                  label="Serving Size"
                  type="number"
                  min="1"
                  max="12"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />

                <Input
                  label="Dietary Restrictions (comma-separated)"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  placeholder="nuts, shellfish"
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Preferred Stores</h4>
              <div className="grid grid-cols-2 gap-3">
                {STORES.map((store) => (
                  <label
                    key={store.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStores.includes(store.value)}
                      onChange={() => handleStoreToggle(store.value)}
                      className="w-4 h-4"
                    />
                    <span>{store.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Settings
              </Button>
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}