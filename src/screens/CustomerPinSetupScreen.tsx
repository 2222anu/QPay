import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PinPad } from '../components/PinPad';
import { useApp } from '../state/AppContext';

export const CustomerPinSetupScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [step, setStep] = useState<'ENTER_NEW' | 'CONFIRM_NEW'>('ENTER_NEW');
  const [newPin, setNewPin] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isDone, setIsDone] = useState<boolean>(false);

  const handlePinSubmit = (enteredPin: string) => {
    setError(undefined);

    if (step === 'ENTER_NEW') {
      setNewPin(enteredPin);
      setStep('CONFIRM_NEW');
    } else {
      if (enteredPin === newPin) {
        setIsDone(true);
        setTimeout(() => {
          navigateTo('CUSTOMER_SECURITY_SETUP');
        }, 600);
      } else {
        setError('PINs do not match. Please re-enter.');
        setStep('ENTER_NEW');
        setNewPin('');
      }
    }
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
        <AppHeader title="Setup UPI PIN" showBack={step === 'CONFIRM_NEW'} onBack={() => setStep('ENTER_NEW')} showSettings={false} />

        <div style={{ padding: '20px', textAlign: 'center' }}>
          {/* Top Security Emblem */}
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
              margin: '0 auto 16px auto',
              border: '1.5px solid #d6e6ff',
            }}
          >
            <Lock size={26} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            {step === 'ENTER_NEW' ? 'Set 4-Digit UPI PIN' : 'Re-enter UPI PIN to Confirm'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', fontWeight: 500 }}>
            {step === 'ENTER_NEW'
              ? 'This PIN will authorize all payments and bank transfers'
              : 'Make sure this matches the PIN you just entered'}
          </p>

          {/* White Card with PinPad */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {isDone ? (
              <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={48} color="#10b981" />
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  UPI PIN Created Securely!
                </span>
              </div>
            ) : (
              <PinPad length={4} onComplete={handlePinSubmit} error={error} />
            )}
          </div>
        </div>
      </div>

      {/* Security Tip Footer */}
      <div style={{ padding: '0 20px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#eef5ff',
            border: '1px solid #d6e6ff',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '11.5px',
            color: '#0f172a',
            fontWeight: 700,
          }}
        >
          <ShieldCheck size={14} color="#2e83ff" />
          <span>Never share your UPI PIN with anyone, including bank officials.</span>
        </div>
      </div>
    </div>
  );
};
