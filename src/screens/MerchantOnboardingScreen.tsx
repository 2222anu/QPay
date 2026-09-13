import React, { useState } from 'react';
import {
  Store,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Landmark,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';

export const MerchantOnboardingScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [step, setStep] = useState<number>(1); // 1: Business, 2: Store, 3: Settlement, 4: Review

  // Form State
  const [tradeName, setTradeName] = useState('Anu Super Retail');
  const [legalName, setLegalName] = useState('Anu Trading & Retail LLC');
  const [crNumber, setCrNumber] = useState('1010892412');
  const [vatNumber, setVatNumber] = useState('310294819200003');
  const [category, setCategory] = useState('Grocery & Supermarket');

  const [storeAddress, setStoreAddress] = useState('King Fahd Road, Al Olaya District');
  const [city, setCity] = useState('Riyadh');
  const [pincode, setPincode] = useState('12214');

  const [bankAccount, setBankAccount] = useState('SA92 8000 0234 8912 3400 01');
  const [selectedBank, setSelectedBank] = useState('Al Rajhi Bank');
  const [settlementMode, setSettlementMode] = useState<'INSTANT' | 'DAILY'>('INSTANT');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate KYB / Saudi Ministry of Commerce validation
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsApproved(true);

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
        title="Merchant Onboarding"
        showBack
        onBack={() => {
          if (step > 1) setStep(step - 1);
          else navigateTo('HOME');
        }}
      />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 4 ? 1 : 'none' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: step >= s ? '#2e83ff' : '#ffffff',
                  color: step >= s ? '#ffffff' : '#64748b',
                  border: step >= s ? '2px solid #2e83ff' : '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 4 && (
                <div
                  style={{
                    flex: 1,
                    height: '2.5px',
                    backgroundColor: step > s ? '#2e83ff' : '#e2e8f0',
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
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={20} color="#2e83ff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                1. Business & Entity Details
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
                style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Legal Registered Entity Name
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Anu Trading & Retail LLC"
                style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  Commercial Reg. (CR)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="1010892412"
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 800, color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  VAT Number (Optional)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="310294819200003"
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
              >
                <option value="Grocery & Supermarket">Grocery & Supermarket</option>
                <option value="Restaurants & Food Outlets">Restaurants & Food Outlets</option>
                <option value="Retail & Apparel">Retail & Apparel</option>
                <option value="Electronics & Mobile">Electronics & Mobile</option>
                <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                <option value="Services & Consultancy">Services & Consultancy</option>
              </select>
            </div>

            <PrimaryButton onClick={() => setStep(2)}>
              Next: Store Address <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        )}

        {/* Step 2: Store Details */}
        {step === 2 && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Store size={20} color="#2e83ff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                2. Store Physical Location (KSA)
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Store / Shop Address
              </label>
              <textarea
                rows={3}
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  City (Saudi Arabia)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Riyadh"
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="12214"
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 800, color: '#0f172a', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#eef5ff', border: '1px solid #d6e6ff', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>
              <MapPin size={16} color="#2e83ff" />
              <span>Countertop Standee QR code will be shipped to this location.</span>
            </div>

            <PrimaryButton onClick={() => setStep(3)}>
              Next: Settlement Bank <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        )}

        {/* Step 3: Settlement Bank */}
        {step === 3 && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Landmark size={20} color="#2e83ff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                3. Settlement Account Details (Saudi IBAN)
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Bank Name
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
              >
                <option value="Al Rajhi Bank">Al Rajhi Bank</option>
                <option value="Saudi National Bank (SNB)">Saudi National Bank (SNB)</option>
                <option value="Riyad Bank">Riyad Bank</option>
                <option value="Alinma Bank">Alinma Bank</option>
                <option value="Banque Saudi Fransi">Banque Saudi Fransi</option>
                <option value="Arab National Bank">Arab National Bank</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Saudi IBAN
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.toUpperCase())}
                placeholder="SA92 8000 0234 8912 3400 01"
                style={{ width: '100%', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontWeight: 800, color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Payout Frequency
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
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Instant Settlement</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>T+0 Realtime payout</div>
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

            <PrimaryButton onClick={() => setStep(4)}>
              Review Registration <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        )}

        {/* Step 4: Review & Final Verification */}
        {step === 4 && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#2e83ff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                4. Review & Activate Merchant Account
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
                <span style={{ fontSize: '12px', color: '#64748b' }}>Store Location</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{city} ({pincode})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Settlement Bank</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedBank}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Settlement Mode</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#2e83ff' }}>{settlementMode === 'INSTANT' ? 'Instant T+0' : 'Daily Batch'}</span>
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

            <PrimaryButton onClick={handleSubmit} disabled={isSubmitting || isApproved}>
              {isSubmitting ? 'Verifying with Ministry of Commerce...' : 'Submit & Activate Merchant Account'}
            </PrimaryButton>
          </div>
        )}

        <SecondaryButton onClick={() => navigateTo('HOME')}>
          Cancel & Return
        </SecondaryButton>
      </div>
    </div>
  );
};
