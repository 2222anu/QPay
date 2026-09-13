import React, { useState } from 'react';
import { ShieldCheck, UserCheck, ArrowRight, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';

export const CustomerKycScreen: React.FC = () => {
  const { navigateTo, user, updateUser } = useApp();

  const [panNumber, setPanNumber] = useState<string>('ABCDE1234F');
  const [dob, setDob] = useState<string>('1998-05-15');
  const [aadhaarLast4, setAadhaarLast4] = useState<string>('8921');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [kycVerified, setKycVerified] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleVerifyPAN = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    // Validate PAN format: 5 uppercase letters, 4 digits, 1 uppercase letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const cleanPan = panNumber.toUpperCase().trim();

    if (!panRegex.test(cleanPan)) {
      setValidationError('Invalid PAN format. Must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).');
      return;
    }

    setIsVerifying(true);
    // Simulate real-time NSDL / Income Tax verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsVerifying(false);
    setKycVerified(true);

    updateUser({ name: user.name || 'Anu' });

    setTimeout(() => {
      navigateTo('CUSTOMER_PIN_SETUP');
    }, 600);
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
        <AppHeader title="Identity & KYC" showBack showSettings={false} />

        <div style={{ padding: '20px' }}>
          {/* NPCI Verified Banner */}
          <div
            style={{
              backgroundColor: '#071529',
              borderRadius: '16px',
              padding: '16px 18px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(46, 131, 255, 0.25)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff' }}>
                RBI & NPCI Mandated KYC
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                Quick 30-second digital verification
              </div>
            </div>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleVerifyPAN}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '22px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Full Name Display */}
            <div>
              <label
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
                Full Legal Name
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                <UserCheck size={18} color="#2e83ff" />
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                  {user.name || 'Anu'}
                </span>
              </div>
            </div>

            {/* Permanent Account Number (PAN) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="pan-input"
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  PAN Card Number
                </label>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2e83ff' }}>Instant Verification</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#f8fafc',
                  border: validationError ? '1.5px solid #ef4444' : '1.5px solid #2e83ff',
                  borderRadius: '12px',
                  padding: '10px 14px',
                }}
              >
                <FileText size={18} color="#2e83ff" />
                <input
                  id="pan-input"
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => {
                    setPanNumber(e.target.value.toUpperCase());
                    setValidationError(null);
                  }}
                  placeholder="ABCDE1234F"
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#0f172a',
                    width: '100%',
                    textTransform: 'uppercase',
                  }}
                />
              </div>
              {validationError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '11px', fontWeight: 600, marginTop: '6px' }}>
                  <AlertCircle size={12} />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob-input"
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
                Date of Birth (As per PAN)
              </label>
              <input
                id="dob-input"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            {/* Aadhaar Last 4 Digits */}
            <div>
              <label
                htmlFor="aadhaar-input"
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
                Aadhaar Number (Last 4 Digits)
              </label>
              <input
                id="aadhaar-input"
                type="text"
                maxLength={4}
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="8921"
                className="tabular-nums"
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '16px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            {kycVerified && (
              <div
                style={{
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2e83ff',
                }}
              >
                <CheckCircle2 size={18} color="#2e83ff" />
                <span style={{ fontSize: '12.5px', fontWeight: 700 }}>
                  PAN & Identity Verified with NSDL Database!
                </span>
              </div>
            )}

            <PrimaryButton type="submit" disabled={isVerifying || panNumber.length < 10}>
              {isVerifying ? 'Verifying Identity...' : 'Verify & Continue'} <ArrowRight size={18} />
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
};
