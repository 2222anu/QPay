import React, { useState } from 'react';
import { User as UserIcon, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { QtPayLogo } from '../components/QtPayLogo';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, user, updateUser, setIsLanguageModalOpen, language } = useApp();
  const [fullName, setFullName] = useState<string>(user.name || 'Anu');
  const [mobileNumber, setMobileNumber] = useState<string>('501234567');

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mobileNumber.length >= 9 && fullName.trim().length > 0) {
      updateUser({ name: fullName, mobile: `+966 ${mobileNumber}` });
      navigateTo('SMS_OTP', { mobile: mobileNumber, name: fullName });
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 20px 32px 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header Bar with Language Switcher */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {/* Logo with themeMode="light" for clear visibility on light background */}
          <QtPayLogo variant="horizontal" size={26} themeMode="light" showTagline={false} />
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="interactive-tap"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <span>🌐</span>
            <span>{language}</span>
          </button>
        </div>

        {/* Security Tag Header */}
        <div
          style={{
            backgroundColor: '#0e274d',
            borderRadius: '18px',
            padding: '18px 20px',
            color: '#ffffff',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(14, 39, 77, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: 'rgba(46, 131, 255, 0.25)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#ffffff' }}>UPI Device Registration</div>
          </div>
        </div>

        {/* Main Input Form Card - Simple, Clean, Streamlined (No SIM selector clutter) */}
        <form
          onSubmit={handleContinue}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Full Name Input */}
          <div>
            <label
              htmlFor="name-input"
              style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Full Name</span>
              <span style={{ color: '#2e83ff', textTransform: 'none', fontWeight: 700 }}>As per bank records</span>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '12px 14px',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  flexShrink: 0,
                }}
              >
                <UserIcon size={16} />
              </div>
              <input
                id="name-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0f172a',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Mobile Number Input with +966 Country Badge */}
          <div>
            <label
              htmlFor="mobile-input"
              style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Mobile Number
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #2e83ff',
                borderRadius: '12px',
                padding: '10px 14px',
              }}
            >
              {/* Country Flag Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  marginRight: '10px',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '15px' }}>🇸🇦</span>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#2e83ff' }}>+966</span>
              </div>
              <input
                id="mobile-input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={10}
                placeholder="501234567"
                required
                className="tabular-nums"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#0f172a',
                  width: '100%',
                  letterSpacing: '0.05em',
                }}
              />
            </div>
          </div>



          <PrimaryButton type="submit" disabled={mobileNumber.length < 9 || fullName.trim().length === 0}>
            Get OTP Verification Code <ArrowRight size={18} />
          </PrimaryButton>
        </form>
      </div>

      {/* Security Trust Badges Footer */}
      <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
          <Lock size={12} color="#2e83ff" />
          <span>SAMA & Saudi Payments Certified &bull; 256-Bit Hardware Encryption</span>
        </div>
      </div>
    </div>
  );
};
