import React from 'react';
import { CreditCard, Landmark, Plus, Star, Wifi, ShieldCheck } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';

export const PaymentMethodsScreen: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f9', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader title="Payment Methods" showBack showSettings={false} />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* UPI Accounts Section */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
              marginLeft: '4px',
            }}
          >
            Linked UPI Accounts
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Primary ICICI Bank Card */}
            <div
              onClick={() => navigateTo('BANK_ACCOUNTS')}
              className="interactive-tap"
              style={{
                background: 'linear-gradient(135deg, #071529 0%, #0a2540 55%, #1d4ed8 100%)',
                borderRadius: '16px',
                padding: '16px 18px',
                color: '#ffffff',
                border: '1.5px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 4px 16px rgba(10, 25, 47, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Landmark size={20} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>ICICI Bank Savings</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                    •••• 3616
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(46, 131, 255, 0.3)',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  padding: '4px 9px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Star size={10} fill="#ffffff" color="#ffffff" /> PRIMARY
              </div>
            </div>

            {/* Yes Bank Card */}
            <div
              onClick={() => navigateTo('BANK_ACCOUNTS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#eef5ff',
                    border: '1px solid #d6e6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2e83ff',
                  }}
                >
                  <Landmark size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Yes Bank Savings</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                    •••• 8821
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  color: '#2e83ff',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '4px 9px',
                  borderRadius: '12px',
                }}
              >
                ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Credit & RuPay Cards Section */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
              marginLeft: '4px',
            }}
          >
            Saved Credit & RuPay Cards
          </div>

          <div
            onClick={() => navigateTo('CARDS')}
            className="interactive-tap"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2e83ff',
                }}
              >
                <CreditCard size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>ICICI RuPay Credit Card</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  •••• 9901 &bull; Tap to Open Cards Hub
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wifi size={16} color="#94a3b8" />
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#2e83ff',
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  padding: '3px 8px',
                  borderRadius: '10px',
                }}
              >
                CARDS HUB
              </span>
            </div>
          </div>
        </div>

        {/* Add New Bank / Card Button */}
        <div style={{ marginTop: '8px' }}>
          <PrimaryButton onClick={() => navigateTo('BANK_ACCOUNTS')}>
            <Plus size={18} /> Add New Bank or Card
          </PrimaryButton>
        </div>

        {/* Security Footer */}
        <div style={{ marginTop: '8px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={13} color="#2e83ff" />
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            Tokenized Card Payments &bull; RBI & NPCI Secured
          </span>
        </div>
      </div>
    </div>
  );
};
