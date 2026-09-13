import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Receipt,
  Check,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';
import { softPosService } from '../services/softPosService';
import { formatCurrency, formatDate } from '../utils/formatters';

type CardScheme = 'mada' | 'Visa' | 'Mastercard';
type SoftPosState = 'IDLE' | 'WAITING_CARD' | 'READING_CARD' | 'AUTHORIZING' | 'SUCCESS' | 'DECLINED';

export const SoftPosScreen: React.FC = () => {
  const { navigateTo, addMerchantTxn } = useApp();

  const [amountStr, setAmountStr] = useState<string>('85.00');
  const [selectedScheme, setSelectedScheme] = useState<CardScheme>('mada');
  const [txnState, setTxnState] = useState<SoftPosState>('IDLE');
  const [terminalId, setTerminalId] = useState<string>('TID-QTP-9824');
  const [showReceiptDetails, setShowReceiptDetails] = useState<boolean>(false);

  const [authResult, setAuthResult] = useState<{
    cardBrand: string;
    maskedCard: string;
    authCode: string;
    referenceId: string;
    errorMessage?: string;
  } | null>(null);

  useEffect(() => {
    softPosService.checkDeviceEligibility().then((res) => {
      setTerminalId(res.terminalId);
    });
  }, []);

  const numAmount = parseFloat(amountStr) || 0;

  const handleStartCollect = () => {
    if (numAmount <= 0) return;
    setTxnState('WAITING_CARD');
  };

  const handleSimulateTap = async () => {
    // Step 1: Card detected / Reading card
    setTxnState('READING_CARD');

    setTimeout(() => {
      // Step 2: Authorizing with acquiring network
      setTxnState('AUTHORIZING');

      setTimeout(async () => {
        // Step 3: Result
        const res = await softPosService.simulateCardTap(numAmount);

        if (res.status === 'APPROVED') {
          const resultData = {
            cardBrand: selectedScheme === 'mada' ? 'mada Debit' : selectedScheme,
            maskedCard: res.maskedCard || '•••• 4821',
            authCode: res.authCode || 'AUTH-94812',
            referenceId: res.referenceId || `TXN-${Date.now()}`,
          };
          setAuthResult(resultData);
          setTxnState('SUCCESS');

          // Append to AppContext Merchant Collections
          addMerchantTxn({
            customerName: 'Customer Walk-in',
            time: 'Just now',
            method: `${selectedScheme} Contactless Tap`,
            amount: numAmount,
            status: 'SUCCESS',
            cardScheme: selectedScheme,
          });
        } else {
          setAuthResult({
            cardBrand: selectedScheme,
            maskedCard: '•••• 4821',
            authCode: '',
            referenceId: `TXN-${Date.now()}`,
            errorMessage: res.errorMessage || 'Transaction declined by card issuer.',
          });
          setTxnState('DECLINED');
        }
      }, 900);
    }, 800);
  };

  const handleResetForNextSale = () => {
    setTxnState('IDLE');
    setAuthResult(null);
    setAmountStr('');
    setShowReceiptDetails(false);
  };

  const handleDoneReturn = () => {
    navigateTo('MERCHANT_DASHBOARD');
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader
        title="QTPay SoftPOS Terminal"
        showBack
        onBack={() => {
          if (txnState !== 'IDLE') setTxnState('IDLE');
          else navigateTo('MERCHANT_DASHBOARD');
        }}
      />

      <div style={{ padding: '20px clamp(12px, 3.5vw, 20px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Terminal Header Info Card */}
        <div
          style={{
            backgroundColor: '#071529',
            borderRadius: '16px',
            padding: '16px 18px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              }}
            >
              <Smartphone size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff' }}>
                SoftPOS Terminal
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>
                {terminalId} &bull; SAMA / mada Certified
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(46, 131, 255, 0.25)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              borderRadius: '10px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 800,
            }}
          >
            NFC ACTIVE
          </div>
        </div>

        {/* STATE 1: IDLE - Amount Input & Scheme Selector */}
        {txnState === 'IDLE' && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '24px clamp(14px, 3.5vw, 20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '18px',
            }}
          >
            {/* Prominent SAR Amount Entry */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enter Collection Amount (SAR)
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '10px',
                }}
              >
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#2e83ff' }}>SAR</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  autoFocus
                  className="tabular-nums"
                  style={{
                    fontSize: 'clamp(32px, 8vw, 44px)',
                    fontWeight: 900,
                    color: '#0f172a',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    width: '180px',
                    textAlign: 'center',
                  }}
                />
              </div>
            </div>

            {/* Quick SAR Preset Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['25', '50', '85', '100', '250', '500'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmountStr(val)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: amountStr === val ? '#eef5ff' : '#f8fafc',
                    border: amountStr === val ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                    color: amountStr === val ? '#2e83ff' : '#0f172a',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  SAR {val}
                </button>
              ))}
            </div>

            {/* Card Scheme Selector (mada, Visa, Mastercard) */}
            <div style={{ width: '100%', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px', textAlign: 'left' }}>
                Select Accepted Card Scheme
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {(
                  [
                    { id: 'mada', label: 'mada', sub: 'National' },
                    { id: 'Visa', label: 'Visa', sub: 'Credit / Debit' },
                    { id: 'Mastercard', label: 'Mastercard', sub: 'Credit / Debit' },
                  ] as const
                ).map((scheme) => {
                  const isSelected = selectedScheme === scheme.id;
                  return (
                    <div
                      key={scheme.id}
                      onClick={() => setSelectedScheme(scheme.id)}
                      className="interactive-tap"
                      style={{
                        backgroundColor: isSelected ? '#eef5ff' : '#f8fafc',
                        border: isSelected ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '10px 6px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 900, color: isSelected ? '#2e83ff' : '#0f172a' }}>
                          {scheme.label}
                        </span>
                        {isSelected && <Check size={13} color="#2e83ff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '9.5px', color: isSelected ? '#2e83ff' : '#64748b', fontWeight: 600 }}>
                        {scheme.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collect Now Primary CTA */}
            <div style={{ width: '100%', marginTop: '8px' }}>
              <PrimaryButton onClick={handleStartCollect} disabled={numAmount <= 0}>
                Collect {formatCurrency(numAmount)} <ArrowRight size={18} />
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* STATE 2: WAITING_CARD - NFC Radar / Prompt */}
        {txnState === 'WAITING_CARD' && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '32px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated Contactless Waves */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#eef5ff',
                border: '2px solid #2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2e83ff',
                marginBottom: '20px',
                position: 'relative',
              }}
            >
              <Wifi size={54} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Hold Card or Phone to Tap
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', maxWidth: '280px', lineHeight: 1.4 }}>
              Ask the customer to tap their {selectedScheme} contactless card or Apple / Google Pay against the back of this phone.
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 24px',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Amount to Collect
              </span>
              <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                {formatCurrency(numAmount)}
              </div>
              <div style={{ fontSize: '11px', color: '#2e83ff', fontWeight: 700, marginTop: '2px' }}>
                Card Scheme: {selectedScheme}
              </div>
            </div>

            {/* Tap Simulation Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
              <PrimaryButton onClick={handleSimulateTap}>
                <Wifi size={18} /> Simulate Contactless Tap
              </PrimaryButton>
              <SecondaryButton onClick={() => setTxnState('IDLE')}>
                Cancel Transaction
              </SecondaryButton>
            </div>
          </div>
        )}

        {/* STATE 3: READING_CARD */}
        {txnState === 'READING_CARD' && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #2e83ff',
              }}
            >
              <Wifi size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                Reading Contactless Card...
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Do not remove card. Interacting with EMV NFC chip.
              </p>
            </div>
          </div>
        )}

        {/* STATE 4: AUTHORIZING */}
        {txnState === 'AUTHORIZING' && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #2e83ff',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                Authorizing with SAMA Switch...
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Routing secure token to {selectedScheme} payment network.
              </p>
            </div>
          </div>
        )}

        {/* STATE 5: PAYMENT RECEIVED / SUCCESS */}
        {txnState === 'SUCCESS' && authResult && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #2e83ff',
              borderRadius: '20px',
              padding: '26px clamp(14px, 3.5vw, 20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  border: '2px solid #2e83ff',
                }}
              >
                <CheckCircle2 size={34} color="#2e83ff" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                ✓ Payment Received
              </h2>
              <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '6px 0' }}>
                {formatCurrency(numAmount)}
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981', backgroundColor: '#ecfdf5', padding: '3px 10px', borderRadius: '10px' }}>
                Collection Settled to Account
              </span>
            </div>

            {/* Compact Transaction Meta */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12.5px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Scheme</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{authResult.cardBrand}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Card Number</span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>{authResult.maskedCard}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Auth Code</span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#2e83ff' }}>{authResult.authCode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Terminal ID</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>{terminalId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Timestamp</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatDate(new Date())}</span>
              </div>
            </div>

            {/* 3 Explicit Production Actions: Done, Collect Again, View Receipt */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <PrimaryButton onClick={handleDoneReturn}>
                Done &bull; Return to Collections
              </PrimaryButton>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <SecondaryButton onClick={handleResetForNextSale}>
                  <RotateCcw size={15} /> Collect Again
                </SecondaryButton>
                <SecondaryButton onClick={() => setShowReceiptDetails(!showReceiptDetails)}>
                  <Receipt size={15} /> {showReceiptDetails ? 'Hide Receipt' : 'View Receipt'}
                </SecondaryButton>
              </div>
            </div>
          </div>
        )}

        {/* STATE 6: DECLINED */}
        {txnState === 'DECLINED' && authResult && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #fca5a5',
              borderRadius: '20px',
              padding: '28px clamp(14px, 3.5vw, 20px)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <AlertCircle size={48} color="#ef4444" />
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#991b1b', margin: 0 }}>
              Payment Declined
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              {authResult.errorMessage || 'Transaction was declined by the card issuer.'}
            </p>
            <PrimaryButton onClick={handleResetForNextSale}>
              <RotateCcw size={16} /> Try Another Card
            </PrimaryButton>
          </div>
        )}

        {/* Security & Regulatory Disclaimer Footer */}
        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            <ShieldCheck size={13} color="#2e83ff" />
            <span>PCI-CPoC / EMVCo / SAMA Standard Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
};
