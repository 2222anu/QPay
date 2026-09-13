import React, { useState } from 'react';
import { MessageSquare, Phone, Users, Camera, MapPin, Mic, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';

export const PermissionsScreen: React.FC = () => {
  const { navigateTo, goBack } = useApp();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    sms: true,
    phone: true,
    contacts: true,
    camera: true,
    location: true,
    mic: false,
  });

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const permissions = [
    {
      key: 'sms',
      icon: <MessageSquare size={19} />,
      name: 'SMS Verification',
      required: true,
    },
    {
      key: 'phone',
      icon: <Phone size={19} />,
      name: 'Phone & SIM Status',
      required: true,
    },
    {
      key: 'contacts',
      icon: <Users size={19} />,
      name: 'Contacts Access',
      required: false,
    },
    {
      key: 'camera',
      icon: <Camera size={19} />,
      name: 'Camera & QR Scanner',
      required: false,
    },
    {
      key: 'location',
      icon: <MapPin size={19} />,
      name: 'Location Security',
      required: false,
    },
    {
      key: 'mic',
      icon: <Mic size={19} />,
      name: 'Voice Assistant',
      required: false,
    },
  ];

  const handleGrantPermissions = () => {
    try {
      localStorage.setItem('hasGrantedPermissions', 'true');
    } catch {
      // Ignore
    }
    navigateTo('CUSTOMER_KYC');
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '32px' }}>
      <div>
        <AppHeader title="App Permissions" showBack={true} onBack={goBack} showSettings={false} />

        <div style={{ padding: '20px' }}>
          {/* Header Card - Clean & Minimal */}
          <div
            style={{
              backgroundColor: '#0e274d',
              border: '1px solid #1e3a8a',
              borderRadius: '18px',
              padding: '16px 18px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(46, 131, 255, 0.25)',
                color: '#38bdf8',
                border: '1px solid rgba(46, 131, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
              NPCI Mandated Security
            </div>
          </div>

          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
              paddingLeft: '4px',
            }}
          >
            Device Permissions ({Object.values(toggles).filter(Boolean).length}/6 Granted)
          </div>

          {/* Grouped Permissions Card - Main Items Only */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            {permissions.map((perm, index) => {
              const isOn = toggles[perm.key];
              return (
                <React.Fragment key={perm.key}>
                  {index > 0 && <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: isOn ? '#eef5ff' : '#f8fafc',
                          color: isOn ? '#2e83ff' : '#94a3b8',
                          border: isOn ? '1px solid #d6e6ff' : '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {perm.icon}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                          {perm.name}
                        </span>
                        {perm.required && (
                          <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(46, 131, 255, 0.1)', color: '#2e83ff', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(46, 131, 255, 0.2)' }}>
                            REQUIRED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <div
                      role="switch"
                      aria-checked={isOn}
                      aria-label={perm.name}
                      tabIndex={0}
                      onClick={() => handleToggle(perm.key)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleToggle(perm.key);
                        }
                      }}
                      style={{
                        width: '46px',
                        height: '26px',
                        borderRadius: '9999px',
                        backgroundColor: isOn ? '#2e83ff' : '#cbd5e1',
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
                          transform: isOn ? 'translateX(20px)' : 'translateX(0px)',
                          transition: 'transform 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        }}
                      />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <PrimaryButton onClick={handleGrantPermissions}>
          Allow Permissions & Enter QTPay <ArrowRight size={18} />
        </PrimaryButton>
        <SecondaryButton onClick={handleGrantPermissions}>
          Skip & Customize Later
        </SecondaryButton>

        <div style={{ textAlign: 'center', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={12} color="#64748b" />
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            256-Bit Hardware Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};
