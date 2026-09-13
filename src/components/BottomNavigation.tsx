import React from 'react';
import { Home, FileText, QrCode, Clock, User } from 'lucide-react';
import { useApp } from '../state/AppContext';
import type { BottomTab } from '../types';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs: { id: BottomTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: (a) => <Home size={20} strokeWidth={a ? 2.5 : 1.8} /> },
    { id: 'account', label: 'Services', icon: (a) => <FileText size={20} strokeWidth={a ? 2.5 : 1.8} /> },
    { id: 'scan', label: 'Scan', icon: () => <QrCode size={24} strokeWidth={2.2} /> },
    { id: 'history', label: 'History', icon: (a) => <Clock size={20} strokeWidth={a ? 2.5 : 1.8} /> },
    { id: 'profile', label: 'Profile', icon: (a) => <User size={20} strokeWidth={a ? 2.5 : 1.8} /> },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '480px',
        margin: '0 auto',
        height: 'calc(68px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(8px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(8px, env(safe-area-inset-right, 0px))',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        boxShadow: 'none',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isScan = tab.id === 'scan';

        if (isScan) {
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTab(tab.id);
                }
              }}
              style={{
                position: 'relative',
                top: '-18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 45,
                transition: 'transform 0.12s ease',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3.5px solid #ffffff',
                  outline: '1.5px solid #d6e6ff',
                  transition: 'transform 0.15s ease',
                }}
              >
                {tab.icon(isActive)}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#2e83ff',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {t(tab.label)}
              </span>
            </div>
          );
        }

        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveTab(tab.id);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              cursor: 'pointer',
              color: isActive ? '#2e83ff' : '#64748b',
              transition: 'color 0.15s ease',
              position: 'relative',
            }}
          >
            <div style={{ transform: isActive ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.15s ease' }}>
              {tab.icon(isActive)}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#2e83ff' : '#64748b',
                marginTop: '3px',
                letterSpacing: '-0.01em',
              }}
            >
              {t(tab.label)}
            </span>

            {/* Active Subtle Bottom Indicator Pill */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  width: '14px',
                  height: '2.5px',
                  borderRadius: '2px',
                  backgroundColor: '#2e83ff',
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
};
