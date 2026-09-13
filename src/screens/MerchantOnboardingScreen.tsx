import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Landmark,
  Lock,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { PinPad } from '../components/PinPad';
import { useApp } from '../state/AppContext';

const BUSINESS_CATEGORIES = [
  'Grocery',
  'Food & Drink',
  'Retail',
  'Electronics',
  'Fuel',
  'Services',
  'Pharmacy',
  'Other',
];

const SAUDI_BANKS = [
  { id: 'alrajhi', name: 'Al Rajhi Bank', short: 'Rajhi' },
  { id: 'snb', name: 'Saudi National Bank (SNB)', short: 'SNB' },
  { id: 'riyad', name: 'Riyad Bank', short: 'Riyad' },
  { id: 'alinma', name: 'Alinma Bank', short: 'Alinma' },
  { id: 'fransi', name: 'Banque Saudi Fransi', short: 'BSF' },
  { id: 'anb', name: 'Arab National Bank', short: 'ANB' },
];

export const MerchantOnboardingScreen: React.FC = () => {
  const { navigateTo, updateMerchantProfile, setAccountRole } = useApp();

  const [step, setStep] = useState<number>(1); // 1: Business, 2: Bank, 3: PIN, 4: Approved

  // Form State
  const [tradeName, setTradeName] = useState('Anu Super Retail');
  const [legalName, setLegalName] = useState('Anu Trading & Retail LLC');
  const [category, setCategory] = useState('Grocery');
  const [city, setCity] = useState('Riyadh');
  const [crNumber, setCrNumber] = useState('1010892412');

  const [selectedBank, setSelectedBank] = useState('Al Rajhi Bank');
  const [bankAccount, setBankAccount] = useState('SA92 8000 0234 8912 3400 01');
  const [settlementMode, setSettlementMode] = useState<'INSTANT' | 'DAILY'>('INSTANT');

  // PIN Setup State
  const [pinStep, setPinStep] = useState<'ENTER' | 'CONFIRM'>('ENTER');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handlePinComplete = (pin: string) => {
    setPinError(undefined);
    if (pinStep === 'ENTER') {
      setEnteredPin(pin);
      setPinStep('CONFIRM');
    } else {
      if (pin === enteredPin) {
        setStep(4);
      } else {
        setPinError('PINs do not match. Please try again.');
        setPinStep('ENTER');
        setEnteredPin('');
      }
    }
  };

  const handleActivate = async () => {
    setIsSubmitting(true);
    // Simulate Ministry of Commerce / SAMA registration
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsApproved(true);

    updateMerchantProfile({
      tradeName: tradeName.trim() || 'Anu Super Retail',
      legalName: legalName.trim() || 'Anu Trading & Retail LLC',
      crNumber: crNumber.trim() || '1010892412',
      category,
      city: `${city.trim() || 'Riyadh'}, Saudi Arabia`,
      bankName: selectedBank,
      ibanMasked: `${bankAccount.slice(0, 9)} •••• •••• ${bankAccount.slice(-6)}`,
      merchantUpi: `${tradeName.toLowerCase().replace(/[^a-z0-9]/g, '')}@qtpay`,
      settlementMode,
    });

    setAccountRole('MERCHANT');

    try {
      localStorage.setItem('isMerchantApproved', 'true');
    } catch {
      // Ignore
    }

    setTimeout(() => {
      navigateTo('MERCHANT_DASHBOARD');
    }, 800);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader
        title="Merchant Business Setup"
        showBack
        onBack={() => {
          if (step > 1 && step < 4) setStep(step - 1);
          else navigateTo('HOME');
        }}
      />

      <div style={{ padding: '20px clamp(12px, 3.5vw, 20px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[
            { num: 1, label: 'Business' },
            { num: 2, label: 'Bank' },
            { num: 3, label: 'PIN' },
            { num: 4, label: 'Activate' },
          ].map((s) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: s.num < 4 ? 1 : 'none' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: step >= s.num ? '#2e83ff' : '#ffffff',
                  color: step >= s.num ? '#ffffff' : '#64748b',
                  border: step >= s.num ? '2px solid #2e83ff' : '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              {s.num < 4 && (
                <div
                  style={{
                    flex: 1,
                    height: '2.5px',
                    backgroundColor: step > s.num ? '#2e83ff' : '#e2e8f0',
                    margin: '0 6px',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Business Details */}
        {step === 1 && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px clamp(14px, 3.5vw, 20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={20} color="#2e83ff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                1. Business &amp; Entity Profile
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Store / Trade Name
              </label>
              <input
                type="text"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                placeholder="e.g. Anu Super Retail"
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Legal Registered Name
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Anu Trading & Retail LLC"
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            {/* Business Category Selection Chips */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Business Category
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {BUSINESS_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className="interactive-tap"
                      style={{
                        backgroundColor: isSelected ? '#eef5ff' : '#f8fafc',
                        border: isSelected ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                        color: isSelected ? '#2e83ff' : '#475569',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  City (KSA)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Riyadh"
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  CR Number (10 Digits)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="1010892412"
                  className="tabular-nums"
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <PrimaryButton onClick={() => setStep(2)} disabled={!tradeName || crNumber.length < 5}>
              Continue to Settlement Bank <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        )}

        {/* Step 2: Settlement Bank Selection */}
        {step === 2 && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px clamp(14px, 3.5vw, 20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Landmark size={20} color="#2e83ff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                2. Settlement Bank (Saudi Arabia)
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Select Saudi Settlement Bank
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {SAUDI_BANKS.map((b) => {
                  const isSelected = selectedBank === b.name;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBank(b.name)}
                      className="interactive-tap"
                      style={{
                        backgroundColor: isSelected ? '#eef5ff' : '#f8fafc',
                        border: isSelected ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#2e83ff' : '#0f172a' }}>
                        {b.short}
                      </span>
                      {isSelected && <CheckCircle2 size={14} color="#2e83ff" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Saudi IBAN Account
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.toUpperCase())}
                placeholder="SA92 8000 0234 8912 3400 01"
                className="tabular-nums"
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#0f172a',
                  outline: 'none',
                  letterSpacing: '0.04em',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Settlement Cadence
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setSettlementMode('INSTANT')}
                  className="interactive-tap"
                  style={{
                    backgroundColor: settlementMode === 'INSTANT' ? '#eef5ff' : '#f8fafc',
                    border: settlementMode === 'INSTANT' ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Instant T+0</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Realtime daily payout</div>
                </div>

                <div
                  onClick={() => setSettlementMode('DAILY')}
                  className="interactive-tap"
                  style={{
                    backgroundColor: settlementMode === 'DAILY' ? '#eef5ff' : '#f8fafc',
                    border: settlementMode === 'DAILY' ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Daily Batch</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Next morning 2:00 AM</div>
                </div>
              </div>
            </div>

            <PrimaryButton onClick={() => setStep(3)}>
              Continue to PIN Setup <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        )}

        {/* Step 3: PIN / Security Confirmation */}
        {step === 3 && (
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
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #d6e6ff',
              }}
            >
              <Lock size={26} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {pinStep === 'ENTER' ? 'Set 4-Digit Merchant PIN' : 'Confirm 4-Digit Merchant PIN'}
            </h3>

            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, maxWidth: '280px' }}>
              {pinStep === 'ENTER'
                ? 'Create a secure 4-digit PIN for merchant collections, refunds, and bank settlements.'
                : 'Re-enter your 4-digit PIN to confirm.'}
            </p>

            <PinPad onComplete={handlePinComplete} error={pinError} length={4} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              <ShieldCheck size={13} color="#2e83ff" />
              <span>SAMA &amp; Saudi Payments 256-Bit Hardware Encryption</span>
            </div>
          </div>
        )}

        {/* Step 4: Review & Final Activation */}
        {step === 4 && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px clamp(14px, 3.5vw, 20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#2e83ff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                4. Review &amp; Activate Account
              </h3>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Trade Name</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{tradeName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>CR Number</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{crNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Category</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>City</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{city}, Saudi Arabia</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Settlement Bank</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedBank}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Payout Mode</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#2e83ff' }}>
                  {settlementMode === 'INSTANT' ? 'Instant T+0' : 'Daily Batch'}
                </span>
              </div>
            </div>

            {isApproved && (
              <div
                style={{
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#2e83ff',
                }}
              >
                <CheckCircle2 size={20} color="#2e83ff" />
                <span style={{ fontSize: '13px', fontWeight: 800 }}>
                  Merchant Account Approved &amp; Activated!
                </span>
              </div>
            )}

            <PrimaryButton onClick={handleActivate} disabled={isSubmitting || isApproved}>
              {isSubmitting ? 'Validating with SAMA / Ministry of Commerce...' : 'Activate & Enter Merchant Dashboard'}
            </PrimaryButton>
          </div>
        )}

        <SecondaryButton onClick={() => navigateTo('HOME')}>
          Cancel &amp; Return to Home
        </SecondaryButton>
      </div>
    </div>
  );
};
