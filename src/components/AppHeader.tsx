import React from 'react';
import { ArrowLeft, Search, Settings } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { QtPayLogo } from './QtPayLogo';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
  showSettings?: boolean;
  showUserInfo?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showSearch = false,
  onSearchClick,
  showSettings = true,
  showUserInfo = false,
  rightAction,
}) => {
  const { user, goBack, navigateTo, currentScreen } = useApp();

  const handleBack = () => {
    if (onBack) onBack();
    else goBack();
  };

  const handleAvatarClick = () => {
    if (currentScreen === 'PROFILE') {
      navigateTo('HOME');
    } else {
      navigateTo('PROFILE');
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
        paddingBottom: '12px',
        paddingLeft: 'max(18px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(18px, env(safe-area-inset-right, 0px))',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        borderBottom: '1px solid #e2e8f0',
        boxShadow: 'none',
      }}
    >
      {/* Left Slot: Back Button or User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: '40px' }}>
        {showBack ? (
          <button
            onClick={handleBack}
            aria-label="Go back"
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease, transform 0.1s ease',
            }}
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={handleAvatarClick}
              role="button"
              tabIndex={0}
              aria-label={currentScreen === 'PROFILE' ? 'Go to home' : 'View user profile'}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#2e83ff',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'none',
                overflow: 'hidden',
                border: '2px solid #ffffff',
                outline: '1.5px solid #2e83ff',
                transition: 'transform 0.15s ease',
              }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.avatarInitials
              )}
            </div>
            {showUserInfo && (
              <div style={{ marginLeft: '10px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a', display: 'block', lineHeight: '16px' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#64748b' }}>
                  Standard Plan
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Slot: Official Vector Logo or Page Title */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 8px' }}>
        {title ? (
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0, textAlign: 'center', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
        ) : (
          <div onClick={() => navigateTo('HOME')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <QtPayLogo variant="header" size={26} themeMode="light" />
          </div>
        )}
      </div>

      {/* Right Slot: Search / Settings / Custom Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '40px', justifyContent: 'flex-end' }}>
        {showSearch && (
          <button
            onClick={onSearchClick}
            aria-label="Search"
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Search size={18} />
          </button>
        )}

        {rightAction}

        {showSettings && !rightAction && (
          <button
            onClick={() => navigateTo('UPI_SETTINGS')}
            aria-label="UPI Settings"
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Settings size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
