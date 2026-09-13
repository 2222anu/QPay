import React, { useState } from 'react';
import { Fingerprint, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';

export const CustomerSecuritySetupScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleFinishOnboarding = () => {
    try {
      localStorage.setItem('hasCompletedOnboarding', 'true');
      localStorage.setItem('hasSeenOnboarding', 'true');
    } catch {
      // Ignore
    }
    setIsCompleted(true);
    setTimeout(() => {
      navigateTo('HOME');
    }, 900);
  };

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '32px',
      }}
    >
      <div>
        <AppHeader title="Device Security" showBack={false} showSettings={false} />

        <div style={{ padding: '20px' }}>
          {/* Top Hero Banner */}
          <div
            style={{
              backgroundColor: '#071529',
              borderRadius: '18px',
              padding: '20px',
              color: '#ffffff',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: 'rgba(46, 131, 255, 0.25)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                Hardware Level Security
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                Protecting your account with cryptographic device binding
              </div>
            </div>
          </div>

          {/* Security Features Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
            {/* Biometric Toggle Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: biometricsEnabled ? '#eef5ff' : '#f8fafc',
                    color: biometricsEnabled ? '#2e83ff' : '#94a3b8',
                    border: biometricsEnabled ? '1px solid #d6e6ff' : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Fingerprint size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                    Biometric Fast Login
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    Unlock with Fingerprint or Face ID
                  </div>
                </div>
              </div>

              <div
                role="switch"
                aria-checked={biometricsEnabled}
                tabIndex={0}
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                style={{
                  width: '46px',
                  height: '26px',
                  borderRadius: '9999px',
                  backgroundColor: biometricsEnabled ? '#2e83ff' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    transform: biometricsEnabled ? 'translateX(20px)' : 'translateX(0px)',
                    transition: 'transform 0.2s ease',
                    boxShadow: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />

            {/* Device SIM Binding Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#eef5ff',
                    color: '#2e83ff',
                    border: '1px solid #d6e6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Smartphone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                    SIM Device Binding
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    Cryptographic hardware token bound
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  borderRadius: '10px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#2e83ff',
                }}
              >
                <CheckCircle2 size={12} color="#2e83ff" /> BOUND
              </div>
            </div>
          </div>

          {/* Celebration Pill */}
          {isCompleted && (
            <div
              className="fade-in"
              style={{
                backgroundColor: '#eef5ff',
                border: '1.5px solid #d6e6ff',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2e83ff', fontWeight: 800, fontSize: '15px' }}>
                <Sparkles size={18} /> Welcome to QTPay!
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Redirecting you to your account...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Finish Actions */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <PrimaryButton onClick={handleFinishOnboarding} disabled={isCompleted}>
          Complete Setup & Enter QTPay <ArrowRight size={18} />
        </PrimaryButton>
        <SecondaryButton onClick={handleFinishOnboarding}>
          Skip Biometrics For Now
        </SecondaryButton>
      </div>
    </div>
  );
};
