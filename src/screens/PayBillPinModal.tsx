import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { PinPad } from '../components/PinPad';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { authService } from '../services/authService';
import { designSystem } from '../design-system';

export const PayBillPinModal: React.FC = () => {
  const { isPinModalOpen, closePinModal, pendingPaymentData, bankAccounts } = useApp();
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [biometricSuccess, setBiometricSuccess] = useState<boolean>(false);

  const primaryBank = bankAccounts.find((b) => b.isPrimary) || bankAccounts[0];

  if (!pendingPaymentData) return null;

  const isCheckBalance = pendingPaymentData.title.toLowerCase().includes('balance');

  const handlePinComplete = async (pin: string) => {
    setIsVerifying(true);
    setError('');
    try {
      const isValid = await authService.verifyPin(pin);
      if (isValid) {
        closePinModal();
        if (pendingPaymentData.onSuccess) {
          pendingPaymentData.onSuccess();
        }
      } else {
        setError('Incorrect PIN. Please try again.');
      }
    } catch {
      setError('Verification failed. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsVerifying(true);
    setError('');
    // Simulate instant biometric scan
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBiometricSuccess(true);
    setIsVerifying(false);

    setTimeout(() => {
      setBiometricSuccess(false);
      closePinModal();
      if (pendingPaymentData.onSuccess) {
        pendingPaymentData.onSuccess();
      }
    }, 450);
  };

  return (
    <BottomSheet
      isOpen={isPinModalOpen}
      onClose={closePinModal}
      title={isCheckBalance ? 'Verify UPI PIN to Check Balance' : pendingPaymentData.title}
    >
      <div style={{ paddingBottom: '10px' }}>
        {/* Payment / Check Balance Summary Box */}
        <div
          style={{
            backgroundColor: designSystem.colors.surface,
            border: `1px solid ${designSystem.colors.borderHairline}`,
            borderRadius: designSystem.radii.md,
            padding: '16px',
            marginBottom: '18px',
            boxShadow: designSystem.shadows.none,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: designSystem.typography.weights.extrabold, fontSize: '15px', color: designSystem.colors.textPrimary }}>
                {pendingPaymentData.title}
              </div>
              <div style={{ fontSize: '12px', color: designSystem.colors.textSecondary, marginTop: '2px' }}>
                {pendingPaymentData.subTitle}
              </div>
            </div>
            {pendingPaymentData.amount > 0 && !isCheckBalance && (
              <div style={{ fontSize: '20px', fontWeight: designSystem.typography.weights.black, color: designSystem.colors.primary }}>
                {formatCurrency(pendingPaymentData.amount)}
              </div>
            )}
            {isCheckBalance && (
              <div style={{ fontSize: '18px', fontWeight: designSystem.typography.weights.extrabold, color: designSystem.colors.textPrimary, letterSpacing: '4px' }}>
                ••••••••
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: `1px solid ${designSystem.colors.borderHairline}`,
              marginTop: '12px',
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
            }}
          >
            <span style={{ color: designSystem.colors.textSecondary }}>Debiting Account:</span>
            <span style={{ fontWeight: designSystem.typography.weights.bold, color: designSystem.colors.textPrimary }}>
              {primaryBank ? `${primaryBank.bankName} (${primaryBank.accountNumberMasked})` : 'Linked Bank Account'}
            </span>
          </div>
        </div>

        {/* Biometric Instant Authorization Quick Action */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={isVerifying}
            className="interactive-tap"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: biometricSuccess ? '#ecfdf5' : '#eef5ff',
              border: `1.5px solid ${biometricSuccess ? '#10b981' : '#d6e6ff'}`,
              color: biometricSuccess ? '#059669' : '#2e83ff',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {biometricSuccess ? (
              <>
                <CheckCircle2 size={16} color="#10b981" /> Biometric Verified!
              </>
            ) : (
              <>
                <Fingerprint size={16} /> Fast Biometric Authorize
              </>
            )}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: designSystem.typography.weights.extrabold, color: designSystem.colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isVerifying ? 'Verifying Credentials...' : 'OR ENTER 4-DIGIT UPI PIN'}
          </span>
        </div>

        <PinPad length={4} onComplete={handlePinComplete} error={error} />

        <div style={{ textAlign: 'center', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={12} color="#2e83ff" />
          <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>
            NPCI 256-Bit Hardware Encrypted Tunnel
          </span>
        </div>
      </div>
    </BottomSheet>
  );
};
