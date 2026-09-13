import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';
import { softPosService } from '../services/softPosService';
import type { SoftPosTxnState } from '../types/fintech';
import { formatCurrency, formatDate } from '../utils/formatters';

export const SoftPosScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [amountStr, setAmountStr] = useState<string>('500');
  const [txnState, setTxnState] = useState<SoftPosTxnState>('IDLE');
  const [terminalId, setTerminalId] = useState<string>('TID-QTP-9824');
  const [authResult, setAuthResult] = useState<{
    cardBrand?: string;
    maskedCard?: string;
    authCode?: string;
    referenceId?: string;
    errorMessage?: string;
  } | null>(null);

  useEffect(() => {
    softPosService.checkDeviceEligibility().then((res) => {
      setTerminalId(res.terminalId);
    });
  }, []);

  const numAmount = parseFloat(amountStr) || 0;

  const handleStartTap = () => {
    if (numAmount <= 0) return;
    setTxnState('WAITING_CARD');
  };

  const handleSimulateTap = async () => {
    setTxnState('CARD_DETECTED');

    // If above SAR 500, PIN is required on glass
    if (numAmount > 500) {
      setTimeout(() => {
        setTxnState('PIN_REQUIRED');
      }, 700);
      return;
    }

    proceedAuthorization();
  };

  const proceedAuthorization = async () => {
    setTxnState('AUTHORIZING');
    const result = await softPosService.simulateCardTap(numAmount);

    setAuthResult(result);
    if (result.status === 'APPROVED') {
      setTxnState('APPROVED');
    } else if (result.status === 'DECLINED') {
      setTxnState('DECLINED');
    } else {
      setTxnState('TIMEOUT');
    }
  };

  const handleReset = () => {
    setTxnState('IDLE');
    setAuthResult(null);
    setAmountStr('');
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader title="QTPay SoftPOS Terminal" showBack onBack={() => navigateTo('MERCHANT_DASHBOARD')} />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(46, 131, 255, 0.25)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Smartphone size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff' }}>
                SoftPOS Terminal
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>
                {terminalId} &bull; NFC Active
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
            SIMULATION MODE
          </div>
        </div>

        {/* State 1: IDLE - Amount Input Keypad */}
        {txnState === 'IDLE' && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '18px',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enter Sale Amount
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  marginTop: '10px',
                }}
              >
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#2e83ff' }}>SAR</span>
                <input
                  type="number"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="tabular-nums"
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#0f172a',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    width: '200px',
                    textAlign: 'center',
                  }}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['50', '100', '250', '500', '1200'].map((val) => (
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

            <div style={{ width: '100%', marginTop: '8px' }}>
              <PrimaryButton onClick={handleStartTap} disabled={numAmount <= 0}>
                Collect {formatCurrency(numAmount)} <ArrowRight size={18} />
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* State 2: WAITING_CARD - NFC Radar Animation */}
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
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0', maxWidth: '280px' }}>
              Ask the customer to tap their contactless card or device against the back of this phone.
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 24px',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Sale Amount
              </span>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a' }}>
                {formatCurrency(numAmount)}
              </div>
            </div>

            {/* Tap Simulation Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
              <PrimaryButton onClick={handleSimulateTap}>
                <Wifi size={18} /> Simulate Contactless Tap
              </PrimaryButton>
              <SecondaryButton onClick={handleReset}>
                Cancel Transaction
              </SecondaryButton>
            </div>
          </div>
        )}

        {/* State 3: PIN_REQUIRED (for amounts > SAR 500) */}
        {txnState === 'PIN_REQUIRED' && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <ShieldCheck size={28} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              PIN Required on Glass
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '20px' }}>
              Amount ({formatCurrency(numAmount)}) exceeds the SAR 500 contactless limit without PIN.
            </p>

            <PrimaryButton onClick={proceedAuthorization}>
              Authorize with Card PIN
            </PrimaryButton>
          </div>
        )}

        {/* State 4: AUTHORIZING */}
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
              gap: '14px',
            }}
          >
            <Clock size={44} className="spin-slow" color="#2e83ff" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Authorizing EMV Contactless Card...
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Communicating with acquiring bank network
            </span>
          </div>
        )}

        {/* State 5: APPROVED - Digital Receipt */}
        {txnState === 'APPROVED' && authResult && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #2e83ff',
              borderRadius: '20px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  border: '1.5px solid #d6e6ff',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                Payment Approved
              </h2>
              <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: '6px 0' }}>
                {formatCurrency(numAmount)}
              </div>
            </div>

            {/* Receipt Table */}
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
                <span style={{ color: '#64748b' }}>Payment Mode</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{authResult.cardBrand}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Card Number</span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>{authResult.maskedCard}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Auth Approval Code</span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#2e83ff' }}>{authResult.authCode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Terminal ID</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>{terminalId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Date & Time</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatDate(new Date())}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <PrimaryButton onClick={handleReset}>
                <RotateCcw size={16} /> New Sale
              </PrimaryButton>
              <SecondaryButton onClick={handleReset}>
                <Share2 size={16} /> SMS Receipt
              </SecondaryButton>
            </div>
          </div>
        )}

        {/* State 6: DECLINED */}
        {txnState === 'DECLINED' && authResult && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #fca5a5',
              borderRadius: '20px',
              padding: '28px 20px',
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
              {authResult.errorMessage || 'Transaction was declined by the issuer.'}
            </p>
            <PrimaryButton onClick={handleReset}>
              <RotateCcw size={16} /> Try Another Card
            </PrimaryButton>
          </div>
        )}

        {/* Security & Disclaimer Footer */}
        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            <ShieldCheck size={13} color="#2e83ff" />
            <span>PCI-CPoC / EMVCo Standard Architecture Boundary &bull; Protected Sandbox</span>
          </div>
        </div>
      </div>
    </div>
  );
};
