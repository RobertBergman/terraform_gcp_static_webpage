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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Card variant="elevated" className="shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              Settings
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          <CardContent className="py-6">
            <div className="space-y-8">
              {/* API Configuration Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  API Configuration
                </h4>
                <Input
                  label="OpenRouter API Key (Optional)"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-... (leave blank to use default)"
                  helperText="Leave blank to use the default API key"
                />
                <p className="text-sm text-muted-foreground">
                  Get your own API key from{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    openrouter.ai/keys
                  </a>
                </p>

                <Input
                  label="AI Model"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  placeholder="z-ai/glm-4.6"
                  helperText="Browse available models at openrouter.ai/models"
                />
              </div>

              {/* Meal Preferences Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  Meal Preferences
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Diet Type"
                    options={DIET_TYPES}
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value as DietType)}
                  />

                  <Input
                    label="Serving Size"
                    type="number"
                    min="1"
                    max="12"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                  />
                </div>

                <Input
                  label="Location (City, State)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Spokane, WA"
                />

                <Input
                  label="Dietary Restrictions (comma-separated)"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  placeholder="nuts, shellfish"
                />
              </div>

              {/* Preferred Stores Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Preferred Stores
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STORES.map((store) => (
                    <label
                      key={store.value}
                      className="flex items-center gap-3 cursor-pointer glass px-4 py-3 rounded-xl border border-border hover:border-primary/50 transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.value)}
                        onChange={() => handleStoreToggle(store.value)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {store.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <Button onClick={handleSave} size="lg" className="flex-1 shadow-lg">
                  Save Settings
                </Button>
                <Button onClick={onClose} variant="outline" size="lg" className="sm:w-32">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}