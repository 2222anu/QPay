import React from 'react';
import { Check } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { useApp } from '../state/AppContext';
import { designSystem } from '../design-system';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalOpen, setIsLanguageModalOpen, language, setAppLanguage } = useApp();

  const languages = [
    { name: 'English', native: 'English (Default)' },
    { name: 'Telugu', native: 'తెలుగు (Telugu)' },
    { name: 'Hindi', native: 'हिंदी (Hindi)' },
    { name: 'Tamil', native: 'தமிழ் (Tamil)' },
    { name: 'Spanish', native: 'Español (Spanish)' },
    { name: 'العربية', native: 'العربية (Arabic - RTL)' },
  ];

  return (
    <BottomSheet
      isOpen={isLanguageModalOpen}
      onClose={() => setIsLanguageModalOpen(false)}
      title="Select Language"
      themeMode="light"
    >
      <div role="radiogroup" aria-label="App Language Options" style={{ marginBottom: designSystem.spacing.lg }}>
        {languages.map((lang) => {
          const isSelected = language === lang.name;
          return (
            <div
              key={lang.name}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setAppLanguage(lang.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setAppLanguage(lang.name);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: isSelected ? designSystem.colors.primaryLight : designSystem.colors.surface,
                border: isSelected ? `2px solid ${designSystem.colors.primary}` : `1px solid ${designSystem.colors.borderHairline}`,
                borderRadius: designSystem.radii.md,
                marginBottom: designSystem.spacing.sm,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: designSystem.shadows.none,
              }}
            >
              <div>
                <div style={{ fontWeight: designSystem.typography.weights.bold, fontSize: '15px', color: designSystem.colors.textPrimary }}>
                  {lang.name}
                </div>
                <div style={{ fontSize: '12px', color: designSystem.colors.textSecondary }}>
                  {lang.native}
                </div>
              </div>
              {isSelected && <Check size={20} color={designSystem.colors.primary} />}
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
};
