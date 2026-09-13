import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Smartphone, User, Store, ShieldCheck, ChevronRight } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';

export const SmsOtpScreen: React.FC = () => {
  const { navigateTo, screenParams, setAccountRole } = useApp();
  const mobile = screenParams.mobile || '501234567';

  const [otp, setOtp] = useState<string[]>(['5', '8', '9', '2', '0', '4']);
  const [timer, setTimer] = useState(28);
  const [isResent, setIsResent] = useState(false);
  const [isAccountTypeModalOpen, setIsAccountTypeModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    setIsAccountTypeModalOpen(true);
  };

  const handleSelectCustomer = () => {
    setAccountRole('CUSTOMER');
    setIsAccountTypeModalOpen(false);
    navigateTo('PERMISSIONS');
  };

  const handleSelectMerchant = () => {
    setAccountRole('MERCHANT');
    setIsAccountTypeModalOpen(false);
    navigateTo('MERCHANT_ONBOARDING');
  };

  const handleResend = () => {
    setTimer(30);
    setIsResent(true);
    setTimeout(() => setIsResent(false), 3000);
  };

  const handleAutofillDemo = () => {
    setOtp(['5', '8', '9', '2', '0', '4']);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '32px' }}>
      <div>
        <AppHeader title="OTP Verification" showBack showSettings={false} />

        <div style={{ padding: '20px' }}>
          {/* Main Verification Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Top Emblem & Header */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto',
                  border: '1.5px solid #d6e6ff',
                }}
              >
                <Smartphone size={28} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                Verify Mobile Number
              </h2>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eef5ff', border: '1px solid #d6e6ff', padding: '4px 14px', borderRadius: '12px' }}>
                <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 800, color: '#2e83ff' }}>
                  +966 {mobile}
                </span>
              </div>
            </div>

            {/* 6-Digit OTP Input Boxes */}
            <div style={{ display: 'flex', gap: 'clamp(4px, 1.5vw, 8px)', justifyContent: 'center', width: '100%' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const newOtp = [...otp];
                    newOtp[i] = val;
                    setOtp(newOtp);
                  }}
                  className="tabular-nums"
                  style={{
                    width: 'clamp(36px, 9.5vw, 42px)',
                    height: 'clamp(46px, 12vw, 52px)',
                    minWidth: 0,
                    borderRadius: '12px',
                    backgroundColor: digit ? '#eef5ff' : '#f8fafc',
                    border: digit ? '2px solid #2e83ff' : '1.5px solid #cbd5e1',
                    fontSize: '19px',
                    fontWeight: 900,
                    color: '#0f172a',
                    textAlign: 'center',
                    outline: 'none',
                    padding: 0,
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                  }}
                />
              ))}
            </div>

            {/* Auto-Detect Success Pill Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#eef5ff',
                border: '1px solid #d6e6ff',
                padding: '10px 14px',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#2e83ff" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0e274d' }}>
                  Auto-Detected (589204)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="interactive-tap"
                style={{
                  backgroundColor: '#2e83ff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Refill
              </button>
            </div>

            {/* Resend Link & Timer */}
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              Didn't receive SMS?{' '}
              <button
                disabled={timer > 0}
                onClick={handleResend}
                className="interactive-tap"
                style={{
                  background: 'none',
                  border: 'none',
                  color: timer > 0 ? '#94a3b8' : '#2e83ff',
                  fontWeight: 800,
                  cursor: timer > 0 ? 'not-allowed' : 'pointer',
                  padding: 0,
                }}
              >
                Resend OTP {timer > 0 ? `(00:${timer < 10 ? `0${timer}` : timer}s)` : ''}
              </button>
            </div>

            {isResent && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#2e83ff', fontWeight: 700 }}>
                ✓ New 6-digit code dispatched to +966 {mobile}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div style={{ padding: '0 20px' }}>
        <PrimaryButton onClick={handleVerify} disabled={otp.some((d) => !d)}>
          Verify &amp; Continue <ArrowRight size={18} />
        </PrimaryButton>
      </div>

      {/* Account Type Selection Modal Sheet */}
      <Modal
        isOpen={isAccountTypeModalOpen}
        onClose={() => setIsAccountTypeModalOpen(false)}
        title="Select Account Type"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '6px 0' }}>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 4px 0', lineHeight: 1.4 }}>
            Choose how you wish to operate QTPay. You can also switch modes anytime from profile settings.
          </p>

          {/* Option 1: Personal Customer */}
          <div
            onClick={handleSelectCustomer}
            className="interactive-tap"
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={22} color="#0f172a" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    Personal Customer
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                  Pay via UPI QR, send money, recharge bills, and view personal spent analysis
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
          </div>

          {/* Option 2: Merchant Business */}
          <div
            onClick={handleSelectMerchant}
            className="interactive-tap"
            style={{
              backgroundColor: '#f0f7ff',
              border: '1.5px solid #2e83ff',
              borderRadius: '16px',
              padding: '16px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#2e83ff',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Store size={22} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    Merchant Business
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#2e83ff', backgroundColor: '#eef5ff', border: '1px solid #d6e6ff', padding: '1px 6px', borderRadius: '8px' }}>
                    SoftPOS Tap
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px', lineHeight: 1.3 }}>
                  Collect card taps (mada/Visa/MC), countertop QR, real-time sales &amp; instant bank settlement
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#2e83ff" style={{ flexShrink: 0 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            <ShieldCheck size={13} color="#2e83ff" />
            <span>SAMA &amp; Saudi Payments Regulated Boundary</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
