import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  themeMode?: 'dark' | 'light';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  themeMode = 'light',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDark = themeMode === 'dark';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'bottom-sheet-title' : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#ffffff' : '#0f172a',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          padding: '24px 20px calc(24px + env(safe-area-inset-bottom, 0px)) 20px',
          maxHeight: '90dvh',
          overflowY: 'auto',
          boxShadow: 'none',
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0',
            borderRadius: '2px',
            margin: '0 auto 16px auto',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {title ? (
            <h3 id="bottom-sheet-title" style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            aria-label="Close sheet"
            className="interactive-tap"
            style={{
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f8fafc',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              color: isDark ? '#ffffff' : '#64748b',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
