import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';

// Realistic EMV Chip Graphic strictly using QPay Brand Palette
const EmvChip: React.FC<{ variant?: 'sapphire' | 'silver' }> = ({ variant = 'sapphire' }) => {
  const isSapphire = variant === 'sapphire';
  return (
    <svg width="34" height="25" viewBox="0 0 34 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '5px', overflow: 'hidden', flexShrink: 0 }}>
      <rect width="34" height="25" rx="5" fill={isSapphire ? '#0f274d' : '#f1f5f9'} />
      <rect x="0.5" y="0.5" width="33" height="24" rx="4.5" stroke={isSapphire ? '#38bdf8' : '#cbd5e1'} strokeOpacity={isSapphire ? '0.7' : '0.9'} />
      {/* Circuit Traces */}
      <path d="M0 12.5H11M23 12.5H34M11 6V19M23 6V19M11 9.5H17M11 15.5H17M23 9.5H17M23 15.5H17M17 6V19" stroke={isSapphire ? '#38bdf8' : '#94a3b8'} strokeWidth="1" />
      <circle cx="17" cy="12.5" r="2.5" fill={isSapphire ? '#2e83ff' : '#cbd5e1'} />
    </svg>
  );
};

// Contactless NFC Waves Icon
const ContactlessIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#ffffff', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(90deg)', flexShrink: 0 }}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill={color} />
  </svg>
);

export const BankAccountsScreen: React.FC = () => {
  const { bankAccounts, toggleShowBalance, setPrimaryBank, removeBankAccount, setIsAddBankModalOpen, openPinModal } = useApp();
  const [bankToRemove, setBankToRemove] = useState<string | null>(null);

  const confirmRemove = () => {
    if (bankToRemove) {
      removeBankAccount(bankToRemove);
      setBankToRemove(null);
    }
  };

  const handleBalanceCheck = (bank: typeof bankAccounts[0]) => {
    if (bank.showBalance) {
      toggleShowBalance(bank.id);
    } else {
      openPinModal({
        title: `Check ${bank.bankName} Balance`,
        subTitle: `${bank.accountType} • ${bank.accountNumberMasked}`,
        amount: bank.balance,
        onSuccess: () => toggleShowBalance(bank.id),
      });
    }
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f9', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader title="Bank Accounts" showBack showSettings />

      <div style={{ padding: '16px 20px' }}>
        {/* Top Summary Banner */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '16px 18px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                border: '1px solid #d6e6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Landmark size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  Linked UPI Accounts
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#2e83ff',
                    backgroundColor: '#eef5ff',
                    border: '1px solid #d6e6ff',
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {bankAccounts.length} Active
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} color="#2e83ff" />
                <span>NPCI / BHIM UPI Secured</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddBankModalOpen(true)}
            className="interactive-tap"
            style={{
              backgroundColor: '#2e83ff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '9px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 8px rgba(46, 131, 255, 0.25)',
            }}
          >
            <Plus size={15} /> Add Bank
          </button>
        </div>

        {/* Bank Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
          {bankAccounts.map((bank) => {
            const rawNumbers = bank.accountNumberMasked.replace(/[^0-9]/g, '') || '3616';

            // PRIMARY BANK CARD MODEL: Luxury Midnight Sapphire Fintech Card
            if (bank.isPrimary) {
              return (
                <div
                  key={bank.id}
                  style={{
                    background: 'linear-gradient(135deg, #071529 0%, #0a2540 50%, #1d4ed8 100%)',
                    borderRadius: '20px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    boxShadow: '0 10px 28px rgba(10, 25, 47, 0.25)',
                    color: '#ffffff',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {/* Subtle Ambient Radial Light Highlights */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-40px',
                      right: '-30px',
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-30px',
                      left: '-20px',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(46, 131, 255, 0.25) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* 1. Card Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid rgba(255, 255, 255, 0.22)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <Landmark size={20} color="#ffffff" />
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.01em', color: '#ffffff' }}>
                          {bank.bankName}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
                          {bank.accountType}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(46, 131, 255, 0.3)',
                        border: '1px solid rgba(56, 189, 248, 0.6)',
                        color: '#ffffff',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <Star size={11} fill="#ffffff" color="#ffffff" /> PRIMARY
                    </div>
                  </div>

                  {/* 2. EMV Chip & Account Number Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 20px 0', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <EmvChip variant="sapphire" />
                      <ContactlessIcon color="rgba(255, 255, 255, 0.65)" size={18} />
                    </div>

                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        letterSpacing: '0.12em',
                        fontWeight: 700,
                        color: '#ffffff',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
                    >
                      •••• &nbsp; •••• &nbsp; •••• &nbsp; {rawNumbers}
                    </div>
                  </div>

                  {/* 3. Integrated Frosted Balance Container */}
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.09)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      borderRadius: '14px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Available Balance
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '19px', fontWeight: 900, color: '#ffffff', marginTop: '2px', letterSpacing: '0.02em' }}>
                        {bank.showBalance ? formatCurrency(bank.balance) : 'SAR ••••••••'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBalanceCheck(bank)}
                      className="interactive-tap"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {bank.showBalance ? <EyeOff size={13} color="#ffffff" /> : <Eye size={13} color="#38bdf8" />}
                      <span>{bank.showBalance ? 'Hide' : 'Check'}</span>
                    </button>
                  </div>

                  {/* 4. Action Strip (QPay Brand Palette Only - No Green / No Red) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
                      <CheckCircle2 size={15} color="#38bdf8" />
                      <span>Default for receiving money</span>
                    </div>

                    <button
                      onClick={() => setBankToRemove(bank.id)}
                      className="interactive-tap"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        color: 'rgba(255, 255, 255, 0.85)',
                        padding: '7px 12px',
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} color="rgba(255, 255, 255, 0.85)" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            }

            // SECONDARY BANK CARD MODEL: Modern Sculpted White & Sapphire Fintech Card
            return (
              <div
                key={bank.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 3px 12px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* 1. Card Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#eef5ff',
                        border: '1px solid #d6e6ff',
                        color: '#2e83ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Landmark size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.01em' }}>
                        {bank.bankName}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
                        {bank.accountType}
                      </div>
                    </div>
                  </div>

                  <ContactlessIcon color="#94a3b8" size={18} />
                </div>

                {/* 2. EMV Chip & Account Number Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 18px 0' }}>
                  <EmvChip variant="silver" />

                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '15px',
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    •••• &nbsp; •••• &nbsp; •••• &nbsp; {rawNumbers}
                  </div>
                </div>

                {/* 3. Integrated Balance Container */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
                      Available Balance
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginTop: '2px', letterSpacing: '0.01em' }}>
                      {bank.showBalance ? formatCurrency(bank.balance) : 'SAR ••••••••'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBalanceCheck(bank)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {bank.showBalance ? <EyeOff size={13} color="#64748b" /> : <Eye size={13} color="#2e83ff" />}
                    <span>{bank.showBalance ? 'Hide' : 'Check'}</span>
                  </button>
                </div>

                {/* 4. Action Strip (QPay Brand Palette Only - No Green / No Red) */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => setPrimaryBank(bank.id)}
                    className="interactive-tap"
                    style={{
                      flex: 1,
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #2e83ff',
                      color: '#2e83ff',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <Star size={13} /> Set as Primary
                  </button>

                  <button
                    onClick={() => setBankToRemove(bank.id)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#64748b',
                      padding: '9px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} color="#64748b" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Bank Account Action */}
        <PrimaryButton onClick={() => setIsAddBankModalOpen(true)}>
          <Plus size={18} /> Add New Bank Account
        </PrimaryButton>

        {/* Security & NPCI Trust Footer */}
        <div style={{ marginTop: '22px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={13} color="#64748b" />
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            256-Bit Hardware Encrypted &bull; NPCI Regulated
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal (Strictly QPay Brand Palette) */}
      {bankToRemove && (
        <Modal
          isOpen={Boolean(bankToRemove)}
          onClose={() => setBankToRemove(null)}
          title="Remove Bank Account"
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px', lineHeight: '20px' }}>
              Are you sure you want to unlink this bank account from QPay?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setBankToRemove(null)}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: '#0e274d',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Unlink Account
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
